import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function POST(request: Request) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'You must be signed in.' },
      { status: 401 }
    )
  }

  const body = await request.json()

  const amount = Number(body.amount)
  const method = String(body.method || '')
  const destination = String(body.destination || '').trim()

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json(
      { error: 'Invalid withdrawal amount.' },
      { status: 400 }
    )
  }

  if (!['airtel', 'mpamba', 'bank'].includes(method)) {
    return NextResponse.json(
      { error: 'Invalid withdrawal method.' },
      { status: 400 }
    )
  }

  if (!destination) {
    return NextResponse.json(
      { error: 'Withdrawal destination is required.' },
      { status: 400 }
    )
  }

  const { data: wallet } = await supabase
    .from('wallets')
    .select('balance,currency')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!wallet) {
    return NextResponse.json(
      { error: 'Wallet not found.' },
      { status: 404 }
    )
  }

  if (Number(wallet.balance) < amount) {
    return NextResponse.json(
      { error: 'Insufficient available balance.' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('withdrawal_requests')
    .insert({
      user_id: user.id,
      amount,
      method,
      destination,
      status: 'pending'
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { error: 'Unable to create withdrawal request.' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    withdrawal: data,
    message: 'Withdrawal request submitted for processing.'
  })
}
