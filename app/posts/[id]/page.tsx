
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Post = {
  id: string | number;
  content?: string | null;
  text?: string | null;
  body?: string | null;
  image_url?: string | null;
  video_url?: string | null;
  created_at?: string | null;
  profiles?: {
    username?: string | null;
    display_name?: string | null;
    avatar_url?: string | null;
  } | null;
  user?: {
    username?: string | null;
    display_name?: string | null;
    avatar_url?: string | null;
  } | null;
};

type Comment = {
  id: string | number;
  user_id: string;
  content: string;
  created_at: string;
};

function getToken() {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("moveti_access_token") ||
    localStorage.getItem("supabase_access_token") ||
    localStorage.getItem("access_token")
  );
}

function postText(post: Post) {
  return post.content || post.text || post.body || "";
}

export default function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [postId, setPostId] = useState("");
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    params.then((value) => setPostId(value.id));
  }, [params]);

  useEffect(() => {
    if (!postId) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const postsResponse = await fetch("/api/posts", {
          cache: "no-store",
        });

        if (!postsResponse.ok) {
          throw new Error("Unable to load post.");
        }

        const postsData = await postsResponse.json();

        const posts = Array.isArray(postsData)
          ? postsData
          : Array.isArray(postsData?.posts)
          ? postsData.posts
          : Array.isArray(postsData?.data)
          ? postsData.data
          : [];

        const found = posts.find(
          (item: Post) => String(item.id) === String(postId)
        );

        if (!found) {
          throw new Error("This post could not be found.");
        }

        const interactionResponse = await fetch(
          `/api/post-interactions?postId=${encodeURIComponent(postId)}`,
          { cache: "no-store" }
        );

        const interactionData = interactionResponse.ok
          ? await interactionResponse.json()
          : { likes: [], comments: [] };

        if (cancelled) return;

        const token = getToken();

        setPost(found);
        setComments(interactionData.comments || []);
        setLikeCount((interactionData.likes || []).length);

        if (token) {
          try {
            const userResponse = await fetch("/api/auth/me", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (userResponse.ok) {
              const userData = await userResponse.json();
              const userId =
                userData?.user?.id ||
                userData?.id ||
                userData?.user_id;

              if (userId) {
                setLiked(
                  (interactionData.likes || []).some(
                    (like: { user_id: string }) =>
                      like.user_id === userId
                  )
                );
              }
            }
          } catch {
            // Like state can still be displayed from the interaction count.
          }
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || "Unable to load this post.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [postId]);

  async function toggleLike() {
    const token = getToken();

    if (!token) {
      alert("Please log in to like this post.");
      return;
    }

    const nextLiked = !liked;

    setLiked(nextLiked);
    setLikeCount((count) => Math.max(0, count + (nextLiked ? 1 : -1)));

    try {
      const response = await fetch("/api/post-interactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId,
          action: nextLiked ? "like" : "unlike",
        }),
      });

      if (!response.ok) {
        throw new Error("Like update failed.");
      }
    } catch {
      setLiked(!nextLiked);
      setLikeCount((count) =>
        Math.max(0, count + (nextLiked ? -1 : 1))
      );
      alert("Unable to update the like.");
    }
  }

  async function addComment() {
    const content = commentText.trim();
    const token = getToken();

    if (!token) {
      alert("Please log in to comment.");
      return;
    }

    if (!content) return;

    setPosting(true);

    try {
      const response = await fetch("/api/post-interactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId,
          action: "comment",
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to add comment.");
      }

      setComments((current) => [...current, data.comment]);
      setCommentText("");
    } catch (e: any) {
      alert(e?.message || "Unable to add comment.");
    } finally {
      setPosting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white p-5">
        <div className="mx-auto max-w-2xl animate-pulse">
          <div className="h-6 w-24 rounded bg-zinc-800 mb-8" />
          <div className="h-32 rounded-2xl bg-zinc-900" />
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-black text-white p-5">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/"
            className="inline-block mb-8 text-zinc-400"
          >
            ← Back
          </Link>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <h1 className="text-xl font-semibold mb-2">
              Post unavailable
            </h1>
            <p className="text-zinc-400">
              {error || "This post could not be found."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const profile = post.profiles || post.user;
  const username =
    profile?.username ||
    profile?.display_name ||
    "MOVETI Creator";

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-2xl px-4 py-5">
        <Link
          href="/"
          className="inline-flex items-center text-zinc-400 hover:text-white mb-6"
        >
          ← Back to feed
        </Link>

        <article className="rounded-3xl border border-zinc-800 bg-zinc-950 overflow-hidden">
          <div className="p-5">
            <div className="flex items-center gap-3 mb-5">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <div className="h-11 w-11 rounded-full bg-zinc-800 flex items-center justify-center">
                  ●
                </div>
              )}

              <div>
                <div className="font-semibold">@{username}</div>
                {post.created_at && (
                  <div className="text-xs text-zinc-500">
                    {new Date(post.created_at).toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            <p className="whitespace-pre-wrap text-base leading-7">
              {postText(post)}
            </p>

            {post.image_url && (
              <img
                src={post.image_url}
                alt=""
                className="mt-5 w-full rounded-2xl object-cover"
              />
            )}

            {post.video_url && (
              <video
                src={post.video_url}
                controls
                className="mt-5 w-full rounded-2xl"
              />
            )}

            <div className="mt-5 flex gap-3">
              <button
                onClick={toggleLike}
                className="rounded-full border border-zinc-700 px-4 py-2 hover:bg-zinc-900"
              >
                {liked ? "♥ Liked" : "♡ Like"} {likeCount}
              </button>

              <span className="rounded-full border border-zinc-800 px-4 py-2 text-zinc-400">
                💬 {comments.length}
              </span>
            </div>
          </div>

          <section className="border-t border-zinc-800 p-5">
            <h2 className="text-lg font-semibold mb-4">
              Comments
            </h2>

            <div className="space-y-4 mb-5">
              {comments.length === 0 ? (
                <p className="text-zinc-500">
                  No comments yet. Be the first to comment.
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-2xl bg-zinc-900 p-4"
                  >
                    <div className="text-xs text-zinc-500 mb-1">
                      @{comment.user_id.slice(0, 8)}
                    </div>
                    <div className="whitespace-pre-wrap">
                      {comment.content}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addComment();
                  }
                }}
                maxLength={1000}
                placeholder="Write a comment..."
                className="min-w-0 flex-1 rounded-full border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-zinc-400"
              />

              <button
                onClick={addComment}
                disabled={posting || !commentText.trim()}
                className="rounded-full bg-white px-5 py-3 font-semibold text-black disabled:opacity-40"
              >
                {posting ? "..." : "Post"}
              </button>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
