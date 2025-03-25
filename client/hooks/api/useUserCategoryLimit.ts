'use client'

import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/lib/axiosInstance'

// Types
export interface UserCategoryLimit {
  userId: string
  categoryId: string
  limit: number
  createdAt: string
  updatedAt: string
}

export interface SetUserCategoryLimitDto {
  categoryId: string
  limit: number
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
