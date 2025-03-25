'use client'

import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/lib/axiosInstance'

// Types
export interface Invitation {
  id: string
  email: string
  groupId: string
  status: string
}

export interface InviteUserDto {
  email: string
  groupId: string
}

export interface AcceptInvitationDto {
  invitationId: string
  password: string
}

// Invite user to group
export const useInviteUser = () => {
  return useMutation({
    mutationFn: async (inviteData: InviteUserDto) => {
      const response = await axiosInstance.post<Invitation>('/invitation', inviteData)
      return response.data
    },
  })
}

// Accept invitation
export const useAcceptInvitation = () => {
  return useMutation({
    mutationFn: async (acceptData: AcceptInvitationDto) => {
      const response = await axiosInstance.post('/invitation/accept', acceptData)
      return response.data
    },
  })
}
