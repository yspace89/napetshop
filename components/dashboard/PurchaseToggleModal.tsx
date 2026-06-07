'use client'

import { useState } from 'react'
import { X, Loader2, CheckCircle2 } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

interface Props {
  itemId: string
  onClose: () => void
  onSuccess: () => void
}

export function PurchaseToggleModal({ itemId, onClose, onSuccess }: Props) {
  const [actualPrice, setActualPrice] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleConfirm() {
    const price = parseInt(actualPrice.replace(/\D/g, ''))
    if (!price || price <= 0) {
      setError('Masukkan harga jual yang valid')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch(`/api/education/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purchase_status: 'purchased',
          actual_price: price,
        }),
      })

      if (!res.ok) throw new Error('Gagal mengubah status')
      onSuccess()
      onClose()
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRevertPending() {
    setSubmitting(true)
    try {
      await fetch(`/api/education/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchase_status: 'pending' }),
      })
      onSuccess()
      onClose()
    } catch {
      setError('Gagal mengubah status')
    } finally {
      setSubmitting(false)
    }
  }

  function handlePriceInput(value: string) {
    // Only allow numbers
    const cleaned = value.replace(/\D/g, '')
    setActualPrice(cleaned)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-500" strokeWidth={1.5} />
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-800 text-center mb-1">
          Konfirmasi Pembelian
        </h3>
        <p className="text-xs text-slate-500 text-center mb-5">
          Masukkan harga jual aktual untuk produk ini
        </p>

        {/* Price input */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Harga Jual (Rp) *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
              Rp
            </span>
            <input
              id="input-actual-price"
              type="number"
              inputMode="numeric"
              value={actualPrice}
              onChange={(e) => handlePriceInput(e.target.value)}
              placeholder="450000"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          {actualPrice && (
            <p className="text-xs text-slate-500 mt-1 text-right">
              {formatRupiah(parseInt(actualPrice))}
            </p>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-500 mb-3 text-center">{error}</p>
        )}

        {/* Buttons */}
        <div className="space-y-2">
          <button
            id="confirm-purchase-btn"
            onClick={handleConfirm}
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-sm hover:from-green-600 hover:to-green-700 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Tandai Sudah Beli
          </button>
          <button
            id="revert-pending-btn"
            onClick={handleRevertPending}
            disabled={submitting}
            className="w-full py-2.5 rounded-xl text-slate-500 text-sm hover:bg-slate-50 transition-colors"
          >
            Kembalikan ke Pending
          </button>
        </div>

        {/* Close */}
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
