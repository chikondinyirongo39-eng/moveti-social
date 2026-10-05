'use client'

import MovetiDownloadButton from '@/components/MovetiDownloadButton'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Post = {
  id: number
  user_id: string
  content: string | null
  likes: number
  comments: number
  created_at: string
  media_url?: string | null
  media_type?: 'image' | 'video' | null
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'for-you' | 'trending'>('for-you')

  async function loadPosts() {
    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/posts', {
        method: 'GET',
        cache: 'no-store'
      })

      if (!response.ok) {
        throw new Error('Unable to load posts.')
      }

      const data = await response.json()

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.posts)
        ? data.posts
        : []

      setPosts(list)
    } catch {
      setError('Unable to load the MOVETI feed right now.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  return (
    <main className="min-h-screen bg-black pb-24 text-white">
      <div className="mx-auto min-h-screen w-full max-w-2xl">

        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-black/90 px-4 py-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-[#8A2BE2] via-[#4169E1] to-[#FF1493] bg-clip-text text-transparent">
                MOVETI
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/search"
                aria-label="Search"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-lg transition hover:bg-white/10"
              >
                🔍
              </Link>

              <Link
                href="/notifications"
                aria-label="Notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-lg transition hover:bg-white/10"
              >
                🔔
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#FF1493]" />
              </Link>
            </div>
          </div>

          <div className="mt-4 flex rounded-xl bg-white/5 p-1">
            <button
              onClick={() => setActiveTab('for-you')}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                activeTab === 'for-you'
                  ? 'bg-gradient-to-r from-[#8A2BE2] to-[#4169E1] text-white'
                  : 'text-white/45'
              }`}
            >
              For You
            </button>

            <button
              onClick={() => setActiveTab('trending')}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                activeTab === 'trending'
                  ? 'bg-gradient-to-r from-[#8A2BE2] to-[#FF1493] text-white'
                  : 'text-white/45'
              }`}
            >
              Trending
            </button>
          </div>
        </header>

        {/* Stories */}
        <section className="border-b border-white/10 px-4 py-4">
          <div className="flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none]">
            <Link href="/upload" className="flex min-w-[64px] flex-col items-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-[#8A2BE2] bg-white/5 text-2xl">
                +
              </div>
              <span className="text-xs text-white/55">Your story</span>
            </Link>

            {['A', 'C', 'M', 'J', 'K', 'T'].map((letter, index) => (
              <div key={index} className="flex min-w-[64px] flex-col items-center gap-2">
                <div className="rounded-full bg-gradient-to-br from-[#8A2BE2] via-[#4169E1] to-[#FF1493] p-[2px]">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#17121f] text-lg font-bold">
                    {letter}
                  </div>
                </div>
                <span className="max-w-16 truncate text-xs text-white/55">
                  Creator
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Feed */}
        <section className="px-3 py-4">
          {loading && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#8A2BE2]" />
              <p className="mt-4 text-sm text-white/50">
                Loading your MOVETI feed...
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-6 text-center">
              <p className="text-sm text-red-200">{error}</p>
              <button
                onClick={loadPosts}
                className="mt-4 rounded-xl bg-white px-5 py-2 text-sm font-semibold text-black"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
              <div className="text-5xl">🎬</div>
              <h2 className="mt-4 text-xl font-bold">
                Your MOVETI feed is ready
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/45">
                Follow creators and start sharing photos, videos and music.
              </p>

              <Link
                href="/discover"
                className="mt-6 inline-block rounded-xl bg-gradient-to-r from-[#8A2BE2] to-[#4169E1] px-6 py-3 font-semibold"
              >
                Discover Creators
              </Link>
          <Link
            href="/music"
            className="flex flex-col items-center gap-1 text-[10px] font-semibold text-white/40"
          >
            <span className="text-xl">♫</span>
            Music
          </Link>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="space-y-4">
              {posts.map(post => (
                <article
                  key={post.id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0f] shadow-2xl"
                >
                  {/* Post header */}
                  <div className="flex items-center gap-3 px-4 py-4">
                    <div className="rounded-full bg-gradient-to-br from-[#8A2BE2] to-[#FF1493] p-[2px]">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#17121f] font-bold">
                        M
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="font-bold">MOVETI Creator</span>
                        <span className="text-[#4169E1]">✓</span>
                      </div>

                      <p className="text-xs text-white/40">
                        {new Date(post.created_at).toLocaleString()}
                      </p>
                    </div>

                    <button className="px-2 text-xl text-white/50">
                      •••
                    </button>
                  </div>

                  {/* Caption */}
                  {post.content && (
                    <p className="px-4 pb-4 text-[15px] leading-6 text-white/90">
                      {post.content}
                    </p>
                  )}

                  {/* Media */}
                  {post.media_url && post.media_type === 'image' && (
                    <Link href={`/posts/${post.id}`} className="block bg-black">
                      <img
                        src={post.media_url}
                        alt="MOVETI post"
                        className="block max-h-[700px] w-full object-contain"
                        loading="lazy"
                      />
                    </Link>
                  )}

                  {post.media_url && post.media_type === 'video' && (
                    <video
                      src={post.media_url}
                      controls
                      playsInline
                      preload="metadata"
                      className="block max-h-[700px] w-full bg-black"
                    />
                  )}

                  {/* Interaction bar */}
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-5 text-xl">
                      <Link
                        href={`/posts/${post.id}`}
                        className="transition hover:scale-110"
                        aria-label="Like"
                      >
                        ♡
                      </Link>

                      <Link
                        href={`/posts/${post.id}`}
                        className="transition hover:scale-110"
                        aria-label="Comment"
                      >
                        ◯
                      </Link>

                      <Link
                        href={`/posts/${post.id}`}
                        className="transition hover:scale-110"
                        aria-label="Share"
                      >
                        ↗
                      </Link>

                      <span className="ml-auto">♡</span>
                    </div>

                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <Link
                        href={`/posts/${post.id}`}
                        className="font-semibold text-white"
                      >
                        {post.likes || 0} likes
                      </Link>

                      <Link
                        href={`/posts/${post.id}`}
                        className="text-white/50"
                      >
                        {post.comments || 0} comments
                      </Link>
                    </div>

                    {post.media_url && (
                      <div className="mt-3">
                        <MovetiDownloadButton
                          url={post.media_url}
                          filename={`moveti-${post.id}`}
                        />
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/95 px-3 py-2 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link
            href="/feed"
            className="flex flex-1 flex-col items-center gap-1 py-1 text-[#8A2BE2]"
          >
            <span className="text-xl">⌂</span>
            <span className="text-[10px] font-semibold">Home</span>
          </Link>

          <Link
            href="/discover"
            className="flex flex-1 flex-col items-center gap-1 py-1 text-white/40"
          >
            <span className="text-xl">◉</span>
            <span className="text-[10px]">Discover</span>
          </Link>

          <Link
            href="/create"
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8A2BE2] to-[#FF1493] text-2xl font-bold shadow-lg shadow-purple-900/30"
          >
            +
          </Link>

          <Link
            href="/messages"
            className="flex flex-1 flex-col items-center gap-1 py-1 text-white/40"
          >
            <span className="text-xl">◌</span>
            <span className="text-[10px]">Messages</span>
          </Link>

          <Link
            href="/profile"
            className="flex flex-1 flex-col items-center gap-1 py-1 text-white/40"
          >
            <span className="text-xl">◎</span>
            <span className="text-[10px]">Profile</span>
          </Link>
        </div>
      </nav>
    </main>
  )
}
