import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const room = searchParams.get('room') || 'office'

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('room', room)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ messages: (data || []).reverse() })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { room, nick, text } = body

  if (!room || !nick || !text) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  if (text.length > 200) {
    return NextResponse.json({ error: 'Message too long' }, { status: 400 })
  }

  const blocked = ['씨발', '개새끼', '존나']
  const filtered = blocked.some(w => text.includes(w))
  if (filtered) {
    return NextResponse.json({ error: 'Filtered content' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({ room, nick, text })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: data })
}
