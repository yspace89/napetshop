import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const advisorId = (session.user as any).id
  const db = getDb()

  const userBranchIds = db.user_branches
    .filter(ub => ub.user_id === advisorId)
    .map(ub => ub.branch_id)

  const branches = db.branches.filter(b => userBranchIds.includes(b.id))
  return NextResponse.json(branches)
}
