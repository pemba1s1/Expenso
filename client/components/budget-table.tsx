"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMonthlyExpenseSummary } from "@/hooks/api/useExpense"
import { useMonthStore } from "@/stores/useMonthStore"
import { useGetUserCategoryLimits } from "@/hooks/api/useUserCategoryLimit"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface BudgetTableProps {
  groupId?: string
}

export function BudgetTable({ groupId }: BudgetTableProps) {
  const router = useRouter()
  const selectedMonth = useMonthStore((state) => state.selectedMonth)
  const monthName = useMonthStore((state) => state.getMonthName())
  const [year] = selectedMonth.split('-')
  
  const { data: summary } = useMonthlyExpenseSummary(year, monthName, groupId)
  const { data: categoryLimits } = useGetUserCategoryLimits(groupId)
  const categories = summary?.totalAmountPerCategory || []

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Spent</TableHead>
          <TableHead>Budget</TableHead>
          <TableHead>Remaining</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-4">
              No expenses recorded for this period
            </TableCell>
          </TableRow>
        ) : categories.map((category) => {
          const categoryLimit = categoryLimits?.find(limit => limit.category.name === category.name)
          const budget = categoryLimit?.limit || 0
          const remaining = budget > 0 ? budget - category.amount : 0

          return (
            <TableRow key={category.name}>
              <TableCell>{category.name}</TableCell>
              <TableCell>${category.amount.toFixed(2)}</TableCell>
              <TableCell>
                {budget > 0 ? (
                  `$${budget.toFixed(2)}`
                ) : (
                  <span className="text-muted-foreground text-sm">No budget set</span>
                )}
              </TableCell>
              <TableCell>
                {budget > 0 ? (
                  `$${remaining.toFixed(2)}`
                ) : (
                  <Button 
                    variant="link" 
                    className="text-sm p-0 h-auto"
                    onClick={() => router.push('/dashboard?section=groups')}
                  >
                    Set budget
                  </Button>
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
