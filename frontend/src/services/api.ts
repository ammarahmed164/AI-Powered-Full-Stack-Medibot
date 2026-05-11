import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  refreshToken: (refreshToken: string) => api.post('/auth/refresh', { refresh_token: refreshToken }),
}

// Chat API
export const chatAPI = {
  sendMessage: (message: string, sessionId?: string, conversationHistory?: any[]) => {
    console.log('Sending message:', message)
    console.log('Conversation history:', conversationHistory)
    
    return api.post('/chat/message', { 
      message, 
      session_id: sessionId,
      conversation_history: conversationHistory || [] 
    })
  },
  getHistory: (page = 1, limit = 20) =>
    api.get('/chat/history', { params: { page, limit } }),
  getConsultation: (id: string) =>
    api.get(`/chat/history/${id}`),
  deleteConsultation: (id: string) =>
    api.delete(`/chat/history/${id}`),
  getStats: () =>
    api.get('/chat/stats'),
}

// Disease API
export const diseaseAPI = {
  list: (params?: any) => api.get('/diseases', { params }),
  get: (id: string) => api.get(`/diseases/${id}`),
  search: (query: string) => api.get('/diseases/search', { params: { q: query } }),
  getSymptoms: () => api.get('/diseases/symptoms'),
}

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
}

export default api
