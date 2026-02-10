export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'farmer' | 'officer' | 'expert' | string;
  village?: string;
  district?: string;
  taluka?: string;
  expertise?: string[];
  department?: string;
  verified: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token?: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'farmer' | 'officer' | 'expert';
  village?: string;
  district?: string;
  taluka?: string;
  expertise?: string[];
  department?: string;
}