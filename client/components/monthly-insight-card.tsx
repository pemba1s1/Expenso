"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMonthlyInsight, useGenerateNewInsight } from "@/hooks/api/useExpense"
import { useMonthStore } from "@/stores/useMonthStore"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw } from "lucide-react"

interface MonthlyInsightCardProps {
  groupId: string
}

export function MonthlyInsightCard({ groupId }: MonthlyInsightCardProps) {
  const monthStore = useMonthStore()
  const { data: insight, isLoading, refetch } = useMonthlyInsight(
    groupId, 
    monthStore.selectedYear, 
    monthStore.getMonthName()
  )

  const generateNewInsight = useGenerateNewInsight()

  const handleGenerateNewInsight = async () => {
    await generateNewInsight.mutateAsync({
      groupId,
      year: monthStore.selectedYear,
      month: monthStore.getMonthName()
    }, {
      onSuccess: () => refetch()
    })
  }

  const isRegenerating = generateNewInsight.isPending

  if (isLoading || isRegenerating) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Monthly Insight</CardTitle>
          <CardDescription>AI-powered analysis of your spending</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-3/4" />
          <Skeleton className="h-16 w-5/6" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!insight) return null

  return (
    <Card className="col-span-2 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between px-3 sm:px-6 py-4">
        <div>
          <CardTitle className="text-base sm:text-lg">Monthly Insight</CardTitle>
          <CardDescription className="text-xs sm:text-sm">AI-powered analysis of your spending</CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleGenerateNewInsight}
          title="Generate new insight"
          className="h-8 w-8"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6">
        <div className="space-y-1.5 sm:space-y-2">
          <h4 className="font-medium text-sm sm:text-base">Summary</h4>
          <p className="text-xs sm:text-sm text-muted-foreground">{insight.summary}</p>
        </div>
        <div className="space-y-1.5 sm:space-y-2">
          <h4 className="font-medium text-sm sm:text-base">Top Categories</h4>
          <p className="text-xs sm:text-sm text-muted-foreground">{insight.topCategories}</p>
        </div>
        <div className="space-y-1.5 sm:space-y-2">
          <h4 className="font-medium text-sm sm:text-base">Saving Opportunities</h4>
          <p className="text-xs sm:text-sm text-muted-foreground">{insight.savingOpportunities}</p>
        </div>
        <div className="space-y-1.5 sm:space-y-2">
          <h4 className="font-medium text-sm sm:text-base">Tips</h4>
          <ul className="list-disc pl-4 space-y-1">
            {insight.tips.map((tip, index) => (
              <li key={index} className="text-xs sm:text-sm text-muted-foreground">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
