import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const ticketAPI = {
  // Submit text-only ticket
  submitTextTicket: async (data) => {
    const response = await apiClient.post('/api/tickets/submit', data);
    return response.data;
  },

  // Submit image-based ticket with OCR
  submitImageTicket: async (formData) => {
    const response = await apiClient.post('/api/ocr/submit-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all tickets (for admin)
  getAllTickets: async () => {
    const response = await apiClient.get('/api/tickets/all');
    return response.data;
  },

  // Update admin solution for a ticket
  updateAdminSolution: async (ticketId, adminSolution) => {
    const response = await apiClient.patch(`/api/tickets/${ticketId}/admin-solution`, {
      admin_solution: adminSolution
    });
    return response.data;
  },

  // Authentication methods
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    const response = await apiClient.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  signup: async (userData) => {
    const response = await apiClient.post('/auth/signup', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }
};

export default apiClient;