import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { BottomNav } from '@/components/BottomNav'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex flex-col min-h-dvh bg-slate-50">
      <main className="flex-1 pb-safe overflow-y-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
