"use client"

import { useMonthlyExpenseSummary } from "@/hooks/api/useExpense"
import { Progress } from "@/components/ui/progress"
import { useMonthStore } from "@/stores/useMonthStore"
import { useGetUserCategoryLimits } from "@/hooks/api/useUserCategoryLimit"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface BudgetChartProps {
  groupId?: string
}

export function BudgetChart({ groupId }: BudgetChartProps) {
  const router = useRouter()
  const selectedMonth = useMonthStore((state) => state.selectedMonth)
  const monthName = useMonthStore((state) => state.getMonthName())
  const [year] = selectedMonth.split('-')
  
  const { data: summary } = useMonthlyExpenseSummary(year, monthName, groupId)
  const { data: categoryLimits } = useGetUserCategoryLimits(groupId)
  const categories = summary?.totalAmountPerCategory || []
  
  const totalBudget = categoryLimits?.reduce((acc, limit) => acc + limit.limit, 0) || 0
  const totalSpent = categories.reduce((acc, cat) => acc + cat.amount, 0)

  return (
    <div className="w-full space-y-4">
      {categories.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          No expenses recorded for this period
        </div>
      ) : (
        <>
          {categories.map((category) => {
            const categoryLimit = categoryLimits?.find(limit => limit.category.name === category.name)
            const budget = categoryLimit?.limit || 0
            const percentage = budget > 0 ? (category.amount / budget) * 100 : 0

            return (
              <div key={category.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{category.name}</span>
                  {budget > 0 ? (
                    <span>${category.amount.toFixed(2)} / ${budget.toFixed(2)}</span>
                  ) : (
                    <Button 
                      variant="link" 
                      className="text-sm p-0 h-auto"
                      onClick={() => router.push('/dashboard?section=groups')}
                    >
                      Set budget
                    </Button>
                  )}
                </div>
                {budget > 0 && <Progress value={percentage} className="h-2" />}
              </div>
            )
          })}
          
          {totalBudget > 0 && (
            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm font-medium">
                <span>Total (Budgeted Categories)</span>
                <span>${totalSpent.toFixed(2)} / ${totalBudget.toFixed(2)}</span>
              </div>
              <Progress 
                value={(totalSpent / totalBudget) * 100} 
                className="h-2 mt-2" 
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
