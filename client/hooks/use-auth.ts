'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/lib/axiosInstance'
import { useAuthContext, User } from '@/app/providers'
import { useRouter } from 'next/navigation'

type LoginCredentials = {
  email: string
  password: string
}

type RegisterCredentials = {
  name: string
  email: string
  password: string
}

type AuthResponse = {
  accessToken: string
  user: User
}

export function useLogin() {
  const { setUser } = useAuthContext()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials)
      return response.data
    },
    onSuccess: (data) => {
      // Store the token
      localStorage.setItem('token', data.accessToken)
      
      // Update the auth context
      setUser(data.user)
      
      // Invalidate queries that might depend on the user's authentication status
      queryClient.invalidateQueries({ queryKey: ['user'] })
      
      // Redirect to dashboard
      router.push('/dashboard')
    },
    onError: (error) => {
      console.error('Login failed:', error)
    }
  })
}

export function useRegister() {
  const router = useRouter()

  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const response = await axiosInstance.post<User>('/auth/register', credentials)
      return response.data
    },
    onSuccess: () => {
      // Redirect to email verification page after successful registration
      router.push('/verify-email')
    },
    onError: (error) => {
      console.error('Registration failed:', error)
    }
  })
}

export function useLogout() {
  const { setUser } = useAuthContext()
  const router = useRouter()
  const queryClient = useQueryClient()

  return () => {
    // Remove the token
    localStorage.removeItem('token')
    
    // Clear the user from context
    setUser(null)
    
    // Reset the query client
    queryClient.clear()
    
    // Redirect to home
    router.push('/')
  }
}
