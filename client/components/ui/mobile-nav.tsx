"use client"

import { useState, useRef } from "react"
import { Home, CreditCard, BarChart, Camera, LogOut, Settings, Loader2, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { useAuthContext } from "@/app/providers"
import { useLogout } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { useAddExpenseFromReceipt } from "@/hooks/api/useExpense"
import { useGroupStore } from "@/stores/useGroupStore"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleCameraClick = (e: React.MouseEvent) => {
    e.preventDefault()
    fileInputRef.current?.click()
  }

  const { toast } = useToast()
  const { selectedGroup } = useGroupStore()
  const addExpenseFromReceipt = useAddExpenseFromReceipt()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && selectedGroup?.id) {
      addExpenseFromReceipt.mutate(
        { receiptImage: file, groupId: selectedGroup.id },
        {
          onSuccess: () => {
            setActiveSection("expenses")
            toast({
              title: "Receipt uploaded successfully",
              description: "Your receipt is being processed and expenses will be added shortly.",
            })
          },
          onError: (error) => {
            toast({
              title: "Failed to upload receipt",
              description: error.message,
              variant: "destructive",
            })
          },
        }
      )
    } else if (!selectedGroup?.id) {
      toast({
        title: "Please select a group",
        description: "You need to select a group before uploading a receipt.",
        variant: "destructive",
      })
    }
    // Reset the input
    e.target.value = ""
  }

  const handleSettingsClick = () => {
    setActiveSection("settings")
    setIsProfileOpen(false)
  }

  const handleGroupClick = () => {
    setActiveSection("groups")
    setIsProfileOpen(false)
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
      
      <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
        <TabsList className="grid grid-cols-5 w-full h-16 rounded-none bg-background relative">
          <TabsTrigger 
            value="dashboard" 
            className="flex flex-col items-center justify-center gap-1 data-[state=active]:shadow-none"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </TabsTrigger>
          <TabsTrigger 
            value="expenses" 
            className="flex flex-col items-center justify-center gap-1 data-[state=active]:shadow-none"
          >
            <CreditCard className="h-5 w-5" />
            <span className="text-xs">Expenses</span>
          </TabsTrigger>
          <button 
            className="flex flex-col items-center justify-center relative -top-4" 
            onClick={handleCameraClick}
          >
            <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
              {addExpenseFromReceipt.isPending ? (
                <Loader2 className="h-7 w-7 text-primary-foreground animate-spin" />
              ) : (
                <Camera className="h-7 w-7 text-primary-foreground" />
              )}
            </div>
          </button>
          <TabsTrigger 
            value="insights" 
            className="flex flex-col items-center justify-center gap-1 data-[state=active]:shadow-none"
          >
            <BarChart className="h-5 w-5" />
            <span className="text-xs">Insights</span>
          </TabsTrigger>
          
          <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <SheetTrigger asChild>
              <button 
                className="flex flex-col items-center justify-center gap-1 h-full w-full hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-background data-[state=active]:text-accent-foreground"
                onClick={(e) => {
                  e.preventDefault();
                  setIsProfileOpen(true);
                }}
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user?.picture || ''} alt={user?.name || user?.email || 'User'} />
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                <span className="text-xs">Profile</span>
              </button>
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
                    onClick={handleSettingsClick}
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    Settings
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
    </div>
  )
}
