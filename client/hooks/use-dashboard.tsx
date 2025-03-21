"use client"

import { createContext, useContext } from "react"

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
