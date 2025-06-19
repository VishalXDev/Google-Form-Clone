import axios from 'axios';

const API_VERSION = '/api/v1';
const API_BASE_URL = `${process.env.REACT_APP_API_URL}${API_VERSION}`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Field Services
export const fieldService = {
  getFields: () => api.get('/fields'),
  createField: (fieldData) => api.post('/fields', fieldData),
  getField: (id) => api.get(`/fields/${id}`),
  updateField: (id, fieldData) => api.put(`/fields/${id}`, fieldData),
  deleteField: (id) => api.delete(`/fields/${id}`),
};

// Form Services
export const formService = {
  getForms: () => api.get('/forms'),
  createForm: (formData) => api.post('/forms', formData),
  getForm: (id) => api.get(`/forms/${id}`),
  getFormByLink: (uniqueLink) => api.get(`/forms/link/${uniqueLink}`),
  updateForm: (id, formData) => api.put(`/forms/${id}`, formData),
  deleteForm: (id) => api.delete(`/forms/${id}`),
};

// Response Services
export const responseService = {
  submitResponse: (responseData) => api.post('/responses', responseData),
  getFormResponses: (formId) => api.get(`/responses/form/${formId}`),
  getFormResponseSummary: (formId) => api.get(`/responses/form/${formId}/summary`),
  getResponse: (id) => api.get(`/responses/${id}`),
};

export default api;
