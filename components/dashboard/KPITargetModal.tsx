'use client'

import { useState } from 'react'
import { KpiSummary } from '@/types'
import { formatRupiah, formatMonthLabel, getCurrentMonth } from '@/lib/utils'
import { X, Target, Loader2 } from 'lucide-react'

interface Props {
  month: string
  currentSummary: KpiSummary | null
  onClose: () => void
  onSuccess: () => void
}

export function KPITargetModal({ month, currentSummary, onClose, onSuccess }: Props) {
  const [eduTarget, setEduTarget] = useState(
    String(currentSummary?.edu_target || '')
  )
  const [salesTarget, setSalesTarget] = useState(
    String(currentSummary?.sales_target || '')
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const edu = parseInt(eduTarget) || 0
    const sales = parseInt(salesTarget.replace(/\D/g, '')) || 0

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/kpi', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month,
          edu_target: edu,
          sales_target: sales,
        }),
      })

      if (!res.ok) throw new Error('Gagal menyimpan target')
      onSuccess()
      onClose()
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
            <Target className="w-8 h-8 text-amber-500" strokeWidth={1.5} />
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-800 text-center mb-1">
          Set Target KPI
        </h3>
        <p className="text-xs text-slate-500 text-center mb-5">
          {formatMonthLabel(month)}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Edukasi */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Target Edukasi (sesi)
            </label>
            <input
              id="input-edu-target"
              type="number"
              min="0"
              value={eduTarget}
              onChange={(e) => setEduTarget(e.target.value)}
              placeholder="Contoh: 30"
              className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Target Penjualan */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Target Penjualan (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
                Rp
              </span>
              <input
                id="input-sales-target"
                type="number"
                min="0"
                value={salesTarget}
                onChange={(e) => setSalesTarget(e.target.value)}
                placeholder="5000000"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            {salesTarget && (
              <p className="text-xs text-slate-400 mt-1 text-right">
                {formatRupiah(parseInt(salesTarget.replace(/\D/g, '') || '0'))}
              </p>
            )}
          </div>

          {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}

          <button
            id="save-target-btn"
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-sm hover:from-green-600 hover:to-green-700 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Simpan Target
          </button>
        </form>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          <X className="w-3.5 h-3.5 text-slate-600" />
        </button>
      </div>
    </div>
  )
}
