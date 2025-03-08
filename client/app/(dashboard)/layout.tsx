"use client"

import { createContext, useState, useContext } from "react"
import type React from "react"

import { useIsMobile } from "@/hooks/use-mobile"
import { MobileNav } from "@/components/ui/mobile-nav"
import { ProtectedRoute } from "@/components/protected-route"
import "./dashboard.css"

// Create a context to share the active section state
type DashboardContextType = {
  activeSection: string
  setActiveSection: (section: string) => void
}

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

// Hook to use the dashboard context
export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [activeSection, setActiveSection] = useState("dashboard")
  const isMobile = useIsMobile()

  return (
    <ProtectedRoute>
      <DashboardContext.Provider value={{ activeSection, setActiveSection }}>
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
      </DashboardContext.Provider>
    </ProtectedRoute>
  )
}
