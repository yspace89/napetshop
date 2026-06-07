import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb, saveDb } from '@/lib/db'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { purchase_status, actual_price } = body
  const { id: itemId } = await params

  if (!['pending', 'purchased'].includes(purchase_status)) {
    return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 })
  }

  const db = getDb()
  const itemIdx = db.education_items.findIndex(i => i.id === itemId)

  if (itemIdx === -1) {
    return NextResponse.json({ error: 'Item tidak ditemukan' }, { status: 404 })
  }

  db.education_items[itemIdx].purchase_status = purchase_status
  
  if (purchase_status === 'purchased' && actual_price) {
    db.education_items[itemIdx].actual_price = actual_price
  } else if (purchase_status === 'pending') {
    db.education_items[itemIdx].actual_price = null
  }
  
  db.education_items[itemIdx].updated_at = new Date().toISOString()

  saveDb(db)

  const product = db.products.find(p => p.id === db.education_items[itemIdx].product_id)

  return NextResponse.json({ ...db.education_items[itemIdx], product })
}
