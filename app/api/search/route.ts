import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const query = new URL(request.url).searchParams.get("q")?.trim() || ""

    if (!query) {
      return NextResponse.json({ results: [] })
    }

    const supabase = createClient()
    const results: Array<Record<string, unknown>> = []

    const { data: posts } = await supabase
      .from("posts")
      .select("id,user_id,content,likes,comments,created_at,media_url,media_type")
      .eq("visibility", "public")
      .ilike("content", `%${query}%`)
      .order("created_at", { ascending: false })
      .limit(30)

    for (const post of posts || []) {
      results.push({
        id: post.id,
        type: "post",
        title: "MOVETI Post",
        description: post.content || "",
        user_id: post.user_id,
        media_url: post.media_url,
        media_type: post.media_type
      })
    }

    return NextResponse.json({ results })
  } catch {
    return NextResponse.json({ results: [] })
  }
}
