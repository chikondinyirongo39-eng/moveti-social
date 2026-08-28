'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

type Profile = {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string | null;
};

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfiles() {
      const supabase = createClient();

      const { data } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .order('display_name', { ascending: true });

      setProfiles(data || []);
      setLoading(false);
    }

    loadProfiles();
  }, []);

  return (
    <main className="min-h-screen bg-[#07090d] px-5 py-8 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm text-gray-400">
          ← Home
        </Link>

        <h1 className="mt-6 text-3xl font-black">
          People on MOVETI
        </h1>

        <p className="mt-2 text-gray-400">
          Discover artists and creators.
        </p>

        {loading ? (
          <div className="mt-8 rounded-2xl bg-[#11151d] p-6 text-gray-400">
            Loading profiles...
          </div>
        ) : profiles.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-[#11151d] p-8 text-center text-gray-400">
            No profiles found yet.
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {profiles.map((profile) => (
              <Link
                key={profile.id}
                href={`/profiles/${profile.id}`}
                className="rounded-2xl bg-[#11151d] p-5 transition hover:bg-[#181d27]"
              >
                <div className="flex items-center gap-4">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt=""
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl font-black text-black">
                      {(profile.display_name || profile.username || 'M')
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}

                  <div>
                    <h2 className="font-bold">
                      {profile.display_name || profile.username}
                    </h2>

                    <p className="text-sm text-gray-400">
                      @{profile.username}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
