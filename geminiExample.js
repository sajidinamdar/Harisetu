/**
 * Simple example of using Google's Gemini API with an OpenAI-like interface
 * 
 * This script demonstrates how to use the Gemini API for text generation
 * with a wrapper that provides an interface similar to OpenAI.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Simple adapter class to provide OpenAI-like interface for Gemini
class GeminiAdapter {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Use the latest model name
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  }

  // Method similar to OpenAI's createCompletion
  async createCompletion(options) {
    try {
      const { prompt, max_tokens = 1024, temperature = 0.7 } = options;
      
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: max_tokens,
          temperature: temperature,
        }
      });
      
      const response = await result.response;
      const text = response.text();
      
      // Return in a format similar to OpenAI's response
      return {
        choices: [{ text, index: 0, finish_reason: "stop" }],
        model: "gemini-1.5-pro"
      };
    } catch (error) {
      console.error("Error in Gemini API call:", error);
      throw error;
    }
  }

  // Method similar to OpenAI's createChatCompletion
  async createChatCompletion(options) {
    try {
      const { messages, max_tokens = 1024, temperature = 0.7 } = options;
      
      // Convert OpenAI message format to Gemini format
      const geminiMessages = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : msg.role,
        parts: [{ text: msg.content }]
      }));
      
      const result = await this.model.generateContent({
        contents: geminiMessages,
        generationConfig: {
          maxOutputTokens: max_tokens,
          temperature: temperature,
        }
      });
      
      const response = await result.response;
      const text = response.text();
      
      // Return in a format similar to OpenAI's response
      return {
        choices: [{
          message: { role: "assistant", content: text },
          index: 0,
          finish_reason: "stop"
        }],
        model: "gemini-1.5-pro"
      };
    } catch (error) {
      console.error("Error in Gemini API call:", error);
      throw error;
    }
  }
}

// Example usage
async function runExample() {
  try {
    // Replace with your actual Gemini API key
    const GEMINI_API_KEY = 'AIzaSyB0A5D_L7YGy3hqc7Am1HGDU992i_lRCeI';
    
    // Create an instance of the adapter
    const gemini = new GeminiAdapter(GEMINI_API_KEY);
    
    console.log('=== Testing Gemini API with OpenAI-like interface ===\n');
    
    // Example 1: Text completion (similar to OpenAI's completion)
    console.log('Example 1: Text Completion');
    console.log('Prompt: "What are the best practices for growing tomatoes in India?"');
    
    const completionResponse = await gemini.createCompletion({
      prompt: "What are the best practices for growing tomatoes in India?",
      max_tokens: 500,
      temperature: 0.7
    });
    
    console.log('\nResponse:');
    console.log(completionResponse.choices[0].text);
    console.log('\n---\n');
    
    // Example 2: Chat completion (similar to OpenAI's chat completion)
    console.log('Example 2: Chat Completion');
    console.log('Messages:');
    console.log('1. System: "You are an agricultural expert specializing in Indian farming."');
    console.log('2. User: "What crops are best suited for Maharashtra\'s climate?"\n');
    
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
    
    console.log('\n=== Test completed successfully ===');
    
  } catch (error) {
    console.error('Error running example:', error);
  }
}

// Run the example
runExample();