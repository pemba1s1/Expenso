"use client"

import { DollarSign, Plus, Upload, CreditCard, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Section } from "@/stores/useDashboardStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BudgetTable } from "@/components/budget-table"
import { BudgetChart } from "@/components/budget-chart"
import { useGroupStore } from "@/stores/useGroupStore"
import { useMonthStore } from "@/stores/useMonthStore"
import { useMonthlyExpenseSummary, useAddExpenseFromReceipt } from "@/hooks/api/useExpense"
import { useGetUserCategoryLimits } from "@/hooks/api/useUserCategoryLimit"
import { useToast } from "@/hooks/use-toast"

interface DashboardSectionProps {
  setShowExpenseForm: (show: boolean) => void
  setActiveSection: (section: Section) => void
}

export function DashboardSection({ setShowExpenseForm, setActiveSection }: DashboardSectionProps) {
  const { selectedGroup } = useGroupStore()
  const addExpenseFromReceipt = useAddExpenseFromReceipt()
  const { toast } = useToast()
  const selectedMonth = useMonthStore((state) => state.selectedMonth)
  const monthName = useMonthStore((state) => state.getMonthName())
  const [year] = selectedMonth.split('-')

  const { data: summary } = useMonthlyExpenseSummary(year, monthName, selectedGroup?.id)
  const { data: categoryLimits } = useGetUserCategoryLimits(selectedGroup?.id)

  const totalSpent = summary?.totalAmount || 0
  const budgetedAmount = categoryLimits?.reduce((acc, limit) => acc + limit.limit, 0) || 0
  const remainingBudget = budgetedAmount - totalSpent
  const spentPercentage = budgetedAmount > 0 ? (totalSpent / budgetedAmount) * 100 : 0
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Current Month Balance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budgeted</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {budgetedAmount > 0 ? (
              <>
                <div className="text-2xl font-bold">${budgetedAmount.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Monthly Budget</p>
              </>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center text-yellow-600">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm">No budgets set</span>
                </div>
                <Button 
                  variant="link" 
                  className="text-sm p-0 h-auto"
                  onClick={() => setActiveSection('groups')}
                >
                  Set category budgets
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{spentPercentage.toFixed(1)}% of budget</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {budgetedAmount > 0 ? (
              <>
                <div className="text-2xl font-bold">${remainingBudget.toFixed(2)}</div>
                <div className="mt-2">
                  <Progress value={spentPercentage} className="h-2" />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center text-yellow-600">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm">No budgets set</span>
                </div>
                <Button 
                  variant="link" 
                  className="text-sm p-0 h-auto"
                  onClick={() => setActiveSection('groups')}
                >
                  Set category budgets
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Budget Planning</CardTitle>
              <CardDescription>Manage your budget allocations</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <BudgetTable groupId={selectedGroup?.id} />
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Budget Allocation</CardTitle>
            <CardDescription>How your budget is distributed</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <BudgetChart groupId={selectedGroup?.id} />
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-4">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="receipt-upload"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file && selectedGroup?.id) {
                  addExpenseFromReceipt.mutate(
                    { receiptImage: file, groupId: selectedGroup.id },
                    {
                      onSuccess: () => {
                        setActiveSection("expenses")
                        toast({
                          title: "Receipt uploaded successfully",
                          description: "Your receipt is being processed and expenses will be added shortly.",
                        })
                      },
                      onError: (error) => {
                        toast({
                          title: "Failed to upload receipt",
                          description: error.message,
                          variant: "destructive",
                        })
                      },
                    }
                  )
                } else if (!selectedGroup?.id) {
                  toast({
                    title: "Please select a group",
                    description: "You need to select a group before uploading a receipt.",
                    variant: "destructive",
                  })
                }
                // Reset the input
                e.target.value = ""
              }}
            />
            <Button onClick={() => setShowExpenseForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
            <Button 
              variant="outline"
              onClick={() => document.getElementById("receipt-upload")?.click()}
              disabled={addExpenseFromReceipt.isPending}
            >
              <Upload className="mr-2 h-4 w-4" />
              {addExpenseFromReceipt.isPending ? "Uploading..." : "Upload Receipt"}
            </Button>
            <Button variant="outline" onClick={() => setActiveSection("expenses")}>
              <CreditCard className="mr-2 h-4 w-4" />
              View Transactions
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
