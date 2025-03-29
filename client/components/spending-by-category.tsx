"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useMonthlyExpenseSummary } from "@/hooks/api/useExpense"
import { useMonthStore } from "@/stores/useMonthStore"
import { Skeleton } from "@/components/ui/skeleton"

interface SpendingByCategoryProps {
  groupId?: string
}

export function SpendingByCategory({ groupId }: SpendingByCategoryProps) {
  const monthStore = useMonthStore()
  const { data: summary, isLoading } = useMonthlyExpenseSummary(
    monthStore.selectedYear,
    monthStore.getMonthName(),
    groupId
  )

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="overflow-x-auto -mx-3 sm:-mx-6">
          <div className="h-[250px] sm:h-[400px] w-full px-2 sm:px-6">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!summary) return null

  const data = summary.totalAmountPerCategory.map(category => ({
    name: category.name,
    amount: category.amount
  }))
  return (
    <div className="w-full">
      <div className="overflow-x-auto -mx-3 sm:-mx-6">
        <div className="h-[250px] sm:h-[400px] w-full px-2 sm:px-6">
          <ResponsiveContainer width="100%" height="100%" debounce={50}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 0,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} width={45} />
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
                labelStyle={{ color: "var(--foreground)" }}
                contentStyle={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)"
                }}
              />
              <Bar dataKey="amount" name="Amount" fill="var(--primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
