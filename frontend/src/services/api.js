import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    }
    
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject({
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

// Mock data for development
const mockData = {
  bloodInventory: [
    { id: 1, bloodGroup: 'A+', units: 45, capacity: 100, status: 'Adequate' },
    { id: 2, bloodGroup: 'A-', units: 15, capacity: 100, status: 'Low' },
    { id: 3, bloodGroup: 'B+', units: 38, capacity: 100, status: 'Adequate' },
    { id: 4, bloodGroup: 'B-', units: 12, capacity: 100, status: 'Critical' },
    { id: 5, bloodGroup: 'AB+', units: 8, capacity: 100, status: 'Critical' },
    { id: 6, bloodGroup: 'AB-', units: 4, capacity: 100, status: 'Critical' },
    { id: 7, bloodGroup: 'O+', units: 52, capacity: 100, status: 'Adequate' },
    { id: 8, bloodGroup: 'O-', units: 18, capacity: 100, status: 'Low' },
  ],
  donors: [
    { id: 1, name: 'John Doe', bloodGroup: 'A+', location: 'New York', lastDonation: '2024-01-15', contact: 'john@example.com' },
    { id: 2, name: 'Jane Smith', bloodGroup: 'O-', location: 'Los Angeles', lastDonation: '2024-02-20', contact: 'jane@example.com' },
  ],
  bloodBanks: [
    { id: 1, name: 'City Blood Bank', location: 'Downtown', contact: '555-0101', inventory: { 'A+': 25, 'O+': 30 } },
    { id: 2, name: 'Community Blood Center', location: 'Uptown', contact: '555-0102', inventory: { 'B+': 15, 'AB+': 8 } },
  ]
};

// Authentication API
export const authAPI = {
  register: async (userData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      data: {
        user: {
          id: 1,
          name: userData.name,
          email: userData.email,
          role: userData.role || 'donor',
          phone: userData.phone
        },
        token: 'mock-jwt-token'
      }
    };
  },
  
  login: async (credentials) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (credentials.email === 'donor@example.com' && credentials.password === 'password123') {
      return {
        success: true,
        data: {
          user: {
            id: 1,
            name: 'Demo Donor',
            email: 'donor@example.com',
            role: 'donor',
            phone: '+1234567890'
          },
          token: 'mock-jwt-token-donor'
        }
      };
    }
    
    if (credentials.email === 'bloodbank@example.com' && credentials.password === 'password123') {
      return {
        success: true,
        data: {
          user: {
            id: 2,
            name: 'Demo Blood Bank',
            email: 'bloodbank@example.com',
            role: 'bloodbank',
            phone: '+1234567891'
          },
          token: 'mock-jwt-token-bloodbank'
        }
      };
    }
    
    throw new Error('Invalid credentials');
  },
  
  logout: async () => {
    return { success: true };
  },
  
  getProfile: async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (token === 'mock-jwt-token-donor') {
      return {
        success: true,
        data: {
          user: {
            id: 1,
            name: 'Demo Donor',
            email: 'donor@example.com',
            role: 'donor',
            phone: '+1234567890'
          }
        }
      };
    }
    
    if (token === 'mock-jwt-token-bloodbank') {
      return {
        success: true,
        data: {
          user: {
            id: 2,
            name: 'Demo Blood Bank',
            email: 'bloodbank@example.com',
            role: 'bloodbank',
            phone: '+1234567891'
          }
        }
      };
    }
    
    throw new Error('Invalid token');
  },
  
  updateProfile: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      data: { user: userData }
    };
  }
};

// Donors API
export const donorsAPI = {
  getAllDonors: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      data: mockData.donors
    };
  },
  
  getNearbyDonors: async (params) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      success: true,
      data: mockData.donors
    };
  }
};

// Blood Banks API
export const bloodBanksAPI = {
  getAllBloodBanks: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      data: mockData.bloodBanks
    };
  }
};

// Inventory API
export const inventoryAPI = {
  getInventory: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      success: true,
      data: mockData.bloodInventory
    };
  },
  
  searchBlood: async (params) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const filtered = mockData.bloodBanks.map(bank => ({
      ...bank,
      distance: Math.random() * 10 + 1
    }));
    return {
      success: true,
      data: filtered
    };
  }
};

// Utility functions
export const apiUtils = {
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  },

  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
};

export default apiClient;