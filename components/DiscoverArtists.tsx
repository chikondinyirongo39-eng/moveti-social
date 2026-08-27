'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

type Artist = {
  id: string;
  name?: string;
  username?: string;
  bio?: string;
  avatar_url?: string;
};

export default function DiscoverArtists() {
  const supabase = createClient();

  const [artists, setArtists] = useState<Artist[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  async function searchArtists(value = '') {
    setLoading(true);

    const clean = value.trim();

    let request = supabase
      .from('artist_profiles')
      .select('id,name,username,bio,avatar_url')
      .order('name', { ascending: true })
      .limit(30);

    if (clean) {
      request = request.or(
        `name.ilike.%${clean}%,username.ilike.%${clean}%`
      );
    }

    const { data } = await request;

    setArtists(data || []);
    setLoading(false);
  }

  useEffect(() => {
    searchArtists();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchArtists(query);
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <main className="min-h-screen bg-gray-50 p-5 pb-10">
      <div className="mx-auto max-w-2xl">

        <div className="rounded-3xl bg-black p-6 text-white">
          <h1 className="text-3xl font-black">
            🔎 Discover
          </h1>

          <p className="mt-1 text-gray-300">
            Find artists and discover music on MOVETI.
          </p>
        </div>

        <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artists..."
            className="w-full rounded-xl border p-4 outline-none"
          />
        </div>

        <section className="mt-5 space-y-3">

          {loading ? (
            <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
              Searching...
            </div>
          ) : artists.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <div className="text-4xl">🔎</div>

              <h2 className="mt-3 font-black">
                No artists found
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Try another artist name or username.
              </p>
            </div>
          ) : (
            artists.map((artist) => (
              <a
                key={artist.id}
                href={`/profiles/${artist.id}`}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                {artist.avatar_url ? (
                  <img
                    src={artist.avatar_url}
                    alt={artist.name || 'Artist'}
                    className="h-16 w-16 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-100 text-2xl">
                    👤
                  </div>
                )}

                <div className="min-w-0 flex-1">

                  <h2 className="truncate text-lg font-black">
                    {artist.name || artist.username || 'MOVETI Artist'}
                  </h2>

                  {artist.username && (
                    <p className="truncate text-sm text-gray-500">
                      @{artist.username}
                    </p>
                  )}

                  {artist.bio && (
                    <p className="mt-1 truncate text-sm text-gray-400">
                      {artist.bio}
                    </p>
                  )}

                </div>

                <span className="text-xl">
                  →
                </span>

              </a>
            ))
          )}

        </section>

        <div className="mt-6 grid grid-cols-3 gap-2">

          <a
            href="/"
            className="rounded-xl bg-white p-3 text-center text-sm font-bold shadow-sm"
          >
            🏠 Home
          </a>

          <a
            href="/following"
            className="rounded-xl bg-white p-3 text-center text-sm font-bold shadow-sm"
          >
            👥 Following
          </a>

          <a
            href="/dashboard"
            className="rounded-xl bg-black p-3 text-center text-sm font-bold text-white"
          >
            📊 Dashboard
          </a>

        </div>

      </div>
    </main>
  );
}
