import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterData } from '../types/auth';
import axios from 'axios';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  sendOTP: (phone: string, type: 'login' | 'signup') => Promise<{ success: boolean }>;
  verifyOTP: (phone: string, otp: string, type: 'login' | 'signup') => Promise<{ success: boolean, user?: User }>;
  registerWithOTP: (data: any) => Promise<{ success: boolean, user?: User }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  setUser: (user: User) => void;
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

  const sendOTP = async (phone: string, type: 'login' | 'signup'): Promise<{ success: boolean }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Sending OTP to ${phone} for ${type}`);
    // In development, we can mock a successful response
    return { success: true };
  };

  const verifyOTP = async (phone: string, otp: string, type: 'login' | 'signup'): Promise<{ success: boolean, user?: User }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test OTP: 123456
    if (otp === '123456') {
      if (type === 'login') {
        const registeredUsers = JSON.parse(localStorage.getItem('haritsetu_registered_users') || '[]');
        const user = registeredUsers.find((u: any) => u.phone === phone);
        if (user) {
          const { password, ...userWithoutPassword } = user;
          return { success: true, user: userWithoutPassword };
        }
        // If not found, create a mock user for demo
        return {
          success: true,
          user: {
            id: 'mock-id',
            name: 'Demo User',
            email: 'demo@example.com',
            phone: phone,
            role: 'farmer',
            verified: true,
            createdAt: new Date().toISOString()
          }
        };
      }
      return { success: true };
    }

    throw new Error('Invalid OTP. Please use 123456 for testing.');
  };

  const registerWithOTP = async (data: any): Promise<{ success: boolean, user?: User }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email || `${data.phone}@example.com`,
      phone: data.phone,
      role: data.role || 'farmer',
      village: data.village,
      district: data.district,
      taluka: data.taluka,
      verified: true,
      createdAt: new Date().toISOString(),
    };

    // Store in registered users for future login
    const registeredUsers = JSON.parse(localStorage.getItem('haritsetu_registered_users') || '[]');
    registeredUsers.push({ ...newUser, password: 'otp_user' });
    localStorage.setItem('haritsetu_registered_users', JSON.stringify(registeredUsers));

    return { success: true, user: newUser };
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

  const setUser = (user: User) => {
    localStorage.setItem('haritsetu_user', JSON.stringify(user));
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    sendOTP,
    verifyOTP,
    registerWithOTP,
    logout,
    updateProfile,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
