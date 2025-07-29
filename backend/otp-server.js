// Node.js Express server for OTP with user registration (without Twilio)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
 
const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for users and OTPs
const users = [
  // Add a demo user for testing
  {
    id: '1',
    phone: '+919876543210', // Demo phone number
    name: 'Demo Farmer',
    email: 'demo.farmer@example.com',
    district: 'Demo District',
    village: 'Demo Village',
    createdAt: new Date().toISOString()
  }
];
const verifiedPhones = new Set();
const otpStore = new Map(); // Store OTPs with phone numbers as keys
 
// Function to generate a random OTP
function generateOTP() {
  // Generate a 6-digit random number
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP endpoint using custom implementation
app.post('/send-otp', (req, res) => {
  const { phone, purpose } = req.body;
  
  if (!phone) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }
  
  // Format phone number to international format if needed
  let formattedPhone = phone;
  if (!phone.startsWith('+')) {
    // Assuming Indian numbers by default
    formattedPhone = `+91${phone.replace(/^0/, '')}`;
  }
  
  // Check if phone number is already registered for signup purpose
  if (purpose === 'signup') {
    const existingUser = users.find(user => user.phone === formattedPhone);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number already registered',
        userExists: true
      });
    }
  }
  
  // For login purpose, check if user exists
  if (purpose === 'login') {
    const existingUser = users.find(user => user.phone === formattedPhone);
    if (!existingUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found. Please sign up first.',
        userExists: false
      });
    }
  }
  
  try {
    // Generate a random OTP
    const otp = generateOTP();
    
    // Store the OTP with the phone number (with 10-minute expiry)
    otpStore.set(formattedPhone, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes from now
      purpose
    });
    
    // In a real application, you would send this OTP via SMS
    console.log(`OTP for ${formattedPhone}: ${otp}`);
    
    res.json({ 
      success: true, 
      message: 'OTP sent', 
      phone: formattedPhone
    });
  } catch (err) {
    console.error('Error generating OTP:', err);
    res.status(500).json({ success: false, message: 'Failed to send OTP', error: err.message });
  }
});
 
// Verify OTP endpoint using custom implementation
app.post('/verify-otp', (req, res) => {
  const { phone, otp, purpose } = req.body;
  
  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: 'Phone number and OTP are required' });
  }
  
  // Format phone number to international format if needed
  let formattedPhone = phone;
  if (!phone.startsWith('+')) {
    // Assuming Indian numbers by default
    formattedPhone = `+91${phone.replace(/^0/, '')}`;
  }
  
  try {
    // Get the stored OTP data
    const otpData = otpStore.get(formattedPhone);
    
    // Check if OTP exists and is not expired
    if (!otpData) {
      return res.status(400).json({ 
        success: false, 
        message: 'No OTP found for this phone number. Please request a new OTP.'
      });
    }
    
    if (Date.now() > otpData.expiresAt) {
      // Remove expired OTP
      otpStore.delete(formattedPhone);
      return res.status(400).json({ 
        success: false, 
        message: 'OTP has expired. Please request a new OTP.'
      });
    }
    
    // Verify the OTP
    if (otpData.otp === otp) {
      // Remove the used OTP
      otpStore.delete(formattedPhone);
      
      // For signup, add to verified phones set
      if (purpose === 'signup') {
        verifiedPhones.add(formattedPhone);
        
        res.json({ 
          success: true, 
          message: 'OTP verified successfully. You can now complete registration.',
          verified: true,
          phone: formattedPhone
        });
      } 
      // For login, find the user and return user data
      else if (purpose === 'login') {
        const user = users.find(user => user.phone === formattedPhone);
        
        if (!user) {
          return res.status(404).json({ 
            success: false, 
            message: 'User not found. Please sign up first.',
            userExists: false
          });
        }
        
        res.json({ 
          success: true, 
          message: 'Login successful',
          user: {
            id: user.id,
            phone: user.phone,
            name: user.name,
            email: user.email,
            district: user.district,
            taluka: user.taluka,
            village: user.village
          }
        });
      }
      // Default response for other purposes
      else {
        res.json({ 
          success: true, 
          message: 'OTP verified successfully',
          verified: true,
          phone: formattedPhone
        });
      }
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP. Please try again.'
      });
    }
  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ success: false, message: 'Failed to verify OTP', error: err.message });
  }
});

// Complete registration after OTP verification
app.post('/register', (req, res) => {
  const { phone, name, email, district, taluka, village } = req.body;
  
  if (!phone || !name) {
    return res.status(400).json({ success: false, message: 'Phone number and name are required' });
  }
  
  // Format phone number to international format if needed
  let formattedPhone = phone;
  if (!phone.startsWith('+')) {
    // Assuming Indian numbers by default
    formattedPhone = `+91${phone.replace(/^0/, '')}`;
  }
  
  // Check if phone is verified
  if (!verifiedPhones.has(formattedPhone)) {
    return res.status(403).json({ 
      success: false, 
      message: 'Phone number not verified. Please verify your phone number first.'
    });
  }
  
  // Check if user already exists
  if (users.some(user => user.phone === formattedPhone)) {
    return res.status(400).json({ 
      success: false, 
      message: 'User with this phone number already exists'
    });
  }
  
  // Create user
  const userId = crypto.randomBytes(16).toString('hex');
  const user = {
    id: userId,
    phone: formattedPhone,
    name,
    email,
    district,
    taluka,
    village,
    createdAt: new Date().toISOString()
  };
  
  // Save user
  users.push(user);
  
  // Remove from verified phones set to prevent duplicate registrations
  verifiedPhones.delete(formattedPhone);
  
  // Return user data
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: {
      id: user.id,
      phone: user.phone,
      name: user.name,
      email: user.email,
      district: user.district,
      taluka: user.taluka,
      village: user.village
    }
  });
});

// Get all users (for testing)
app.get('/users', (req, res) => {
  res.json({ users });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Twilio OTP Service with User Registration' });
});
 
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`OTP server running on port ${PORT}`));

// Export for testing
module.exports = app;