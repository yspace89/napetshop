import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb, saveDb } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const branchId = searchParams.get('branch_id')

  if (!branchId) return NextResponse.json({ error: 'branch_id diperlukan' }, { status: 400 })

  const db = getDb()
  const overrides = db.price_overrides.filter(o => o.branch_id === branchId)

  return NextResponse.json(overrides)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const advisorId = (session.user as any).id
  const body = await req.json()
  const { branch_id, product_id, custom_price } = body

  if (!branch_id || !product_id || !custom_price) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
  }

  const db = getDb()
  
  const idx = db.price_overrides.findIndex(
    o => o.branch_id === branch_id && o.product_id === product_id && o.advisor_id === advisorId
  )

  const newOverride = {
    id: idx >= 0 ? db.price_overrides[idx].id : `po-${Date.now()}`,
    advisor_id: advisorId,
    branch_id,
    product_id,
    custom_price,
    updated_at: new Date().toISOString()
  }

  if (idx >= 0) {
    db.price_overrides[idx] = newOverride
  } else {
    db.price_overrides.push(newOverride)
  }

  saveDb(db)

  return NextResponse.json(newOverride, { status: 201 })
}
