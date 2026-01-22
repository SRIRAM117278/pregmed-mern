import axios from "axios";

// Determine API base URL:
// - Development: Use REACT_APP_API_URL (localhost:5000)
// - Production (Vercel): Use relative path since frontend & API share the same domain
const getApiBaseUrl = () => {
  // If explicitly set, use that
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Production: use relative path (same origin)
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ===================== AUTH =====================
export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
};

// ===================== USER =====================
export const userService = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
  getAllUsers: () => api.get("/users"),
};

// ===================== APPOINTMENTS =====================
export const appointmentService = {
  getAll: () => api.get("/appointments"),
  create: (data) => api.post("/appointments", data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  cancel: (id) => api.delete(`/appointments/${id}`),
};

// ===================== HEALTH RECORDS =====================
export const healthRecordService = {
  getAll: () => api.get("/health-records"),
  create: (data) => api.post("/health-records", data),
  update: (id, data) => api.put(`/health-records/${id}`, data),
  delete: (id) => api.delete(`/health-records/${id}`),
};

// ===================== COMMUNITY =====================
export const communityService = {
  getAllPosts: () => api.get("/community"),
  createPost: (data) => api.post("/community", data),
  likePost: (id) => api.post(`/community/${id}/like`),
  addComment: (id, data) => api.post(`/community/${id}/comment`, data),
};

// ===================== GUIDANCE =====================
export const guidanceService = {
  getCurrent: (week) => api.get("/guidance/current", { params: { week } }),
  getAll: () => api.get("/guidance"),
  createOrUpdate: (data) => api.post("/guidance", data),
};

export default api;
