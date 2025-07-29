const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
require('dotenv').config();

// SQLite database file path
const dbPath = path.resolve(__dirname, '../haritsetu.db');

// Create and initialize the database connection
let db;

async function initializeDatabase() {
  if (!db) {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    console.log('SQLite database connection established successfully');
  }
  return db;
}

// Test the connection and initialize tables
async function testConnection() {
  try {
    const database = await initializeDatabase();
    
    // Check if users table exists, create if not
    await database.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        phone TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        email TEXT,
        password TEXT,
        district TEXT,
        taluka TEXT,
        village TEXT,
        role TEXT CHECK(role IN ('farmer', 'officer', 'expert')) NOT NULL DEFAULT 'farmer',
        verified INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Users table checked/created');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Execute a query with parameters
async function query(sql, params = []) {
  try {
    const database = await initializeDatabase();
    return await database.all(sql, params);
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Get a direct connection
async function getConnection() {
  try {
    return await initializeDatabase();
  } catch (error) {
    console.error('Error getting database connection:', error);
    throw error;
  }
}

module.exports = {
  initializeDatabase,
  testConnection,
  query,
  getConnection
};