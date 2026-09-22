'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-100 text-black pb-24">
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="mx-auto max-w-[520px] h-16 px-4 flex items-center justify-between">
          <div className="text-2xl font-black">MOVETI</div>
          <div className="flex gap-2">
            <Link href="/search" className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-xl">⌕</Link>
            <Link href="/notifications" className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-xl">🔔</Link>
            <Link href="/profile" className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">C</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[520px] px-3 pt-4">
        <div className="bg-white rounded-3xl p-4 shadow-sm mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">C</div>
            <div>
              <div className="font-bold">What are you creating?</div>
              <div className="text-sm text-zinc-500">Share music, videos or a post</div>
            </div>
          </div>

          <Link href="/create" className="h-12 rounded-2xl bg-black text-white flex items-center justify-center font-bold">
            + Create a post
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto mb-4">
          <Link href="/" className="bg-black text-white rounded-full px-5 py-2 font-bold text-sm">For You</Link>
          <Link href="/player" className="bg-white rounded-full px-5 py-2 font-bold text-sm">Music</Link>
          <Link href="/shorts" className="bg-white rounded-full px-5 py-2 font-bold text-sm">Shorts</Link>
          <Link href="/discover" className="bg-white rounded-full px-5 py-2 font-bold text-sm">Discover</Link>
        </div>

        <article className="bg-white rounded-3xl overflow-hidden shadow-sm">
          <div className="p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center font-bold">A</div>
            <div className="flex-1">
              <div className="font-bold">Astravet CN</div>
              <div className="text-xs text-zinc-500">Artist • MOVETI</div>
            </div>
            <div className="font-bold">•••</div>
          </div>

          <div className="aspect-square bg-black text-white flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">♪</div>
              <div className="text-3xl font-black">MOVETI</div>
              <div className="text-zinc-400 mt-1">Music • Videos • Creators</div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex gap-6 text-2xl mb-3">
              <button>🔔</button>
              <button>◯</button>
              <button>↗</button>
              <button className="ml-auto">⌑</button>
            </div>
            <div className="font-bold">Welcome to MOVETI Social</div>
            <p className="text-sm text-zinc-600 mt-1">
              Discover music, watch videos, connect with creators and share your world.
            </p>
          </div>
        </article>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t">
        <div className="mx-auto max-w-[520px] h-20 flex items-center justify-around">
          <Link href="/" className="flex flex-col items-center text-xs font-bold"><span className="text-2xl">⌂</span>Home</Link>
          <Link href="/discover" className="flex flex-col items-center text-xs font-bold"><span className="text-2xl">◉</span>Discover</Link>
          <Link href="/create" className="w-14 h-12 rounded-2xl bg-black text-white flex items-center justify-center text-3xl">+</Link>
          <Link href="/messages" className="flex flex-col items-center text-xs font-bold"><span className="text-2xl"><svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H8l-4 2v-4.5A7.5 7.5 0 1 1 20 11.5Z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/></svg></span>Messages</Link>
          <Link href="/profile" className="flex flex-col items-center text-xs font-bold"><span className="text-2xl">●</span>Profile</Link>
        </div>
      </nav>
    </main>
  )
}
