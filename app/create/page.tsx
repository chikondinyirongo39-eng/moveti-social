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
    icon: '✎',
    action: 'post',
  },
  {
    title: 'Photo',
    description: 'Share a photo with your followers',
    icon: '▧',
    href: '/upload',
  },
  {
    title: 'Video',
    description: 'Upload and share a video',
    icon: '▶',
    href: '/videos',
  },
  {
    title: 'Reel / Short',
    description: 'Create short-form video content',
    icon: '▣',
    href: '/shorts',
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
    <main className="min-h-screen bg-[#09090b] pb-28 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#09090b]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[680px] items-center justify-between px-4">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-lg"
          >
            ‹
          </Link>

          <div className="text-center">
            <div className="text-[22px] font-black tracking-[-1px]">
              CREATE
            </div>
            <div className="text-[9px] font-medium tracking-[3px] text-white/35">
              MOVETI
            </div>
          </div>

          <Link
            href="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-black text-black"
          >
            C
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-[680px] px-4 pt-6">
        <div className="mb-7">
          <h1 className="text-3xl font-black tracking-tight">
            What do you want to create?
          </h1>
          <p className="mt-2 text-sm leading-6 text-white/40">
            Share your creativity with the MOVETI community.
          </p>
        </div>

        {message && (
          <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-xs text-white/70">
            {message}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {options.map((option) => {
            const content = (
              <>
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.07] text-2xl">
                  {option.icon}
                </div>

                <div className="text-base font-black">
                  {option.title}
                </div>

                <div className="mt-1 text-xs leading-5 text-white/35">
                  {option.description}
                </div>

                <div className="mt-5 text-[10px] font-bold uppercase tracking-[1.5px] text-white/30">
                  {option.action === 'post' ? 'Create now' : 'Open'}
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
                  className="min-h-[185px] rounded-[26px] border border-white/10 bg-[#111113] p-5 text-left transition hover:border-white/20 hover:bg-white/[0.05]"
                >
                  {content}
                </button>
              )
            }

            return (
              <Link
                key={option.title}
                href={option.href || '/'}
                className="min-h-[185px] rounded-[26px] border border-white/10 bg-[#111113] p-5 text-left transition hover:border-white/20 hover:bg-white/[0.05]"
              >
                {content}
              </Link>
            )
          })}
        </div>

        <div className="mt-5 rounded-[26px] border border-white/10 bg-[#111113] p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.06] text-xl">
              ✦
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-sm font-black">
                Creator tools
              </div>
              <div className="mt-1 text-xs leading-5 text-white/35">
                Manage your creator content, music and releases.
              </div>
            </div>

            <Link
              href="/creator"
              className="rounded-full border border-white/10 px-4 py-2 text-[11px] font-bold text-white/60"
            >
              Open
            </Link>
          </div>
        </div>

        <div className="mt-5 rounded-[26px] border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent p-5">
          <div className="text-[10px] font-black uppercase tracking-[2px] text-white/30">
            Your creativity
          </div>

          <div className="mt-2 text-lg font-black">
            Music. Video. Community.
          </div>

          <p className="mt-2 text-xs leading-5 text-white/35">
            MOVETI gives creators one place to share posts, photos, videos,
            short-form content, live sessions and music.
          </p>
        </div>
      </section>

      {postOpen && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 px-3 pb-3 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-[600px] rounded-[28px] border border-white/10 bg-[#111113] p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-lg font-black">Create a post</div>
                <div className="mt-1 text-xs text-white/35">
                  Share something with your community.
                </div>
              </div>

              <button
                onClick={() => setPostOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-white/60"
              >
                ×
              </button>
            </div>

            <div className="flex gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-black">
                C
              </div>

              <textarea
                autoFocus
                value={postText}
                onChange={(event) => setPostText(event.target.value)}
                placeholder="What's happening?"
                rows={6}
                className="min-h-[150px] flex-1 resize-none bg-transparent text-sm leading-6 text-white outline-none placeholder:text-white/30"
              />
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-[11px] text-white/25">
                {postText.length} characters
              </span>

              <button
                onClick={publishPost}
                disabled={!postText.trim() || posting}
                className="rounded-full bg-white px-6 py-3 text-xs font-black text-black disabled:cursor-not-allowed disabled:opacity-30"
              >
                {posting ? 'Publishing...' : 'Publish post'}
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 pb-[env(safe-area-inset-bottom)] z-50 border-t border-white/10 bg-[#09090b]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[78px] max-w-[680px] items-center justify-around px-2">
          <Link
            href="/"
            className="flex flex-col items-center gap-1 text-[10px] font-semibold text-white/40"
          >
            <span className="text-xl">⌂</span>
            Home
          </Link>

          <Link
            href="/discover"
            className="flex flex-col items-center gap-1 text-[10px] font-semibold text-white/40"
          >
            <span className="text-xl">◉</span>
            Discover
          </Link>

          <div className="flex h-12 w-14 items-center justify-center rounded-2xl bg-white text-2xl font-light text-black">
            +
          </div>

          <Link
            href="/messages"
            className="flex flex-col items-center gap-1 text-[10px] font-semibold text-white/40"
          >
            <span className="text-xl">◌</span>
            Messages
          </Link>

          <Link
            href="/profile"
            className="flex flex-col items-center gap-1 text-[10px] font-semibold text-white/40"
          >
            <span className="text-xl">●</span>
            Profile
          </Link>
        </div>
      </nav>
    </main>
  )
}
