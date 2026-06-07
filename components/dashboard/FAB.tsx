'use client'

import { Plus } from 'lucide-react'

interface Props {
  onClick: () => void
}

export function FAB({ onClick }: Props) {
  return (
    <button
      id="fab-add-education"
      onClick={onClick}
      aria-label="Tambah edukasi baru"
      className="fab fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl shadow-green-300 flex items-center justify-center hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-200"
    >
      <Plus className="w-7 h-7" strokeWidth={2.5} />
    </button>
  )
}
