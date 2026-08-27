'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function FollowersPage() {
  const supabase = createClient();

  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [tab, setTab] = useState<'followers' | 'following'>('followers');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/login';
        return;
      }

      const { data: followerRows } = await supabase
        .from('followers')
        .select('*')
        .eq('following_id', user.id);

      const { data: followingRows } = await supabase
        .from('followers')
        .select('*')
        .eq('follower_id', user.id);

      setFollowers(followerRows || []);
      setFollowing(followingRows || []);
      setLoading(false);
    }

    load();
  }, []);

  const current = tab === 'followers' ? followers : following;

  return (
    <main className="min-h-screen bg-gray-50 p-5">
      <div className="mx-auto max-w-2xl">

        <div className="rounded-2xl bg-black p-6 text-white">
          <h1 className="text-3xl font-black">👥 Connections</h1>
          <p className="mt-1 text-gray-300">
            Manage your followers and following.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-white p-2 shadow-sm">
          <button
            onClick={() => setTab('followers')}
            className={`rounded-lg p-3 font-bold ${
              tab === 'followers'
                ? 'bg-black text-white'
                : 'bg-gray-100'
            }`}
          >
            Followers {followers.length}
          </button>

          <button
            onClick={() => setTab('following')}
            className={`rounded-lg p-3 font-bold ${
              tab === 'following'
                ? 'bg-black text-white'
                : 'bg-gray-100'
            }`}
          >
            Following {following.length}
          </button>
        </div>

        <section className="mt-5 space-y-3">
          {loading ? (
            <div className="rounded-2xl bg-white p-6 text-center text-gray-500">
              Loading...
            </div>
          ) : current.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center text-gray-500">
              No {tab} yet.
            </div>
          ) : (
            current.map((item) => {
              const id =
                tab === 'followers'
                  ? item.follower_id
                  : item.following_id;

              return (
                <a
                  key={item.id}
                  href={`/profiles/${id}`}
                  className="block rounded-2xl bg-white p-5 shadow-sm"
                >
                  <p className="font-bold">
                    View creator profile
                  </p>

                  <p className="mt-1 text-xs text-gray-400 break-all">
                    {id}
                  </p>
                </a>
              );
            })
          )}
        </section>

        <a
          href="/dashboard"
          className="mt-5 block rounded-xl bg-black p-4 text-center font-bold text-white"
        >
          ← Dashboard
        </a>

      </div>
    </main>
  );
}
