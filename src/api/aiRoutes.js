/**
 * AI Routes
 * 
 * API endpoints for AI functionality
 */

const express = require('express');
const router = express.Router();
const aiService = require('./aiService');

/**
 * Generate AI response
 * POST /api/ai/generate
 */
router.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    const response = await aiService.generateCompletion(prompt);
    
    return res.json({ response });
  } catch (error) {
    console.error('Error in AI generate endpoint:', error);
    return res.status(500).json({ 
      error: 'Failed to generate AI response',
      details: error.message 
    });
  }
});

/**
 * Generate AI chat response
 * POST /api/ai/chat
 */
router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Valid messages array is required' });
    }
    
    const response = await aiService.generateChatCompletion(messages);
    
    return res.json({ response });
  } catch (error) {
    console.error('Error in AI chat endpoint:', error);
    return res.status(500).json({ 
      error: 'Failed to generate AI chat response',
      details: error.message 
    });
  }
});

module.exports = router;