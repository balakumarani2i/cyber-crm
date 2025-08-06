import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to extract error message
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};

// Helper function to handle API calls with error handling
export const handleApiCall = async <T>(apiCall: () => Promise<any>): Promise<T> => {
  const response = await apiCall();
  return response.data;
};

export const authAPI = {
  login: (email: string, password: string) =>
    handleApiCall(() => api.post('/auth/login', { email, password })),
  register: (data: any) =>
    handleApiCall(() => api.post('/auth/register', data)),
};

export const customerAPI = {
  getAll: () => handleApiCall(() => api.get('/customers')),
  getById: (id: string) => handleApiCall(() => api.get(`/customers/${id}`)),
  create: (data: any) => handleApiCall(() => api.post('/customers', data)),
  update: (id: string, data: any) => handleApiCall(() => api.put(`/customers/${id}`, data)),
  delete: (id: string) => handleApiCall(() => api.delete(`/customers/${id}`)),
};

export const dealAPI = {
  getAll: () => handleApiCall(() => api.get('/deals')),
  create: (data: any) => handleApiCall(() => api.post('/deals', data)),
  update: (id: string, data: any) => handleApiCall(() => api.put(`/deals/${id}`, data)),
};

export const taskAPI = {
  getAll: () => handleApiCall(() => api.get('/tasks')),
  create: (data: any) => handleApiCall(() => api.post('/tasks', data)),
  update: (id: string, data: any) => handleApiCall(() => api.put(`/tasks/${id}`, data)),
};

export const interactionAPI = {
  getAll: (customerId?: string) => 
    handleApiCall(() => api.get('/interactions', { params: customerId ? { customerId } : {} })),
  create: (data: any) => handleApiCall(() => api.post('/interactions', data)),
};

export default api;