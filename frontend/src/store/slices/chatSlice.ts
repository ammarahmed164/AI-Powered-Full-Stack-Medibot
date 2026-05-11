import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { chatAPI } from '../../services/api'
import { historyAPI } from '../../services/historyApi'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: string
  symptoms?: any[]
  diseases?: any[]
  advice?: string[]
  remedies?: any[]
}

interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
  sessionId: string | null
}

const createMessageId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

function messageFromChatSendError(error: any): string {
  const detail = error?.response?.data?.detail
  if (detail) {
    return typeof detail === 'string' ? detail : JSON.stringify(detail)
  }
  const code = error?.code
  if (code === 'ERR_NETWORK' || error?.message === 'Network Error') {
    const base =
      import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
    return `Server unreachable (${base}). Start the MediBot backend (uvicorn) on the same host/port as VITE_API_URL, or fix the URL in frontend/.env.`
  }
  return error?.message || 'Failed to send message'
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  sessionId: null,
}

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any
      const sessionId = state.chat.sessionId || undefined

      // Build conversation history - ALL messages
      const conversationHistory = state.chat.messages
        .filter((msg: any) => msg.type === 'user' || msg.type === 'bot')
        .map((msg: any) => ({
          type: msg.type,
          content: msg.content
        }))

      console.log('Sending to API:', {
        message,
        history_length: conversationHistory.length,
        history: conversationHistory
      })

      // Send to API
      const response = await chatAPI.sendMessage(message, sessionId, conversationHistory)
      const responseData = response?.data

      if (!responseData || typeof responseData !== 'object') {
        throw new Error('Invalid response from chat service')
      }

      // Save to database if user is logged in
      // 1. Check State & LocalStorage
      let userId = state.auth.user?.id || 
                   localStorage.getItem('user_id') || 
                   localStorage.getItem('userId')
      
      // 2. Fallback: Extract ID from Token (jwt_{id})
      if (!userId) {
        const token = state.auth.token || localStorage.getItem('access_token')
        if (token) {
          if (token.startsWith('jwt_')) {
            userId = token.replace('jwt_', '')
          } else if (token.startsWith('admin_jwt_')) {
            userId = token.replace('admin_jwt_', '')
          }
        }
      }
      
      console.log('💾 Attempting to save chat history...', {
        userId,
        sessionId: response.data?.consultation_id,
        messageCount: conversationHistory.length + 2
      })

      if (userId && response.data) {
        const historyMessages = [
          ...conversationHistory.map((msg: any) => ({
            sender_type: msg.type,
            content: msg.content
          })),
          { sender_type: 'user', content: message },
          { sender_type: 'bot', content: response.data.response }
        ]

        const payload = {
          user_id: userId,
          session_name: `Chat ${new Date().toLocaleDateString()}`,
          messages: historyMessages
        }

        // Persist in background so a failing /history/sessions call never blocks chat UX
        // or surfaces a noisy axios stack in the same tick as the assistant reply.
        queueMicrotask(() => {
          historyAPI
            .saveSession(payload)
            .then((saveResponse) => {
              if (saveResponse.data?.skipped) return
              if (import.meta.env.DEV) {
                console.debug('[chat history] saved', saveResponse.data)
              }
            })
            .catch((err: any) => {
              const status = err.response?.status
              const detail = err.response?.data?.detail
              console.warn(
                '[chat history] save failed (chat reply is unaffected)',
                status ?? err.message,
                detail ?? ''
              )
            })
        })
      } else if (import.meta.env.DEV) {
        console.debug('[chat history] skipped — no user id')
      }

      return {
        userMessage: message,
        botResponse: responseData,
        sessionId: responseData.consultation_id || responseData.session_id,
      }
    } catch (error: any) {
      console.error('Chat error:', error)
      return rejectWithValue(messageFromChatSendError(error))
    }
  }
)

export const getChatHistory = createAsyncThunk(
  'chat/getHistory',
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getHistory(page, limit)
      return response.data
    } catch (error: any) {
      return rejectWithValue('Failed to load history')
    }
  }
)

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const payload = action.payload || {}
      state.messages.push({
        ...payload,
        id: payload.id || createMessageId(),
        timestamp: payload.timestamp || new Date().toISOString(),
      })
    },
    clearMessages: (state) => {
      state.messages = []
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Send Message
      .addCase(sendMessage.pending, (state, action) => {
        state.isLoading = true
        state.error = null
        state.messages.push({
          id: createMessageId(),
          type: 'user',
          content: action.meta.arg,
          timestamp: new Date().toISOString(),
        })
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false

        // Add bot response
        const response = action.payload.botResponse
        state.messages.push({
          id: createMessageId(),
          type: 'bot',
          content: response.response || response.message || 'I need more information to help you.',
          timestamp: new Date().toISOString(),
          symptoms: response.extracted_symptoms,
          diseases: response.predicted_diseases,
          advice: response.advice,
          remedies: response.home_remedies,
        })

        // Update session ID
        if (!state.sessionId) {
          state.sessionId = response.consultation_id || response.session_id
        }
      })
      .addCase(sendMessage.rejected, (state, action: any) => {
        state.isLoading = false
        const errorMessage = action.payload || 'Failed to send message'
        state.error = errorMessage
        state.messages.push({
          id: createMessageId(),
          type: 'bot',
          content: `Sorry, I could not process that message. ${errorMessage}`,
          timestamp: new Date().toISOString(),
        })
      })
      // Get History
      .addCase(getChatHistory.fulfilled, () => {
        // Handle history loading if needed
      })
  },
})

export const { addMessage, clearMessages, setError } = chatSlice.actions
export default chatSlice.reducer
