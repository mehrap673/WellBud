import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: __dirname + '/../.env' });

import { GoogleGenerativeAI } from '@google/generative-ai';
import Chat from '../models/Chat.js';
import HealthLog from '../models/HealthLog.js';

const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    console.log('📩 Received message:', message);

    if (!genAI) {
      return res.status(503).json({ 
        message: '🤖 AI chatbot is currently unavailable. Please configure GEMINI_API_KEY.' 
      });
    }

    let chat = await Chat.findOne({ userId: req.user._id });
    
    if (!chat) {
      chat = await Chat.create({
        userId: req.user._id,
        messages: []
      });
    }

    // Get recent health data for personalized responses
    const recentLogs = await HealthLog.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(10);

    // Prepare health context
    let healthSummary = '';
    if (recentLogs.length > 0) {
      const dietLogs = recentLogs.filter(log => log.type === 'diet');
      const fitnessLogs = recentLogs.filter(log => log.type === 'fitness');
      const sleepLogs = recentLogs.filter(log => log.type === 'sleep');
      const moodLogs = recentLogs.filter(log => log.type === 'mood');

      healthSummary = '\n\nUser Health Summary:';
      
      if (dietLogs.length > 0) {
        const avgCal = Math.round(dietLogs.reduce((sum, l) => sum + (l.data.calories || 0), 0) / dietLogs.length);
        healthSummary += `\n- Diet: ${dietLogs.length} meals logged, avg ${avgCal} calories`;
      }
      
      if (fitnessLogs.length > 0) {
        const avgSteps = Math.round(fitnessLogs.reduce((sum, l) => sum + (l.data.steps || 0), 0) / fitnessLogs.length);
        healthSummary += `\n- Fitness: ${fitnessLogs.length} workouts, avg ${avgSteps} steps`;
      }
      
      if (sleepLogs.length > 0) {
        const avgSleep = (sleepLogs.reduce((sum, l) => sum + (l.data.hours || 0), 0) / sleepLogs.length).toFixed(1);
        healthSummary += `\n- Sleep: avg ${avgSleep} hours per night`;
      }
      
      if (moodLogs.length > 0) {
        const avgEnergy = (moodLogs.reduce((sum, l) => sum + (l.data.energy || 0), 0) / moodLogs.length).toFixed(1);
        healthSummary += `\n- Mood: avg energy ${avgEnergy}/10`;
      }
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 400,
      }
    });

    const conversationHistory = chat.messages.slice(-6).map(msg => 
      `${msg.sender === 'user' ? 'User' : 'Health Mate'}: ${msg.content}`
    ).join('\n');

    const systemPrompt = `You are Health Mate, a warm, friendly, and supportive personal health assistant. 

Your role:
- Provide personalized health advice on diet, fitness, sleep, and mental wellbeing
- Be encouraging and motivational
- Give actionable, specific tips
- Keep responses concise (2-3 short paragraphs max)
- Use emojis naturally but don't overdo it
- Be conversational and empathetic
- Reference the user's health data when relevant${healthSummary}

Guidelines:
✓ Be supportive and positive
✓ Give practical, evidence-based advice
✓ Use bullet points for lists
✓ Keep tone friendly and conversational
✗ Don't be preachy or judgmental
✗ Don't give overly long responses
✗ Don't use medical jargon`;

    const fullPrompt = `${systemPrompt}

Recent conversation:
${conversationHistory}

User: ${message}

Health Mate:`;

    console.log('📝 Sending to Gemini...');

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    let aiResponse = response.text();

    // Clean up response
    aiResponse = aiResponse
      .replace(/^Health Mate:\s*/i, '')
      .replace(/^Assistant:\s*/i, '')
      .trim();

    console.log('✅ Response received');

    chat.messages.push(
      { sender: 'user', content: message },
      { sender: 'ai', content: aiResponse }
    );

    // Keep only last 50 messages to avoid database bloat
    if (chat.messages.length > 50) {
      chat.messages = chat.messages.slice(-50);
    }

    await chat.save();

    res.json({ 
      message: aiResponse,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('❌ Gemini Error:', error.message);
    
    if (error.message?.includes('quota') || error.message?.includes('429')) {
      return res.status(429).json({ 
        message: '⏰ I\'m getting too many requests right now. Please wait a moment and try again!' 
      });
    }

    if (error.message?.includes('safety') || error.message?.includes('blocked')) {
      return res.status(400).json({ 
        message: '🛡️ Sorry, I couldn\'t process that message. Could you rephrase it?' 
      });
    }
    
    res.status(500).json({ 
      message: '😔 Oops! Something went wrong. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const chat = await Chat.findOne({ userId: req.user._id });
    res.json(chat?.messages || []);
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const clearChatHistory = async (req, res) => {
  try {
    await Chat.findOneAndUpdate(
      { userId: req.user._id },
      { messages: [] }
    );
    res.json({ message: 'Chat history cleared successfully' });
  } catch (error) {
    console.error('Clear chat history error:', error);
    res.status(500).json({ message: error.message });
  }
};
