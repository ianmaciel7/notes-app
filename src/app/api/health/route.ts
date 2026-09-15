import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({ ok: true, service: 'notes-app' })
}
