const twilioService = require('../services/twilio_service');
const userService = require('../services/user_service');

/**
 * Controller for OTP-based authentication
 */
const otpAuthController = {
  /**
   * Send OTP to a phone number
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  sendOTP: async (req, res) => {
    try {
      const { phone, purpose } = req.body;
      
      if (!phone) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is required'
        });
      }
      
      if (!purpose || !['login', 'signup'].includes(purpose)) {
        return res.status(400).json({
          success: false,
          message: 'Valid purpose (login or signup) is required'
        });
      }
      
      // For login, check if user exists
      if (purpose === 'login') {
        const user = await userService.findUserByPhone(phone);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found. Please register first.',
            userExists: false
          });
        }
      }
      
      // For signup, check if user already exists
      if (purpose === 'signup') {
        const user = await userService.findUserByPhone(phone);
        if (user) {
          return res.status(400).json({
            success: false,
            message: 'Phone number already registered',
            userExists: true
          });
        }
      }
      
      // Send OTP via Twilio
      const result = await twilioService.sendOTP(phone);
      
      res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
        sid: result.sid,
        phone: result.phone
      });
    } catch (error) {
      console.error('Send OTP Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to send OTP'
      });
    }
  },
  
  /**
   * Verify OTP for a phone number
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  verifyOTP: async (req, res) => {
    try {
      const { phone, otp, purpose } = req.body;
      
      if (!phone || !otp) {
        return res.status(400).json({
          success: false,
          message: 'Phone number and OTP are required'
        });
      }
      
      if (!purpose || !['login', 'signup'].includes(purpose)) {
        return res.status(400).json({
          success: false,
          message: 'Valid purpose (login or signup) is required'
        });
      }
      
      // Verify OTP via Twilio
      const result = await twilioService.verifyOTP(phone, otp);
      
      if (!result.valid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid OTP. Please try again.',
          verified: false
        });
      }
      
      // For login, return user data
      if (purpose === 'login') {
        const user = await userService.findUserByPhone(phone);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found. Please register first.',
            verified: true
          });
        }
        
        return res.status(200).json({
          success: true,
          message: 'OTP verified successfully. Login successful.',
          verified: true,
          user
        });
      }
      
      // For signup, just confirm verification
      res.status(200).json({
        success: true,
        message: 'OTP verified successfully. You can now complete registration.',
        verified: true,
        phone: result.phone
      });
    } catch (error) {
      console.error('Verify OTP Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to verify OTP'
      });
    }
  },
  
  /**
   * Register a new user after OTP verification
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  register: async (req, res) => {
    try {
      const { phone, name, email, district, taluka, village } = req.body;
      
      if (!phone || !name) {
        return res.status(400).json({
          success: false,
          message: 'Phone number and name are required'
        });
      }
      
      // Check if user already exists
      const existingUser = await userService.findUserByPhone(phone);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this phone number already exists'
        });
      }
      
      // Create new user
      const userData = {
        phone,
        name,
        email,
        district,
        taluka,
        village,
        verified: true
      };
      
      const user = await userService.createUser(userData);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user
      });
    } catch (error) {
      console.error('Register Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to register user'
      });
    }
  }
};

module.exports = otpAuthController;