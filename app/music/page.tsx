'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type Release = {
  id: string
  title?: string
  artist?: string
  artist_name?: string
  cover_url?: string
  artwork_url?: string
  cover?: string
  created_at?: string
}

const genres = [
  { name: 'Afrobeats', icon: '◉' },
  { name: 'Hip Hop', icon: '♬' },
  { name: 'Gospel', icon: '✦' },
  { name: 'R&B', icon: '♡' },
  { name: 'Dance', icon: '◆' },
]

const tabs = ['For You', 'Trending', 'New Releases', 'Genres']

export default function MusicPage() {
  const [releases, setReleases] = useState<Release[]>([])
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('For You')
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState<Release | null>(null)

  useEffect(() => {
    async function loadReleases() {
      try {
        const response = await fetch('/releases', {
          cache: 'no-store',
        })

        if (!response.ok) return

        const html = await response.text()

        const titleMatches = [
          ...html.matchAll(/<h1[^>]*>(.{2,80})<\/h1>/g),
        ]
          .map((match) => match[1]?.trim())
          .filter(
            (value) =>
              value &&
              !value.includes('MOVETI') &&
              !value.includes('Release') &&
              !value.includes('Dashboard') &&
              !value.includes('Manage')
          )

        const uniqueTitles = Array.from(new Set(titleMatches)).slice(0, 12)

        setReleases(
          uniqueTitles.map((title, index) => ({
            id: `release-${index}`,
            title,
            artist: 'MOVETI Artist',
          }))
        )
      } catch {
        // Keep the music experience available if releases cannot be read.
      } finally {
        setLoading(false)
      }
    }

    loadReleases()
  }, [])

  const filteredReleases = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return releases

    return releases.filter((release) =>
      `${release.title || ''} ${release.artist || release.artist_name || ''}`
        .toLowerCase()
        .includes(query)
    )
  }, [releases, search])

  const featured = filteredReleases.slice(0, 5)
  const newReleases = filteredReleases.slice(0, 8)

  return (
    <main className="min-h-screen bg-black pb-28 text-white">
      <div className="mx-auto min-h-screen w-full max-w-2xl">

        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl">
          <div className="px-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="bg-gradient-to-r from-[#8A2BE2] via-[#4169E1] to-[#FF1493] bg-clip-text text-2xl font-black tracking-tight text-transparent">
                  MOVETI
                </div>
                <div className="text-[9px] font-bold tracking-[3px] text-white/30">
                  MUSIC
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/search"
                  aria-label="Search"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-lg"
                >
                  ⌕
                </Link>

                <Link
                  href="/profile"
                  aria-label="Profile"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#8A2BE2] to-[#FF1493] text-sm font-black"
                >
                  C
                </Link>
              </div>
            </div>

            {/* Search */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4">
              <span className="text-white/35">⌕</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search songs, artists or releases"
                className="h-12 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-white/35"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Music tabs */}
            <div className="mt-4 flex gap-5 overflow-x-auto pb-3">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap pb-2 text-xs font-bold ${
                    activeTab === tab
                      ? 'border-b-2 border-[#FF1493] text-white'
                      : 'text-white/35'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </header>

        <section className="px-4 pt-5">

          {/* Featured banner */}
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#8A2BE2]/45 via-[#4169E1]/25 to-[#FF1493]/35 p-6">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#FF1493]/20 blur-3xl" />
            <div className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-[#4169E1]/20 blur-3xl" />

            <div className="relative">
              <div className="text-[10px] font-black uppercase tracking-[3px] text-white/55">
                MOVETI MUSIC
              </div>

              <h1 className="mt-3 max-w-[330px] text-3xl font-black leading-tight tracking-tight">
                Discover your
                <br />
                next sound.
              </h1>

              <p className="mt-3 max-w-[360px] text-sm leading-6 text-white/60">
                New music, artists and releases from the MOVETI community.
              </p>

              <Link
                href="/releases"
                className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-xs font-black text-black"
              >
                Explore releases
              </Link>
            </div>
          </div>

          {/* Genres */}
          {(activeTab === 'For You' || activeTab === 'Genres') && (
            <section className="mt-7">
              <div className="mb-3">
                <h2 className="text-lg font-black">Genres</h2>
                <p className="mt-1 text-xs text-white/30">
                  Find music your way
                </p>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-1">
                {genres.map((genre) => (
                  <button
                    key={genre.name}
                    onClick={() => setSearch(genre.name)}
                    className="min-w-[120px] rounded-2xl border border-white/10 bg-[#101014] p-3 text-left"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#8A2BE2]/30 to-[#FF1493]/20 text-sm">
                      {genre.icon}
                    </div>
                    <div className="mt-3 text-xs font-bold text-white/75">
                      {genre.name}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* New Releases */}
          {(activeTab === 'For You' || activeTab === 'New Releases') && (
            <section className="mt-8">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <h2 className="text-xl font-black">New Releases</h2>
                  <p className="mt-1 text-xs text-white/30">
                    Fresh music from MOVETI artists
                  </p>
                </div>

                <Link
                  href="/releases"
                  className="text-xs font-bold text-[#FF1493]"
                >
                  See all
                </Link>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="aspect-square animate-pulse rounded-[22px] bg-white/[0.05]"
                    />
                  ))}
                </div>
              ) : newReleases.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {newReleases.map((release) => {
                    const artwork =
                      release.cover_url ||
                      release.artwork_url ||
                      release.cover

                    return (
                      <button
                        key={release.id}
                        onClick={() => setPlaying(release)}
                        className="group min-w-0 text-left"
                      >
                        <div className="relative aspect-square overflow-hidden rounded-[22px] border border-white/10 bg-[#111114]">
                          {artwork ? (
                            <img
                              src={artwork}
                              alt={release.title || 'MOVETI release'}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#8A2BE2]/30 via-[#4169E1]/15 to-[#FF1493]/25 text-4xl">
                              ♫
                            </div>
                          )}

                          <div className="absolute inset-x-0 bottom-0 flex justify-end bg-gradient-to-t from-black/80 to-transparent p-3 pt-10">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs text-black">
                              ▶
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 truncate text-sm font-black">
                          {release.title || 'Untitled release'}
                        </div>

                        <div className="mt-1 truncate text-[11px] text-white/35">
                          {release.artist ||
                            release.artist_name ||
                            'MOVETI Artist'}
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-[26px] border border-white/10 bg-[#101014] p-10 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#8A2BE2]/20 to-[#FF1493]/20 text-2xl">
                    ♫
                  </div>
                  <h3 className="mt-4 font-black">
                    Music is waiting for you
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-white/35">
                    Your music catalog will appear here as releases become
                    available.
                  </p>
                  <Link
                    href="/releases"
                    className="mt-5 inline-flex rounded-full bg-white px-5 py-2.5 text-xs font-black text-black"
                  >
                    Open releases
                  </Link>
                </div>
              )}
            </section>
          )}

          {/* Trending */}
          {(activeTab === 'For You' || activeTab === 'Trending') && (
            <section className="mt-8">
              <div className="mb-4">
                <h2 className="text-xl font-black">Trending Tracks</h2>
                <p className="mt-1 text-xs text-white/30">
                  What the MOVETI community is discovering
                </p>
              </div>

              <div className="overflow-hidden rounded-[26px] border border-white/10 bg-[#101014]">
                {featured.length > 0 ? (
                  featured.map((release, index) => {
                    const artwork =
                      release.cover_url ||
                      release.artwork_url ||
                      release.cover

                    return (
                      <button
                        key={`trending-${release.id}`}
                        onClick={() => setPlaying(release)}
                        className="flex w-full items-center gap-3 border-b border-white/10 px-4 py-3 text-left last:border-b-0"
                      >
                        <div className="w-5 text-center text-xs font-black text-white/20">
                          {index + 1}
                        </div>

                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#8A2BE2]/25 to-[#FF1493]/20">
                          {artwork ? (
                            <img
                              src={artwork}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-lg">
                              ♫
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-black">
                            {release.title || 'Untitled release'}
                          </div>
                          <div className="mt-1 truncate text-[11px] text-white/35">
                            {release.artist ||
                              release.artist_name ||
                              'MOVETI Artist'}
                          </div>
                        </div>

                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-xs">
                          ▶
                        </span>
                      </button>
                    )
                  })
                ) : (
                  <div className="p-7 text-center text-xs text-white/35">
                    Trending music will appear here.
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Artist / releases cards */}
          <section className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              href="/releases"
              className="rounded-[26px] border border-white/10 bg-[#101014] p-5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8A2BE2]/25 to-[#4169E1]/20 text-xl">
                ◉
              </div>
              <div className="mt-5 text-base font-black">
                Albums & Releases
              </div>
              <p className="mt-1 text-xs leading-5 text-white/35">
                Explore complete releases from MOVETI artists.
              </p>
              <div className="mt-5 text-[10px] font-black uppercase tracking-[1.5px] text-white/30">
                Explore →
              </div>
            </Link>

            <Link
              href="/creator"
              className="rounded-[26px] border border-white/10 bg-[#101014] p-5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF1493]/25 to-[#8A2BE2]/20 text-xl">
                ♫
              </div>
              <div className="mt-5 text-base font-black">
                Artist Music
              </div>
              <p className="mt-1 text-xs leading-5 text-white/35">
                Manage your music and creator content.
              </p>
              <div className="mt-5 text-[10px] font-black uppercase tracking-[1.5px] text-white/30">
                Creator Studio →
              </div>
            </Link>
          </section>

        </section>
      </div>

      {/* Mini player */}
      {playing && (
        <div className="fixed bottom-[78px] left-0 right-0 z-40 px-3">
          <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-[22px] border border-white/10 bg-[#151517]/95 p-3 shadow-2xl backdrop-blur-xl">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#8A2BE2]/25 to-[#FF1493]/20 text-xl">
              ♫
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-black">
                {playing.title || 'Untitled release'}
              </div>
              <div className="mt-1 truncate text-[10px] text-white/35">
                {playing.artist ||
                  playing.artist_name ||
                  'MOVETI Artist'}
              </div>
            </div>

            <Link
              href="/player"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-black text-black"
            >
              ▶
            </Link>

            <button
              onClick={() => setPlaying(null)}
              className="flex h-9 w-9 items-center justify-center text-white/35"
              aria-label="Close player"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Bottom navigation */}
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

          <Link
            href="/create"
            className="flex h-12 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8A2BE2] to-[#FF1493] text-2xl font-bold"
          >
            +
          </Link>

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
