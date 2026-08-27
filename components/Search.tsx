'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function Search() {
  const supabase = createClient();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>({
    artists: [],
    releases: [],
    posts: []
  });
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function search() {
    const q = query.trim();

    if (!q) return;

    setLoading(true);
    setSearched(true);

    const [artists, releases, posts] = await Promise.all([
      supabase
        .from('artist_profiles')
        .select('*')
        .ilike('name', `%${q}%`)
        .limit(20),

      supabase
        .from('releases')
        .select('*')
        .or(`title.ilike.%${q}%,artist.ilike.%${q}%`)
        .limit(20),

      supabase
        .from('posts')
        .select('*')
        .ilike('content', `%${q}%`)
        .limit(20)
    ]);

    setResults({
      artists: artists.data || [],
      releases: releases.data || [],
      posts: posts.data || []
    });

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-5">
      <div className="mx-auto max-w-3xl">

        <div className="rounded-2xl bg-black p-6 text-white">
          <h1 className="text-3xl font-black">🔎 Search MOVETI</h1>
          <p className="mt-1 text-gray-300">
            Find creators, music and posts.
          </p>
        </div>

        <div className="mt-5 flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') search();
            }}
            placeholder="Search MOVETI..."
            className="min-w-0 flex-1 rounded-xl border bg-white p-4 outline-none"
          />

          <button
            onClick={search}
            className="rounded-xl bg-black px-5 font-bold text-white"
          >
            Search
          </button>
        </div>

        {loading && (
          <div className="mt-6 rounded-2xl bg-white p-6 text-center text-gray-500">
            Searching...
          </div>
        )}

        {searched && !loading && (
          <div className="mt-6 space-y-6">

            <section>
              <h2 className="mb-3 text-xl font-black">Creators</h2>

              {results.artists.length === 0 ? (
                <div className="rounded-2xl bg-white p-5 text-gray-500">
                  No creators found.
                </div>
              ) : (
                <div className="space-y-3">
                  {results.artists.map((artist: any) => (
                    <a
                      key={artist.id || artist.user_id}
                      href={`/profiles/${artist.user_id}`}
                      className="block rounded-2xl bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        {artist.avatar_url ? (
                          <img
                            src={artist.avatar_url}
                            alt={artist.name || 'Artist'}
                            className="h-16 w-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-2xl">
                            🎤
                          </div>
                        )}

                        <div>
                          <h3 className="font-bold">
                            {artist.name || 'Artist'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {artist.bio || 'MOVETI creator'}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="mb-3 text-xl font-black">Music</h2>

              {results.releases.length === 0 ? (
                <div className="rounded-2xl bg-white p-5 text-gray-500">
                  No music found.
                </div>
              ) : (
                <div className="space-y-3">
                  {results.releases.map((release: any) => (
                    <a
                      key={release.id}
                      href="/player"
                      className="block rounded-2xl bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        {release.cover_url ? (
                          <img
                            src={release.cover_url}
                            alt={release.title}
                            className="h-16 w-16 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-200 text-2xl">
                            🎵
                          </div>
                        )}

                        <div>
                          <h3 className="font-bold">{release.title}</h3>
                          <p className="text-sm text-gray-500">
                            {release.artist || 'Artist'}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="mb-3 text-xl font-black">Posts</h2>

              {results.posts.length === 0 ? (
                <div className="rounded-2xl bg-white p-5 text-gray-500">
                  No posts found.
                </div>
              ) : (
                <div className="space-y-3">
                  {results.posts.map((post: any) => (
                    <article
                      key={post.id}
                      className="rounded-2xl bg-white p-5 shadow-sm"
                    >
                      <p className="whitespace-pre-wrap">
                        {post.content}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>

          </div>
        )}

        <div className="mt-6 flex gap-3">
          <a
            href="/"
            className="flex-1 rounded-xl bg-black p-3 text-center font-bold text-white"
          >
            Home
          </a>

          <a
            href="/profiles"
            className="flex-1 rounded-xl bg-white p-3 text-center font-medium shadow-sm"
          >
            Creators
          </a>
        </div>

      </div>
    </main>
  );
}
