'use client'

import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, BookOpen, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/catalog', label: 'Katalog', icon: BookOpen },
]

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-slate-100 shadow-lg z-50">
      <div className="flex items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <button
              key={item.href}
              id={`nav-${item.label.toLowerCase()}`}
              onClick={() => router.push(item.href)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 h-full transition-colors ${
                isActive
                  ? 'text-green-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-green-500 rounded-full" />
              )}
            </button>
          )
        })}

        {/* Logout */}
        <button
          id="nav-logout"
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex-none flex flex-col items-center justify-center gap-1 h-full px-5 text-slate-400 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-5 h-5" strokeWidth={1.8} />
          <span className="text-[10px] font-medium">Keluar</span>
        </button>
      </div>
    </nav>
  )
}
