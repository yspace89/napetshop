import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardClient } from '@/components/dashboard/DashboardClient'

export const metadata = {
  title: 'Dashboard KPI | NA Mini-App',
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const user = session!.user as any

  return (
    <DashboardClient
      advisorId={user.id}
      advisorName={user.name}
    />
  )
}
