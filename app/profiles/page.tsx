'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

type ArtistProfile = {
  id: string;
  user_id?: string | null;
  username?: string | null;
  name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
};

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<ArtistProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfiles() {
      const supabase = createClient();

      const { data } = await supabase
        .from('artist_profiles')
        .select('id, user_id, username, name, avatar_url, bio')
        .order('name', { ascending: true });

      setProfiles(data || []);
      setLoading(false);
    }

    loadProfiles();
  }, []);

  return (
    <main className="min-h-screen bg-[#050507] px-5 py-8 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/feed" className="text-sm text-white/45">
          ← Home
        </Link>

        <h1 className="mt-6 text-3xl font-black">
          People on MOVETI
        </h1>

        <p className="mt-2 text-white/45">
          Discover artists and creators.
        </p>

        {loading ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-white/45">
            Loading artists...
          </div>
        ) : profiles.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
            <div className="text-5xl">🎤</div>
            <h2 className="mt-4 text-xl font-black">
              No artists found yet
            </h2>
            <p className="mt-2 text-sm text-white/40">
              Artist profiles will appear here when they are created.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {profiles.map((artist) => {
              const profileId = artist.user_id || artist.id;
              const name = artist.name || artist.username || 'MOVETI Artist';

              return (
                <Link
                  key={artist.id}
                  href={`/profiles/${profileId}`}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition hover:bg-white/[0.08]"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#8A2BE2] to-[#4169E1]">
                      {artist.avatar_url ? (
                        <img
                          src={artist.avatar_url}
                          alt={name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-2xl font-black">
                          {name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate font-bold">
                        {name}
                        <span className="ml-2 inline-grid h-5 w-5 place-items-center rounded-full bg-gradient-to-r from-[#8A2BE2] to-[#4169E1] text-[10px]">
                          ✓
                        </span>
                      </h2>

                      <p className="mt-1 text-sm text-white/40">
                        @{artist.username || 'moveti_artist'}
                      </p>

                      <p className="mt-1 truncate text-xs text-[#FF1493]">
                        Artist • Malawi
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
