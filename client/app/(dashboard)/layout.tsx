"use client"

import type React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { MobileNav } from "@/components/ui/mobile-nav"
import { ProtectedRoute } from "@/components/protected-route"
import { useDashboardStore } from "@/stores/useDashboardStore"
import "./dashboard.css"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { activeSection, setActiveSection } = useDashboardStore()
  const isMobile = useIsMobile()

  return (
    <ProtectedRoute>
      <div className="dashboard-layout">
        {children}
        {isMobile && (
          <MobileNav 
            activeSection={activeSection} 
            setActiveSection={setActiveSection}
            className="pb-safe-area-bottom"
          />
        )}
        {isMobile && <div className="h-16 pb-safe-area-bottom" />}
      </div>
    </ProtectedRoute>
  )
}
