"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SpendingByCategory } from "@/components/spending-by-category"
import { MonthlyInsightCard } from "@/components/monthly-insight-card"
import { useGroupStore } from "@/stores/useGroupStore"

export function InsightsSection() {
  const { selectedGroup } = useGroupStore()

  return (
    <div className="grid gap-3 sm:gap-4 lg:grid-cols-2 w-full overflow-hidden">
      <MonthlyInsightCard groupId={selectedGroup?.id || ""} />
      <Card className="lg:col-span-2 overflow-hidden w-full">
        <CardHeader className="px-3 sm:px-6 py-4">
          <CardTitle className="text-base sm:text-lg">Spending by Category</CardTitle>
          <CardDescription className="text-xs sm:text-sm">How your spending is distributed</CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="w-full overflow-hidden">
            <SpendingByCategory groupId={selectedGroup?.id} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
