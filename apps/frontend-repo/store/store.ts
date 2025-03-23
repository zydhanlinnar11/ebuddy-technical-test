import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth'
import updateUserReducer from './updateUser'

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      updateUser: updateUserReducer,
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
