// src/services/api.js - API Service Layer
import axios from 'axios';

// Base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor to add auth token
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

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Return error in consistent format
    return Promise.reject({
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

// Authentication API
export const authAPI = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  logout: () => apiClient.post('/auth/logout'),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (userData) => apiClient.put('/auth/profile', userData),
  changePassword: (passwordData) => apiClient.put('/auth/change-password', passwordData)
};

// Donors API
export const donorsAPI = {
  getAllDonors: (params = {}) => apiClient.get('/donors', { params }),
  getDonorById: (id) => apiClient.get(`/donors/${id}`),
  createDonor: (donorData) => apiClient.post('/donors', donorData),
  updateDonor: (id, donorData) => apiClient.put(`/donors/${id}`, donorData),
  deleteDonor: (id) => apiClient.delete(`/donors/${id}`),
  getNearbyDonors: (params) => apiClient.get('/donors/nearby', { params }),
  getEligibleDonors: (bloodGroup, location) => 
    apiClient.get('/donors/eligible', { params: { bloodGroup, location } })
};

// Blood Banks API
export const bloodBanksAPI = {
  getAllBloodBanks: (params = {}) => apiClient.get('/bloodbanks', { params }),
  getBloodBankById: (id) => apiClient.get(`/bloodbanks/${id}`),
  createBloodBank: (bankData) => apiClient.post('/bloodbanks', bankData),
  updateBloodBank: (id, bankData) => apiClient.put(`/bloodbanks/${id}`, bankData),
  deleteBloodBank: (id) => apiClient.delete(`/bloodbanks/${id}`),
  getNearbyBloodBanks: (params) => apiClient.get('/bloodbanks/nearby', { params })
};

// Inventory API
export const inventoryAPI = {
  getInventory: (params = {}) => apiClient.get('/inventory', { params }),
  updateInventory: (id, inventoryData) => apiClient.put(`/inventory/${id}`, inventoryData),
  searchBlood: (params) => apiClient.get('/inventory/search', { params }),
  getBloodBankInventory: (bloodBankId) => 
    apiClient.get(`/inventory/bloodbank/${bloodBankId}`),
  addInventory: (inventoryData) => apiClient.post('/inventory', inventoryData)
};

// Blood Requests API
export const requestsAPI = {
  getAllRequests: (params = {}) => apiClient.get('/requests', { params }),
  getRequestById: (id) => apiClient.get(`/requests/${id}`),
  createRequest: (requestData) => apiClient.post('/requests', requestData),
  updateRequest: (id, requestData) => apiClient.put(`/requests/${id}`, requestData),
  deleteRequest: (id) => apiClient.delete(`/requests/${id}`),
  matchRequest: (requestId) => apiClient.post(`/requests/${requestId}/match`),
  getMyRequests: () => apiClient.get('/requests/my-requests')
};

// Utility functions
export const apiUtils = {
  // Handle file upload
  uploadFile: async (file, endpoint) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Get user location
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
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  },

  // Calculate distance between two points
  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  },

  // Format API errors for display
  formatError: (error) => {
    if (error.response?.data?.errors) {
      return error.response.data.errors.join(', ');
    }
    return error.message || 'An unexpected error occurred';
  }
};

// Export the main api client for custom requests
export default apiClient;