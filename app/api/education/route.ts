import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb, saveDb } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const advisorId = (session.user as any).id
  const db = getDb()

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  const startIso = startOfMonth.toISOString()

  let sessions = db.education_sessions.filter(
    s => s.advisor_id === advisorId && s.created_at >= startIso
  )

  sessions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  // Populate branch and items
  sessions = sessions.map(s => {
    const branch = db.branches.find(b => b.id === s.branch_id)
    const items = db.education_items.filter(i => i.session_id === s.id).map(i => {
      const product = db.products.find(p => p.id === i.product_id)
      return { ...i, product }
    })
    return { ...s, branch, items }
  })

  return NextResponse.json(sessions)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const advisorId = (session.user as any).id
  const body = await req.json()
  const { client_name, client_wa, pet_type, branch_id, product_ids } = body

  if (!client_name || !client_wa || !pet_type || !branch_id || !product_ids?.length) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
  }

  const db = getDb()
  const now = new Date().toISOString()
  const sessionId = `s-${Date.now()}`

  const newSession = {
    id: sessionId,
    advisor_id: advisorId,
    branch_id,
    client_name,
    client_wa,
    pet_type,
    created_at: now
  }

  db.education_sessions.push(newSession)

  const newItems = product_ids.map((pid: string, idx: number) => ({
    id: `i-${Date.now()}-${idx}`,
    session_id: sessionId,
    product_id: pid,
    purchase_status: 'pending',
    actual_price: null,
    updated_at: now
  }))

  db.education_items.push(...newItems)
  saveDb(db)

  // Populate response
  const branch = db.branches.find(b => b.id === branch_id)
  const populatedItems = newItems.map((i: any) => ({
    ...i,
    product: db.products.find(p => p.id === i.product_id)
  }))

  return NextResponse.json({ ...newSession, branch, items: populatedItems }, { status: 201 })
}
