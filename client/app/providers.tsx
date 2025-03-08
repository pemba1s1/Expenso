'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState, createContext, useContext, useEffect } from 'react'

// Create a type for the user
export type User = {
  id: string
  email: string
  name: string
  picture?: string
}

// Create a type for the auth context
type AuthContextType = {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
}

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
})

// Create a hook to use the auth context
export const useAuthContext = () => useContext(AuthContext)

export function Providers({ children }: { children: ReactNode }) {
  // Create a client
  const [queryClient] = useState(() => new QueryClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse user from localStorage', error)
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AuthContext.Provider>
  )
}
