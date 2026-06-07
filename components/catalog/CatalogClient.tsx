'use client'

import { useState, useEffect, useCallback } from 'react'
import { Branch, Product, PriceOverride } from '@/types'
import { formatRupiah } from '@/lib/utils'
import { Search, ChevronDown, Pencil, Store, PackageSearch } from 'lucide-react'
import { PriceEditModal } from './PriceEditModal'

interface Props {
  advisorId: string
}

export function CatalogClient({ advisorId }: Props) {
  const [branches, setBranches] = useState<Branch[]>([])
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [overrides, setOverrides] = useState<PriceOverride[]>([])
  const [search, setSearch] = useState('')
  const [editTarget, setEditTarget] = useState<{ product: Product; branchId: string } | null>(null)
  const [loading, setLoading] = useState(true)

  // Load branches and products
  useEffect(() => {
    async function load() {
      setLoading(true)
      const [branchRes, productRes] = await Promise.all([
        fetch('/api/branches'),
        fetch('/api/products'),
      ])
      const branchData: Branch[] = await branchRes.json()
      const productData: Product[] = await productRes.json()
      setBranches(branchData)
      setProducts(productData)
      if (branchData.length > 0) setSelectedBranch(branchData[0])
      setLoading(false)
    }
    load()
  }, [])

  // Load overrides when branch changes
  useEffect(() => {
    if (!selectedBranch) return
    fetch(`/api/price-overrides?branch_id=${selectedBranch.id}`)
      .then((r) => r.json())
      .then(setOverrides)
  }, [selectedBranch])

  const getEffectivePrice = useCallback(
    (product: Product) => {
      if (!selectedBranch) return product.base_price
      const override = overrides.find(
        (o) => o.product_id === product.id && o.branch_id === selectedBranch.id
      )
      return override ? override.custom_price : product.base_price
    },
    [overrides, selectedBranch]
  )

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  )

  // Group products by category
  const grouped = filteredProducts.reduce<Record<string, Product[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {})

  return (
    <div className="flex flex-col min-h-dvh bg-slate-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm">
        <div className="px-4 pt-4 pb-3">
          <h1 className="text-base font-bold text-slate-800 mb-3">🔍 Katalog Produk</h1>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="catalog-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, SKU, atau kategori..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Branch filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {branches.map((b) => (
              <button
                key={b.id}
                id={`branch-tab-${b.id}`}
                onClick={() => setSelectedBranch(b)}
                className={`flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  selectedBranch?.id === b.id
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Store className="w-3 h-3" />
                {b.name.replace('Cabang ', '')}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 py-4 pb-8">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-16 rounded-2xl" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <PackageSearch className="w-7 h-7 text-slate-400" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-slate-600">Produk tidak ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">Coba kata kunci lain</p>
          </div>
        ) : (
          <div className="space-y-5">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
                  {category}
                </h3>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  {items.map((product, idx) => {
                    const effectivePrice = getEffectivePrice(product)
                    const isOverridden = effectivePrice !== product.base_price

                    return (
                      <div
                        key={product.id}
                        className={`flex items-center justify-between px-4 py-3.5 ${
                          idx < items.length - 1 ? 'border-b border-slate-50' : ''
                        }`}
                      >
                        <div className="flex-1 min-w-0 pr-3">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{product.sku}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="text-right">
                            <p className={`text-sm font-bold ${isOverridden ? 'text-green-600' : 'text-slate-700'}`}>
                              {formatRupiah(effectivePrice)}
                            </p>
                            {isOverridden && (
                              <p className="text-[10px] text-slate-400 line-through">
                                {formatRupiah(product.base_price)}
                              </p>
                            )}
                          </div>
                          <button
                            id={`edit-price-${product.id}`}
                            onClick={() =>
                              setEditTarget({ product, branchId: selectedBranch!.id })
                            }
                            className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-green-50 hover:text-green-600 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5 text-slate-500" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Edit Modal */}
      {editTarget && (
        <PriceEditModal
          product={editTarget.product}
          branchId={editTarget.branchId}
          branchName={selectedBranch?.name || ''}
          currentOverride={overrides.find(
            (o) => o.product_id === editTarget.product.id && o.branch_id === editTarget.branchId
          )}
          onClose={() => setEditTarget(null)}
          onSuccess={(newOverride) => {
            setOverrides((prev) => {
              const idx = prev.findIndex(
                (o) => o.product_id === newOverride.product_id && o.branch_id === newOverride.branch_id
              )
              if (idx >= 0) {
                const updated = [...prev]
                updated[idx] = newOverride
                return updated
              }
              return [...prev, newOverride]
            })
            setEditTarget(null)
          }}
        />
      )}
    </div>
  )
}
