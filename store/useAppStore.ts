import { create } from 'zustand'
import { Branch, EducationSession, KpiSummary } from '@/types'

interface AppStore {
  // Branch selection
  selectedBranch: Branch | null
  setSelectedBranch: (branch: Branch | null) => void

  // Dashboard modals
  isEduModalOpen: boolean
  openEduModal: () => void
  closeEduModal: () => void

  isTargetModalOpen: boolean
  openTargetModal: () => void
  closeTargetModal: () => void

  // Toggle purchase modal: stores the item id being toggled
  toggleItemId: string | null
  openToggleModal: (itemId: string) => void
  closeToggleModal: () => void

  // KPI summary (cached for the current session)
  kpiSummary: KpiSummary | null
  setKpiSummary: (summary: KpiSummary) => void

  // Education sessions (current month)
  sessions: EducationSession[]
  setSessions: (sessions: EducationSession[]) => void
  addSession: (session: EducationSession) => void

  // Catalog search
  catalogSearch: string
  setCatalogSearch: (q: string) => void
}

export const useAppStore = create<AppStore>((set) => ({
  selectedBranch: null,
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),

  isEduModalOpen: false,
  openEduModal: () => set({ isEduModalOpen: true }),
  closeEduModal: () => set({ isEduModalOpen: false }),

  isTargetModalOpen: false,
  openTargetModal: () => set({ isTargetModalOpen: true }),
  closeTargetModal: () => set({ isTargetModalOpen: false }),

  toggleItemId: null,
  openToggleModal: (itemId) => set({ toggleItemId: itemId }),
  closeToggleModal: () => set({ toggleItemId: null }),

  kpiSummary: null,
  setKpiSummary: (summary) => set({ kpiSummary: summary }),

  sessions: [],
  setSessions: (sessions) => set({ sessions }),
  addSession: (session) =>
    set((state) => ({ sessions: [session, ...state.sessions] })),

  catalogSearch: '',
  setCatalogSearch: (q) => set({ catalogSearch: q }),
}))
