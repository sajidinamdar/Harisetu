/**
 * AI Service
 * 
 * This service provides AI functionality using either OpenAI or Gemini API
 * based on available API keys and configuration.
 */

// Import OpenAI
const { Configuration, OpenAIApi } = require('openai');

// Import our Gemini adapter
const GeminiAdapter = require('../utils/geminiAdapter');

// Import dotenv to access environment variables
require('dotenv').config();

class AIService {
  constructor() {
    // Check which API keys are available
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.geminiApiKey = process.env.GEMINI_API_KEY;
    
    // Initialize the appropriate client
    if (this.geminiApiKey && this.geminiApiKey !== 'your_openai_api_key') {
      console.log('Using Gemini API');
      this.client = new GeminiAdapter(this.geminiApiKey);
      this.provider = 'gemini';
    } else if (this.openaiApiKey && this.openaiApiKey !== 'your_openai_api_key') {
      console.log('Using OpenAI API');
      const configuration = new Configuration({
        apiKey: this.openaiApiKey,
      });
      this.client = new OpenAIApi(configuration);
      this.provider = 'openai';
    } else {
      console.warn('No valid API key found for AI services');
      this.client = null;
      this.provider = null;
    }
  }

  /**
   * Generate a text completion
   * @param {string} prompt - The prompt to generate completion for
   * @param {Object} options - Additional options
   * @returns {Promise<string>} - The generated text
   */
  async generateCompletion(prompt, options = {}) {
    if (!this.client) {
      throw new Error('No AI provider configured. Please check your API keys.');
    }

    try {
      const defaultOptions = {
        max_tokens: 1000,
        temperature: 0.7,
      };
      
      const requestOptions = { ...defaultOptions, ...options, prompt };
      
      if (this.provider === 'gemini') {
        const response = await this.client.createCompletion(requestOptions);
        return response.choices[0].text;
      } else {
        // OpenAI
        const response = await this.client.createCompletion({
          model: "text-davinci-003",
          ...requestOptions
        });
        return response.data.choices[0].text;
      }
    } catch (error) {
      console.error('Error generating AI completion:', error);
      throw error;
    }
  }

  /**
   * Generate a chat completion
   * @param {Array} messages - Array of message objects with role and content
   * @param {Object} options - Additional options
   * @returns {Promise<string>} - The generated response
   */
  async generateChatCompletion(messages, options = {}) {
    if (!this.client) {
      throw new Error('No AI provider configured. Please check your API keys.');
    }

    try {
      const defaultOptions = {
        max_tokens: 1000,
        temperature: 0.7,
      };
      
      const requestOptions = { ...defaultOptions, ...options, messages };
      
      if (this.provider === 'gemini') {
        const response = await this.client.createChatCompletion(requestOptions);
        return response.choices[0].message.content;
      } else {
        // OpenAI
        const response = await this.client.createChatCompletion({
          model: "gpt-3.5-turbo",
          ...requestOptions
        });
        return response.data.choices[0].message.content;
      }
    } catch (error) {
      console.error('Error generating AI chat completion:', error);
      throw error;
    }
  }
}

// Export a singleton instance
module.exports = new AIService();