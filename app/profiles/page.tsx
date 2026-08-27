'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import FollowButton from '@/components/FollowButton';

export default function ProfilesPage() {
  const supabase = createClient();
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    async function loadProfiles() {
      const { data } = await supabase
        .from('artist_profiles')
        .select('*')
        .order('name', { ascending: true });

      setProfiles(data || []);
    }

    loadProfiles();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-5">
      <div className="mx-auto max-w-3xl">

        <h1 className="text-3xl font-black">Creators</h1>
        <p className="mt-1 text-gray-500">
          Discover artists and follow your favourites.
        </p>

        {profiles.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-white p-6 text-center text-gray-500 shadow-sm">
            No creators yet.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            {profiles.map((profile) => (
              <article
                key={profile.id || profile.user_id}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-4">

                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.name || 'Artist'}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-3xl">
                      🎤
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-xl font-bold">
                      {profile.name || 'Artist'}
                    </h2>

                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                      {profile.bio || 'MOVETI creator'}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <FollowButton artistId={profile.user_id} />
                </div>
              </article>
            ))}

          </div>
        )}

        <div className="mt-6 flex gap-3">
          <a
            href="/dashboard"
            className="flex-1 rounded-xl bg-black p-3 text-center font-bold text-white"
          >
            Dashboard
          </a>

          <a
            href="/"
            className="flex-1 rounded-xl bg-white p-3 text-center font-medium shadow-sm"
          >
            Home
          </a>
        </div>

      </div>
    </main>
  );
}
