'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import axiosInstance from '@/lib/axiosInstance'

// Types
export interface GroupInfo {
    id: string
    name: string
    type: 'NORMAL' | 'BUSINESS'
    createdAt: string
    updatedAt: string
}

export interface Group {
    group: GroupInfo
    groupId: string
    role: string
    userId: string
}

export interface GroupUser {
    userId: string
    groupId: string
    role: string
    user: {
        id: string
        name: string
        email: string
        picture?: string
    }
}

export interface CreateGroupDto {
    name: string
    type: 'NORMAL' | 'BUSINESS'
}

export interface UpdateGroupNameDto {
    name: string
}

// Create group
export const useCreateGroup = () => {
  return useMutation({
    mutationFn: async (groupData: CreateGroupDto) => {
      const response = await axiosInstance.post<Group>('/group/create', groupData)
      return response.data
    },
  })
}

// Get all user groups
export const useUserGroups = (enabled = true) => {
  return useQuery({
    queryKey: ['userGroups'],
    queryFn: async () => {
      const response = await axiosInstance.get<Group[]>('/group/all')
      return response.data
    },
    enabled,
    staleTime: 30000, // Consider data fresh for 30 seconds
  })
}

// Get group by ID
export const useGroupById = (groupId: string, enabled = true) => {
  return useQuery({
    queryKey: ['group', groupId],
    queryFn: async () => {
      const response = await axiosInstance.get<Group>(`/group/${groupId}`)
      return response.data
    },
    enabled: !!groupId && enabled,
    staleTime: 30000, // Consider data fresh for 30 seconds
  })
}

// Get group users
export const useGroupUsers = (groupId: string, enabled = true) => {
  return useQuery({
    queryKey: ['groupUsers', groupId],
    queryFn: async () => {
      const response = await axiosInstance.get<GroupUser[]>(`/group/${groupId}/users`)
      return response.data
    },
    enabled: !!groupId && enabled,
    staleTime: 30000, // Consider data fresh for 30 seconds
  })
}

// Update group name
export const useUpdateGroupName = (groupId: string) => {
  return useMutation({
    mutationFn: async (data: UpdateGroupNameDto) => {
      const response = await axiosInstance.patch<GroupInfo>(`/group/${groupId}`, data)
      return response.data
    },
  })
}
