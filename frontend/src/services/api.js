import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials) => {
    // Convert to OAuth2PasswordRequestForm format
    const formData = new FormData();
    formData.append("username", credentials.email);
    formData.append("password", credentials.password);
    return api.post("/auth/login", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  register: (userData) => api.post("/auth/register", userData),
  getProfile: () => api.get("/auth/me"),
};

// Documents API
export const documentsAPI = {
  getAll: (params = {}) => api.get("/documents", { params }),
  getById: (id) => api.get(`/documents/${id}`),
  create: (data) => api.post("/documents", data),
  update: (id, data) => api.put(`/documents/${id}`, data),
  delete: (id) => api.delete(`/documents/${id}`),
  upload: (formData) =>
    api.post("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// Drafts API
export const draftsAPI = {
  create: (draftData) => api.post("/drafts", draftData),
  getById: (id) => api.get(`/drafts/${id}`),
  update: (id, data) => api.put(`/drafts/${id}`, data),
  simulate: (id, data) => api.post(`/drafts/${id}/simulate`, data),
};

// Clauses API
export const clausesAPI = {
  getAll: (params = {}) => api.get("/clauses", { params }),
  getById: (id) => api.get(`/clauses/${id}`),
  create: (data) => api.post("/clauses", data),
  update: (id, data) => api.put(`/clauses/${id}`, data),
  delete: (id) => api.delete(`/clauses/${id}`),
  getTypes: () => api.get("/clauses/types"),
  getTags: () => api.get("/clauses/tags"),
};

// AI API
export const aiAPI = {
  explainClause: (data) => api.post("/ai/explain", data),
  simulateClause: (data) => api.post("/ai/simulate", data),
  suggestRedline: (data) => api.post("/ai/redline", data),
  generateAlternatives: (data) => api.post("/ai/alternatives", data),
  analyzeRisk: (data) => api.post("/ai/risk-analysis", data),
};

// Workflows API
export const workflowsAPI = {
  getAll: (params = {}) => api.get("/workflows", { params }),
  getById: (id) => api.get(`/workflows/${id}`),
  start: (documentId, data) => api.post(`/${documentId}/workflow/start`, data),
  approve: (id, data) => api.put(`/workflows/${id}/approve`, data),
  reject: (id, data) => api.put(`/workflows/${id}/reject`, data),
};

export default api;
