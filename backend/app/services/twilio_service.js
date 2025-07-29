// Twilio service removed. File can be deleted.
        return await sendDirectSMS(phoneNumber);
      } catch (smsError) {
        console.error('SMS Fallback Error:', smsError);
        throw new Error(`Failed to send OTP: ${error.message}`);
      }
    }
  },

  /**
   * Verify OTP code for a phone number
   * @param {string} phoneNumber - The phone number to verify
   * @param {string} otpCode - The OTP code to verify
   * @returns {Promise} - Promise with verification check results
   */
  verifyOTP: async (phoneNumber, otpCode) => {
    try {
      // Format phone number if needed
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      // First try Twilio Verify (primary method)
      try {
        const verification = await client.verify.v2
          .services(config.serviceId)
          .verificationChecks.create({
            to: formattedPhone,
            code: otpCode
          });
        
        return {
          success: true,
          valid: verification.valid,
          status: verification.status,
          phone: formattedPhone
        };
      } catch (verifyError) {
        console.error('Twilio Verify API Error:', verifyError);
        
        // If Twilio Verify fails, check our direct SMS OTP store
        if (global.otpStore && global.otpStore.has(formattedPhone)) {
          const storedOtp = global.otpStore.get(formattedPhone);
          
          if (storedOtp === otpCode) {
            // Clear the OTP after successful verification
            global.otpStore.delete(formattedPhone);
            
            return {
              success: true,
              valid: true,
              status: 'approved',
              phone: formattedPhone
            };
          } else {
            return {
              success: false,
              valid: false,
              status: 'rejected',
              phone: formattedPhone
            };
          }
        }
        
        // If we get here, both Twilio Verify and our OTP store failed
        throw verifyError;
      }
    } catch (error) {
      console.error('OTP Verification Error:', error);
      return {
        success: false,
        valid: false,
        status: 'failed',
        phone: formatPhoneNumber(phoneNumber),
        error: error.message
      };
    }
  }
};

/**
 * Send OTP directly via SMS
 * @param {string} phoneNumber - The phone number to send SMS to
 * @returns {Promise} - Promise with SMS details
 */
async function sendDirectSMS(phoneNumber) {
  try {
    // Format phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in memory (in production, use a database or cache)
    if (!global.otpStore) {
      global.otpStore = new Map();
    }
    global.otpStore.set(formattedPhone, otp);
    
    // Set expiry (10 minutes)
    setTimeout(() => {
      if (global.otpStore.has(formattedPhone)) {
        global.otpStore.delete(formattedPhone);
      }
    }, config.otpExpiry * 1000);
    
    // Send SMS with OTP
    const message = await client.messages.create({
      body: `Your verification code is: ${otp}. Valid for ${config.otpExpiry / 60} minutes.`,
      from: config.phoneNumber,
      to: formattedPhone
    });
    
    console.log(`Direct SMS sent with SID: ${message.sid}`);
    
    return {
      success: true,
      sid: message.sid,
      status: 'pending',
      phone: formattedPhone
    };
  } catch (error) {
    console.error('Direct SMS Error:', error);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
}

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

module.exports = twilioService;