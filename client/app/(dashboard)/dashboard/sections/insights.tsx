"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SpendingTrends } from "@/components/spending-trends"
import { SpendingByCategory } from "@/components/spending-by-category"
import { TopExpenses } from "@/components/top-expense"

export function InsightsSection() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Spending Trends</CardTitle>
          <CardDescription>Your spending patterns over time</CardDescription>
        </CardHeader>
        <CardContent>
          <SpendingTrends />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>How your spending is distributed</CardDescription>
        </CardHeader>
        <CardContent>
          <SpendingByCategory />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Top Expenses</CardTitle>
          <CardDescription>Your largest expenses this period</CardDescription>
        </CardHeader>
        <CardContent>
          <TopExpenses />
        </CardContent>
      </Card>
    </div>
  )
}
