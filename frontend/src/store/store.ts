import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import chatReducer from './slices/chatSlice'
import diseaseReducer from './slices/diseaseSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    disease: diseaseReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
