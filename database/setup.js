import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function setupDatabase() {
  console.log('Starting database setup...');
  
  // Read the SQL file
  const sqlFilePath = path.join(__dirname, 'haritsetu_db.sql');
  const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
  
  // Split the script into individual statements
  const statements = sqlScript
    .replace(/(\r\n|\n|\r)/gm, ' ') // Remove newlines
    .replace(/\/\*.*?\*\//g, '') // Remove block comments
    .replace(/--.*$/gm, '') // Remove line comments
    .split(';') // Split on semicolons
    .filter(statement => statement.trim()); // Remove empty statements
  
  // Create a connection without specifying a database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    multipleStatements: true
  });
  
  try {
    console.log('Connected to MySQL server');
    
    // Execute each statement
    for (const statement of statements) {
      try {
        await connection.execute(statement);
        console.log('Executed statement successfully');
      } catch (error) {
        console.error(`Error executing statement: ${statement.substring(0, 100)}...`);
        console.error(error);
        // Continue with other statements even if one fails
      }
    }
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await connection.end();
    console.log('Database connection closed');
  }
}

setupDatabase().catch(console.error);