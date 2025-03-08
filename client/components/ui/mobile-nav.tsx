"use client"

import * as React from "react"
import { Home, CreditCard, BarChart, Settings, Camera } from "lucide-react"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MobileNavProps {
  activeSection: string
  setActiveSection: (section: string) => void
  className?: string
}

export function MobileNav({
  activeSection,
  setActiveSection,
  className,
}: MobileNavProps) {
  const isMobile = useIsMobile()

  if (!isMobile) return null

  return (
    <div className={cn("fixed bottom-0 left-0 right-0 border-t bg-background", className)}>
      <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
        <TabsList className="grid grid-cols-5 w-full h-16 rounded-none bg-background relative">
          <TabsTrigger value="dashboard" className="flex flex-col items-center justify-center gap-1 data-[state=active]:shadow-none">
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </TabsTrigger>
          <TabsTrigger value="expenses" className="flex flex-col items-center justify-center gap-1 data-[state=active]:shadow-none">
            <CreditCard className="h-5 w-5" />
            <span className="text-xs">Expenses</span>
          </TabsTrigger>
          <TabsTrigger value="camera" className="flex flex-col items-center justify-center relative -top-4">
            <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <Camera className="h-7 w-7 text-primary-foreground" />
            </div>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex flex-col items-center justify-center gap-1 data-[state=active]:shadow-none">
            <BarChart className="h-5 w-5" />
            <span className="text-xs">Insights</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex flex-col items-center justify-center gap-1 data-[state=active]:shadow-none">
            <Settings className="h-5 w-5" />
            <span className="text-xs">Settings</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
