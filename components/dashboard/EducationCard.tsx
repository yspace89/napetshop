'use client'

import { useState, useRef } from 'react'
import { EducationSession, EducationItem } from '@/types'
import { formatDateTime, formatRupiah, formatWA } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import { Cat, Dog, Phone, MapPin, ShoppingCart, CheckCircle2, Clock, Camera, Calendar, Loader2 } from 'lucide-react'

interface Props {
  session: EducationSession
  onStatusChange: () => void
}

export function EducationCard({ session, onStatusChange }: Props) {
  const { openToggleModal } = useAppStore()
  const PetIcon = session.pet_type === 'Kucing' ? Cat : Dog

  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleUploadClick() {
    fileInputRef.current?.click()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    // Get time label
    const now = new Date()
    const timeLabel = now.toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    // Get location/GPS coordinates
    let locationLabel = session.branch?.name || 'Cabang'
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000
        })
      })
      const { latitude, longitude } = position.coords
      locationLabel = `${locationLabel} (GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)})`
    } catch (err) {
      console.warn('Geolocation failed', err)
      locationLabel = `${locationLabel} (GPS tidak terdeteksi)`
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) throw new Error('Gagal memuat canvas')

          // Scale down image if it's too large (max 1024px width or height)
          const maxDim = 1024
          let w = img.width
          let h = img.height
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w)
              w = maxDim
            } else {
              w = Math.round((w * maxDim) / h)
              h = maxDim
            }
          }
          canvas.width = w
          canvas.height = h

          // Draw original image
          ctx.drawImage(img, 0, 0, w, h)

          // Add semi-transparent banner at the bottom
          const bannerHeight = Math.round(h * 0.16)
          ctx.fillStyle = 'rgba(0, 0, 0, 0.65)'
          ctx.fillRect(0, h - bannerHeight, w, bannerHeight)

          // Draw Text
          ctx.fillStyle = '#ffffff'
          const fontSize = Math.max(14, Math.round(w * 0.026))
          ctx.font = `bold ${fontSize}px sans-serif`

          const textLocation = `📍 ${locationLabel}`
          const textTime = `⏰ ${timeLabel}`

          ctx.fillText(textLocation, Math.round(w * 0.03), h - Math.round(bannerHeight * 0.6))
          ctx.fillText(textTime, Math.round(w * 0.03), h - Math.round(bannerHeight * 0.25))

          const base64Image = canvas.toDataURL('image/jpeg', 0.8)

          // Upload via API
          const res = await fetch('/api/education/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: session.id,
              photo: base64Image,
              location: locationLabel,
              timestamp: now.toISOString()
            })
          })

          if (!res.ok) throw new Error('Gagal mengunggah foto ke database')

          onStatusChange()
        } catch (err: any) {
          setError(err.message || 'Gagal memproses foto')
        } finally {
          setUploading(false)
        }
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

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
      <div className="px-4 pb-3 pt-3 space-y-2">
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

      {/* Photo display or upload */}
      {session.photo ? (
        <div className="mt-1 px-4 pb-4">
          <div className="relative rounded-xl overflow-hidden border border-slate-100 shadow-sm group">
            <img
              src={session.photo}
              alt="Foto Bukti Edukasi"
              className="w-full h-40 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
              <div className="flex items-center gap-1.5 text-white">
                <MapPin className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                <span className="text-[10px] font-medium truncate">{session.photo_location || 'Lokasi tidak terdeteksi'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80 mt-1">
                <Calendar className="w-3.5 h-3.5 text-blue-300 flex-shrink-0" />
                <span className="text-[10px] font-medium">{formatDateTime(session.photo_timestamp || session.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 pb-4">
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className="w-full py-2.5 rounded-xl border border-dashed border-green-200 bg-green-50/30 hover:bg-green-50 text-green-600 hover:text-green-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Memproses Foto & GPS...
              </>
            ) : (
              <>
                <Camera className="w-3.5 h-3.5" />
                Upload Foto Bukti (Kamera/Upload)
              </>
            )}
          </button>
          {error && <p className="text-[10px] text-red-500 mt-1 text-center font-medium">{error}</p>}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
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
