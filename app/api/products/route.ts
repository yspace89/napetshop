import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')?.toLowerCase() || ''
  const category = searchParams.get('category') || ''

  const db = getDb()
  let products = db.products

  if (category) {
    products = products.filter(p => p.category === category)
  }

  if (search) {
    products = products.filter(p => 
      p.name.toLowerCase().includes(search) || 
      p.sku.toLowerCase().includes(search)
    )
  }

  products.sort((a, b) => a.name.localeCompare(b.name))

  return NextResponse.json(products)
}
