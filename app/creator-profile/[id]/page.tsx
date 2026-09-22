"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Post = {
  id: number
  user_id: string
  content: string | null
  likes: number
  comments: number
  created_at: string
  media_url?: string | null
  media_type?: string | null
}

export default function CreatorProfile({
  params
}: {
  params: { id: string }
}) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/posts", { cache: "no-store" })
      .then(response => response.json())
      .then(data => {
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.posts)
            ? data.posts
            : []

        setPosts(
          list.filter((post: Post) => post.user_id === params.id)
        )
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [params.id])

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/discover"
          className="text-sm text-white/50 hover:text-white"
        >
          ← Discover
        </Link>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white/10 text-3xl font-black">
              M
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-black">MOVETI Creator</h1>
              <p className="mt-1 text-sm text-white/45">
                Creator on MOVETI
              </p>

              <div className="mt-4 flex gap-6 text-sm">
                <span>
                  <strong>{posts.length}</strong>{" "}
                  <span className="text-white/45">posts</span>
                </span>

                <span>
                  <strong>0</strong>{" "}
                  <span className="text-white/45">followers</span>
                </span>

                <span>
                  <strong>0</strong>{" "}
                  <span className="text-white/45">following</span>
                </span>
              </div>
            </div>

            <button className="rounded-xl bg-white px-5 py-3 font-semibold text-black">
              Follow
            </button>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="mb-4 text-xl font-bold">Creator Posts</h2>

          {loading && (
            <div className="rounded-2xl bg-white/5 p-6 text-white/50">
              Loading posts...
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/50">
              This creator has no public posts yet.
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {posts.map(post => (
              <article
                key={post.id}
                className="group relative aspect-square overflow-hidden rounded-xl bg-white/5"
              >
                {post.media_url && post.media_type === "image" && (
                  <img
                    src={post.media_url}
                    alt="Creator post"
                    loading="lazy"
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                )}

                {post.media_url && post.media_type === "video" && (
                  <video
                    src={post.media_url}
                    muted
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                )}

                {!post.media_url && (
                  <div className="flex h-full items-center justify-center p-4 text-center text-sm text-white/60">
                    {post.content || "MOVETI post"}
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-xs">
                  ♡ {post.likes || 0} · 💬 {post.comments || 0}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
