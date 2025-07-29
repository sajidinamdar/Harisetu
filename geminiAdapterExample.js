/**
 * Gemini API Adapter for OpenAI-like interface (Example)
 * 
 * This file demonstrates how to create an adapter that allows you to use
 * Google's Gemini API with code that was originally designed for OpenAI.
 */

// Import the Google Generative AI library
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * GeminiAdapter - A wrapper class that provides an OpenAI-like interface for Gemini API
 * 
 * This adapter allows you to use Gemini API in place of OpenAI by providing compatible
 * methods like createCompletion and createChatCompletion.
 */
class GeminiAdapter {
  /**
   * Initialize the adapter with your Gemini API key
   * @param {string} apiKey - Your Gemini API key
   */
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  /**
   * Creates a completion with Gemini that mimics OpenAI's completion interface
   * @param {Object} options - Options similar to OpenAI's createCompletion
   * @returns {Promise<Object>} - Response formatted similar to OpenAI's response
   */
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
      
      // Format response to be similar to OpenAI's completion response
      return {
        choices: [
          {
            text: text,
            index: 0,
            finish_reason: "stop"
          }
        ],
        model: "gemini-pro",
        usage: {
          prompt_tokens: prompt.length, // Approximation
          completion_tokens: text.length, // Approximation
          total_tokens: prompt.length + text.length // Approximation
        }
      };
    } catch (error) {
      console.error("Error in Gemini API call:", error);
      throw error;
    }
  }

  /**
   * Creates a chat completion with Gemini that mimics OpenAI's chat interface
   * @param {Object} options - Options similar to OpenAI's createChatCompletion
   * @returns {Promise<Object>} - Response formatted similar to OpenAI's response
   */
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
      
      // Format response to be similar to OpenAI's chat completion response
      return {
        choices: [
          {
            message: {
              role: "assistant",
              content: text
            },
            index: 0,
            finish_reason: "stop"
          }
        ],
        model: "gemini-pro",
        usage: {
          prompt_tokens: JSON.stringify(messages).length, // Approximation
          completion_tokens: text.length, // Approximation
          total_tokens: JSON.stringify(messages).length + text.length // Approximation
        }
      };
    } catch (error) {
      console.error("Error in Gemini API call:", error);
      throw error;
    }
  }
}

/**
 * Example of how to use the GeminiAdapter in place of OpenAI
 */

// Original OpenAI code:
/*
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Text completion
const completion = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: "Hello, I am a language model",
  max_tokens: 100
});
console.log(completion.data.choices[0].text);

// Chat completion
const chatCompletion = await openai.createChatCompletion({
  model: "gpt-3.5-turbo",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Hello, who are you?" }
  ],
});
console.log(chatCompletion.data.choices[0].message.content);
*/

// Modified code using GeminiAdapter:
/*
import { GeminiAdapter } from './geminiAdapter.js';

const gemini = new GeminiAdapter(process.env.GEMINI_API_KEY);

// Text completion (same interface as OpenAI)
const completion = await gemini.createCompletion({
  prompt: "Hello, I am a language model",
  max_tokens: 100
});
console.log(completion.choices[0].text);

// Chat completion (same interface as OpenAI)
const chatCompletion = await gemini.createChatCompletion({
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Hello, who are you?" }
  ],
});
console.log(chatCompletion.choices[0].message.content);
*/

// Export the adapter for use in other files
export default GeminiAdapter;