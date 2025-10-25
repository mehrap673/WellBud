import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    console.log('🔍 Fetching available models for your API key...\n');
    console.log('API Key:', process.env.GEMINI_API_KEY ? 'Loaded ✅' : 'Missing ❌');
    console.log('');
    
    // Method 1: Try listModels()
    try {
      const models = await genAI.listModels();
      
      console.log('✅ Available models:\n');
      
      for await (const model of models) {
        console.log(`📦 Model Name: ${model.name}`);
        console.log(`   Display: ${model.displayName}`);
        console.log(`   Description: ${model.description || 'N/A'}`);
        console.log(`   Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
        console.log('');
      }
    } catch (listError) {
      console.log('⚠️  listModels() not available, trying common models...\n');
      
      // Method 2: Try common model names
      const commonModels = [
        'gemini-pro',
        'gemini-1.5-pro',
        'gemini-1.5-flash',
        'gemini-1.0-pro',
        'models/gemini-pro',
        'models/gemini-1.5-pro',
        'models/gemini-1.5-flash'
      ];
      
      for (const modelName of commonModels) {
        try {
          console.log(`Testing: ${modelName}`);
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent('Hello');
          const response = result.response;
          const text = response.text();
          
          console.log(`✅ ${modelName} WORKS!`);
          console.log(`   Response: ${text.substring(0, 50)}...\n`);
        } catch (error) {
          console.log(`❌ ${modelName} failed: ${error.message.substring(0, 100)}...\n`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nFull error:', error);
    
    if (error.message?.includes('API_KEY_INVALID')) {
      console.error('\n⚠️  Your API key is invalid.');
      console.error('Solution: Create a new API key at https://aistudio.google.com/app/apikey');
    } else if (error.message?.includes('403') || error.message?.includes('location')) {
      console.error('\n⚠️  Gemini API might not be available in your region.');
      console.error('Solution: Check if Gemini is available in your country.');
    }
  }
}

listModels();
