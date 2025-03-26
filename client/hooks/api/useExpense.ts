'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import axiosInstance from '@/lib/axiosInstance'

// Types
export interface ExpenseItem {
  name: string
  amount: number
}

export interface ExpenseCategory {
  name: string
  amount: number
  items: ExpenseItem[]
}

export interface Receipt {
  id: string
  totalAmount: number
  taxAmount: number
  receiptImageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Expense {
  id: string
  createdAt: string
  updatedAt: string
  amount: number
  description?: string
  userId: string
  receiptImageUrl?: string
  status: string | null
  groupId: string | null
  Receipt?: Receipt
  category: {
    id: string
    name: string
  }
}

export interface ExpenseSummary {
  totalAmount: number
  totalAmountPerCategory: {
    name: string
    amount: number
  }[]
}

// Add expense
export const useAddExpense = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axiosInstance.post<Expense>('/expense', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
  })
}

// Approve expense
export const useApproveExpense = () => {
  return useMutation({
    mutationFn: async (expenseId: string) => {
      const response = await axiosInstance.post<Expense>('/expense/approve', { expenseId })
      return response.data
    },
  })
}

// Get user expenses for a month
export const useUserExpenses = (date: Date, groupId?: string, enabled = true) => {
  return useQuery({
    queryKey: ['userExpenses', date.toISOString(), groupId],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (groupId) {
        params.append('groupId', groupId)
      }
      params.append('date', date.toISOString())
      
      const response = await axiosInstance.get<Expense[]>(`/expense/user?${params.toString()}`)
      return response.data
    },
    enabled,
  })
}

// Get expense summary for custom date range
export const useExpenseSummary = (
  startDate: string,
  endDate: string,
  groupId?: string,
  enabled = true
) => {
  return useQuery({
    queryKey: ['expenseSummary', startDate, endDate, groupId],
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate,
        endDate,
      })
      
      if (groupId) {
        params.append('groupId', groupId)
      }
      
      const response = await axiosInstance.get<ExpenseSummary>(`/expense/summary?${params.toString()}`)
      return response.data
    },
    enabled,
  })
}

// Get monthly expense summary
export const useMonthlyExpenseSummary = (
  year: string,
  month: string,
  groupId?: string,
  enabled = true
) => {
  return useQuery({
    queryKey: ['monthlyExpenseSummary', year, month, groupId],
    queryFn: async () => {
      const params = new URLSearchParams({
        year,
        month,
      })
      
      if (groupId) {
        params.append('groupId', groupId)
      }
      
      const response = await axiosInstance.get<ExpenseSummary>(`/expense/monthly-summary?${params.toString()}`)
      return response.data
    },
    enabled,
  })
}
