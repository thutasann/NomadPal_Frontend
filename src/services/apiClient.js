import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token if available
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

// Response interceptor - handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden
      console.error('Access forbidden');
    } else if (error.response?.status >= 500) {
      // Server error
      console.error('Server error occurred');
    }
    
    return Promise.reject(error);
  }
);

// API methods
const api = {
  // Auth endpoints
  auth: {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    register: (userData) => apiClient.post('/auth/register', userData),
    logout: () => apiClient.post('/auth/logout'),
    refreshToken: () => apiClient.post('/auth/refresh'),
    verifyToken: () => apiClient.get('/auth/verify'),
  },

  // User endpoints
  users: {
    getProfile: () => apiClient.get('/users/profile'),
    updateProfile: (userData) => apiClient.put('/users/profile', userData),
    updatePreferences: (preferences) => apiClient.put('/users/preferences', preferences),
    deleteAccount: () => apiClient.delete('/users/account'),
  },

  // Cities endpoints
  cities: {
    getAll: (params) => apiClient.get('/cities', { params }),
    getById: (id) => apiClient.get(`/cities/${id}`),
    search: (query) => apiClient.get('/cities/search', { params: { q: query } }),
    getByCountry: (country) => apiClient.get(`/cities/country/${country}`),
    getPopular: () => apiClient.get('/cities/popular'),
  },

  // Jobs endpoints
  jobs: {
    getAll: (params) => apiClient.get('/jobs', { params }),
    getLatest: (params) => apiClient.get('/jobs/latest', { params }),
    getCategories: () => apiClient.get('/jobs/categories'),
    getByCategory: (categorySlug, params) => apiClient.get(`/jobs/category/${categorySlug}`, { params }),
    getByCompany: (companyName, params) => apiClient.get(`/jobs/company/${companyName}`, { params }),
    search: (keywords, params) => apiClient.get(`/jobs/search/${keywords}`, { params }),
  },

  // Applications endpoints
  applications: {
    getAll: (params) => apiClient.get('/applications', { params }),
    getById: (id) => apiClient.get(`/applications/${id}`),
    create: (applicationData) => apiClient.post('/applications', applicationData),
    update: (id, applicationData) => apiClient.put(`/applications/${id}`, applicationData),
    delete: (id) => apiClient.delete(`/applications/${id}`),
    withdraw: (id) => apiClient.post(`/applications/${id}/withdraw`),
  },

  // Utility methods
  upload: {
    image: (file, onProgress) => {
      const formData = new FormData();
      formData.append('image', file);
      
      return apiClient.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onProgress,
      });
    },
    document: (file, onProgress) => {
      const formData = new FormData();
      formData.append('document', file);
      
      return apiClient.post('/upload/document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onProgress,
      });
    },
  },

  // Generic HTTP methods for custom endpoints
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  patch: (url, data, config) => apiClient.patch(url, data, config),
  delete: (url, config) => apiClient.delete(url, config),
};

// Export both the configured client and the API methods
export { apiClient, api };
export default api;
