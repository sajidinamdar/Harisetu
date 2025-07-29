/**
 * Gemini API Adapter for OpenAI-like interface
 * 
 * This adapter allows using Google's Gemini API with code structured for OpenAI.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiAdapter {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  /**
   * Creates a completion with Gemini that mimics OpenAI's completion interface
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

module.exports = GeminiAdapter;