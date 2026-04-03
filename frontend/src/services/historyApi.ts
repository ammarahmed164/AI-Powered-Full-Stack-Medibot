/**
 * History API Service
 * Save and fetch user chat history
 */

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const historyAPI = {
  // Save chat session
  saveSession: (data: {
    user_id: string
    session_name?: string
    messages: Array<{ type: string; content: string }>
  }) => api.post('/history/sessions', data),

  // Get all user sessions
  getUserSessions: (userId: string) => 
    api.get(`/history/sessions/${userId}`),

  // Get session messages
  getSessionMessages: (sessionId: string) => 
    api.get(`/history/sessions/${sessionId}/messages`),

  // Save medical report
  saveReport: (data: {
    user_id: string
    report_type: string
    file_name: string
    analysis_result: string
  }) => api.post('/history/reports', data),

  // Get user reports
  getUserReports: (userId: string) => 
    api.get(`/history/reports/${userId}`),
}
