import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: __dirname + '/.env' });

console.log('=== Testing OpenAI API Configuration ===\n');

// Check if API key is loaded
console.log('1. Environment Variables:');
console.log('   OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? `✅ Loaded (${process.env.OPENAI_API_KEY.substring(0, 20)}...)` : '❌ Not found');
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Loaded' : '❌ Not found');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ Loaded' : '❌ Not found\n');

// Test OpenAI API key
async function testOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    console.log('\n❌ Error: OPENAI_API_KEY not found in environment variables');
    return;
  }

  try {
    console.log('\n2. Testing OpenAI API Connection...');
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: 'Say "Hello" if you can read this.' }
      ],
      max_tokens: 10
    });

    console.log('   ✅ API Key is VALID!');
    console.log('   Response:', completion.choices[0].message.content);
    console.log('\n✅ All tests passed! Your OpenAI API is working correctly.');
    
  } catch (error) {
    console.log('   ❌ API Key Test FAILED');
    console.log('\nError Details:');
    
    if (error.status === 401) {
      console.log('   Error: Invalid API Key (401 Unauthorized)');
      console.log('   Solution: Your API key is incorrect or has been revoked.');
      console.log('   → Go to https://platform.openai.com/api-keys');
      console.log('   → Create a new API key');
      console.log('   → Replace the OPENAI_API_KEY in your .env file');
    } else if (error.status === 429) {
      console.log('   Error: Rate limit exceeded or quota exceeded (429)');
      console.log('   Solution: Check your billing at https://platform.openai.com/account/billing');
      console.log('   → You may need to add credits to your account');
    } else if (error.status === 403) {
      console.log('   Error: Country/region not supported (403)');
      console.log('   Solution: OpenAI may not be available in your region');
    } else {
      console.log('   Error:', error.message);
      console.log('   Status:', error.status || 'Unknown');
    }
    
    console.log('\nFull error:');
    console.log(error);
  }
}

testOpenAI();
