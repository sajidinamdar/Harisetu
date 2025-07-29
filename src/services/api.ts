// API service for making requests to the backend

const API_URL = '/api';

// Helper function for making API requests
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  
  // Get token from localStorage if available
  const token = localStorage.getItem('haritsetu_token');
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      // Handle API errors
      if (!response.ok) {
        throw new Error(data.detail || 'An error occurred');
      }
      
      return data;
    } else {
      // Handle non-JSON responses (like file downloads)
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'An error occurred');
      }
      
      return response;
    }
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await fetch(`${API_URL}/users/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Login failed');
    }
    
    // Store token in localStorage
    localStorage.setItem('haritsetu_token', data.access_token);
    
    return data;
  },
  
  register: async (userData: any) => {
    return fetchAPI('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  getCurrentUser: async () => {
    return fetchAPI('/users/me');
  },
  
  updateProfile: async (userData: any) => {
    return fetchAPI('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
  
  logout: () => {
    localStorage.removeItem('haritsetu_token');
  },
};

// Complaints API
export const complaintsAPI = {
  getComplaints: async (params: any = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return fetchAPI(`/complaints?${queryParams}`);
  },
  
  getComplaintById: async (id: number) => {
    return fetchAPI(`/complaints/${id}`);
  },
  
  createComplaint: async (complaintData: any) => {
    return fetchAPI('/complaints', {
      method: 'POST',
      body: JSON.stringify(complaintData),
    });
  },
  
  updateComplaint: async (id: number, complaintData: any) => {
    return fetchAPI(`/complaints/${id}`, {
      method: 'PUT',
      body: JSON.stringify(complaintData),
    });
  },
  
  addUpdate: async (id: number, updateData: any) => {
    return fetchAPI(`/complaints/${id}/updates`, {
      method: 'POST',
      body: JSON.stringify(updateData),
    });
  },
};

// Weather API
export const weatherAPI = {
  getCurrentWeather: async (location: string) => {
    return fetchAPI(`/weather/current?location=${encodeURIComponent(location)}`);
  },
  
  getForecast: async (location: string, days: number = 5) => {
    return fetchAPI(`/weather/forecast?location=${encodeURIComponent(location)}&days=${days}`);
  },
};

// AgriScan API
export const agriscanAPI = {
  detectDisease: async (formData: FormData) => {
    const response = await fetch(`${API_URL}/agriscan/detect`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('haritsetu_token')}`,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Disease detection failed');
    }
    
    return data;
  },
};

// AgriConnect API
export const agriconnectAPI = {
  getNearbyServices: async (lat: number, lng: number, radius: number = 5, type: string = '') => {
    return fetchAPI(`/agriconnect/nearby?lat=${lat}&lng=${lng}&radius=${radius}${type ? `&type=${type}` : ''}`);
  },
  
  getServiceDetails: async (id: string) => {
    return fetchAPI(`/agriconnect/service/${id}`);
  },
};

export default {
  auth: authAPI,
  complaints: complaintsAPI,
  weather: weatherAPI,
  agriscan: agriscanAPI,
  agriconnect: agriconnectAPI,
};