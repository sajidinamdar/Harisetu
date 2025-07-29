/**
 * Test script for the Gemini adapter
 */

// Import the AI service
const aiService = require('../api/aiService');

// Test function
async function testAdapter() {
  try {
    console.log('Testing AI Service with Gemini adapter...\n');
    
    // Test text completion
    console.log('1. Testing text completion:');
    const completionPrompt = 'What are the best practices for organic farming in India?';
    console.log(`Prompt: "${completionPrompt}"`);
    
    const completionResponse = await aiService.generateCompletion(completionPrompt);
    console.log('Response:');
    console.log(completionResponse);
    console.log('\n---\n');
    
    // Test chat completion
    console.log('2. Testing chat completion:');
    const chatMessages = [
      { role: 'system', content: 'You are an agricultural expert specializing in Indian farming.' },
      { role: 'user', content: 'What crops should I plant in Maharashtra during the monsoon season?' }
    ];
    console.log('Messages:', JSON.stringify(chatMessages, null, 2));
    
    const chatResponse = await aiService.generateChatCompletion(chatMessages);
    console.log('Response:');
    console.log(chatResponse);
    
    console.log('\nTests completed successfully!');
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Run the test
testAdapter();