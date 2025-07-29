// Global type definitions for the project

// Auth types
interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: "farmer" | "officer" | "expert" | string;
  village?: string;
  district?: string;
  expertise?: string[];
  department?: string;
  verified: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

// AgriConnect types
interface AgriService {
  id: number;
  name: string;
  name_marathi: string;
  service_type: string;
  description: string;
  description_marathi: string;
  address: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  contact_phone: string;
  contact_email?: string;
  website?: string;
  opening_hours?: string;
  is_verified?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Krushi Bazaar types
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  category_id?: number;
  image: string;
  seller: {
    id: number;
    name: string;
    location: string;
    rating: number;
  };
  stock: number;
  unit: string;
  rating: number;
  reviews_count: number;
}

// Grievance360 types
interface Complaint {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  status: string;
  priority: string;
  user_id: number;
  assigned_to?: number;
  created_at: string;
  updated_at: string;
  comments: {
    id: number;
    text: string;
    created_at: string;
    updated_at: string;
    user_id: number;
    user: {
      id: number;
      name: string;
      role: string;
    };
  }[];
}

// Weather types
interface WeatherForecast {
  current: {
    temp: number;
    humidity: number;
    wind_speed: number;
    weather: {
      description: string;
      icon: string;
    }[];
  };
  daily: {
    dt: number;
    temp: {
      day: number;
      min: number;
      max: number;
    };
    humidity: number;
    wind_speed: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
  }[];
  agricultural_advice: {
    general: string[];
    crop_specific: {
      [key: string]: string[];
    };
  };
}

// Utility function types
declare function formatServiceType(type: string): string;