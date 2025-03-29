'use client'

import { create } from 'zustand'

interface Group {
  id: string
  name: string
}

interface GroupState {
  selectedGroup: Group | null
  setSelectedGroup: (group: Group | null) => void
}

export const useGroupStore = create<GroupState>((set) => ({
  selectedGroup: null,
  setSelectedGroup: (group) => set({ selectedGroup: group })
}))
