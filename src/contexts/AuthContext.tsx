import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterData } from '../types/auth';
import { OTPUser, OTPRegisterData, OTPResponse, OTPVerifyRequest, OTPSendRequest } from '../types/otp-auth-types';
import axios from 'axios';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  setUser: (user: User | OTPUser) => void;
  verifyOTP: (email: string, otp: string, purpose: 'login' | 'signup') => Promise<OTPResponse>;
  sendOTP: (email: string, purpose: 'login' | 'signup') => Promise<OTPResponse>;
  registerWithOTP: (data: OTPRegisterData) => Promise<OTPResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('haritsetu_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        localStorage.removeItem('haritsetu_user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
    
    // Create demo OTP users if none exist
    const otpUsers = JSON.parse(localStorage.getItem('haritsetu_otp_users') || '[]');
    if (otpUsers.length === 0) {
      // Add demo users for testing
      const demoUsers: OTPUser[] = [
        {
          id: '1',
          email: 'demo.farmer@example.com',
          name: 'Demo Farmer',
          district: 'Demo District',
          taluka: 'Demo Taluka',
          village: 'Demo Village',
          role: 'farmer',
          verified: true,
          createdAt: new Date().toISOString()
        }
      ];
      
      localStorage.setItem('haritsetu_otp_users', JSON.stringify(demoUsers));
      console.log('Created demo OTP users for testing. You can use any email for login in development mode.');
    }
    
    // Helper function to ensure a user exists with the given email
    window.ensureOTPUserExists = (email: string) => {
      const users = JSON.parse(localStorage.getItem('haritsetu_otp_users') || '[]');
      const userExists = users.some((user: any) => user.email === email);
      
      if (!userExists) {
        const newUser: OTPUser = {
          id: Date.now().toString(),
          email,
          name: 'User ' + email.split('@')[0],
          district: 'Your District',
          taluka: 'Your Taluka',
          village: 'Your Village',
          role: 'farmer',
          verified: true,
          createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('haritsetu_otp_users', JSON.stringify(users));
        console.log(`Created new OTP user with email: ${email}`);
      }
      
      return !userExists;
    };
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // For demo accounts, use mock data to avoid backend dependency
      const isDemoAccount = 
        (credentials.email === 'farmer@demo.com' || 
         credentials.email === 'officer@demo.com' || 
         credentials.email === 'expert@demo.com') && 
        credentials.password === 'demo123';
      
      if (isDemoAccount) {
        // Mock user data for demo accounts
        const userData = {
          id: '1',
          email: credentials.email,
          name: credentials.email.includes('farmer') ? 'राम पाटील' : 
                credentials.email.includes('officer') ? 'Dr. Priya Sharma' : 'Prof. Suresh Kumar',
          // phone: '+91-9876543210',
          role: credentials.email.includes('farmer') ? 'farmer' : 
                credentials.email.includes('officer') ? 'officer' : 'expert',
          village: credentials.email.includes('farmer') ? 'पुणे' : undefined,
          district: credentials.email.includes('farmer') ? 'पुणे' : undefined,
          taluka: credentials.email.includes('farmer') ? 'पुणे' : undefined,
          expertise: credentials.email.includes('expert') ? ['Crop Disease', 'Soil Management'] : undefined,
          department: credentials.email.includes('officer') ? 'Agriculture Department' : undefined,
          verified: true,
          createdAt: new Date().toISOString(),
        };
        
        // Store mock token
        localStorage.setItem('haritsetu_token', 'mock_token_for_demo_account');
        localStorage.setItem('haritsetu_user', JSON.stringify(userData));
        
        setAuthState({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }
      
      // For real accounts, try to use the API
      try {
        // Import API service
        const { authAPI } = await import('../services/api');
        
        // Login via API
        await authAPI.login(credentials.email, credentials.password);
        
        // Get user data
        const userData = await authAPI.getCurrentUser();
        
        localStorage.setItem('haritsetu_user', JSON.stringify(userData));
        setAuthState({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (apiError) {
        console.error('API login failed, falling back to local storage:', apiError);
        
        // Fallback to localStorage for offline development
        const registeredUsers = JSON.parse(localStorage.getItem('haritsetu_registered_users') || '[]');
        const userExists = registeredUsers.find((user: any) => 
          user.email === credentials.email
        );
        
        // Verify password for registered user
        const isRegisteredUser = userExists && userExists.password === credentials.password;
        
        if (!isRegisteredUser) {
          throw new Error('Invalid email or password. Please register if you don\'t have an account.');
        }
        
        // Use registered user data (excluding password)
        const { password, ...userWithoutPassword } = userExists;
        
        localStorage.setItem('haritsetu_user', JSON.stringify(userWithoutPassword));
        setAuthState({
          user: userWithoutPassword,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      // Check if email already exists
      const registeredUsers = JSON.parse(localStorage.getItem('haritsetu_registered_users') || '[]');
      const emailExists = registeredUsers.some((user: any) => user.email === data.email);
      
      if (emailExists) {
        throw new Error('Email already registered. Please use a different email or login.');
      }

      const newUser: User & { password: string } = {
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
        // phone: data.phone,
        role: data.role,
        village: data.village,
        district: data.district,
        expertise: data.expertise,
        department: data.department,
        verified: false,
        createdAt: new Date().toISOString(),
        password: data.password // Store password for login verification
      };
      
      // Add user to registered users
      registeredUsers.push(newUser);
      localStorage.setItem('haritsetu_registered_users', JSON.stringify(registeredUsers));
      
      // Store user data without password for session
      const { password, ...userWithoutPassword } = newUser;
      localStorage.setItem('haritsetu_user', JSON.stringify(userWithoutPassword));
      
      setAuthState({
        user: userWithoutPassword,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    // Clear all auth-related data
    localStorage.removeItem('haritsetu_user');
    localStorage.removeItem('haritsetu_token');
    
    // Reset auth state
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    
    // Try to call API logout if available
    try {
      import('../services/api').then(({ authAPI }) => {
        authAPI.logout();
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!authState.user) return;
    
    const updatedUser = { ...authState.user, ...data };
    localStorage.setItem('haritsetu_user', JSON.stringify(updatedUser));
    setAuthState(prev => ({
      ...prev,
      user: updatedUser,
    }));
  };

  const setUser = (user: User | OTPUser) => {
    localStorage.setItem('haritsetu_user', JSON.stringify(user));
    setAuthState({
      user: user as User,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const sendOTP = async (email: string, purpose: 'login' | 'signup'): Promise<OTPResponse> => {
    try {
      // For development: Check if we should use mock API
      const useMockAPI = true; // Set to true to use mock API instead of real backend
      
      if (useMockAPI) {
        console.log('Using mock OTP API for development');
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For login purpose, check if user exists
        if (purpose === 'login') {
          // In development mode, automatically create a user if it doesn't exist
          if (process.env.NODE_ENV === 'development') {
            // Use the window helper function to ensure a user exists
            const isNewUser = window.ensureOTPUserExists(email);
            
            if (isNewUser) {
              console.log(`Created a new user with email ${email} for development testing`);
            }
          } else {
            // In production, check if user exists
            const registeredUsers = JSON.parse(localStorage.getItem('haritsetu_otp_users') || '[]');
            const userExists = registeredUsers.some((user: any) => user.email === email);
            
            if (!userExists) {
              return {
                success: false,
                message: 'User not found with this email address',
                status: 'error'
              };
            }
          }
        }
        
        // Generate a random OTP (6 digits)
        const mockOTP = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem(`otp_${email}`, mockOTP);
        console.log('%c 🔐 DEVELOPMENT OTP CODE: ' + mockOTP + ' 🔐', 'background: #222; color: #bada55; font-size: 16px; padding: 10px;');
        
        return {
          success: true,
          message: 'OTP sent successfully',
          status: 'success'
        };
      }
      
      // Real API call
      const request: OTPSendRequest = {
        email,
        purpose
      };
      const response = await axios.post('http://localhost:8000/api/send-otp', request);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === 'ECONNREFUSED') {
        console.error('Backend server not available. Using mock response.');
        return {
          success: false,
          message: 'Server connection failed. Please try again later.',
          status: 'error'
        };
      }
      throw error;
    }
  };

  const verifyOTP = async (email: string, otp: string, purpose: 'login' | 'signup'): Promise<OTPResponse> => {
    try {
      // For development: Check if we should use mock API
      const useMockAPI = true; // Set to true to use mock API instead of real backend
      
      if (useMockAPI) {
        console.log('Using mock OTP verification for development');
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get stored OTP from localStorage
        const storedOTP = localStorage.getItem(`otp_${email}`);
        
        // Verify OTP - also accept "123456" as a universal test OTP
        if (storedOTP && (otp === storedOTP || otp === "123456")) {
          // Clear the OTP after successful verification
          localStorage.removeItem(`otp_${email}`);
          
          // For login, get the user data
          if (purpose === 'login') {
            const registeredUsers = JSON.parse(localStorage.getItem('haritsetu_otp_users') || '[]');
            const user = registeredUsers.find((u: any) => u.email === email);
            
            if (user) {
              return {
                success: true,
                message: 'OTP verified successfully',
                status: 'success',
                user: user,
                token: 'mock_token_' + Date.now()
              };
            }
          } else if (purpose === 'signup') {
            // For signup, just return success
            return {
              success: true,
              message: 'OTP verified successfully',
              status: 'success'
            };
          }
        }
        
        // Invalid OTP
        return {
          success: false,
          message: 'Invalid OTP',
          status: 'error'
        };
      }
      
      // Real API call
      const request: OTPVerifyRequest = {
        email,
        otp,
        purpose
      };
      const response = await axios.post('http://localhost:8000/api/verify-otp', request);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === 'ECONNREFUSED') {
        console.error('Backend server not available. Using mock response.');
        return {
          success: false,
          message: 'Server connection failed. Please try again later.',
          status: 'error'
        };
      }
      throw error;
    }
  };

  const registerWithOTP = async (data: OTPRegisterData): Promise<OTPResponse> => {
    try {
      // For development: Check if we should use mock API
      const useMockAPI = false; // Set to true to use mock API instead of real backend
      
      if (useMockAPI) {
        console.log('Using mock OTP registration for development');
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create a new user
        const newUser: OTPUser = {
          id: Date.now().toString(),
          email: data.email,
          name: data.name,
          district: data.district || null,
          taluka: data.taluka || null,
          village: data.village || null,
          role: 'farmer', // Default role
          verified: true,
          createdAt: new Date().toISOString()
        };
        
        // Store the user in localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('haritsetu_otp_users') || '[]');
        registeredUsers.push(newUser);
        localStorage.setItem('haritsetu_otp_users', JSON.stringify(registeredUsers));
        
        return {
          success: true,
          message: 'Registration successful',
          status: 'success',
          user: newUser,
          token: 'mock_token_' + Date.now()
        };
      }
      
      // Real API call
      const response = await axios.post('http://localhost:8000/api/register-otp', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === 'ECONNREFUSED') {
        console.error('Backend server not available. Using mock response.');
        return {
          success: false,
          message: 'Server connection failed. Please try again later.',
          status: 'error'
        };
      }
      throw error;
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    setUser,
    sendOTP,
    verifyOTP,
    registerWithOTP
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};