'use client'

import { PropsWithChildren, useEffect, useRef } from 'react'
import { Provider } from 'react-redux'
import { AppStore, makeStore } from '../store/store'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { app } from '../config/firebase'
import { setAuthState } from '../store/auth'

const Providers = ({ children }: PropsWithChildren) => {
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
    const auth = getAuth(app)
    onAuthStateChanged(auth, (user) => {
      storeRef.current?.dispatch(
        setAuthState({
          loading: false,
          userId: user?.uid ?? null,
        })
      )
    })
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}

export default Providers
