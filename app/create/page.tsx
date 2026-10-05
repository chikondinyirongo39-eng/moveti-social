'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

type CreateOption = {
  title: string
  description: string
  icon: string
  href?: string
  action?: 'post'
}

const options: CreateOption[] = [
  {
    title: 'Post',
    description: 'Share something with your community',
    icon: '✦',
    action: 'post',
  },
  {
    title: 'Reel / Short Video',
    description: 'Create short-form video content',
    icon: '▶',
    href: '/shorts',
  },
  {
    title: 'Photo',
    description: 'Share a photo with your followers',
    icon: '▧',
    href: '/upload',
  },
  {
    title: 'Live',
    description: 'Go live with your community',
    icon: '●',
    href: '/live',
  },
  {
    title: 'Music',
    description: 'Create or manage a music release',
    icon: '♫',
    href: '/new-release',
  },
  {
    title: 'More',
    description: 'Explore more creator tools',
    icon: '•••',
    href: '/creator',
  },
]

export default function CreatePage() {
  const supabase = createClient()

  const [postText, setPostText] = useState('')
  const [posting, setPosting] = useState(false)
  const [message, setMessage] = useState('')
  const [postOpen, setPostOpen] = useState(false)

  async function publishPost() {
    const text = postText.trim()
    if (!text || posting) return

    setPosting(true)
    setMessage('')

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setMessage('Please log in before creating a post.')
        return
      }

      const { error } = await supabase.from('posts').insert({
        user_id: user.id,
        content: text,
      })

      if (error) throw error

      setPostText('')
      setPostOpen(false)
      setMessage('Your post was published successfully.')
    } catch {
      setMessage('Your post could not be published. Please try again.')
    } finally {
      setPosting(false)
    }
  }

  return (
    <main className="min-h-screen bg-black pb-28 text-white">
      <div className="mx-auto min-h-screen w-full max-w-2xl">

        <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 px-4 py-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <Link
              href="/feed"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-xl text-white/70"
            >
              ‹
            </Link>

            <div className="text-center">
              <h1 className="text-xl font-black tracking-tight">Create</h1>
              <p className="text-[9px] font-bold tracking-[3px] text-white/30">
                MOVETI
              </p>
            </div>

            <Link
              href="/profile"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#8A2BE2] to-[#FF1493] text-sm font-black"
            >
              C
            </Link>
          </div>
        </header>

        <section className="px-4 pt-7">
          <div className="mb-7">
            <h2 className="text-3xl font-black tracking-tight">
              Create something
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/45">
              Share your creativity with the MOVETI community.
            </p>
          </div>

          {message && (
            <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white/70">
              {message}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {options.map((option, index) => {
              const cardClass =
                'group min-h-[165px] rounded-[26px] border border-white/10 bg-[#101014] p-5 text-left transition hover:border-[#8A2BE2]/50 hover:bg-[#15121b]'

              const content = (
                <>
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold ${
                      index === 0
                        ? 'bg-gradient-to-br from-[#8A2BE2] to-[#4169E1]'
                        : 'bg-white/[0.07] text-white/80'
                    }`}
                  >
                    {option.icon}
                  </div>

                  <div className="mt-5 text-base font-black">
                    {option.title}
                  </div>

                  <div className="mt-1 text-xs leading-5 text-white/35">
                    {option.description}
                  </div>
                </>
              )

              if (option.action === 'post') {
                return (
                  <button
                    key={option.title}
                    onClick={() => {
                      setPostOpen(true)
                      setMessage('')
                    }}
                    className={cardClass}
                  >
                    {content}
                  </button>
                )
              }

              return (
                <Link
                  key={option.title}
                  href={option.href || '/creator'}
                  className={cardClass}
                >
                  {content}
                </Link>
              )
            })}
          </div>

          <div className="mt-7">
            <h3 className="mb-3 text-sm font-black text-white/80">
              Quick Actions
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/videos"
                className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#8A2BE2]/20 to-[#4169E1]/10 p-4"
              >
                <div className="text-lg">▶</div>
                <div className="mt-2 text-sm font-bold">Upload Video</div>
                <div className="mt-1 text-[11px] text-white/35">
                  Share a video
                </div>
              </Link>

              <Link
                href="/live"
                className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#FF1493]/20 to-[#8A2BE2]/10 p-4"
              >
                <div className="text-lg">●</div>
                <div className="mt-2 text-sm font-bold">Go Live</div>
                <div className="mt-1 text-[11px] text-white/35">
                  Connect in real time
                </div>
              </Link>
            </div>
          </div>

          <div className="mt-6 rounded-[26px] border border-white/10 bg-white/[0.035] p-5">
            <div className="text-[10px] font-black uppercase tracking-[2px] text-white/30">
              Creator tools
            </div>
            <div className="mt-2 text-lg font-black">
              Music. Video. Community.
            </div>
            <p className="mt-2 text-xs leading-5 text-white/35">
              Everything you create on MOVETI can live in one place.
            </p>
          </div>
        </section>
      </div>

      {postOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/75 px-3 pb-3 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-2xl rounded-[30px] border border-white/10 bg-[#111114] p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Create a post</h2>
                <p className="mt-1 text-xs text-white/35">
                  Share something with your community.
                </p>
              </div>

              <button
                onClick={() => setPostOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-white/60"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8A2BE2] to-[#FF1493] text-sm font-black">
                C
              </div>

              <textarea
                autoFocus
                value={postText}
                onChange={event => setPostText(event.target.value)}
                placeholder="What's happening?"
                rows={6}
                className="min-h-[150px] flex-1 resize-none bg-transparent text-sm leading-6 text-white outline-none placeholder:text-white/25"
              />
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-[11px] text-white/25">
                {postText.length} characters
              </span>

              <button
                onClick={publishPost}
                disabled={!postText.trim() || posting}
                className="rounded-full bg-gradient-to-r from-[#8A2BE2] to-[#4169E1] px-6 py-3 text-xs font-black disabled:cursor-not-allowed disabled:opacity-30"
              >
                {posting ? 'Publishing...' : 'Publish post'}
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
        <div className="mx-auto flex h-[78px] max-w-2xl items-center justify-around px-2">
          <Link
            href="/feed"
            className="flex flex-col items-center gap-1 text-[10px] font-semibold text-white/40"
          >
            <span className="text-xl">⌂</span>
            Home
          </Link>

          <Link
            href="/discover"
            className="flex flex-col items-center gap-1 text-[10px] font-semibold text-white/40"
          >
            <span className="text-xl">✳</span>
            Discover
          </Link>

          <div className="flex h-12 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8A2BE2] to-[#FF1493] text-2xl font-bold">
            +
          </div>

          <Link
            href="/messages"
            className="flex flex-col items-center gap-1 text-[10px] font-semibold text-white/40"
          >
            <span className="text-xl">✉</span>
            Messages
          </Link>

          <Link
            href="/profile"
            className="flex flex-col items-center gap-1 text-[10px] font-semibold text-white/40"
          >
            <span className="text-xl">☺</span>
            Profile
          </Link>
        </div>
      </nav>
    </main>
  )
}
