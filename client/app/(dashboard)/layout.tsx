"use client"

import { useState } from "react"
import type React from "react"

import { useIsMobile } from "@/hooks/use-mobile"
import { MobileNav } from "@/components/ui/mobile-nav"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardContext } from "@/hooks/use-dashboard"
import "./dashboard.css"

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
