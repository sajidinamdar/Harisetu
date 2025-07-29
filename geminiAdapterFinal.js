/**
 * Gemini API Adapter for OpenAI-like interface (Final Version)
 * 
 * This adapter allows using Google's Gemini API with code structured for OpenAI.
 * It includes error handling and fallback mechanisms.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiAdapter {
  /**
   * Initialize the adapter with your Gemini API key
   * @param {string} apiKey - Your Gemini API key
   */
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
    
    // Try different model names if one fails
    this.modelNames = [
      "gemini-pro",
      "gemini-1.0-pro",
      "gemini-1.5-pro"
    ];
    
    this.currentModelIndex = 0;
    this.model = this.genAI.getGenerativeModel({ model: this.modelNames[this.currentModelIndex] });
  }

  /**
   * Try to use the next available model
   * @returns {boolean} - Whether a new model was successfully set
   */
  tryNextModel() {
    this.currentModelIndex++;
    if (this.currentModelIndex < this.modelNames.length) {
      this.model = this.genAI.getGenerativeModel({ model: this.modelNames[this.currentModelIndex] });
      console.log(`Trying model: ${this.modelNames[this.currentModelIndex]}`);
      return true;
    }
    return false;
  }

  /**
   * Creates a completion with Gemini that mimics OpenAI's completion interface
   * @param {Object} options - Options similar to OpenAI's createCompletion
   * @returns {Promise<Object>} - Response formatted similar to OpenAI's response
   */
  async createCompletion(options) {
    const { prompt, max_tokens = 1024, temperature = 0.7 } = options;
    
    // Try each model until one works or we run out of models
    let modelAttempts = this.modelNames.length;
    
    while (modelAttempts > 0) {
      try {
        console.log(`Attempting completion with model: ${this.modelNames[this.currentModelIndex]}`);
        
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
          model: this.modelNames[this.currentModelIndex],
          usage: {
            prompt_tokens: prompt.length, // Approximation
            completion_tokens: text.length, // Approximation
            total_tokens: prompt.length + text.length // Approximation
          }
        };
      } catch (error) {
        console.error(`Error with model ${this.modelNames[this.currentModelIndex]}:`, error.message);
        
        // If we have more models to try, try the next one
        if (this.tryNextModel()) {
          modelAttempts--;
        } else {
          // If we've tried all models, throw the error
          throw new Error(`All Gemini models failed. Last error: ${error.message}`);
        }
      }
    }
    
    throw new Error("All Gemini models failed to generate a completion.");
  }

  /**
   * Creates a chat completion with Gemini that mimics OpenAI's chat interface
   * @param {Object} options - Options similar to OpenAI's createChatCompletion
   * @returns {Promise<Object>} - Response formatted similar to OpenAI's response
   */
  async createChatCompletion(options) {
    const { messages, max_tokens = 1024, temperature = 0.7 } = options;
    
    // Try each model until one works or we run out of models
    let modelAttempts = this.modelNames.length;
    
    while (modelAttempts > 0) {
      try {
        console.log(`Attempting chat completion with model: ${this.modelNames[this.currentModelIndex]}`);
        
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
          model: this.modelNames[this.currentModelIndex],
          usage: {
            prompt_tokens: JSON.stringify(messages).length, // Approximation
            completion_tokens: text.length, // Approximation
            total_tokens: JSON.stringify(messages).length + text.length // Approximation
          }
        };
      } catch (error) {
        console.error(`Error with model ${this.modelNames[this.currentModelIndex]}:`, error.message);
        
        // If we have more models to try, try the next one
        if (this.tryNextModel()) {
          modelAttempts--;
        } else {
          // If we've tried all models, throw the error
          throw new Error(`All Gemini models failed. Last error: ${error.message}`);
        }
      }
    }
    
    throw new Error("All Gemini models failed to generate a chat completion.");
  }
  
  /**
   * Provides a mock response when API calls fail
   * This is useful for testing the interface without making actual API calls
   * @param {string} prompt - The prompt or last message
   * @returns {string} - A mock response
   */
  generateMockResponse(prompt) {
    return `[Mock Gemini Response] This is a simulated response to: "${prompt}". The actual API call failed, but this mock response allows you to test your integration.`;
  }
}

export default GeminiAdapter;