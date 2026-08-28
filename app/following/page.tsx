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

export default function FollowingPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFollowing() {
      const supabase = createClient();

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/login';
        return;
      }

      const { data } = await supabase
        .from('follows')
        .select(`
          following_id,
          profiles:following_id (
            id,
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('follower_id', user.id);

      const result = (data || [])
        .map((item: any) => item.profiles)
        .filter(Boolean);

      setProfiles(result);
      setLoading(false);
    }

    loadFollowing();
  }, []);

  return (
    <main className="min-h-screen bg-[#07090d] px-5 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-gray-400">
          ← Home
        </Link>

        <h1 className="mt-6 text-3xl font-black">Following</h1>

        {loading ? (
          <p className="mt-8 text-gray-400">Loading following...</p>
        ) : profiles.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-[#11151d] p-8 text-center text-gray-400">
            You are not following anyone yet.
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {profiles.map((profile) => (
              <Link
                key={profile.id}
                href={`/profiles/${profile.id}`}
                className="flex items-center gap-4 rounded-2xl bg-[#11151d] p-4"
              >
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white font-black text-black">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    (profile.display_name || profile.username || 'M')
                      .charAt(0)
                      .toUpperCase()
                  )}
                </div>

                <div>
                  <p className="font-bold">
                    {profile.display_name || profile.username}
                  </p>
                  <p className="text-sm text-gray-400">
                    @{profile.username}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
