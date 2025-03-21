"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionList } from "@/components/transaction-list"

interface ExpensesSectionProps {
  setShowExpenseForm: (show: boolean) => void
}

export function ExpensesSection({ setShowExpenseForm }: ExpensesSectionProps) {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Expense Tracking</CardTitle>
              <CardDescription>Manage and track your expenses</CardDescription>
            </div>
            <Button onClick={() => setShowExpenseForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <TransactionList />
        </CardContent>
      </Card>
    </div>
  )
}
