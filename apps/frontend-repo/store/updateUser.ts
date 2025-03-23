'use client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type UpdateUserState = 'no_update' | 'success' | 'error' | 'loading'

const initialState: UpdateUserState = 'no_update'

const updateUserSlice = createSlice({
  name: 'updateUser',
  initialState: initialState as UpdateUserState,
  reducers: {
    setUpdateUserState: (_, { payload }: PayloadAction<UpdateUserState>) => {
      return payload
    },
  },
  extraReducers: (_) => {},
})

export const setUpdateUserState = updateUserSlice.actions.setUpdateUserState
export default updateUserSlice.reducer
