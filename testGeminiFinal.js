/**
 * Test script for the final Gemini adapter
 */

import GeminiAdapter from './geminiAdapterFinal.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Test function
async function testAdapter() {
  try {
    console.log('Testing Gemini adapter with OpenAI-like interface...\n');
    
    // Get API key from environment variables
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    // Initialize the adapter
    const gemini = new GeminiAdapter(GEMINI_API_KEY);
    
    // Example 1: Text completion (similar to OpenAI's completion)
    console.log('Example 1: Text Completion');
    console.log('Prompt: "What are the best practices for growing tomatoes in India?"');
    
    try {
      const completionResponse = await gemini.createCompletion({
        prompt: "What are the best practices for growing tomatoes in India?",
        max_tokens: 500,
        temperature: 0.7
      });
      
      console.log('\nResponse:');
      console.log(completionResponse.choices[0].text);
    } catch (error) {
      console.log('\nError with text completion:', error.message);
      
      // Use mock response for demonstration
      console.log('\nUsing mock response instead:');
      console.log(gemini.generateMockResponse("What are the best practices for growing tomatoes in India?"));
    }
    
    console.log('\n---\n');
    
    // Example 2: Chat completion (similar to OpenAI's chat completion)
    console.log('Example 2: Chat Completion');
    console.log('Messages:');
    console.log('1. System: "You are an agricultural expert specializing in Indian farming."');
    console.log('2. User: "What crops are best suited for Maharashtra\'s climate?"\n');
    
    try {
      const chatResponse = await gemini.createChatCompletion({
        messages: [
          { role: "system", content: "You are an agricultural expert specializing in Indian farming." },
          { role: "user", content: "What crops are best suited for Maharashtra's climate?" }
        ],
        max_tokens: 500,
        temperature: 0.7
      });
      
      console.log('Response:');
      console.log(chatResponse.choices[0].message.content);
    } catch (error) {
      console.log('\nError with chat completion:', error.message);
      
      // Use mock response for demonstration
      console.log('\nUsing mock response instead:');
      console.log(gemini.generateMockResponse("What crops are best suited for Maharashtra's climate?"));
    }
    
    console.log('\n=== Test completed ===');
    
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Run the test
testAdapter();