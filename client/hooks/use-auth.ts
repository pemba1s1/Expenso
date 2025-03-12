'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/lib/axiosInstance'
import { useAuthContext, User } from '@/app/providers'
import { useRouter } from 'next/navigation'
import { AxiosError } from 'axios'

// Helper function to extract error message from AxiosError
const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // Try to get error message from response data
    const responseData = error.response?.data
    if (responseData?.message) {
      return responseData.message
    }
    if (responseData?.error) {
      return responseData.error
    }
    // Fallback to status text or generic message
    return error.response?.statusText || 'An error occurred during authentication'
  }
  return error instanceof Error ? error.message : 'An unexpected error occurred'
}

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

  const mutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials)
      return response.data
    },
    onSuccess: (data) => {
      // Store the token
      localStorage.setItem('token', data.accessToken)
      
      // Store the user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user))

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

  return {
    ...mutation,
    error: mutation.error ? getErrorMessage(mutation.error) : null
  }
}

export function useRegister() {
  const router = useRouter()

  const mutation = useMutation({
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

  return {
    ...mutation,
    error: mutation.error ? getErrorMessage(mutation.error) : null
  }
}

export function useLogout() {
  const { setUser } = useAuthContext()
  const router = useRouter()
  const queryClient = useQueryClient()

  return () => {
    // Remove the token and user data from localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    // Clear the user from context
    setUser(null)

    // Reset the query client
    queryClient.clear()

    // Redirect to home
    router.push('/')
  }
}

export function useVerifyEmail() {
  const router = useRouter()
  const { setUser } = useAuthContext()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (token: string) => {
      // Use the new endpoint format with query parameter
      const response = await axiosInstance.get<AuthResponse>(`/auth/verify?token=${token}`)
      return response.data
    },
    onSuccess: (data) => {
      // Store the token
      localStorage.setItem('token', data.accessToken)
      
      // Store the user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user))

      // Update the auth context
      setUser(data.user)

      // Invalidate queries that might depend on the user's authentication status
      queryClient.invalidateQueries({ queryKey: ['user'] })

      // Redirect to dashboard page after successful verification
      router.push('/dashboard')
    },
    onError: (error) => {
      console.error('Email verification failed:', error)
    }
  })

  return {
    ...mutation,
    error: mutation.error ? getErrorMessage(mutation.error) : null
  }
}
