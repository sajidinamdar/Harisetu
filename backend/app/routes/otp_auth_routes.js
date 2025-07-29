const express = require('express');
const otpAuthController = require('../controllers/otp_auth_controller');

const router = express.Router();

/**
 * OTP Authentication Routes
 */

// Send OTP
router.post('/send-otp', otpAuthController.sendOTP);

// Verify OTP
router.post('/verify-otp', otpAuthController.verifyOTP);

// Register after OTP verification
router.post('/register', otpAuthController.register);

module.exports = router;