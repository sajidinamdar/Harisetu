const express = require('express');
const otpController = require('../controllers/otp_controller');

const router = express.Router();

/**
 * @route POST /api/send-otp
 * @desc Send OTP to phone number
 * @access Public
 */
router.post('/send-otp', otpController.sendOTP);

/**
 * @route POST /api/verify-otp
 * @desc Verify OTP
 * @access Public
 */
router.post('/verify-otp', otpController.verifyOTP);

/**
 * @route POST /api/register
 * @desc Register user with OTP verification
 * @access Public
 */
router.post('/register', otpController.registerWithOTP);

module.exports = router;