# HaritSetu Database Setup

This directory contains the database schema and setup instructions for the HaritSetu application.

## Database Schema

The `haritsetu_db.sql` file contains the complete database schema for all modules of the HaritSetu application, including:

- User Management
- KrushiBazaar (Agricultural Marketplace)
- AgriScan (Plant Disease Detection)
- Grievance360 (Complaint Management)
- AgriConnect (Service Provider Directory)
- AgroAlert (Weather and Pest Alerts)
- HaritSetu Chat (AI Chatbot)
- AgriDocAI (Document Generation)
- Kisan Mitra (Voice Assistant)

## Setup Instructions

### Prerequisites

- MySQL Server 5.7+ or MariaDB 10.2+
- Node.js 14+ and npm

### Option 1: Setup using Node.js script

1. **Install dependencies**:

   ```bash
   cd database
   npm install mysql2 dotenv
   ```

2. **Run the setup script**:

   ```bash
   node setup.js
   ```

   This script will create the database and all tables automatically.

### Option 2: Manual setup using MySQL client

1. **Create the database and tables**:

   ```bash
   mysql -u root -p < haritsetu_db.sql
   ```

   Or import the SQL file using phpMyAdmin.

2. **Verify the installation**:

   ```bash
   mysql -u root -p
   ```

   ```sql
   USE haritsetu_db;
   SHOW TABLES;
   SELECT * FROM users;
   ```

## Configuration

Update the `.env` file in the project root directory with your database credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=haritsetu_db
```

## Database Structure

The database is organized by module, with table prefixes indicating which module they belong to:

- `users` - Common user table for all modules
- `kb_*` - KrushiBazaar module tables
- `as_*` - AgriScan module tables
- `g360_*` - Grievance360 module tables
- `ac_*` - AgriConnect module tables
- `aa_*` - AgroAlert module tables
- `hc_*` - HaritSetu Chat module tables
- `ad_*` - AgriDocAI module tables
- `km_*` - Kisan Mitra module tables

## Sample Data

The SQL file includes sample data for:

- Users (farmers, sellers, buyers, experts, admin)
- Categories for KrushiBazaar
- Subsidies for agricultural products
- Service categories for AgriConnect
- Departments and complaint categories for Grievance360
- Plant diseases for AgriScan
- Weather alerts for AgroAlert

## Troubleshooting

If you encounter any issues with the database setup:

1. Ensure MySQL server is running
2. Check that the user has appropriate permissions
3. Verify the database name and credentials in the `.env` file
4. Check for any error messages during import