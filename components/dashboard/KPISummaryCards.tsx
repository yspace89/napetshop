'use client'

import { KpiSummary } from '@/types'
import { formatRupiah } from '@/lib/utils'
import { GraduationCap, ShoppingBag, TrendingUp } from 'lucide-react'

interface Props {
  summary: KpiSummary | null
  loading: boolean
}

export function KPISummaryCards({ summary, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <div className="skeleton h-28 rounded-2xl" />
        <div className="skeleton h-28 rounded-2xl" />
      </div>
    )
  }

  const eduProgress = summary?.edu_target
    ? Math.min((summary.edu_count / summary.edu_target) * 100, 100)
    : 0

  const salesProgress = summary?.sales_target
    ? Math.min((summary.sales_total / summary.sales_target) * 100, 100)
    : 0

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Card Edukasi */}
      <div
        id="kpi-edu-card"
        className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-blue-600" strokeWidth={2} />
          </div>
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Edukasi</span>
        </div>
        <div className="mb-2">
          <span className="text-2xl font-bold text-slate-800">{summary?.edu_count ?? 0}</span>
          <span className="text-sm text-slate-400 ml-1">/ {summary?.edu_target ?? 0}</span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${eduProgress}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5">{Math.round(eduProgress)}% dari target</p>
      </div>

      {/* Card Penjualan */}
      <div
        id="kpi-sales-card"
        className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-green-600" strokeWidth={2} />
          </div>
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Penjualan</span>
        </div>
        <div className="mb-1">
          <span className="text-lg font-bold text-slate-800">
            {summary?.sales_qty ?? 0}
            <span className="text-xs font-normal text-slate-400 ml-1">item</span>
          </span>
        </div>
        <p className="text-sm font-semibold text-green-600 mb-2">
          {formatRupiah(summary?.sales_total ?? 0)}
        </p>
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
            style={{ width: `${salesProgress}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5">{Math.round(salesProgress)}% dari target</p>
      </div>
    </div>
  )
}
