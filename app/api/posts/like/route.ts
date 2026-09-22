import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const postId = Number(body.postId)

    if (!Number.isInteger(postId) || postId <= 0) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 })
    }

    const supabase = createClient()
    const { data: auth } = await supabase.auth.getUser()

    if (!auth.user) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 })
    }

    const { error } = await supabase
      .from("post_likes")
      .insert({
        post_id: postId,
        user_id: auth.user.id
      })

    if (error && !error.message.toLowerCase().includes("duplicate")) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const { count } = await supabase
      .from("post_likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId)

    return NextResponse.json({
      liked: true,
      likes: count || 0
    })
  } catch {
    return NextResponse.json(
      { error: "Unable to like post" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const postId = Number(body.postId)

    if (!Number.isInteger(postId) || postId <= 0) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 })
    }

    const supabase = createClient()
    const { data: auth } = await supabase.auth.getUser()

    if (!auth.user) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 })
    }

    const { error } = await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", auth.user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const { count } = await supabase
      .from("post_likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId)

    return NextResponse.json({
      liked: false,
      likes: count || 0
    })
  } catch {
    return NextResponse.json(
      { error: "Unable to unlike post" },
      { status: 500 }
    )
  }
}
