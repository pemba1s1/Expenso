'use client'

import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/lib/axiosInstance'

// Types
export interface Invitation {
  id: string
  email: string
  groupId: string
  status: string
  group?: {
    id: string
    name: string
  }
}

export interface InviteUserDto {
  email: string
  groupId: string
}

export interface AcceptInvitationDto {
  invitationId: string
  password?: string  // Optional for existing users
  name?: string      // Required for new users
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

// Helper function to determine if it's a new user invitation
export const isNewUserInvitation = (invitationLink: string): boolean => {
  return invitationLink.includes('password=true')
}
