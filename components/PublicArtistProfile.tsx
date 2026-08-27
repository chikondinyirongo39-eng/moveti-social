'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import FollowButton from '@/components/FollowButton';

export default function PublicArtistProfile({
  artistId
}: {
  artistId: string;
}) {
  const supabase = createClient();

  const [artist, setArtist] = useState<any>(null);
  const [releases, setReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: profile } = await supabase
        .from('artist_profiles')
        .select('*')
        .eq('id', artistId)
        .maybeSingle();

      const { data: music } = await supabase
        .from('releases')
        .select('*')
        .eq('user_id', artistId)
        .order('created_at', { ascending: false });

      setArtist(profile);
      setReleases(music || []);
      setLoading(false);
    }

    load();
  }, [artistId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-5">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center">
          Loading artist...
        </div>
      </main>
    );
  }

  if (!artist) {
    return (
      <main className="min-h-screen bg-gray-50 p-5">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center">
          <div className="text-4xl">👤</div>
          <h1 className="mt-3 text-xl font-black">
            Artist not found
          </h1>

          <a
            href="/search"
            className="mt-5 block rounded-xl bg-black p-3 font-bold text-white"
          >
            Back to Discover
          </a>
        </div>
      </main>
    );
  }

  const name =
    artist.name ||
    artist.username ||
    'MOVETI Artist';

  return (
    <main className="min-h-screen bg-gray-50 p-5 pb-10">
      <div className="mx-auto max-w-2xl">

        <section className="overflow-hidden rounded-3xl bg-black text-white">

          <div className="flex flex-col items-center p-7 text-center">

            {artist.avatar_url ? (
              <img
                src={artist.avatar_url}
                alt={name}
                className="h-28 w-28 rounded-full object-cover ring-4 ring-white/20"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white text-4xl">
                👤
              </div>
            )}

            <h1 className="mt-4 text-3xl font-black">
              {name}
            </h1>

            {artist.username && (
              <p className="mt-1 text-gray-300">
                @{artist.username}
              </p>
            )}

            {artist.bio && (
              <p className="mt-4 max-w-lg text-sm leading-6 text-gray-300">
                {artist.bio}
              </p>
            )}

            <div className="mt-5 w-full max-w-sm">
              <FollowButton artistId={artistId} />
            </div>

          </div>

        </section>

        <section className="mt-6">

          <h2 className="mb-3 text-xl font-black">
            🎵 Music
          </h2>

          {releases.length === 0 ? (
            <div className="rounded-2xl bg-white p-7 text-center text-gray-500 shadow-sm">
              This artist has no releases yet.
            </div>
          ) : (
            <div className="space-y-3">

              {releases.map((release) => (
                <div
                  key={release.id}
                  className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm"
                >

                  {release.cover_url ? (
                    <img
                      src={release.cover_url}
                      alt={release.title || 'Release'}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                      🎵
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-black">
                      {release.title || 'Untitled Release'}
                    </h3>

                    <p className="truncate text-sm text-gray-500">
                      {release.artist || name}
                    </p>
                  </div>

                  {release.audio_url && (
                    <audio
                      controls
                      preload="none"
                      className="max-w-[150px]"
                      src={release.audio_url}
                    />
                  )}

                </div>
              ))}

            </div>
          )}

        </section>

        <div className="mt-6 grid grid-cols-3 gap-2">

          <a
            href="/search"
            className="rounded-xl bg-white p-3 text-center text-sm font-bold shadow-sm"
          >
            🔎 Discover
          </a>

          <a
            href="/player"
            className="rounded-xl bg-white p-3 text-center text-sm font-bold shadow-sm"
          >
            🎵 Player
          </a>

          <a
            href="/"
            className="rounded-xl bg-black p-3 text-center text-sm font-bold text-white"
          >
            🏠 Home
          </a>

        </div>

      </div>
    </main>
  );
}
