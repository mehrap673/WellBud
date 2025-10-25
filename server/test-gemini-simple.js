import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  try {
    console.log('Testing Gemini API...');
    console.log('API Key:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');
    
    const model = genAI.getGenerativeModel({ model: "models/gemini-pro" });
    const result = await model.generateContent("Say hello");
    const response = result.response;
    console.log('✅ Success!');
    console.log('Response:', response.text());
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

test();
