const userService = require('../services/user_service');
const twilioService = require('../services/twilio_service');
const { generateToken } = require('../utils/auth');

/**
 * Controller for OTP-based authentication
 */
const otpController = {
  /**
   * Send OTP to phone number
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  sendOTP: async (req, res) => {
    try {
      const { phone, purpose } = req.body;
      
      if (!phone) {
        return res.status(400).json({ success: false, message: 'Phone number is required' });
      }
      
      // Check if user exists for login purpose
      if (purpose === 'login') {
        const user = await userService.findUserByPhone(phone);
        if (!user) {
          return res.status(404).json({ 
            success: false, 
            message: 'User not found',
            userExists: false
          });
        }
      }
      
      // Check if user already exists for signup purpose
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
      const twilioResponse = await twilioService.sendOTP(phone);
      
      return res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
        status: twilioResponse.status,
        phone: twilioResponse.phone
      });
    } catch (error) {
      console.error('Send OTP Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP',
        error: error.message
      });
    }
  },
  
  /**
   * Verify OTP
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  verifyOTP: async (req, res) => {
    try {
      const { phone, otp, purpose } = req.body;
      
      if (!phone || !otp) {
        return res.status(400).json({ success: false, message: 'Phone number and OTP are required' });
      }
      
      // Verify OTP via Twilio
      const verification = await twilioService.verifyOTP(phone, otp);
      
      if (!verification.valid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid OTP',
          status: verification.status || 'rejected'
        });
      }
      
      // For login purpose, return user data
      if (purpose === 'login') {
        const user = await userService.findUserByPhone(phone);
        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        // Generate JWT token
        const token = generateToken(user);
        
        return res.status(200).json({
          success: true,
          message: 'OTP verified successfully',
          user,
          token
        });
      }
      
      // For signup purpose, just return success
      return res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
        status: 'approved'
      });
    } catch (error) {
      console.error('Verify OTP Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to verify OTP',
        error: error.message
      });
    }
  },
  
  /**
   * Register user with OTP verification
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  registerWithOTP: async (req, res) => {
    try {
      const { phone, name, email, district, taluka, village } = req.body;
      
      if (!phone || !name) {
        return res.status(400).json({ success: false, message: 'Phone number and name are required' });
      }
      
      // Check if user already exists
      const existingUser = await userService.findUserByPhone(phone);
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Phone number already registered' 
        });
      }
      
      // Create new user
      const userData = {
        phone,
        name,
        email: email || null,
        district: district || null,
        taluka: taluka || null,
        village: village || null,
        verified: true, // User is verified since they completed OTP verification
        role: 'farmer' // Default role
      };
      
      const user = await userService.createUser(userData);
      
      // Generate JWT token
      const token = generateToken(user);
      
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user,
        token
      });
    } catch (error) {
      console.error('Register With OTP Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to register user',
        error: error.message
      });
    }
  }
};

module.exports = otpController;