import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to attach the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const uploadResume = async (file: File) => {
  const formData = new FormData();
  formData.append('resume', file);
  const response = await api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getScore = async (resumeText: string, targetRole: string) => {
  const response = await api.post('/score', { resumeText, targetRole });
  return response.data;
};

export const getRecommendations = async (resumeText: string) => {
  const response = await api.post('/recommend', { resumeText });
  return response.data;
};

export const getSalaryProgression = async (roleName: string) => {
  const response = await api.post('/simulate-salary', { roleName });
  return response.data;
};

export const getRoadmap = async (targetRole: string) => {
  const response = await api.post('/roadmap', { targetRole });
  return response.data;
};

export const getAiOpportunities = async (roles: string[]) => {
  const response = await api.post('/opportunities', { roles });
  return response.data;
};

export const getRoles = async () => {
  const response = await api.get('/roles');
  return response.data;
};

export const getRoleDetails = async (roleName: string, resumeText?: string) => {
  const response = await api.post('/role-details', { roleName, resumeText });
  return response.data;
};

// Mock Interview
export const generateInterviewQuestions = async (resumeText: string, targetRole: string) => {
  const response = await api.post('/interview/generate', { resumeText, targetRole });
  return response.data;
};

export const evaluateInterviewAnswer = async (question: string, answer: string) => {
  const response = await api.post('/interview/evaluate', { question, answer });
  return response.data;
};

export const subscribeToJobs = async (data: { email: string; role: string; location: string }) => {
  const response = await api.post('/subscribe', data);
  return response.data;
};

// Auth
export const loginUser = async (credentials: any) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData: any) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};
