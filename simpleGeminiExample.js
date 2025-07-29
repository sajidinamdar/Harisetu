/**
 * Simple example of using Google's Gemini API directly
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function runExample() {
  try {
    // Get API key from environment variables
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    console.log('Sending prompt to Gemini API...');
    
    // Generate content
    const prompt = "What are the best practices for growing tomatoes in India?";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('\nResponse:');
    console.log(text);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
runExample();