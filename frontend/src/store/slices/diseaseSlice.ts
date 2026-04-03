import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { diseaseAPI } from '../../services/api'

interface DiseaseState {
  diseases: any[]
  symptoms: any[]
  loading: boolean
  error: string | null
}

const initialState: DiseaseState = {
  diseases: [],
  symptoms: [],
  loading: false,
  error: null,
}

export const fetchDiseases = createAsyncThunk(
  'disease/fetchDiseases',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await diseaseAPI.list(params)
      return response.data
    } catch (error: any) {
      return rejectWithValue('Failed to fetch diseases')
    }
  }
)

export const fetchSymptoms = createAsyncThunk(
  'disease/fetchSymptoms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await diseaseAPI.getSymptoms()
      return response.data
    } catch (error: any) {
      return rejectWithValue('Failed to fetch symptoms')
    }
  }
)

const diseaseSlice = createSlice({
  name: 'disease',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiseases.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDiseases.fulfilled, (state, action) => {
        state.loading = false
        state.diseases = action.payload.diseases || []
      })
      .addCase(fetchDiseases.rejected, (state, action: any) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchSymptoms.fulfilled, (state, action) => {
        state.symptoms = action.payload.symptoms || []
      })
  },
})

export default diseaseSlice.reducer
