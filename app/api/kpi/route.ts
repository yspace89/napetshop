import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb, saveDb } from '@/lib/db'
import { getCurrentMonth } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const advisorId = (session.user as any).id
  const { searchParams } = new URL(req.url)
  const month = searchParams.get('month') || getCurrentMonth()

  const db = getDb()
  const target = db.kpi_targets.find(t => t.advisor_id === advisorId && t.month === month)

  if (!target) {
    return NextResponse.json({
      advisor_id: advisorId,
      month,
      edu_target: 0,
      sales_target: 0,
    })
  }

  return NextResponse.json(target)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const advisorId = (session.user as any).id
  const body = await req.json()
  const { month, edu_target, sales_target } = body

  if (!month) return NextResponse.json({ error: 'Month diperlukan' }, { status: 400 })

  const db = getDb()
  const idx = db.kpi_targets.findIndex(t => t.advisor_id === advisorId && t.month === month)

  const newTarget = {
    id: idx >= 0 ? db.kpi_targets[idx].id : `k-${Date.now()}`,
    advisor_id: advisorId,
    month,
    edu_target,
    sales_target
  }

  if (idx >= 0) {
    db.kpi_targets[idx] = newTarget
  } else {
    db.kpi_targets.push(newTarget)
  }

  saveDb(db)
  return NextResponse.json(newTarget)
}
