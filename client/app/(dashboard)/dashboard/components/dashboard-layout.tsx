"use client"

import { ReactNode, useState, useEffect } from "react"
import { Home, CreditCard, BarChart, Users, Settings } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { useDashboard } from "@/hooks/use-dashboard"
import { useUserGroups } from "@/hooks/api/useGroup"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GroupDetails } from "@/components/group-details"
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
  const [currentGroupId, setCurrentGroupId] = useState<string>("no-group")
  const [showGroupDetails, setShowGroupDetails] = useState(false)
  
  // When a group is selected, show the group details
  useEffect(() => {
    if (currentGroupId && currentGroupId !== "no-group") {
      setShowGroupDetails(true)
      setActiveSection("groups")
    } else if (currentGroupId === "no-group") {
      setShowGroupDetails(false)
    }
  }, [currentGroupId, setActiveSection])

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
                    onClick={() => {
                      setActiveSection("dashboard")
                      setShowGroupDetails(false)
                    }}
                  >
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeSection === "expenses"} 
                    onClick={() => {
                      setActiveSection("expenses")
                      setShowGroupDetails(false)
                    }}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Expenses</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeSection === "insights"} 
                    onClick={() => {
                      setActiveSection("insights")
                      setShowGroupDetails(false)
                    }}
                  >
                    <BarChart className="h-4 w-4" />
                    <span>Insights</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeSection === "groups"} 
                    onClick={() => {
                      setActiveSection("groups")
                      setShowGroupDetails(true)
                    }}
                  >
                    <Users className="h-4 w-4" />
                    <span>Groups</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeSection === "settings"} 
                    onClick={() => {
                      setActiveSection("settings")
                      setShowGroupDetails(false)
                    }}
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
          <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6 w-full">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">
                {activeSection === "dashboard" && "Dashboard"}
                {activeSection === "expenses" && "Expense Tracking"}
                {activeSection === "insights" && "Insights & Reports"}
                {activeSection === "groups" && "Group Management"}
                {activeSection === "settings" && "Settings"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Select 
                value={currentGroupId} 
                onValueChange={setCurrentGroupId}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-group">No Group</SelectItem>
                  {groups && groups.map((group) => (
                    <SelectItem key={group.groupId} value={group.groupId}>
                      {group.group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            </div>
          </header>
          <main className="grid flex-1 items-start gap-4 p-4 md:gap-8 md:p-6 w-full max-w-7xl mx-auto">
            {showGroupDetails && activeSection === "groups" ? (
              <GroupDetails groupId={currentGroupId} />
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
