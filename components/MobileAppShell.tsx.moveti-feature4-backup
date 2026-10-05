'use client'

import Link from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase'

type Props = {
  children: ReactNode
}

export default function MobileAppShell({ children }: Props) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'You'

  const avatar =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#050505]">
      <div className="mx-auto min-h-screen w-full max-w-[520px] bg-white shadow-sm">
        <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-white px-4">
          <Link href="/" className="text-2xl font-black tracking-tight">
            MOVETI
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/search"
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f2f5] text-xl"
            >
              🔍
            </Link>

            <Link
              href="/notifications"
              aria-label="Notifications"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f2f5] text-xl"
            >
              🔔
            </Link>

            <Link href={user ? '/profile' : '/login'} aria-label="Profile">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                  {name.slice(0, 1).toUpperCase()}
                </div>
              )}
            </Link>
          </div>
        </header>

        <main className="min-h-[calc(100vh-118px)]">
          {children}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white">
          <div className="mx-auto grid h-16 max-w-[520px] grid-cols-5 items-center px-1">
            <Link href="/" className="flex flex-col items-center justify-center gap-0.5">
              <span className="text-[22px]">⌂</span>
              <span className="text-[10px] font-semibold">Home</span>
            </Link>

            <Link href="/discover" className="flex flex-col items-center justify-center gap-0.5">
              <span className="text-[22px]">◎</span>
              <span className="text-[10px] font-semibold">Discover</span>
            </Link>

            <Link
              href="/create"
              className="flex flex-col items-center justify-center"
              aria-label="Create"
            >
              <span className="-mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-black text-3xl font-light text-white shadow-lg">
                +
              </span>
              <span className="-mt-0.5 text-[10px] font-semibold">Create</span>
            </Link>

            <Link href="/messages" className="flex flex-col items-center justify-center gap-0.5">
              <span className="text-[22px]">◯</span>
              <span className="text-[10px] font-semibold">Messages</span>
            </Link>

            <Link
              href={user ? '/profile' : '/login'}
              className="flex flex-col items-center justify-center gap-0.5"
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt=""
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <span className="text-[22px]">●</span>
              )}
              <span className="text-[10px] font-semibold">Profile</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}
