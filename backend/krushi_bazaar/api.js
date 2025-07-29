const express = require('express');
const router = express.Router();
const { getProducts, getProductById, getCategories, getSubsidies, addToCart, query } = require('./db');

// Get all products
router.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    
    const products = await getProducts(limit, offset);
    
    res.json({ success: true, products, page, limit });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Error fetching products', error: error.message });
  }
});

// Get product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Get product details
    const product = await getProductById(productId);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // Get product images
    const images = await query(`
      SELECT image_url, is_primary FROM kb_product_images 
      WHERE product_id = ?
    `, [productId]);
    
    // Get applicable subsidies
    const subsidies = await query(`
      SELECT s.* FROM kb_subsidies s
      JOIN kb_product_subsidies ps ON s.subsidy_id = ps.subsidy_id
      WHERE ps.product_id = ?
    `, [productId]);
    
    // Get reviews
    const reviews = await query(`
      SELECT r.*, u.full_name as reviewer_name
      FROM kb_reviews r
      JOIN users u ON r.user_id = u.user_id
      WHERE r.product_id = ?
      ORDER BY r.review_date DESC
    `, [productId]);
    
    const productData = {
      ...product,
      images,
      subsidies,
      reviews
    };
    
    res.json({ success: true, product: productData });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ success: false, message: 'Error fetching product details', error: error.message });
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await getCategories();
    
    res.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Error fetching categories', error: error.message });
  }
});

// Get all subsidies
router.get('/subsidies', async (req, res) => {
  try {
    const subsidies = await getSubsidies();
    
    res.json({ success: true, subsidies });
  } catch (error) {
    console.error('Error fetching subsidies:', error);
    res.status(500).json({ success: false, message: 'Error fetching subsidies', error: error.message });
  }
});

// Add product to cart
router.post('/cart', async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;
    
    if (!user_id || !product_id || !quantity) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    // Check if product exists and is available
    const productRows = await query(`
      SELECT * FROM kb_products WHERE product_id = ? AND status = 'available'
    `, [product_id]);
    
    if (productRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found or not available' });
    }
    
    // Add to cart using the function from db.js
    await addToCart(user_id, product_id, quantity);
    
    res.json({ success: true, message: 'Product added to cart successfully' });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ success: false, message: 'Error adding product to cart', error: error.message });
  }
});

// Get user's cart
router.get('/cart/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const cartItems = await query(`
      SELECT c.cart_id, c.quantity, p.product_id, p.name, p.name_marathi, p.price, p.discount_price, p.unit,
             (SELECT image_url FROM kb_product_images WHERE product_id = p.product_id AND is_primary = 1 LIMIT 1) as image
      FROM kb_cart c
      JOIN kb_products p ON c.product_id = p.product_id
      WHERE c.user_id = ?
    `, [userId]);
    
    res.json({ success: true, cart: cartItems });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ success: false, message: 'Error fetching cart', error: error.message });
  }
});

// Create a new order
router.post('/orders', async (req, res) => {
  const connection = await getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { 
      buyer_id, 
      shipping_address, 
      contact_phone, 
      payment_method, 
      items 
    } = req.body;
    
    if (!buyer_id || !shipping_address || !contact_phone || !payment_method || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      const [productRows] = await connection.execute(
        'SELECT price, discount_price FROM kb_products WHERE product_id = ?', 
        [item.product_id]
      );
      
      if (productRows.length === 0) {
        throw new Error(`Product with ID ${item.product_id} not found`);
      }
      
      const price = productRows[0].discount_price || productRows[0].price;
      totalAmount += price * item.quantity;
    }
    
    // Create order
    const [orderResult] = await connection.execute(
      `INSERT INTO kb_orders (buyer_id, total_amount, shipping_address, contact_phone, payment_method)
       VALUES (?, ?, ?, ?, ?)`,
      [buyer_id, totalAmount, shipping_address, contact_phone, payment_method]
    );
    
    const orderId = orderResult.insertId;
    
    // Add order items
    for (const item of items) {
      const [productRows] = await connection.execute(
        'SELECT price, discount_price FROM kb_products WHERE product_id = ?', 
        [item.product_id]
      );
      
      const price = productRows[0].discount_price || productRows[0].price;
      const subtotal = price * item.quantity;
      
      await connection.execute(
        `INSERT INTO kb_order_items (order_id, product_id, quantity, price_per_unit, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, price, subtotal]
      );
      
      // Update product quantity
      await connection.execute(
        'UPDATE kb_products SET quantity = quantity - ? WHERE product_id = ?',
        [item.quantity, item.product_id]
      );
    }
    
    // Clear cart after successful order
    await connection.execute('DELETE FROM kb_cart WHERE user_id = ?', [buyer_id]);
    
    await connection.commit();
    
    res.json({ 
      success: true, 
      message: 'Order created successfully', 
      order_id: orderId,
      total_amount: totalAmount
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Error creating order', error: error.message });
  } finally {
    connection.release();
  }
});

// Get user's orders
router.get('/orders/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const orderRows = await query(`
      SELECT * FROM kb_orders WHERE buyer_id = ? ORDER BY order_date DESC
    `, [userId]);
    
    const orders = [];
    
    for (const order of orderRows) {
      const itemRows = await query(`
        SELECT oi.*, p.name, p.name_marathi, 
               (SELECT image_url FROM kb_product_images WHERE product_id = p.product_id AND is_primary = 1 LIMIT 1) as image
        FROM kb_order_items oi
        JOIN kb_products p ON oi.product_id = p.product_id
        WHERE oi.order_id = ?
      `, [order.order_id]);
      
      orders.push({
        ...order,
        items: itemRows
      });
    }
    
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
  }
});

// Search products
router.get('/search', async (req, res) => {
  try {
    const { query: searchQuery, category, min_price, max_price } = req.query;
    
    let sql = `
      SELECT p.*, c.name as category_name, c.name_marathi as category_name_marathi,
             (SELECT image_url FROM kb_product_images WHERE product_id = p.product_id AND is_primary = 1 LIMIT 1) as primary_image
      FROM kb_products p
      LEFT JOIN kb_categories c ON p.category_id = c.category_id
      WHERE p.status = 'available'
    `;
    
    const params = [];
    
    if (searchQuery) {
      sql += ` AND (p.name LIKE ? OR p.name_marathi LIKE ? OR p.description LIKE ? OR p.description_marathi LIKE ?)`;
      const searchTerm = `%${searchQuery}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    if (category) {
      sql += ` AND p.category_id = ?`;
      params.push(category);
    }
    
    if (min_price) {
      sql += ` AND (p.discount_price > 0 AND p.discount_price >= ? OR p.price >= ?)`;
      params.push(min_price, min_price);
    }
    
    if (max_price) {
      sql += ` AND (p.discount_price > 0 AND p.discount_price <= ? OR p.discount_price = 0 AND p.price <= ?)`;
      params.push(max_price, max_price);
    }
    
    sql += ` ORDER BY p.created_at DESC`;
    
    const products = await query(sql, params);
    
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ success: false, message: 'Error searching products', error: error.message });
  }
});

module.exports = router;