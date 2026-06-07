'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { EducationSession, KpiSummary } from '@/types'
import { getCurrentMonth, formatMonthLabel } from '@/lib/utils'
import { KPISummaryCards } from './KPISummaryCards'
import { EducationList } from './EducationList'
import { FAB } from './FAB'
import { EducationModal } from './EducationModal'
import { KPITargetModal } from './KPITargetModal'
import { PurchaseToggleModal } from './PurchaseToggleModal'
import { UserCircle2, Settings2 } from 'lucide-react'

interface Props {
  advisorId: string
  advisorName: string
}

export function DashboardClient({ advisorId, advisorName }: Props) {
  const {
    isEduModalOpen, openEduModal, closeEduModal,
    isTargetModalOpen, openTargetModal, closeTargetModal,
    toggleItemId, closeToggleModal,
    sessions, setSessions,
    kpiSummary, setKpiSummary,
  } = useAppStore()

  const [loading, setLoading] = useState(true)
  const currentMonth = getCurrentMonth()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [sessionsRes, kpiRes] = await Promise.all([
        fetch('/api/education'),
        fetch(`/api/kpi?month=${currentMonth}`),
      ])

      const sessionsData: EducationSession[] = await sessionsRes.json()
      const kpiTarget = await kpiRes.json()

      setSessions(sessionsData)

      // Compute KPI summary from sessions
      let eduCount = sessionsData.length
      let salesQty = 0
      let salesTotal = 0

      sessionsData.forEach((s) => {
        s.items?.forEach((item) => {
          if (item.purchase_status === 'purchased') {
            salesQty++
            salesTotal += item.actual_price || 0
          }
        })
      })

      setKpiSummary({
        edu_count: eduCount,
        edu_target: kpiTarget.edu_target || 0,
        sales_qty: salesQty,
        sales_total: salesTotal,
        sales_target: kpiTarget.sales_target || 0,
      })
    } catch (err) {
      console.error('Failed to fetch dashboard data', err)
    } finally {
      setLoading(false)
    }
  }, [currentMonth, setSessions, setKpiSummary])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="flex flex-col min-h-dvh bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-sm">
              <UserCircle2 className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs text-slate-500 leading-none">Selamat pagi 👋</p>
              <p className="text-sm font-semibold text-slate-800 leading-tight">{advisorName}</p>
            </div>
          </div>
          <button
            id="kpi-target-btn"
            onClick={openTargetModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-50 text-green-700 text-xs font-medium border border-green-100 hover:bg-green-100 transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5" />
            Target {formatMonthLabel(currentMonth).split(' ')[0]}
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 py-4 space-y-4">
        <KPISummaryCards summary={kpiSummary} loading={loading} />
        <EducationList sessions={sessions} loading={loading} onRefresh={fetchData} />
      </div>

      {/* FAB */}
      <FAB onClick={openEduModal} />

      {/* Modals */}
      {isEduModalOpen && (
        <EducationModal
          advisorId={advisorId}
          onClose={closeEduModal}
          onSuccess={fetchData}
        />
      )}
      {isTargetModalOpen && (
        <KPITargetModal
          month={currentMonth}
          currentSummary={kpiSummary}
          onClose={closeTargetModal}
          onSuccess={fetchData}
        />
      )}
      {toggleItemId && (
        <PurchaseToggleModal
          itemId={toggleItemId}
          onClose={closeToggleModal}
          onSuccess={fetchData}
        />
      )}
    </div>
  )
}
