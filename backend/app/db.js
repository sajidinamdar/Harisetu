const database = require('../config/database');

// Initialize the database
(async () => {
  try {
    await database.testConnection();
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
})();

module.exports = database;