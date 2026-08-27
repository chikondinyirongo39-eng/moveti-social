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

export default function MovetiSearch() {
  const supabase = createClient();

  const [query, setQuery] = useState('');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function searchArtists(value: string) {
    const text = value.trim();

    if (!text) {
      setArtists([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    const { data } = await supabase
      .from('artist_profiles')
      .select('id,name,username,bio,avatar_url')
      .or(`name.ilike.%${text}%,username.ilike.%${text}%`)
      .limit(30);

    setArtists(data || []);
    setLoading(false);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      searchArtists(query);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <main className="min-h-screen bg-gray-50 p-5 pb-10">
      <div className="mx-auto max-w-3xl">

        <div className="rounded-3xl bg-black p-6 text-white">
          <h1 className="text-3xl font-black">
            🔎 Discover MOVETI
          </h1>

          <p className="mt-1 text-gray-300">
            Find artists and creators.
          </p>

          <div className="mt-5">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search artists..."
              className="w-full rounded-2xl bg-white p-4 text-black outline-none"
            />
          </div>
        </div>

        <section className="mt-6">

          {!searched && (
            <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
              Start typing to discover artists.
            </div>
          )}

          {loading && (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              Searching...
            </div>
          )}

          {!loading && searched && artists.length === 0 && (
            <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
              No artists found.
            </div>
          )}

          {!loading && artists.length > 0 && (
            <div className="space-y-3">
              {artists.map((artist) => {
                const name =
                  artist.name ||
                  artist.username ||
                  'MOVETI Artist';

                return (
                  <a
                    key={artist.id}
                    href={`/profiles/${artist.id}`}
                    className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
                  >

                    {artist.avatar_url ? (
                      <img
                        src={artist.avatar_url}
                        alt={name}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-100 text-2xl">
                        👤
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate font-black">
                        {name}
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
                );
              })}
            </div>
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
            href="/player"
            className="rounded-xl bg-white p-3 text-center text-sm font-bold shadow-sm"
          >
            🎵 Music
          </a>

          <a
            href="/messages"
            className="rounded-xl bg-black p-3 text-center text-sm font-bold text-white"
          >
            💬 Chat
          </a>

        </div>

      </div>
    </main>
  );
}
