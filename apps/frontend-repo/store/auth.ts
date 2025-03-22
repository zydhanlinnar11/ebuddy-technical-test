'use client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AuthState {
  loading: boolean
  userId: string | null
}

const initialState: AuthState = {
  loading: true,
  userId: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, { payload }: PayloadAction<AuthState>) => {
      return payload
    },
  },
  extraReducers: (builder) => {},
})

export const setAuthState = authSlice.actions.setAuthState
export default authSlice.reducer
