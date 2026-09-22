import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('posts')
      .select('id, content, likes, comments, created_at')
      .order('created_at', { ascending: false })
      .limit(30)

    if (error) {
      return NextResponse.json([], { status: 200 })
    }

    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}


// MOVETI_INTERACTIONS_V1
// The existing GET/POST handlers remain untouched.
// Like/comment endpoints are implemented in dedicated routes.
