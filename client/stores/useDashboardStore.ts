'use client'

import { create } from 'zustand'

export type Section = 'dashboard' | 'expenses' | 'insights' | 'groups' | 'settings'

interface DashboardState {
  activeSection: Section
  setActiveSection: (section: Section) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeSection: 'dashboard',
  setActiveSection: (section) => set({ activeSection: section })
}))
