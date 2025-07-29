# KrushiBazaar API

This directory contains the API for the KrushiBazaar module of the HaritSetu application.

## Overview

The KrushiBazaar API provides endpoints for:

- Product listing and details
- Category management
- Government subsidy information
- Shopping cart functionality
- Order processing
- Product search and filtering

## Setup Instructions

### Prerequisites

- Node.js 14+ and npm
- MySQL Server 5.7+ or MariaDB 10.2+
- Database set up using the SQL script in the `database` directory

### Installation

1. **Install dependencies**:

   ```bash
   cd backend/krushi_bazaar
   npm install
   ```

2. **Configure environment variables**:

   Create or update the `.env` file with your database credentials:

   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=krushi_bazaar
   PORT=3001
   ```

3. **Start the API server**:

   ```bash
   npm run dev
   ```

   The server will start on port 3001 (or the port specified in your `.env` file).

## API Endpoints

### Products

- `GET /api/krushi-bazaar/products` - Get all products
- `GET /api/krushi-bazaar/products/:id` - Get product details

### Categories

- `GET /api/krushi-bazaar/categories` - Get all categories

### Subsidies

- `GET /api/krushi-bazaar/subsidies` - Get all subsidies

### Cart

- `POST /api/krushi-bazaar/cart` - Add product to cart
- `GET /api/krushi-bazaar/cart/:userId` - Get user's cart

### Orders

- `POST /api/krushi-bazaar/orders` - Create a new order
- `GET /api/krushi-bazaar/orders/:userId` - Get user's orders

### Search

- `GET /api/krushi-bazaar/search` - Search products with filters

## Testing the API

You can test the API using tools like Postman or curl:

```bash
# Get all products
curl http://localhost:3001/api/krushi-bazaar/products

# Get product details
curl http://localhost:3001/api/krushi-bazaar/products/1

# Search products
curl http://localhost:3001/api/krushi-bazaar/search?query=organic&category=1
```

## Integration with Frontend

The frontend React component in `src/components/krushi_bazaar/KrushiBazaarHome.tsx` is designed to work with this API. It includes:

- Product listing with filters
- Search functionality
- Add to cart feature
- Multilingual support (English/Marathi)

## Troubleshooting

If you encounter any issues:

1. Check that the MySQL server is running
2. Verify your database credentials in the `.env` file
3. Ensure the database and tables are properly set up
4. Check the server logs for any error messages