"use client"

import MovetiDownloadButton from "@/components/MovetiDownloadButton"
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
  media_type?: "image" | "video" | null
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadPosts() {
    try {
      setLoading(true)
      setError("")

      const response = await fetch("/api/posts", {
        method: "GET",
        cache: "no-store"
      })

      if (!response.ok) {
        throw new Error("Unable to load posts.")
      }

      const data = await response.json()

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.posts)
          ? data.posts
          : []

      setPosts(list)
    } catch {
      setError("Unable to load the MOVETI feed right now.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto max-w-2xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-2xl font-black tracking-tight">MOVETI</div>
            <p className="text-sm text-white/45">Your social feed</p>
          </div>

          <Link
            href="/upload"
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black"
          >
            Create
          </Link>
        </header>

        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/60">
            Loading your feed...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-red-200">
            {error}
            <button
              onClick={loadPosts}
              className="ml-3 rounded-lg bg-white px-3 py-1 text-sm font-semibold text-black"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <div className="text-4xl">🎵</div>
            <h2 className="mt-3 text-xl font-bold">
              Your MOVETI feed is ready
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Follow creators and start sharing photos, videos and music.
            </p>
            <Link
              href="/discover"
              className="mt-5 inline-block rounded-xl bg-white px-5 py-3 font-semibold text-black"
            >
              Discover Creators
            </Link>
          </div>
        )}

        <div className="space-y-5">
          {posts.map(post => (
            <article
              key={post.id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]"
            >
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 font-bold">
                    M
                  </div>

                  <div>
                    <div className="font-semibold">MOVETI Creator</div>
                    <div className="text-xs text-white/40">
                      {new Date(post.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>

                {post.content && (
                  <p className="mt-4 whitespace-pre-wrap text-[15px] leading-6 text-white/90">
                    {post.content}
                  </p>
                )}
              </div>

              {post.media_url && post.media_type === "image" && (
                <img
                  src={post.media_url}
                  alt="MOVETI post"
                  className="block max-h-[700px] w-full object-contain"
                  loading="lazy"
                />
              )}

              {post.media_url && post.media_type === "video" && (
                <video
                  src={post.media_url}
                  controls
                  playsInline
                  preload="metadata"
                  className="block max-h-[700px] w-full bg-black"
                />
              )}

              <div className="flex flex-wrap items-center gap-3 border-t border-white/10 px-4 py-4 text-sm text-white/55">
                <span>♡ {post.likes || 0}</span>
                <span>💬 {post.comments || 0}</span>
                {post.media_url && (
                  <MovetiDownloadButton
                    url={post.media_url}
                    filename={`moveti-${post.id}`}
                  />
                )}
                <span className="ml-auto">MOVETI</span>
                <span>♡ {post.likes || 0}</span>
                <span>💬 {post.comments || 0}</span>
                <span className="ml-auto">MOVETI</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
