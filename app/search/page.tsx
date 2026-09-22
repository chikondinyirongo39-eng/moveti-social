"use client"

import { useState } from "react"
import Link from "next/link"

type Result = {
  id: string | number
  type: "creator" | "post"
  title: string
  description?: string
  user_id?: string
  media_url?: string
  media_type?: string
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)

  async function search() {
    const value = query.trim()

    if (!value) {
      setResults([])
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(value)}`,
        { cache: "no-store" }
      )

      if (!response.ok) {
        setResults([])
        return
      }

      const data = await response.json()

      setResults(
        Array.isArray(data)
          ? data
          : Array.isArray(data.results)
            ? data.results
            : []
      )
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6">
          <h1 className="text-3xl font-black">Search MOVETI</h1>
          <p className="mt-1 text-sm text-white/45">
            Find creators, posts, videos and music.
          </p>
        </header>

        <div className="flex gap-2">
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            onKeyDown={event => {
              if (event.key === "Enter") search()
            }}
            placeholder="Search creators, posts or music..."
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-white/30"
          />

          <button
            onClick={search}
            className="rounded-2xl bg-white px-6 font-bold text-black"
          >
            Search
          </button>
        </div>

        {loading && (
          <p className="mt-6 text-sm text-white/40">
            Searching MOVETI...
          </p>
        )}

        {!loading && query && results.length === 0 && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/40">
            No results found.
          </div>
        )}

        <div className="mt-6 space-y-3">
          {results.map(result => (
            <article
              key={`${result.type}-${result.id}`}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
            >
              <div className="text-xs uppercase tracking-wider text-white/30">
                {result.type}
              </div>

              {result.type === "creator" && result.user_id ? (
                <Link
                  href={`/creator-profile/${result.user_id}`}
                  className="mt-1 block text-lg font-bold hover:underline"
                >
                  {result.title}
                </Link>
              ) : (
                <h2 className="mt-1 text-lg font-bold">
                  {result.title}
                </h2>
              )}

              {result.description && (
                <p className="mt-1 text-sm text-white/50">
                  {result.description}
                </p>
              )}

              {result.media_url && result.media_type === "image" && (
                <img
                  src={result.media_url}
                  alt=""
                  className="mt-4 max-h-80 w-full rounded-xl object-contain"
                />
              )}

              {result.media_url && result.media_type === "video" && (
                <video
                  src={result.media_url}
                  controls
                  playsInline
                  preload="metadata"
                  className="mt-4 max-h-80 w-full rounded-xl bg-black"
                />
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
