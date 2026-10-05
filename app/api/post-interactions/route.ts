import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

async function getSupabase() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Cookies may be read-only in some server contexts.
          }
        },
      },
    }
  )
}

function response(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

export async function GET(request: Request) {
  try {
    const supabase = await getSupabase()
    const { searchParams } = new URL(request.url)

    const postId = Number(searchParams.get("postId"))

    if (!postId || !Number.isInteger(postId)) {
      return response({ error: "Invalid postId." }, 400)
    }

    const [
      { count: likeCount, error: likeError },
      { data: comments, error: commentError },
      { data: userResult },
    ] = await Promise.all([
      supabase
        .from("post_likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId),

      supabase
        .from("post_comments")
        .select("id, post_id, user_id, content, created_at")
        .eq("post_id", postId)
        .order("created_at", { ascending: true }),

      supabase.auth.getUser(),
    ])

    if (likeError) {
      return response({ error: likeError.message }, 500)
    }

    if (commentError) {
      return response({ error: commentError.message }, 500)
    }

    let liked = false

    if (userResult.user) {
      const { data: userLike } = await supabase
        .from("post_likes")
        .select("post_id")
        .eq("post_id", postId)
        .eq("user_id", userResult.user.id)
        .maybeSingle()

      liked = !!userLike
    }

    return response({
      likes: likeCount ?? 0,
      liked,
      comments: comments ?? [],
      commentCount: comments?.length ?? 0,
    })
  } catch (error) {
    console.error("POST INTERACTIONS GET ERROR:", error)
    return response({ error: "Unable to load post interactions." }, 500)
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await getSupabase()

    const { data: auth, error: authError } = await supabase.auth.getUser()

    if (authError || !auth.user) {
      return response(
        { error: "Please log in to interact with this post." },
        401
      )
    }

    const body = await request.json()

    const action = String(body.action || "")
    const postId = Number(body.postId)

    if (!postId || !Number.isInteger(postId)) {
      return response({ error: "Invalid postId." }, 400)
    }

    if (action === "like") {
      const { error } = await supabase
        .from("post_likes")
        .upsert(
          {
            post_id: postId,
            user_id: auth.user.id,
          },
          {
            onConflict: "post_id,user_id",
            ignoreDuplicates: true,
          }
        )

      if (error) {
        console.error("LIKE ERROR:", error)
        return response({ error: error.message }, 500)
      }
    }

    else if (action === "unlike") {
      const { error } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", auth.user.id)

      if (error) {
        console.error("UNLIKE ERROR:", error)
        return response({ error: error.message }, 500)
      }
    }

    else if (action === "comment") {
      const content = String(body.content || "").trim()

      if (!content) {
        return response({ error: "Comment cannot be empty." }, 400)
      }

      if (content.length > 1000) {
        return response({ error: "Comment is too long." }, 400)
      }

      const { data: comment, error } = await supabase
        .from("post_comments")
        .insert({
          post_id: postId,
          user_id: auth.user.id,
          content,
        })
        .select("id, post_id, user_id, content, created_at")
        .single()

      if (error) {
        console.error("COMMENT ERROR:", error)
        return response({ error: error.message }, 500)
      }

      return response({
        success: true,
        comment,
      })
    }

    else {
      return response({ error: "Invalid interaction action." }, 400)
    }

    const { count, error: countError } = await supabase
      .from("post_likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId)

    if (countError) {
      return response({ error: countError.message }, 500)
    }

    return response({
      success: true,
      liked: action === "like",
      likes: count ?? 0,
    })
  } catch (error) {
    console.error("POST INTERACTIONS POST ERROR:", error)
    return response({ error: "Unable to process interaction." }, 500)
  }
}
