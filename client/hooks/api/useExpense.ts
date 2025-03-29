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
  userId: string
  groupId: string
  totalAmount: number
  taxAmount: number
  receiptImageUrl?: string
  createdAt: string
  updatedAt: string
  expenses: Expense[]
  user: {
    id: string
    name: string
    email: string
  }
  group: {
    id: string
    name: string
    type: string
  }
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

export interface MonthlyInsight {
  summary: string
  topCategories: string
  savingOpportunities: string
  tips: string[]
}

export interface AddExpenseParams {
  amount: string
  description: string
  groupId: string
  categoryName: string
  receiptImage?: File
}

export interface AddExpenseFromReceiptParams {
  receiptImage: File
  groupId: string
}

// Add individual expense
export const useAddExpense = () => {
  return useMutation({
    mutationFn: async (params: AddExpenseParams) => {
      const formData = new FormData()
      formData.append('amount', params.amount)
      formData.append('description', params.description)
      formData.append('groupId', params.groupId)
      formData.append('categoryName', params.categoryName)
      if (params.receiptImage) {
        formData.append('receiptImage', params.receiptImage)
      }

      const response = await axiosInstance.post<Expense>('/expense', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
  })
}

// Add expense from receipt
export const useAddExpenseFromReceipt = () => {
  return useMutation({
    mutationFn: async (params: AddExpenseFromReceiptParams) => {
      const formData = new FormData()
      formData.append('receiptImage', params.receiptImage)
      formData.append('groupId', params.groupId)

      const response = await axiosInstance.post<{
        message: string
        expenseCount: number
        receiptId: string
      }>('/expense/receipt', formData, {
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
export const useUserExpenses = (year: string, month: string, groupId?: string, enabled = true) => {
  return useQuery({
    queryKey: ['userExpenses', year, month, groupId],
    queryFn: async () => {
      const params = new URLSearchParams({
        year,
        month,
      })
      if (groupId) {
        params.append('groupId', groupId)
      }
      
      const response = await axiosInstance.get<Receipt[]>(`expense/user?${params.toString()}`)
      return response.data
    },
    enabled,
  })
}

// Get expense by ID
export const useExpenseById = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['expense', id],
    queryFn: async () => {
      const response = await axiosInstance.get<Expense>(`/expense/${id}`)
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
      
      const response = await axiosInstance.get<ExpenseSummary>(`/expense/summary?${params.toString()}`)
      return response.data
    },
    enabled,
  })
}

// Get monthly expense insights
export const useMonthlyInsight = (
  groupId: string,
  year: string,
  month: string,
  enabled = true
) => {
  return useQuery({
    queryKey: ['monthlyInsight', groupId, year, month],
    queryFn: async () => {
      const params = new URLSearchParams({
        groupId,
        year,
        month,
      })
      
      const response = await axiosInstance.get<MonthlyInsight>(`/expense/monthly-insight?${params.toString()}`)
      return response.data
    },
    enabled,
  })
}

// Generate new monthly insight
export const useGenerateNewInsight = () => {
  return useMutation({
    mutationFn: async ({ groupId, year, month }: { groupId: string; year: string; month: string }) => {
      const params = new URLSearchParams({
        groupId,
        year,
        month,
        newInsight: 'true'
      })
      
      const response = await axiosInstance.get<MonthlyInsight>(`/expense/monthly-insight?${params.toString()}`)
      return response.data
    }
  })
}
