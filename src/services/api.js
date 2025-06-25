import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

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
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const ticketAPI = {
  // Submit text-only ticket
  submitTextTicket: async (data) => {
    const response = await apiClient.post('/tickets/submit', data);
    return response.data;
  },

  // Submit image-based ticket with OCR
  submitImageTicket: async (formData) => {
    const response = await apiClient.post('/ocr/submit-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all tickets (for admin)
  getAllTickets: async () => {
    const response = await apiClient.get('/tickets/all');
    return response.data;
  },

  // Update admin solution for a ticket
  updateAdminSolution: async (ticketId, adminSolution) => {
    const response = await apiClient.patch(`/tickets/${ticketId}/admin-solution`, {
      admin_solution: adminSolution
    });
    return response.data;
  }
};