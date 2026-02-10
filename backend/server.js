const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// Import database connection
const { testConnection } = require('./config/database');

// Import module routes
const krushiBazaarRoutes = require('./krushi_bazaar/api');
// Import other module routes as they become available
// const agriScanRoutes = require('./agriscan/api');
// const grievance360Routes = require('./grievance360/api');
// const agriConnectRoutes = require('./agriconnect/api');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

// Test database connection
testConnection();

// API routes
app.use('/api/krushi-bazaar', krushiBazaarRoutes);

// Get all users (for testing)
app.get('/api/users', async (req, res) => {
  try {
    const db = require('./app/db');
    const users = await db.query('SELECT * FROM users');
    res.json({ users });
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error.message
    });
  }
});

// Register other module routes as they become available
// app.use('/api/agriscan', agriScanRoutes);
// app.use('/api/grievance360', grievance360Routes);
// app.use('/api/agriconnect', agriConnectRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'HaritSetu API' });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`HaritSetu API server running on port ${PORT}`);
});

module.exports = app;