const db = require('../db');
const { v4: uuidv4 } = require('uuid');

/**
 * Service for user-related operations
 */
const userService = {
  /**
   * Find a user by phone number
   * @param {string} phone - Phone number to search for
   * @returns {Promise<Object|null>} - User object or null if not found
   */
  findUserByPhone: async (phone) => {
    try {
      // Format phone for consistency
      const formattedPhone = formatPhoneNumber(phone);
      
      // Query database
      const rows = await db.query(
        'SELECT * FROM users WHERE phone = ?',
        [formattedPhone]
      );
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Find User By Phone Error:', error);
      throw new Error(`Failed to find user: ${error.message}`);
    }
  },
  
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} - Created user object
   */
  createUser: async (userData) => {
    try {
      const { phone, name, email, district, taluka, village, verified, role } = userData;
      
      // Format phone for consistency
      const formattedPhone = formatPhoneNumber(phone);
      
      // Generate user ID
      const userId = uuidv4();
      const createdAt = new Date().toISOString();
      const verifiedValue = verified ? 1 : 0;
      
      // Insert into database
      await db.query(
        `INSERT INTO users (id, phone, name, email, district, taluka, village, verified, role, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, formattedPhone, name, email || null, district || null, taluka || null, village || null, verifiedValue, role || 'farmer', createdAt]
      );
      
      // Return created user
      return {
        id: userId,
        phone: formattedPhone,
        name,
        email: email || null,
        district: district || null,
        taluka: taluka || null,
        village: village || null,
        verified: verified || false,
        role: role || 'farmer',
        createdAt
      };
    } catch (error) {
      console.error('Create User Error:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
};

/**
 * Format phone number to E.164 format
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} - Formatted phone number
 */
function formatPhoneNumber(phoneNumber) {
  // If already in international format, return as is
  if (phoneNumber.startsWith('+')) {
    return phoneNumber;
  }
  
  // Remove any non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');
  
  // Assume Indian number if no country code
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  
  // If country code is included without +
  if (digits.length > 10) {
    return `+${digits}`;
  }
  
  // Return original with + if nothing else matches
  return `+${phoneNumber}`;
}

module.exports = userService;