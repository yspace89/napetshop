'use client'

import { EducationSession, EducationItem } from '@/types'
import { formatDateTime, formatRupiah, formatWA } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import { Cat, Dog, Phone, MapPin, ShoppingCart, CheckCircle2, Clock } from 'lucide-react'

interface Props {
  session: EducationSession
  onStatusChange: () => void
}

export function EducationCard({ session, onStatusChange }: Props) {
  const { openToggleModal } = useAppStore()
  const PetIcon = session.pet_type === 'Kucing' ? Cat : Dog

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden card-hover">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
              <PetIcon className="w-5 h-5 text-slate-600" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{session.client_name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 text-slate-400" />
                <p className="text-xs text-slate-500">{formatWA(session.client_wa)}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] text-slate-400">{formatDateTime(session.created_at)}</span>
            {session.branch && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="text-[10px] text-slate-500">{session.branch.name.replace('Cabang ', '')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-50 mx-4" />

      {/* Items */}
      <div className="px-4 pb-4 pt-3 space-y-2">
        <div className="flex items-center gap-1.5 mb-2">
          <ShoppingCart className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-medium text-slate-500">Rekomendasi Produk</span>
        </div>
        {session.items?.map((item) => (
          <EducationItemRow
            key={item.id}
            item={item}
            onToggle={() => openToggleModal(item.id)}
          />
        ))}
      </div>
    </div>
  )
}

function EducationItemRow({
  item,
  onToggle,
}: {
  item: EducationItem
  onToggle: () => void
}) {
  const isPurchased = item.purchase_status === 'purchased'

  return (
    <div
      className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
        isPurchased
          ? 'bg-green-50 border-green-100'
          : 'bg-slate-50 border-slate-100'
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-700 truncate">{item.product?.name}</p>
        <p className="text-[10px] text-slate-400">{item.product?.sku}</p>
        {isPurchased && item.actual_price && (
          <p className="text-[10px] font-semibold text-green-600 mt-0.5">
            {formatRupiah(item.actual_price)}
          </p>
        )}
      </div>

      <button
        id={`toggle-item-${item.id}`}
        onClick={onToggle}
        className={`ml-2 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all active:scale-95 ${
          isPurchased
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-100'
        }`}
      >
        {isPurchased ? (
          <>
            <CheckCircle2 className="w-3 h-3" />
            Beli
          </>
        ) : (
          <>
            <Clock className="w-3 h-3" />
            Pending
          </>
        )}
      </button>
    </div>
  )
}
