'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function SearchCenter() {
  const supabase = createClient();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [type, setType] = useState('all');
  const [loading, setLoading] = useState(false);

  async function search() {
    const q = query.trim();

    if (!q) {
      setResults([]);
      return;
    }

    setLoading(true);

    const output: any[] = [];

    if (type === 'all' || type === 'artists') {
      const { data } = await supabase
        .from('artist_profiles')
        .select('*')
        .or(`name.ilike.%${q}%,username.ilike.%${q}%`)
        .limit(20);

      (data || []).forEach((item) =>
        output.push({
          kind: 'artist',
          id: item.id,
          title: item.name || item.username || 'Artist',
          description: item.bio || 'MOVETI artist'
        })
      );
    }

    if (type === 'all' || type === 'music') {
      const { data } = await supabase
        .from('releases')
        .select('*')
        .or(`title.ilike.%${q}%,artist.ilike.%${q}%`)
        .limit(20);

      (data || []).forEach((item) =>
        output.push({
          kind: 'music',
          id: item.id,
          title: item.title || 'Untitled release',
          description: item.artist || 'Music release',
          image: item.cover_url
        })
      );
    }

    if (type === 'all' || type === 'videos') {
      const { data } = await supabase
        .from('videos')
        .select('*')
        .ilike('title', `%${q}%`)
        .limit(20);

      (data || []).forEach((item) =>
        output.push({
          kind: 'video',
          id: item.id,
          title: item.title || 'Untitled video',
          description: item.description || 'MOVETI video',
          image: item.thumbnail_url
        })
      );
    }

    if (type === 'all' || type === 'posts') {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .ilike('content', `%${q}%`)
        .limit(20);

      (data || []).forEach((item) =>
        output.push({
          kind: 'post',
          id: item.id,
          title: 'Post',
          description: item.content || ''
        })
      );
    }

    setResults(output);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-5 pb-10">
      <div className="mx-auto max-w-3xl">

        <div className="rounded-2xl bg-black p-6 text-white">
          <h1 className="text-3xl font-black">🔎 Search MOVETI</h1>
          <p className="mt-1 text-gray-300">
            Find artists, music, videos and posts.
          </p>
        </div>

        <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm">

          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') search();
              }}
              placeholder="Search MOVETI..."
              className="min-w-0 flex-1 rounded-xl border p-3"
            />

            <button
              onClick={search}
              className="rounded-xl bg-black px-5 font-bold text-white"
            >
              Search
            </button>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto">
            {[
              ['all', 'All'],
              ['artists', 'Artists'],
              ['music', 'Music'],
              ['videos', 'Videos'],
              ['posts', 'Posts']
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setType(value)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
                  type === value
                    ? 'bg-black text-white'
                    : 'bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

        </section>

        <section className="mt-5 space-y-3">

          {loading ? (
            <div className="rounded-2xl bg-white p-8 text-center text-gray-500">
              Searching...
            </div>
          ) : query && results.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center text-gray-500">
              No results found.
            </div>
          ) : (
            results.map((result) => (
              <a
                key={`${result.kind}-${result.id}`}
                href={
                  result.kind === 'artist'
                    ? `/profiles/${result.id}`
                    : result.kind === 'music'
                    ? '/player'
                    : result.kind === 'video'
                    ? '/videos'
                    : '/'
                }
                className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm"
              >
                {result.image ? (
                  <img
                    src={result.image}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                    {result.kind === 'artist'
                      ? '👤'
                      : result.kind === 'music'
                      ? '🎵'
                      : result.kind === 'video'
                      ? '🎬'
                      : '📝'}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase text-gray-400">
                    {result.kind}
                  </p>

                  <h2 className="truncate font-black">
                    {result.title}
                  </h2>

                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {result.description}
                  </p>
                </div>
              </a>
            ))
          )}

        </section>

        <a
          href="/"
          className="mt-6 block rounded-xl bg-black p-4 text-center font-bold text-white"
        >
          ← Back to MOVETI
        </a>

      </div>
    </main>
  );
}
