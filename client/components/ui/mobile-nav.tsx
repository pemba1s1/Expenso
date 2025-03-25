"use client"

import { useState, useRef, useEffect } from "react"
import { Home, CreditCard, BarChart, Camera, User, Users, LogOut, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { useAuthContext } from "@/app/providers"
import { useLogout } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GroupDetails } from "@/components/group-details"
import { useUserGroups } from "@/hooks/api/useGroup"

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
  const { user } = useAuthContext()
  const logout = useLogout()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentGroupId, setCurrentGroupId] = useState<string | undefined>()
  const { data: groups } = useUserGroups()
  const [showGroupDetails, setShowGroupDetails] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  
  // When a group is selected, show the group details
  useEffect(() => {
    if (currentGroupId && currentGroupId !== "no-group") {
      setShowGroupDetails(true)
      setActiveSection("groups")
      setIsProfileOpen(false)
    } else if (currentGroupId === "no-group") {
      setShowGroupDetails(false)
    }
  }, [currentGroupId, setActiveSection])

  const handleCameraClick = (e: React.MouseEvent) => {
    e.preventDefault()
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Here you would handle the file, e.g., upload it to your server
      console.log("File selected:", file)
      
      // TODO: File handling logic goes here
      // 1. Show a preview of the image
      // 2. Upload it to server
      // 3. Process it for receipt data extraction
    }
  }

  const handleProfileClick = () => {
    router.push('/profile')
    setIsProfileOpen(false)
  }

  const handleSettingsClick = () => {
    setActiveSection("settings")
    setIsProfileOpen(false)
  }

  const handleGroupClick = () => {
    setActiveSection("groups")
  }

  const handleLogoutClick = () => {
    logout()
    setIsProfileOpen(false)
  }

  if (!isMobile) return null

  const initials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : user?.email?.substring(0, 2).toUpperCase() || 'U'

  return (
    <div className={cn("fixed bottom-0 left-0 right-0 border-t bg-background z-50", className)}>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {showGroupDetails && activeSection === "groups" ? (
        <div className="p-4 pb-20">
          <GroupDetails groupId={currentGroupId} />
        </div>
      ) : (
        <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
          <TabsList className="grid grid-cols-5 w-full h-16 rounded-none bg-background relative">
            <TabsTrigger 
              value="dashboard" 
              className="flex flex-col items-center justify-center gap-1 data-[state=active]:shadow-none"
              onClick={() => setShowGroupDetails(false)}
            >
              <Home className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </TabsTrigger>
            <TabsTrigger 
              value="expenses" 
              className="flex flex-col items-center justify-center gap-1 data-[state=active]:shadow-none"
              onClick={() => setShowGroupDetails(false)}
            >
              <CreditCard className="h-5 w-5" />
              <span className="text-xs">Expenses</span>
            </TabsTrigger>
            <TabsTrigger 
              value="camera" 
              className="flex flex-col items-center justify-center relative -top-4" 
              onClick={handleCameraClick}
            >
              <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <Camera className="h-7 w-7 text-primary-foreground" />
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="flex flex-col items-center justify-center gap-1 data-[state=active]:shadow-none"
              onClick={() => setShowGroupDetails(false)}
            >
              <BarChart className="h-5 w-5" />
              <span className="text-xs">Insights</span>
            </TabsTrigger>
            
            <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <SheetTrigger asChild>
                <TabsTrigger 
                  value="profile" 
                  className="flex flex-col items-center justify-center gap-1 data-[state=active]:shadow-none"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user?.picture || ''} alt={user?.name || user?.email || 'User'} />
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs">Profile</span>
                </TabsTrigger>
              </SheetTrigger>
              
              <SheetContent side="bottom" className="h-[60vh] pb-safe-area-bottom">
                <SheetHeader className="mb-4">
                  <SheetTitle>Profile</SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 p-2">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user?.picture || ''} alt={user?.name || user?.email || 'User'} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.name || 'User'}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      onClick={handleProfileClick}
                    >
                      <User className="mr-2 h-5 w-5" />
                      Profile
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      onClick={handleGroupClick}
                    >
                      <Users className="mr-2 h-5 w-5" />
                      Groups
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      onClick={handleSettingsClick}
                    >
                      <Settings className="mr-2 h-5 w-5" />
                      Settings
                    </Button>
                    
                    <div className="mt-2">
                      <Select 
                        value={currentGroupId} 
                        onValueChange={setCurrentGroupId}
                      >
                        <SelectTrigger className="w-full">
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
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-500" 
                      onClick={handleLogoutClick}
                    >
                      <LogOut className="mr-2 h-5 w-5" />
                      Logout
                    </Button>
                  </div>
                  
                </div>
              </SheetContent>
            </Sheet>
          </TabsList>
        </Tabs>
      )}
    </div>
  )
}
