import { User } from '@supabase/supabase-js'
import { create } from 'zustand'

interface Store {
  user: User | null
  setUser: (user: User | null) => void
  isLoggingIn: boolean
  setIsLoggingIn: (arg0: boolean) => void
}

export const useStore = create<Store>((set) => ({
  user: null,
  setUser: (newUser: User | null) => set({ user: newUser }),
  isLoggingIn: false,
  setIsLoggingIn: (arg0: boolean) => set({ isLoggingIn: arg0 }),
}))
