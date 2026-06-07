'use client'

import { EducationSession } from '@/types'
import { EducationCard } from './EducationCard'
import { ClipboardList } from 'lucide-react'

interface Props {
  sessions: EducationSession[]
  loading: boolean
  onRefresh: () => void
}

export function EducationList({ sessions, loading, onRefresh }: Props) {
  if (loading) {
    return (
      <div className="space-y-3">
        <div className="skeleton h-36 rounded-2xl" />
        <div className="skeleton h-36 rounded-2xl" />
        <div className="skeleton h-36 rounded-2xl" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-700">
          Riwayat Edukasi
          <span className="ml-2 text-xs font-normal text-slate-400">Bulan Ini</span>
        </h2>
        <span className="text-xs text-slate-400">{sessions.length} sesi</span>
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <ClipboardList className="w-7 h-7 text-slate-400" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-slate-600">Belum ada edukasi</p>
          <p className="text-xs text-slate-400 mt-1">Tekan tombol + untuk mulai mencatat</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <EducationCard
              key={session.id}
              session={session}
              onStatusChange={onRefresh}
            />
          ))}
        </div>
      )}
    </div>
  )
}
