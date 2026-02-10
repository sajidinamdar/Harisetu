const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

// PostgreSQL pool configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'sajid@77',
  database: process.env.DB_NAME || 'haritsetu',
});

// Test the connection and initialize tables
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL database connection established successfully');

    // Check if users table exists, create if not
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password TEXT,
        district TEXT,
        taluka TEXT,
        village TEXT,
        role TEXT CHECK(role IN ('farmer', 'officer', 'expert')) NOT NULL DEFAULT 'farmer',
        verified BOOLEAN DEFAULT FALSE,
        expertise TEXT,
        department TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Users table checked/created in PostgreSQL');

    // Ensure columns exist (for migration)
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS expertise TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS department TEXT;
    `);

    client.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Execute a query with parameters
async function query(text, params = []) {
  try {
    const res = await pool.query(text, params);
    return res.rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Get a direct connection
async function getConnection() {
  try {
    return await pool.connect();
  } catch (error) {
    console.error('Error getting database connection:', error);
    throw error;
  }
}

module.exports = {
  testConnection,
  query,
  getConnection,
  pool
};