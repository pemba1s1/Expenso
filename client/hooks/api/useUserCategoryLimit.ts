'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import axiosInstance from '@/lib/axiosInstance'

// Types
export interface Category {
  id: string
  name: string
}

export interface UserCategoryLimit {
  id: string
  userId: string
  categoryId: string
  groupId?: string
  limit: number
  year: string
  month: string
  category: Category
  createdAt: string
  updatedAt: string
}

export interface SetUserCategoryLimitDto {
  categoryId: string
  limit: number
  groupId?: string
}

// Get user category limits
export const useGetUserCategoryLimits = (groupId?: string) => {
  return useQuery({
    queryKey: ['userCategoryLimits', groupId],
    queryFn: async () => {
      const response = await axiosInstance.get<UserCategoryLimit[]>('/userCategoryLimit', {
        params: { groupId }
      })
      return response.data
    }
  })
}

export interface UpdateUserCategoryLimitDto {
  id: string
  limit: number
  groupId?: string
}

// Set user category limit
export const useSetUserCategoryLimit = () => {
  return useMutation({
    mutationFn: async (limitData: SetUserCategoryLimitDto) => {
      const response = await axiosInstance.post<UserCategoryLimit>('/userCategoryLimit', limitData)
      return response.data
    },
  })
}

// Update user category limit
export const useUpdateUserCategoryLimit = () => {
  return useMutation({
    mutationFn: async (limitData: UpdateUserCategoryLimitDto) => {
      const response = await axiosInstance.patch<UserCategoryLimit>('/userCategoryLimit', limitData)
      return response.data
    },
  })
}
