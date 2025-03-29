'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import axiosInstance from '@/lib/axiosInstance'
import { useAuthContext } from '@/app/providers'
import { useRouter } from 'next/navigation'

// Types
export interface RegisterUserDto {
  email: string
  password: string
  name: string
}

export interface LoginUserDto {
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    name: string
    picture?: string
    role?: string
  }
  accessToken: string
}

// Register user
export const useRegister = () => {
  const { setUser } = useAuthContext()

  return useMutation({
    mutationFn: async (userData: RegisterUserDto) => {
      const response = await axiosInstance.post<AuthResponse>('/auth/register', userData)
      return response.data
    },
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem('token', data.accessToken)
      // Update user context
      setUser(data.user)
    },
  })
}

// Login user
export const useLogin = () => {
  const { setUser } = useAuthContext()
  const router = useRouter()

  return useMutation({
    mutationFn: async (credentials: LoginUserDto) => {
      const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials)
      return response.data
    },
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem('token', data.accessToken)
      // Update user context
      setUser(data.user)
      // Redirect to dashboard after successful login
      router.push('/dashboard')
    },
  })
}

// Verify user
export const useVerifyUser = () => {
  return useMutation({
    mutationFn: async (token: string) => {
      const response = await axiosInstance.get(`/auth/verify?token=${token}`)
      return response.data
    },
  })
}

// Get current user
export const useCurrentUser = () => {
  const { setUser } = useAuthContext()

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/auth/me')
        return response.data
      } catch (error) {
        // If unauthorized, clear user data
        localStorage.removeItem('token')
        setUser(null)
        throw error
      }
    },
    // Only run if we have a token
    enabled: !!localStorage.getItem('token'),
  })
}

// Logout (client-side only)
export const useLogout = () => {
  const { setUser } = useAuthContext()

  return () => {
    localStorage.removeItem('token')
    setUser(null)
  }
}

// Google login (redirect only)
export const useGoogleLogin = () => {
  return () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`
  }
}
