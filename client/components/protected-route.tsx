'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/app/providers'
import { useUser } from '@/hooks/use-user'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading: contextLoading } = useAuthContext()
  const { isLoading: userLoading } = useUser()
  const router = useRouter()
  
  // Combined loading state
  const isLoading = contextLoading || userLoading

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && !user) {
      router.push('/enter?tab=login')
    }
  }, [user, isLoading, router])

  // Show nothing while loading or if not authenticated
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  // If not authenticated, don't render children
  if (!user) {
    return null
  }

  // If authenticated, render children
  return <>{children}</>
}
