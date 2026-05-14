import axios from 'axios';

const api = axios.create({
  baseURL: 'http://3.26.15.73:5000/api',
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (userData) => api.post('/auth/login', userData),
  getMe: () => api.get('/auth/me'),
};

export const quizAPI = {
  getQuizzes: () => api.get('/quizzes'),
  getQuiz: (id) => api.get(`/quizzes/${id}`),
  createQuiz: (data) => api.post('/quizzes', data),
  updateQuiz: (id, data) => api.put(`/quizzes/${id}`, data),
  deleteQuiz: (id) => api.delete(`/quizzes/${id}`),
};

export const questionAPI = {
  getQuestions: (quizId) => api.get(`/quizzes/${quizId}/questions`),
  createQuestion: (quizId, data) => api.post(`/quizzes/${quizId}/questions`, data),
  updateQuestion: (id, data) => api.put(`/questions/${id}`, data),
  deleteQuestion: (id) => api.delete(`/questions/${id}`),
};

export const scoreAPI = {
  submitQuiz: (data) => api.post('/scores/submit', data),
  getMyScores: () => api.get('/scores/my'),
  getAdminStats: () => api.get('/scores/stats'),
};

export default api;
