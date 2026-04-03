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
        try {
          // Map messages for History API (Backend expects 'sender_type', not 'type')
          const historyMessages = [
            ...conversationHistory.map(msg => ({
              sender_type: msg.type,
              content: msg.content
            })),
            { sender_type: 'user', content: message },
            { sender_type: 'bot', content: response.data.response }
          ]

          const saveResponse = await historyAPI.saveSession({
            user_id: userId,
            session_name: `Chat ${new Date().toLocaleDateString()}`,
            messages: historyMessages
          })
          
          console.log('✅ Chat history saved successfully!', saveResponse.data)
        } catch (error: any) {
          console.error('❌ Failed to save chat history:', error.response?.data || error.message)
          // Don't fail the whole request if save fails
        }
      } else {
        console.warn('⚠️ User ID not found - chat not saved to history')
      }

      return {
        userMessage: message,
        botResponse: response.data,
        sessionId: response.data.consultation_id || response.data.session_id,
      }
    } catch (error: any) {
      console.error('Chat error:', error)
      return rejectWithValue(error.response?.data?.detail || 'Failed to send message')
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
      state.messages.push(action.payload)
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
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false

        // Add user message
        state.messages.push({
          id: Date.now().toString(),
          type: 'user',
          content: action.payload.userMessage,
          timestamp: new Date().toISOString(),
        })

        // Add bot response
        const response = action.payload.botResponse
        state.messages.push({
          id: (Date.now() + 1).toString(),
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
        state.error = action.payload
      })
      // Get History
      .addCase(getChatHistory.fulfilled, (state, action) => {
        // Handle history loading if needed
      })
  },
})

export const { addMessage, clearMessages, setError } = chatSlice.actions
export default chatSlice.reducer
