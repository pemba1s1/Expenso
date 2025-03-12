'use client'

import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/lib/axiosInstance'
import { useAuthContext, User } from '@/app/providers'

export function useUser() {
  const { user, setUser } = useAuthContext()

  // Query to fetch the current user's data
  const query = useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<User> => {
      try {
        const response = await axiosInstance.get('/auth/me')
        return response.data
      } catch (error) {
        // If the request fails, clear the token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
        }
        throw error
      }
    },
    // Only fetch if we have a token but no user data
    // Check if window is defined before accessing localStorage (to avoid SSR issues)
    enabled: !user && typeof window !== 'undefined' && !!localStorage.getItem('token'),
    retry: false, // Don't retry on failure
  })

  // Update the auth context when we get the user data
  if (query.data && !user) {
    setUser(query.data)
  }

  // If the request fails, clear the token
  if (query.isError && typeof window !== 'undefined') {
    localStorage.removeItem('token')
  }

  return {
    user,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
