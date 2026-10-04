
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function getSupabase() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase configuration is missing.");
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function getAuthenticatedUser(
  request: NextRequest,
  supabase: ReturnType<typeof getSupabase>
) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.slice(7).trim();

  if (!token) return null;

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) return null;

  return data.user;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const url = new URL(request.url);
    const postId = url.searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "postId is required" },
        { status: 400 }
      );
    }

    const [{ data: likes, error: likesError }, { data: comments, error: commentsError }] =
      await Promise.all([
        supabase
          .from("post_likes")
          .select("user_id")
          .eq("post_id", postId),

        supabase
          .from("post_comments")
          .select("id, post_id, user_id, content, created_at")
          .eq("post_id", postId)
          .order("created_at", { ascending: true }),
      ]);

    if (likesError) {
      return NextResponse.json(
        { error: likesError.message },
        { status: 500 }
      );
    }

    if (commentsError) {
      return NextResponse.json(
        { error: commentsError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      likes: likes || [],
      comments: comments || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Unable to load interactions." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();

    const action = String(body?.action || "");
    const postId = String(body?.postId || "");

    if (!postId || !action) {
      return NextResponse.json(
        { error: "postId and action are required." },
        { status: 400 }
      );
    }

    const user = await getAuthenticatedUser(request, supabase);

    if (!user) {
      return NextResponse.json(
        { error: "Please log in to interact with posts." },
        { status: 401 }
      );
    }

    if (action === "like") {
      const { error } = await supabase
        .from("post_likes")
        .upsert(
          {
            post_id: postId,
            user_id: user.id,
          },
          {
            onConflict: "post_id,user_id",
            ignoreDuplicates: true,
          }
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
          { error: "Comment must be 1000 characters or less." },
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
        .select("id, post_id, user_id, content, created_at")
        .single();

      if (error) throw error;

      return NextResponse.json({
        comment: data,
      });
    }

    return NextResponse.json(
      { error: "Unsupported interaction." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("MOVETI post interaction error:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Unable to complete this interaction.",
      },
      { status: 500 }
    );
  }
}
