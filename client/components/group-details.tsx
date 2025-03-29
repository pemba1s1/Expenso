'use client'

import { useState, useEffect } from 'react'
import { Users, Edit, UserPlus, Check, X, Plus, DollarSign, Info } from 'lucide-react'
import { AxiosError } from 'axios'
import { 
  useGroupById, 
  useGroupUsers, 
  useUpdateGroupName,
  useUserGroups,
  useCreateGroup,
  CreateGroupDto
} from '@/hooks/api/useGroup'
import { useInviteUser, InviteUserDto } from '@/hooks/api/useInvitation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { useGroupStore } from '@/stores/useGroupStore'
import { useCategories } from '@/hooks/api/useCategory'
import { useGetUserCategoryLimits, useSetUserCategoryLimit } from '@/hooks/api/useUserCategoryLimit'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function GroupDetails() {
  const { selectedGroup } = useGroupStore()
  const selectedGroupId = selectedGroup?.id
  const { data: group, isLoading: isLoadingGroup } = useGroupById(selectedGroupId || '', !!selectedGroupId)
  const { isLoading: isLoadingUsers } = useGroupUsers(selectedGroupId || '', !!selectedGroupId)
  const { data: userGroups, refetch: refetchGroups } = useUserGroups()
  const updateGroupNameMutation = useUpdateGroupName(selectedGroupId || '')
  const inviteUserMutation = useInviteUser()
  const createGroupMutation = useCreateGroup()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupType, setNewGroupType] = useState<'NORMAL' | 'BUSINESS'>('NORMAL')
  const [isBudgetEnabled, setIsBudgetEnabled] = useState(false)
  const [categoryBudgets, setCategoryBudgets] = useState<{ [key: string]: number }>({})
  
  // Hooks for both group and non-group budget settings
  const { data: categories } = useCategories()
  const { data: existingLimits } = useGetUserCategoryLimits(selectedGroupId)
  const { data: defaultLimits } = useGetUserCategoryLimits()
  const setUserCategoryLimit = useSetUserCategoryLimit()

  // Check if current user is admin
  const isAdmin = group?.role === 'admin'

  useEffect(() => {
    if (group) {
      setNewGroupName(group.group.name)
    }
  }, [group])

  useEffect(() => {
    if (existingLimits) {
      const hasExistingLimits = existingLimits.length > 0
      setIsBudgetEnabled(hasExistingLimits)
      
      if (hasExistingLimits) {
        const budgets = existingLimits.reduce((acc, limit) => ({
          ...acc,
          [limit.categoryId]: limit.limit
        }), {})
        setCategoryBudgets(budgets)
      } else {
        setCategoryBudgets({})
      }
    }
  }, [existingLimits])

  const handleInviteUser = async () => {
    if (!inviteEmail.trim() || !selectedGroupId) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive"
      })
      return
    }

    try {
      const inviteData: InviteUserDto = {
        email: inviteEmail.trim(),
        groupId: selectedGroupId
      }

      await inviteUserMutation.mutateAsync(inviteData)

      toast({
        title: "Success",
        description: `Invitation sent to ${inviteEmail}`,
      })

      setInviteEmail('')
      setInviteDialogOpen(false)
    } catch {
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive"
      })
    }
  }

  const handleUpdateGroupName = async () => {
    if (!newGroupName.trim() || !selectedGroupId) {
      toast({
        title: "Error",
        description: "Group name cannot be empty",
        variant: "destructive"
      })
      return
    }

    try {
      await updateGroupNameMutation.mutateAsync({ name: newGroupName.trim() })
      
      toast({
        title: "Success",
        description: "Group name updated successfully",
      })
      
      setIsEditingName(false)
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['group', selectedGroupId] })
      queryClient.invalidateQueries({ queryKey: ['userGroups'] })
    } catch {
      toast({
        title: "Error",
        description: "Failed to update group name",
        variant: "destructive"
      })
    }
  }

  const cancelEditName = () => {
    setNewGroupName(group?.group.name || '')
    setIsEditingName(false)
  }

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast({
        title: "Error",
        description: "Group name cannot be empty",
        variant: "destructive"
      })
      return
    }

    try {
      const groupData: CreateGroupDto = {
        name: newGroupName.trim(),
        type: newGroupType
      }

      await createGroupMutation.mutateAsync(groupData)

      toast({
        title: "Success",
        description: "Group created successfully",
      })

      setNewGroupName('')
      setCreateDialogOpen(false)
      refetchGroups()
    } catch {
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive"
      })
    }
  }

  // Effect to handle budget state based on selected group
  useEffect(() => {
    const limits = selectedGroupId ? existingLimits : defaultLimits
    if (limits) {
      const hasLimits = limits.length > 0
      setIsBudgetEnabled(hasLimits)
      
      if (hasLimits) {
        const budgets = limits.reduce((acc, limit) => ({
          ...acc,
          [limit.categoryId]: limit.limit
        }), {})
        setCategoryBudgets(budgets)
      } else {
        setCategoryBudgets({})
      }
    }
  }, [existingLimits, defaultLimits, selectedGroupId])

  const handleBudgetToggle = (checked: boolean) => {
    setIsBudgetEnabled(checked)
    if (!checked) {
      setCategoryBudgets({})
    }
  }

  const handleBudgetChange = (categoryId: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value)
    setCategoryBudgets(prev => ({
      ...prev,
      [categoryId]: numValue
    }))
  }

  const handleSaveBudgets = async () => {
    try {
      const promises = Object.entries(categoryBudgets).map(([categoryId, limit]) => {
        return setUserCategoryLimit.mutateAsync({
          categoryId,
          limit,
          groupId: selectedGroupId
        })
      })

      await Promise.all(promises)

      toast({
        title: "Success",
        description: selectedGroupId ? "Budget limits saved successfully" : "Default budget limits saved successfully",
      })

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['userCategoryLimits'] })
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Failed to save budget limits:', error.response?.data || error.message)
      }
      toast({
        title: "Error",
        description: "Failed to save budget limits",
        variant: "destructive"
      })
    }
  }

  if (!selectedGroupId || selectedGroupId === "_none") {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Groups</CardTitle>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Group</DialogTitle>
                  <DialogDescription>
                    Create a new group to organize your expenses with team members.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Group Name</Label>
                    <Input
                      id="name"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="Enter group name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Group Type</Label>
                    <Select value={newGroupType} onValueChange={(value: 'NORMAL' | 'BUSINESS') => setNewGroupType(value)}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select group type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NORMAL">Normal</SelectItem>
                        <SelectItem value="BUSINESS">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateGroup} disabled={createGroupMutation.isPending}>
                    {createGroupMutation.isPending ? "Creating..." : "Create Group"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription>
            Select a group from the dropdown in the top bar to manage group or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Your Groups</h3>
            <div className="space-y-1">
              {userGroups && userGroups.length > 0 ? (
                userGroups.map((group) => (
                  <div
                    key={group.groupId}
                    className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{group.group.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {group.role}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  No groups found. Create one to get started.
                </div>
              )}
            </div>
          </div>

          {/* Default Budget Settings Section */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">Default Budget Settings</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>You will be notified if you exceed your budget limit from any category altogether from all group spending.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isBudgetEnabled}
                  onCheckedChange={handleBudgetToggle}
                />
                <span className="text-sm text-muted-foreground">
                  {isBudgetEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>

            {isBudgetEnabled && categories && (
              <div className="space-y-4">
                <div className="grid gap-4">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center gap-4">
                      <Label className="w-32">{category.name}</Label>
                      <div className="flex-1">
                        <div className="relative">
                          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            placeholder="Enter limit"
                            className="pl-8"
                            value={categoryBudgets[category.id] || ''}
                            onChange={(e) => handleBudgetChange(category.id, e.target.value)}
                            disabled={!isBudgetEnabled}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={handleSaveBudgets}
                  disabled={setUserCategoryLimit.isPending || !isBudgetEnabled}
                  className="w-full"
                >
                  {setUserCategoryLimit.isPending ? "Saving..." : "Save Default Budget Limits"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoadingGroup || isLoadingUsers) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <p>Loading group details...</p>
          </div>
        </CardContent>
      </Card>
    )
  }


  if (!group) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <p>Group not found</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          {isEditingName ? (
            <div className="flex items-center gap-2 w-full">
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="max-w-xs"
              />
              <Button size="icon" variant="ghost" onClick={handleUpdateGroupName}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={cancelEditName}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CardTitle>{group.group.name}</CardTitle>
              {isAdmin && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => setIsEditingName(true)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit Group Name</span>
                </Button>
              )}
            </div>
          )}
        </div>
        <CardDescription>
          {group.group.type === "BUSINESS" ? "Business Group" : "Normal Group"} &bull; Created on&#x20;
          {new Date(group.group.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Group Members</h3>
              {isAdmin && (
                <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite User to Group</DialogTitle>
                      <DialogDescription>
                        Send an invitation to join {group.group.name}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleInviteUser} disabled={inviteUserMutation.isPending}>
                        {inviteUserMutation.isPending ? "Sending..." : "Send Invitation"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="space-y-3">
              {/* Group users list implementation */}
            </div>
          </div>

          {/* Budget Settings Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">Budget Settings</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>You will receive notifications when expenses in {group.group.name} exceed the budget limits you set for each category.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isBudgetEnabled}
                  onCheckedChange={handleBudgetToggle}
                  disabled={!isAdmin}
                />
                <span className="text-sm text-muted-foreground">
                  {isBudgetEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>

            {isBudgetEnabled && categories && (
              <div className="space-y-4">
                <div className="grid gap-4">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center gap-4">
                      <Label className="w-32">{category.name}</Label>
                      <div className="flex-1">
                        <div className="relative">
                          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            placeholder="Enter limit"
                            className="pl-8"
                            value={categoryBudgets[category.id] || ''}
                            onChange={(e) => handleBudgetChange(category.id, e.target.value)}
                            disabled={!isBudgetEnabled || !isAdmin}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={handleSaveBudgets}
                  disabled={setUserCategoryLimit.isPending || !isBudgetEnabled || !isAdmin}
                  className="w-full"
                >
                  {setUserCategoryLimit.isPending ? "Saving..." : "Save Budget Limits"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
