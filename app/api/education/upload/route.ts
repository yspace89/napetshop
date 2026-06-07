import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb, saveDb } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { sessionId, photo, location, timestamp } = await req.json()

    if (!sessionId || !photo) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    const db = getDb()
    const sessionIdx = db.education_sessions.findIndex(s => s.id === sessionId)

    if (sessionIdx === -1) {
      return NextResponse.json({ error: 'Sesi tidak ditemukan' }, { status: 404 })
    }

    // Verify ownership
    const advisorId = (session.user as any).id
    if (db.education_sessions[sessionIdx].advisor_id !== advisorId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Update session
    db.education_sessions[sessionIdx].photo = photo
    db.education_sessions[sessionIdx].photo_location = location || ''
    db.education_sessions[sessionIdx].photo_timestamp = timestamp || new Date().toISOString()

    saveDb(db)

    return NextResponse.json({ success: true, session: db.education_sessions[sessionIdx] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Terjadi kesalahan' }, { status: 500 })
  }
}
