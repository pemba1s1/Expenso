'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useAuthContext } from '@/app/providers'
import { useAcceptInvitation } from '@/hooks/api/useInvitation'
import { useDashboardStore } from '@/stores/useDashboardStore'
import { Card } from '@/components/ui/card'

export default function InvitationAcceptPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuthContext()
  const [message, setMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const acceptInvitation = useAcceptInvitation()
  const invitationId = params.id as string
  const isNewUser = searchParams.get('password') === 'true'

  useEffect(() => {
    let redirectTimeout: NodeJS.Timeout

    const handleInvitation = async () => {
      if (isProcessing) return
      setIsProcessing(true)
      if (!user) {
        if (isNewUser) {
          setMessage('You need to create an account to join this group')
          redirectTimeout = setTimeout(() => {
            router.push(`/enter?invitationId=${invitationId}&type=register`)
          }, 3000)
        } else {
          setMessage('Please log in to join this group')
          redirectTimeout = setTimeout(() => {
            router.push(`/enter?invitationId=${invitationId}&type=login`)
          }, 3000)
        }
        return
      }

      if (isNewUser) {
        return
      }

      try {
        setMessage('Adding you to the group...')
        await acceptInvitation.mutateAsync({ invitationId })
        const setActiveSection = useDashboardStore.getState().setActiveSection
        setActiveSection('groups')
        router.push('/dashboard')
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to process invitation'
        setMessage(`${errorMessage}. Redirecting...`)
        redirectTimeout = setTimeout(() => {
          router.push('/')
        }, 3000)
      } finally {
        setIsProcessing(false)
      }
    }

    if (user && !isNewUser) {
      handleInvitation()
    }

    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout)
      }
    }
  }, [acceptInvitation, invitationId, isNewUser, router, user])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Group Invitation</h2>
          <p className="text-gray-600">{message}</p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        </div>
      </Card>
    </div>
  )
}
