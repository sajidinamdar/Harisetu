const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { testConnection } = require('./db');
const api = require('./api');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test database connection
testConnection();

// API routes
app.use('/api/krushi-bazaar', api);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'KrushiBazaar API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`KrushiBazaar API server running on port ${PORT}`);
});

module.exports = app;