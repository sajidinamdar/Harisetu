const { Pool } = require('pg');
require('dotenv').config({ path: './backend/.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function updateSchema() {
    try {
        const client = await pool.connect();
        console.log('Connected to PostgreSQL');

        // Add expertise and department columns if they don't exist
        await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS expertise TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS department TEXT;
    `);

        console.log('Schema updated successfully: added expertise and department columns to users table.');
        client.release();
    } catch (err) {
        console.error('Error updating schema:', err);
    } finally {
        await pool.end();
    }
}

updateSchema();
