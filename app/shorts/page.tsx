"use client"

import MovetiDownloadButton from "@/components/MovetiDownloadButton"
import { useEffect, useRef, useState } from "react"

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

export default function ShortsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [muted, setMuted] = useState(true)
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({})

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
          list.filter(
            (post: Post) =>
              post.media_type === "video" && !!post.media_url
          )
        )
      })
      .catch(() => setPosts([]))
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const video = entry.target as HTMLVideoElement

          if (entry.isIntersecting) {
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.7 }
    )

    Object.values(videoRefs.current).forEach(video => {
      if (video) observer.observe(video)
    })

    return () => observer.disconnect()
  }, [posts])

  return (
    <main className="h-screen snap-y snap-mandatory overflow-y-auto bg-black text-white">
      {posts.length === 0 && (
        <section className="flex h-screen snap-start items-center justify-center px-6 text-center">
          <div>
            <div className="text-5xl">🎬</div>
            <h1 className="mt-4 text-2xl font-black">MOVETI Shorts</h1>
            <p className="mt-2 text-white/50">
              Vertical creator videos will appear here.
            </p>
          </div>
        </section>
      )}

      {posts.map(post => (
        <section
          key={post.id}
          className="relative flex h-screen snap-start items-center justify-center bg-black"
        >
          <video
            ref={element => {
              videoRefs.current[post.id] = element
            }}
            src={post.media_url || ""}
            muted={muted}
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-contain"
          />

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 pb-10">
            <div className="max-w-[75%]">
              <div className="font-bold">MOVETI Creator</div>

              {post.content && (
                <p className="mt-2 text-sm leading-5 text-white/90">
                  {post.content}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/60">
                <span>♡ {post.likes || 0} &nbsp; 💬 {post.comments || 0}</span>
                {post.media_url && (
                  <MovetiDownloadButton
                    url={post.media_url}
                    filename={`moveti-video-${post.id}`}
                  />
                )}
              </div>
            </div>

            <button
              onClick={() => setMuted(value => !value)}
              className="absolute bottom-10 right-5 rounded-full bg-white/15 px-4 py-3 backdrop-blur"
              aria-label={muted ? "Unmute video" : "Mute video"}
            >
              {muted ? "🔇" : "🔊"}
            </button>
          </div>
        </section>
      ))}
    </main>
  )
}
