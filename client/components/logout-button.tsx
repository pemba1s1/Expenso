'use client'

import { Button } from '@/components/ui/button'
import { useLogout } from '@/hooks/use-auth'

export function LogoutButton() {
  const logout = useLogout()

  return (
    <Button 
      variant="outline" 
      onClick={logout}
      className="text-red-500 border-red-500 hover:bg-red-50"
    >
      Logout
    </Button>
  )
}
