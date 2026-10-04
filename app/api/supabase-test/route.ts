import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

    const response = await fetch(`${url}/auth/v1/settings`, {
      headers: { apikey: key },
      cache: 'no-store',
    })

    return NextResponse.json({
      supabase_status: response.status,
      reachable: true,
    })
  } catch (error) {
    return NextResponse.json({
      reachable: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
