import { User } from '@supabase/supabase-js'
import { create } from 'zustand'

import { AnonToDo } from '@/interfaces/anon-to-do'

interface Store {
  user: User | null
  setUser: (user: User | null) => void
  isLoggingIn: boolean
  setIsLoggingIn: (arg0: boolean) => void
  isAnon: boolean
  setIsAnon: (arg0: boolean) => void
  anonToDos: AnonToDo[]
  setAnonToDos: (arg0: AnonToDo[] | []) => void
}

const listOnStorage = localStorage.getItem('@anon-to-do-list-items')

export const useStore = create<Store>((set) => ({
  user: null,
  setUser: (newUser: User | null) => set({ user: newUser }),
  isLoggingIn: false,
  setIsLoggingIn: (arg0: boolean) => set({ isLoggingIn: arg0 }),
  isAnon: false,
  setIsAnon: (arg0: boolean) => set({ isAnon: arg0 }),
  anonToDos: listOnStorage ? JSON.parse(listOnStorage) : [],
  setAnonToDos: (arg0: AnonToDo[]) => set({ anonToDos: arg0 }),
}))
