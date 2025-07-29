import axios from 'axios';
import { OTPSendRequest, OTPVerifyRequest, OTPRegisterData, OTPResponse } from '../types/otp-auth-types';

// Use the correct backend URL
const API_URL = 'http://localhost:3001';

export const otpAuthService = {
  /**
   * Send OTP to the provided phone number
   * @param phone - Phone number to send OTP to
   * @param purpose - Purpose of OTP (login or signup)
   * @returns OTP response with success status and message
   */
  sendOTP: async (phone: string, purpose: 'login' | 'signup'): Promise<OTPResponse> => {
    try {
      const request: OTPSendRequest = { phone, purpose };
      const response = await axios.post(`${API_URL}/send-otp`, request);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verify OTP for the provided phone number
   * @param phone - Phone number to verify OTP for
   * @param otp - OTP code to verify
   * @param purpose - Purpose of OTP (login or signup)
   * @returns OTP response with success status, message, and user data if successful
   */
  verifyOTP: async (phone: string, otp: string, purpose: 'login' | 'signup'): Promise<OTPResponse> => {
    try {
      const request: OTPVerifyRequest = { phone, otp, purpose };
      const response = await axios.post(`${API_URL}/verify-otp`, request);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Complete registration after OTP verification
   * @param data - User registration data including phone, name, and optional fields
   * @returns OTP response with success status, message, and user data if successful
   */
  register: async (data: OTPRegisterData): Promise<OTPResponse> => {
    try {
      const response = await axios.post(`${API_URL}/register`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default otpAuthService;