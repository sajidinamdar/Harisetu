/**
 * Example of using the Gemini adapter with OpenAI-like code
 */

// Import the adapter
const GeminiAdapter = require('../utils/geminiAdapter');

// Import dotenv to access environment variables
require('dotenv').config();

// Example function that demonstrates how to use the adapter
async function runExample() {
  try {
    // Get the Gemini API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return;
    }
    
    // Create an instance of the adapter
    const geminiAdapter = new GeminiAdapter(apiKey);
    
    // Example 1: Text completion (similar to OpenAI's completion)
    console.log('Example 1: Text Completion');
    const completionResponse = await geminiAdapter.createCompletion({
      prompt: "What are the best practices for growing tomatoes in a dry climate?",
      max_tokens: 500,
      temperature: 0.7
    });
    
    console.log('Completion Response:');
    console.log(completionResponse.choices[0].text);
    console.log('\n---\n');
    
    // Example 2: Chat completion (similar to OpenAI's chat completion)
    console.log('Example 2: Chat Completion');
    const chatResponse = await geminiAdapter.createChatCompletion({
      messages: [
        { role: "system", content: "You are an agricultural expert specializing in Indian farming practices." },
        { role: "user", content: "What crops are best suited for Maharashtra's climate?" }
      ],
      max_tokens: 500,
      temperature: 0.7
    });
    
    console.log('Chat Response:');
    console.log(chatResponse.choices[0].message.content);
    
  } catch (error) {
    console.error('Error running example:', error);
  }
}

// Run the example
runExample();

// Export the function for potential use elsewhere
module.exports = { runExample };