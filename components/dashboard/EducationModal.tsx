'use client'

import { useState, useEffect, useRef } from 'react'
import { Branch, Product } from '@/types'
import { X, Loader2, Cat, Dog, Search, ChevronDown, Check } from 'lucide-react'

interface Props {
  advisorId: string
  onClose: () => void
  onSuccess: () => void
}

export function EducationModal({ advisorId, onClose, onSuccess }: Props) {
  const [branches, setBranches] = useState<Branch[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [searchProduct, setSearchProduct] = useState('')
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [showProductDropdown, setShowProductDropdown] = useState(false)

  const [clientName, setClientName] = useState('')
  const [clientWa, setClientWa] = useState('')
  const [petType, setPetType] = useState<'Kucing' | 'Anjing'>('Kucing')
  const [branchId, setBranchId] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [branchRes, productRes] = await Promise.all([
        fetch('/api/branches'),
        fetch('/api/products'),
      ])
      const branchData = await branchRes.json()
      const productData = await productRes.json()
      setBranches(branchData)
      setProducts(productData)
      setFilteredProducts(productData)
      if (branchData.length > 0) setBranchId(branchData[0].id)
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (searchProduct) {
      setFilteredProducts(
        products.filter(
          (p) =>
            p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchProduct.toLowerCase())
        )
      )
    } else {
      setFilteredProducts(products)
    }
  }, [searchProduct, products])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowProductDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function toggleProduct(product: Product) {
    setSelectedProducts((prev) =>
      prev.find((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!branchId || selectedProducts.length === 0) {
      setError('Pilih cabang dan minimal satu produk')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: clientName,
          client_wa: clientWa,
          pet_type: petType,
          branch_id: branchId,
          product_ids: selectedProducts.map((p) => p.id),
        }),
      })

      if (!res.ok) throw new Error('Gagal menyimpan data')

      onSuccess()
      onClose()
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-[480px] bg-white rounded-t-3xl shadow-2xl max-h-[90dvh] flex flex-col animate-slide-up">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4">
          <h2 className="text-base font-bold text-slate-800">Catat Edukasi Baru</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto flex-1 px-5 pb-16">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-green-500" />
            </div>
          ) : (
            <form id="education-form" onSubmit={handleSubmit} className="space-y-4">
              {/* Nama Klien */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Nama Klien *
                </label>
                <input
                  id="input-client-name"
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  required
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* No WA */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  No. WhatsApp *
                </label>
                <input
                  id="input-client-wa"
                  type="tel"
                  value={clientWa}
                  onChange={(e) => setClientWa(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  required
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Jenis Pet */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Jenis Hewan Peliharaan *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Kucing', 'Anjing'] as const).map((type) => {
                    const Icon = type === 'Kucing' ? Cat : Dog
                    const isSelected = petType === type
                    return (
                      <button
                        key={type}
                        type="button"
                        id={`pet-type-${type.toLowerCase()}`}
                        onClick={() => setPetType(type)}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-medium text-sm ${
                          isSelected
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" strokeWidth={1.8} />
                        {type}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Cabang */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Cabang *
                </label>
                <select
                  id="select-branch"
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  required
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              {/* Produk */}
              <div ref={dropdownRef}>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Rekomendasi Produk * <span className="text-slate-400 font-normal">(bisa lebih dari 1)</span>
                </label>

                {/* Selected chips */}
                {selectedProducts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {selectedProducts.map((p) => (
                      <span
                        key={p.id}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-medium"
                      >
                        {p.sku}
                        <button
                          type="button"
                          onClick={() => toggleProduct(p)}
                          className="hover:text-green-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Search input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="search-product"
                    type="text"
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    onFocus={() => setShowProductDropdown(true)}
                    placeholder="Cari SKU atau nama produk..."
                    className="w-full pl-9 pr-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Dropdown list */}
                {showProductDropdown && (
                  <div className="mt-1 border border-slate-200 rounded-xl overflow-hidden shadow-lg bg-white max-h-48 overflow-y-auto">
                    {filteredProducts.length === 0 ? (
                      <p className="px-4 py-3 text-xs text-slate-400">Produk tidak ditemukan</p>
                    ) : (
                      filteredProducts.map((p) => {
                        const isSelected = !!selectedProducts.find((s) => s.id === p.id)
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              toggleProduct(p)
                              setSearchProduct('')
                            }}
                            className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors text-left ${
                              isSelected ? 'bg-green-50' : ''
                            }`}
                          >
                            <div>
                              <p className="text-xs font-medium text-slate-700">{p.name}</p>
                              <p className="text-[10px] text-slate-400">{p.sku} · {p.category}</p>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-green-600 flex-shrink-0" />}
                          </button>
                        )
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <p className="text-xs text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>
              )}

              {/* Submit */}
              <button
                id="submit-education-btn"
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-sm shadow-md shadow-green-200 hover:from-green-600 hover:to-green-700 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Edukasi'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
