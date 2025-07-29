/**
 * Script to list available Gemini models
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function listModels() {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    console.log('Attempting to list available Gemini models...');
    
    // Try to get model information
    const modelInfo = await genAI.getGenerativeModel({ model: "gemini-pro" }).startChat();
    console.log('Model info:', modelInfo);
    
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

listModels();