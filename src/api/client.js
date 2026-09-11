import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// Interceptor to attach JWT token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ── Auth APIs ──────────────────────────────────────────────────
export const loginApi = (credentials) => api.post('/auth/login', credentials);
export const registerApi = (userData) => api.post('/auth/register', userData);
export const getMeApi = () => api.get('/auth/me');

// ── Student APIs ───────────────────────────────────────────────
export const getStudents = (params = {}) => api.get('/students', { params });
export const getStudentById = (id) => api.get(`/students/${id}`);
export const createStudent = (data) => api.post('/students', data);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

// Legacy wrappers for backward compatibility with older pages
export const getProfile = (id) => api.get(`/students/${id}`);
export const getPrediction = (id) => api.get(`/students/${id}`);
export const getExplanation = (id) => api.get(`/students/${id}`);
export const getSkillGap = (id, track) => api.get(`/students/${id}`, { params: { track } });
export const getRoadmap = (id, track) => api.get(`/students/${id}`, { params: { track } });

// ── Company Drive & Cutoff APIs ───────────────────────────────
export const getCompanies = () => api.get('/companies');
export const getCompanyById = (id) => api.get(`/companies/${id}`);
export const createCompany = (data) => api.post('/companies', data);
export const updateCompanyCutoffs = (id, data) => api.put(`/companies/${id}`, data);
export const deleteCompany = (id) => api.delete(`/companies/${id}`);

// ── Applications APIs ─────────────────────────────────────────
export const getApplications = (params = {}) => api.get('/applications', { params });
export const createApplication = (data) => api.post('/applications', data);
export const updateApplicationStatus = (id, status) => api.put(`/applications/${id}`, { status });
export const deleteApplication = (id) => api.delete(`/applications/${id}`);

// ── Interview Scheduler APIs ──────────────────────────────────
export const getInterviews = (params = {}) => api.get('/interviews', { params });
export const bookInterviewSlot = (data) => api.post('/interviews', data);
export const updateInterview = (id, data) => api.put(`/interviews/${id}`, data);
export const cancelInterviewSlot = (id) => api.delete(`/interviews/${id}`);

// ── TPO Legacy Endpoints ─────────────────────────────────────
export const getDeptSummary = () => api.get('/students');
export const getAtRisk = () => api.get('/students');
export const getSkillHeatmap = () => api.get('/students');

export default api;
