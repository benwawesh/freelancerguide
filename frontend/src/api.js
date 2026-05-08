import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username, password) =>
    api.post('/auth/login/', { username, password }),

  verifyToken: (token) =>
    api.post('/auth/verify/', { token }),

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};

// Public Guides API
export const guidesAPI = {
  getFeatured: () =>
    api.get('/guides/featured/'),

  getAll: (params) =>
    api.get('/guides/', { params }),

  getById: (id) =>
    api.get(`/guides/${id}/`),
};

// Admin Guides API
export const adminGuidesAPI = {
  getAll: (params) =>
    api.get('/guides/admin/', { params }),

  getById: (id) =>
    api.get(`/guides/admin/${id}/`),

  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'external_links_data' && Array.isArray(data[key])) {
        formData.append(key, JSON.stringify(data[key]));
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return api.post('/guides/admin/create/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  update: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'external_links_data' && Array.isArray(data[key])) {
        formData.append(key, JSON.stringify(data[key]));
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return api.put(`/guides/admin/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  delete: (id) =>
    api.delete(`/guides/admin/${id}/`),

  togglePublished: (id) =>
    api.post(`/guides/admin/${id}/toggle/`),
};

// Hero Settings API
export const heroSettingsAPI = {
  // Public - get hero settings
  getSettings: () =>
    api.get('/guides/hero-settings/'),

  // Admin - get and update hero settings
  getAdminSettings: () =>
    api.get('/guides/admin/hero-settings/'),

  updateSettings: (data) =>
    api.put('/guides/admin/hero-settings/', data),
};

// Social Links API
export const socialLinksAPI = {
  // Public - get social links
  getLinks: () =>
    api.get('/guides/social-links/'),

  // Admin - get and update social links
  getAdminLinks: () =>
    api.get('/guides/admin/social-links/'),

  updateLinks: (data) =>
    api.put('/guides/admin/social-links/', data),
};

export default api;
