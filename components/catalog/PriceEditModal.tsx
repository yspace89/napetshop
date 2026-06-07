'use client'

import { useState } from 'react'
import { Product, PriceOverride } from '@/types'
import { formatRupiah } from '@/lib/utils'
import { X, Loader2, Tag } from 'lucide-react'

interface Props {
  product: Product
  branchId: string
  branchName: string
  currentOverride?: PriceOverride
  onClose: () => void
  onSuccess: (override: PriceOverride) => void
}

export function PriceEditModal({
  product,
  branchId,
  branchName,
  currentOverride,
  onClose,
  onSuccess,
}: Props) {
  const [price, setPrice] = useState(
    String(currentOverride?.custom_price || product.base_price)
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const numPrice = parseInt(price.replace(/\D/g, ''))
    if (!numPrice || numPrice <= 0) {
      setError('Masukkan harga yang valid')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/price-overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch_id: branchId,
          product_id: product.id,
          custom_price: numPrice,
        }),
      })

      if (!res.ok) throw new Error('Gagal menyimpan harga')
      const data: PriceOverride = await res.json()
      onSuccess(data)
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
          <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center">
            <Tag className="w-8 h-8 text-purple-500" strokeWidth={1.5} />
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-800 text-center mb-1">
          Edit Harga Jual
        </h3>
        <p className="text-xs text-slate-500 text-center mb-1">{product.name}</p>
        <p className="text-[10px] text-slate-400 text-center mb-5">{branchName}</p>

        {/* Base price info */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mb-4">
          <span className="text-xs text-slate-500">Harga Dasar ERP</span>
          <span className="text-xs font-semibold text-slate-700">
            {formatRupiah(product.base_price)}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Harga Jual Anda (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
                Rp
              </span>
              <input
                id="input-custom-price"
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="450000"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            {price && (
              <p className="text-xs text-slate-400 mt-1 text-right">
                {formatRupiah(parseInt(price.replace(/\D/g, '') || '0'))}
              </p>
            )}
          </div>

          {error && <p className="text-xs text-red-500 text-center">{error}</p>}

          <button
            id="save-price-btn"
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-sm hover:from-green-600 hover:to-green-700 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Simpan Harga
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
