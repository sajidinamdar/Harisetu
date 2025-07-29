// Import the main database connection
const { pool, query, getConnection, testConnection } = require('../config/database');

// Module-specific database functions for KrushiBazaar
async function getProducts(limit = 10, offset = 0) {
  const sql = `
    SELECT p.*, c.name as category_name, c.name_marathi as category_name_marathi, 
           u.full_name as seller_name, 
           (SELECT image_url FROM kb_product_images WHERE product_id = p.product_id AND is_primary = 1 LIMIT 1) as primary_image
    FROM kb_products p
    LEFT JOIN kb_categories c ON p.category_id = c.category_id
    LEFT JOIN users u ON p.seller_id = u.user_id
    WHERE p.status = 'available'
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `;
  
  return await query(sql, [limit, offset]);
}

async function getProductById(productId) {
  const sql = `
    SELECT p.*, c.name as category_name, c.name_marathi as category_name_marathi, 
           u.full_name as seller_name, u.phone as seller_phone
    FROM kb_products p
    LEFT JOIN kb_categories c ON p.category_id = c.category_id
    LEFT JOIN users u ON p.seller_id = u.user_id
    WHERE p.product_id = ?
  `;
  
  const results = await query(sql, [productId]);
  return results.length > 0 ? results[0] : null;
}

async function getCategories() {
  return await query('SELECT * FROM kb_categories ORDER BY name');
}

async function getSubsidies() {
  return await query('SELECT * FROM kb_subsidies ORDER BY title');
}

async function addToCart(userId, productId, quantity) {
  // Check if product is already in cart
  const cartItems = await query(
    'SELECT * FROM kb_cart WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  );
  
  if (cartItems.length > 0) {
    // Update quantity if already in cart
    return await query(
      'UPDATE kb_cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [quantity, userId, productId]
    );
  } else {
    // Add new item to cart
    return await query(
      'INSERT INTO kb_cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
      [userId, productId, quantity]
    );
  }
}

module.exports = {
  pool,
  query,
  getConnection,
  testConnection,
  getProducts,
  getProductById,
  getCategories,
  getSubsidies,
  addToCart
};