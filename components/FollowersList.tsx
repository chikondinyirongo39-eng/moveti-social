'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

type Artist = {
  id: string;
  name?: string;
  username?: string;
  avatar_url?: string;
};

export default function FollowersList() {
  const supabase = createClient();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/login';
        return;
      }

      const { data, error } = await supabase
        .from('followers')
        .select(`
          follower_id,
          artist_profiles!followers_follower_id_fkey(
            id,
            name,
            username,
            avatar_url
          )
        `)
        .eq('following_id', user.id);

      if (error) {
        console.error('Followers error:', error);
        setArtists([]);
      } else {
        const list = (data || [])
          .map((item: any) => item.artist_profiles)
          .filter(Boolean);

        setArtists(list);
      }

      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-5">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center">
          Loading followers...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-5 pb-10">
      <div className="mx-auto max-w-2xl">

        <div className="rounded-3xl bg-black p-6 text-white">
          <h1 className="text-3xl font-black">
            👥 Followers
          </h1>

          <p className="mt-1 text-gray-300">
            People following you on MOVETI.
          </p>
        </div>

        <section className="mt-5 space-y-3">

          {artists.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
              <div className="text-4xl">👥</div>
              <p className="mt-3 font-medium">
                You don't have any followers yet.
              </p>
            </div>
          ) : (
            artists.map((artist) => (
              <a
                key={artist.id}
                href={`/profiles/${artist.id}`}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm"
              >
                {artist.avatar_url ? (
                  <img
                    src={artist.avatar_url}
                    alt={artist.name || 'Artist'}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                    👤
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-black">
                    {artist.name || artist.username || 'Artist'}
                  </h2>

                  {artist.username && (
                    <p className="truncate text-sm text-gray-500">
                      @{artist.username}
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
            Following
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
