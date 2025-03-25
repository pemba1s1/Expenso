'use client'

import { useState, useRef, useEffect } from 'react'
import { LogOut, Settings } from 'lucide-react'
import { useAuthContext } from '@/app/providers'
import { useLogout } from '@/hooks/use-auth'
import { useDashboard } from '@/hooks/use-dashboard'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function UserProfileSidebar() {
  const { user } = useAuthContext()
  const logout = useLogout()
  const { setActiveSection } = useDashboard()
  const [showPopup, setShowPopup] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current && 
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPopup(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSettingsClick = () => {
    setShowPopup(false)
    setActiveSection("settings")
  }


  const handleLogoutClick = () => {
    setShowPopup(false)
    logout()
  }

  if (!user) return null

  const initials = user.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : user.email?.substring(0, 2).toUpperCase() || 'U'

  return (
    <div className="relative mt-auto">
      <Button
        ref={buttonRef}
        variant="ghost"
        className="w-full flex items-center justify-start gap-3 px-3 py-2 h-auto"
        onClick={() => setShowPopup(!showPopup)}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.picture || ''} alt={user.name || user.email || 'User'} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start text-left overflow-hidden group-data-[collapsible=icon]:hidden">
          <span className="text-sm font-medium truncate max-w-[120px]">
            {user.name || user.email}
          </span>
          <span className="text-xs text-muted-foreground truncate max-w-[120px]">
            {user.email}
          </span>
        </div>
      </Button>

      {showPopup && (
        <div 
          ref={popupRef}
          className="absolute bottom-full left-0 mb-2 w-full bg-sidebar rounded-md shadow-md border border-sidebar-border overflow-hidden"
        >
          <div className="p-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm"
              onClick={handleSettingsClick}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogoutClick}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
