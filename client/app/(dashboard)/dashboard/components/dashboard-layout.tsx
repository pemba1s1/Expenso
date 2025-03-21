"use client"

import { ReactNode } from "react"
import { Home, CreditCard, BarChart, Settings, User } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { useAuthContext } from "@/app/providers"
import { useDashboard } from "@/hooks/use-dashboard"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { activeSection, setActiveSection } = useDashboard()
  const isMobile = useIsMobile()
  const { user } = useAuthContext()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/40">
        {!isMobile && (
          <Sidebar>
            <SidebarContent>
              <div className="flex h-14 items-center border-b px-4">
                <span className="font-semibold">Expenso</span>
              </div>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeSection === "dashboard"}
                    onClick={() => setActiveSection("dashboard")}
                  >
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeSection === "expenses"} onClick={() => setActiveSection("expenses")}>
                    <CreditCard className="h-4 w-4" />
                    <span>Expenses</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeSection === "insights"} onClick={() => setActiveSection("insights")}>
                    <BarChart className="h-4 w-4" />
                    <span>Insights</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeSection === "settings"} onClick={() => setActiveSection("settings")}>
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        )}
        <div className="flex-1 overflow-auto dashboard-content flex flex-col">
          <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6 w-full">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">
                {activeSection === "dashboard" && "Dashboard"}
                {activeSection === "expenses" && "Expense Tracking"}
                {activeSection === "insights" && "Insights & Reports"}
                {activeSection === "settings" && "Settings"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="april">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="january">January 2025</SelectItem>
                  <SelectItem value="february">February 2025</SelectItem>
                  <SelectItem value="march">March 2025</SelectItem>
                  <SelectItem value="april">April 2025</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User account</span>
                </Button>
                {user && (
                  <span className="text-sm font-medium hidden md:inline-block">
                    {user.name || user.email}
                  </span>
                )}
              </div>
            </div>
          </header>
          <main className="grid flex-1 items-start gap-4 p-4 md:gap-8 md:p-6 w-full max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
