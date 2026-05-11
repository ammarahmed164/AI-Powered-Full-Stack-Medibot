/**
 * History API Service
 * Save and fetch user chat history
 */

import api from './api'

export const historyAPI = {
  saveSession: (data: {
    user_id: string
    session_name?: string
    messages: Array<{ sender_type: string; content: string }>
  }) => api.post('/history/sessions', data),

  getUserSessions: (userId: string) => api.get(`/history/sessions/${userId}`),

  getSessionMessages: (sessionId: string) =>
    api.get(`/history/sessions/${sessionId}/messages`),

  saveReport: (data: {
    user_id: string
    report_type: string
    file_name: string
    analysis_result: string
  }) => api.post('/history/reports', data),

  getUserReports: (userId: string) => api.get(`/history/reports/${userId}`),
}
