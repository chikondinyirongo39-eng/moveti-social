import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: true })
      .limit(100)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ messages: data || [] })
  } catch {
    return NextResponse.json({ error: 'Unable to load messages.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    }

    const body = await request.json()
    const receiverId = String(body.receiverId || '').trim()
    const content = String(body.content || '').trim()

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: 'Recipient and message are required.' },
        { status: 400 }
      )
    }

    if (receiverId === user.id) {
      return NextResponse.json(
        { error: 'You cannot message yourself.' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id: receiverId,
        content
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: data })
  } catch {
    return NextResponse.json({ error: 'Unable to send message.' }, { status: 500 })
  }
}
