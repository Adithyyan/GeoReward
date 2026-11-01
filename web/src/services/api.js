import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Attach JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept 401 Unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isLoginRequest = error.config.url.includes('/admin/login');
      if (!isLoginRequest) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_info');
      }
    }
    return Promise.reject(error);
  }
);

export const referralApi = {
  /**
   * Record visitor geolocation and IP on initial site load
   * @param {{ latitude: number, longitude: number, accuracy: number, client_ip?: string, location_name?: string }} data
   */
  recordVisit: async (data) => {
    const response = await api.post('/referrals/visit', data);
    return response.data;
  },

  /**
   * Submit a verified referral with GPS coordinates
   * @param {{ name: string, mobile: string, latitude: number, longitude: number, accuracy: number, client_ip?: string, location_name?: string }} data
   */
  submitReferral: async (data) => {
    const response = await api.post('/referrals', data);
    return response.data;
  },

  /**
   * Retrieve all captured referrals (Admin protected)
   */
  getReferrals: async () => {
    const response = await api.get('/referrals');
    return response.data;
  },
};

export const adminApi = {
  /**
   * Admin authentication
   * @param {{ email: string, password: string }} credentials
   */
  login: async (credentials) => {
    const response = await api.post('/admin/login', credentials);
    return response.data;
  },
};

export default api;

