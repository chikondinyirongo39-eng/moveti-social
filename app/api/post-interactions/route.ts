import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function db() {
  if (!url || !key) throw new Error("Supabase environment variables are missing");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function getUser(req: NextRequest, supabase: any) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  const { data } = await supabase.auth.getUser(token);
  return data?.user ?? null;
}

export async function GET(req: NextRequest) {
  try {
    const supabase = db();
    const postId = new URL(req.url).searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ error: "postId is required" }, { status: 400 });
    }

    const [{ data: likes }, { data: comments, error }] = await Promise.all([
      supabase.from("post_likes").select("user_id").eq("post_id", postId),
      supabase
        .from("post_comments")
        .select("id,post_id,user_id,content,created_at")
        .eq("post_id", postId)
        .order("created_at", { ascending: true }),
    ]);

    if (error) {
      return NextResponse.json(
        { error: "Comments are not available yet." },
        { status: 200 }
      );
    }

    return NextResponse.json({
      likes: likes ?? [],
      comments: comments ?? [],
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Interaction request failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = db();
    const body = await req.json();
    const action = body?.action;
    const postId = body?.postId;

    if (!postId || !action) {
      return NextResponse.json(
        { error: "action and postId are required" },
        { status: 400 }
      );
    }

    const user = await getUser(req, supabase);

    if (!user) {
      return NextResponse.json(
        { error: "Please log in to interact with posts." },
        { status: 401 }
      );
    }

    if (action === "like") {
      const { error } = await supabase.from("post_likes").upsert(
        {
          post_id: postId,
          user_id: user.id,
        },
        { onConflict: "post_id,user_id" }
      );

      if (error) throw error;
      return NextResponse.json({ liked: true });
    }

    if (action === "unlike") {
      const { error } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);

      if (error) throw error;
      return NextResponse.json({ liked: false });
    }

    if (action === "comment") {
      const content = String(body?.content || "").trim();

      if (!content) {
        return NextResponse.json(
          { error: "Comment cannot be empty." },
          { status: 400 }
        );
      }

      if (content.length > 1000) {
        return NextResponse.json(
          { error: "Comment is too long." },
          { status: 400 }
        );
      }

      const { data, error } = await supabase
        .from("post_comments")
        .insert({
          post_id: postId,
          user_id: user.id,
          content,
        })
        .select("id,post_id,user_id,content,created_at")
        .single();

      if (error) throw error;
      return NextResponse.json({ comment: data });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e: any) {
    console.error("post-interactions:", e);
    return NextResponse.json(
      { error: e?.message || "Unable to complete interaction" },
      { status: 500 }
    );
  }
}
