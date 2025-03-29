import { create } from 'zustand'
import { format } from 'date-fns'

interface MonthStore {
  selectedMonth: string
  selectedYear: string
  setSelectedMonth: (month: string) => void
  getMonthName: () => string
  getFormattedMonth: () => string
}

export const useMonthStore = create<MonthStore>((set, get) => ({
  selectedMonth: format(new Date(), "yyyy-MM"),
  selectedYear: new Date().getFullYear().toString(),
  setSelectedMonth: (month) => set({ 
    selectedMonth: month,
    selectedYear: month.split('-')[0]
  }),
  getMonthName: () => {
    const [, month] = get().selectedMonth.split('-')
    const date = new Date(2025, parseInt(month) - 1)
    return date.toLocaleString('en-US', { month: 'long' }).toLowerCase()
  },
  getFormattedMonth: () => get().selectedMonth
}))
