import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Nodemailer transporter for SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
});

// Store OTP codes temporarily (in a real app, use a database)
const otpStore = new Map();

// Send OTP endpoint
app.post('/api/send-otp', async (req, res) => {
  try {
    const { phone, purpose } = req.body;
    
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required',
        status: 'error'
      });
    }
    
    // Format phone number (ensure it has +91 prefix for India)
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In development or if USE_MOCK_OTP is true, log the OTP instead of sending SMS
    if (process.env.NODE_ENV === 'development' || process.env.USE_MOCK_OTP === 'true') {
      console.log(`Development OTP for ${formattedPhone}: ${otp}`);
      console.log('%c 🔐 DEVELOPMENT OTP CODE: ' + otp + ' 🔐', 'background: #222; color: #bada55; font-size: 16px; padding: 10px;');
      
      // Store OTP in memory
      otpStore.set(formattedPhone, {
        otp,
        purpose,
        createdAt: new Date()
      });
      
      return res.json({
        success: true,
        message: 'OTP sent successfully (development mode)',
        status: 'success'
      });
    }
    
    // Send OTP via email using SMTP
    try {
      const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: req.body.email || process.env.SMTP_EMAIL, // fallback for testing
        subject: 'Your HaritSetu OTP Code',
        text: `Your HaritSetu verification code is: ${otp}. Valid for 10 minutes.`
      };
      await transporter.sendMail(mailOptions);
      // Store OTP in memory
      otpStore.set(formattedPhone, {
        otp,
        purpose,
        createdAt: new Date()
      });
      return res.json({
        success: true,
        message: 'OTP sent successfully via email',
        status: 'success'
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email',
        status: 'error'
      });
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      status: 'error'
    });
  }
});

// Verify OTP endpoint
app.post('/api/verify-otp', async (req, res) => {
  try {
    const { phone, otp, purpose } = req.body;
    
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required',
        status: 'error'
      });
    }
    
    // Format phone number
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    
    // Check for universal test OTP in development mode
    const isTestOTP = (process.env.NODE_ENV === 'development' || process.env.USE_MOCK_OTP === 'true') && 
                      (otp === '123456' || otp === '000000');
    
    if (isTestOTP) {
      console.log(`Using universal test OTP for ${formattedPhone}`);
      
      // For login purpose, create a mock user if it doesn't exist
      if (purpose === 'login') {
        // Create a mock user for this phone number
        const mockUser = {
          id: Date.now().toString(),
          phone: formattedPhone.replace('+91', ''),
          name: `Test User (${formattedPhone.slice(-4)})`,
          email: `test${formattedPhone.slice(-4)}@example.com`,
          role: 'farmer',
          verified: true,
          createdAt: new Date().toISOString()
        };
        
        return res.json({
          success: true,
          message: 'OTP verified successfully (test mode)',
          status: 'success',
          user: mockUser,
          token: 'mock_token_' + Date.now()
        });
      }
      
      // For signup, just return success
      return res.json({
        success: true,
        message: 'OTP verified successfully (test mode)',
        status: 'success'
      });
    }
    
    // Get stored OTP data
    const storedData = otpStore.get(formattedPhone);
    
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'No OTP was sent to this number or it has expired',
        status: 'error'
      });
    }
    
    // Check if OTP matches
    if (storedData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
        status: 'error'
      });
    }
    
    // Check if OTP is expired (10 minutes)
    const now = new Date();
    const otpTime = new Date(storedData.createdAt);
    const diffMinutes = (now.getTime() - otpTime.getTime()) / (1000 * 60);
    
    if (diffMinutes > 10) {
      otpStore.delete(formattedPhone);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
        status: 'error'
      });
    }
    
    // OTP is valid, clear it from store
    otpStore.delete(formattedPhone);
    
    // For login purpose, check if user exists
    if (purpose === 'login') {
      // In a real app, fetch user from database
      // For now, we'll use a mock user
      const mockUser = {
        id: '1',
        phone: formattedPhone.replace('+91', ''),
        name: 'Test User',
        email: 'test@example.com',
        role: 'farmer',
        verified: true,
        createdAt: new Date().toISOString()
      };
      
      return res.json({
        success: true,
        message: 'OTP verified successfully',
        status: 'success',
        user: mockUser,
        token: 'mock_token_' + Date.now()
      });
    }
    
    // For signup, just return success
    return res.json({
      success: true,
      message: 'OTP verified successfully',
      status: 'success'
    });
    
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      status: 'error'
    });
  }
});

// Register with OTP endpoint
app.post('/api/register-otp', async (req, res) => {
  try {
    const { phone, name, email, district, taluka, village } = req.body;
    
    if (!phone || !name) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and name are required',
        status: 'error'
      });
    }
    
    // In a real app, save user to database
    // For now, create a mock user
    const newUser = {
      id: Date.now().toString(),
      phone: phone.startsWith('+') ? phone.substring(3) : phone,
      name,
      email: email || null,
      district: district || null,
      taluka: taluka || null,
      village: village || null,
      role: 'farmer',
      verified: true,
      createdAt: new Date().toISOString()
    };
    
    return res.json({
      success: true,
      message: 'Registration successful',
      status: 'success',
      user: newUser,
      token: 'mock_token_' + Date.now()
    });
    
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      status: 'error'
    });
  }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});