'use client'

import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/lib/axiosInstance'

export interface Category {
  id: string
  name: string
}

export const useCategories = (enabled = true) => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axiosInstance.get<Category[]>('/category')
      return response.data
    },
    enabled,
  })
}
