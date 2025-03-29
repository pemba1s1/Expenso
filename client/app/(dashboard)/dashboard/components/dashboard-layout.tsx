"use client"

import { ReactNode } from "react"
import { Home, CreditCard, BarChart, Users, Settings } from "lucide-react"
import { format } from "date-fns"

import { useIsMobile } from "@/hooks/use-mobile"
import { useMonthStore } from "@/stores/useMonthStore"
import { useDashboard } from "@/hooks/use-dashboard"
import { useUserGroups } from "@/hooks/api/useGroup"
import { useGroupStore } from "@/stores/useGroupStore"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GroupsSection } from "../sections/groups"
import { UserProfileSidebar } from "@/components/user-profile-sidebar"
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
  const { data: groups } = useUserGroups()
  const { selectedGroup, setSelectedGroup } = useGroupStore()
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/40">
        {!isMobile && (
          <Sidebar>
            <SidebarContent>
              <div className="flex h-14 items-center border-b px-4">
                <span className="font-semibold">Expenso</span>
              </div>
              
              <SidebarContent className="flex-1">
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
                  <SidebarMenuButton 
                    isActive={activeSection === "expenses"} 
                    onClick={() => setActiveSection("expenses")}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Expenses</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeSection === "insights"} 
                    onClick={() => setActiveSection("insights")}
                  >
                    <BarChart className="h-4 w-4" />
                    <span>Insights</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeSection === "groups"} 
                    onClick={() => setActiveSection("groups")}
                  >
                    <Users className="h-4 w-4" />
                    <span>Groups</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeSection === "settings"} 
                    onClick={() => setActiveSection("settings")}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
              
              <div className="px-3 py-2 border-t">
                <UserProfileSidebar />
              </div>
            </SidebarContent>
          </Sidebar>
        )}
        <div className="flex-1 overflow-auto dashboard-content flex flex-col">
          <header className="flex flex-col sm:flex-row min-h-[60px] sm:h-14 lg:h-[60px] items-start sm:items-center gap-2 sm:gap-4 border-b bg-background px-3 sm:px-6 py-3 sm:py-0 w-full">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <SidebarTrigger />
              <h1 className="text-base sm:text-lg font-semibold truncate">
                {activeSection === "dashboard" && "Dashboard"}
                {activeSection === "expenses" && "Expense Tracking"}
                {activeSection === "insights" && "Insights & Reports"}
                {activeSection === "groups" && "Group Management"}
                {activeSection === "settings" && "Settings"}
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto sm:ml-auto">
              <Select 
                value={selectedGroup?.id || "_none"} 
                onValueChange={(value) => {
                  if (value === "_none") {
                    setSelectedGroup(null)
                  } else if (groups) {
                    const group = groups.find(g => g.groupId === value)
                    if (group) {
                      setSelectedGroup({
                        id: group.groupId,
                        name: group.group.name
                      })
                    }
                  }
                }}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">No Group</SelectItem>
                  {groups && groups.map((group) => (
                    <SelectItem key={group.groupId} value={group.groupId}>
                      {group.group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select 
                value={useMonthStore((state) => state.getFormattedMonth())}
                onValueChange={useMonthStore((state) => state.setSelectedMonth)}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {(() => {
                    const months = [];
                    const now = new Date();
                    const currentYear = now.getFullYear();
                    const currentMonth = now.getMonth();
                    
                    for (let month = 0; month <= currentMonth; month++) {
                      const date = new Date(currentYear, month);
                      const value = format(date, "yyyy-MM");
                      const label = format(date, "MMMM yyyy");
                      months.push({ value, label });
                    }
                    
                    return months.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ));
                  })()}
                </SelectContent>
              </Select>
            </div>
          </header>
          <main className="grid flex-1 items-start gap-4 px-2 py-4 sm:p-4 md:gap-8 md:p-6 w-full max-w-7xl mx-auto overflow-hidden">
            {activeSection === "groups" ? (
              <GroupsSection />
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
