'use client'

import { useState } from 'react'
import { Plus, Users, Check } from 'lucide-react'
import { useUserGroups, useCreateGroup, CreateGroupDto } from '@/hooks/api/useGroup'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

interface GroupManagementProps {
  currentGroupId?: string
  onGroupChange?: (groupId: string) => void
}

export function GroupManagement({ currentGroupId, onGroupChange }: GroupManagementProps) {
  const { data: groups, isLoading: isLoadingGroups, refetch: refetchGroups } = useUserGroups()
  const createGroupMutation = useCreateGroup()
  const { toast } = useToast()
  console.log('GroupManagement')
  console.log(groups);
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupType, setNewGroupType] = useState<'NORMAL' | 'BUSINESS'>('NORMAL')

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


  const handleGroupChange = (groupId: string) => {
    if (onGroupChange) {
      onGroupChange(groupId)
    }
  }

  if (isLoadingGroups) {
    return <div className="p-4 text-sm text-muted-foreground">Loading groups...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Your Groups</h3>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Create Group</span>
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

      <div className="space-y-1">
        {groups && groups.length > 0 ? (
          groups.map((group) => (
            <button
              key={group.groupId}
              className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm ${group.groupId === currentGroupId
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted"
                }`}
              onClick={() => handleGroupChange(group.groupId)}
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{group.group.name}</span>
              </div>
              {group.groupId === currentGroupId && <Check className="h-4 w-4" />}
            </button>
          ))
        ) : (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            No groups found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  )
}
