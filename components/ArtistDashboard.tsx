'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function ArtistDashboard() {
  const supabase = createClient();

  const [userId, setUserId] = useState('');
  const [artistName, setArtistName] = useState('Artist');
  const [releases, setReleases] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
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

      setUserId(user.id);

      const [
        profileResult,
        releasesResult,
        followersResult,
        followingResult
      ] = await Promise.all([
        supabase
          .from('artist_profiles')
          .select('name,username')
          .eq('id', user.id)
          .maybeSingle(),

        supabase
          .from('releases')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),

        supabase
          .from('followers')
          .select('id', { count: 'exact', head: true })
          .eq('following_id', user.id),

        supabase
          .from('followers')
          .select('id', { count: 'exact', head: true })
          .eq('follower_id', user.id)
      ]);

      const profile = profileResult.data;

      setArtistName(
        profile?.name ||
        profile?.username ||
        user.email?.split('@')[0] ||
        'Artist'
      );

      setReleases(releasesResult.count || 0);
      setFollowers(followersResult.count || 0);
      setFollowing(followingResult.count || 0);

      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-5">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center">
          Loading dashboard...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-5 pb-10">
      <div className="mx-auto max-w-3xl">

        <section className="rounded-3xl bg-black p-7 text-white">

          <p className="text-sm text-gray-300">
            Welcome back
          </p>

          <h1 className="mt-1 text-3xl font-black">
            {artistName}
          </h1>

          <p className="mt-2 text-gray-300">
            Your MOVETI artist dashboard.
          </p>

        </section>

        <section className="mt-5 grid grid-cols-3 gap-3">

          <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
            <div className="text-2xl font-black">
              {releases}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Releases
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
            <div className="text-2xl font-black">
              {followers}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Followers
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
            <div className="text-2xl font-black">
              {following}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Following
            </p>
          </div>

        </section>

        <section className="mt-5">

          <h2 className="mb-3 text-xl font-black">
            Quick Actions
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">

            <a
              href="/new-release"
              className="rounded-2xl bg-black p-5 font-black text-white shadow-sm"
            >
              🎵
              <span className="ml-2">
                New Release
              </span>
            </a>

            <a
              href="/manage"
              className="rounded-2xl bg-white p-5 font-black shadow-sm"
            >
              📁
              <span className="ml-2">
                Manage Releases
              </span>
            </a>

            <a
              href={`/profiles/${userId}`}
              className="rounded-2xl bg-white p-5 font-black shadow-sm"
            >
              👤
              <span className="ml-2">
                View My Profile
              </span>
            </a>

            <a
              href="/artist"
              className="rounded-2xl bg-white p-5 font-black shadow-sm"
            >
              ✏️
              <span className="ml-2">
                Edit Artist Profile
              </span>
            </a>

            <a
              href="/followers"
              className="rounded-2xl bg-white p-5 font-black shadow-sm"
            >
              👥
              <span className="ml-2">
                My Followers
              </span>
            </a>

            <a
              href="/following"
              className="rounded-2xl bg-white p-5 font-black shadow-sm"
            >
              ➕
              <span className="ml-2">
                Following
              </span>
            </a>

          </div>

        </section>

        <div className="mt-6 grid grid-cols-3 gap-2">

          <a
            href="/"
            className="rounded-xl bg-white p-3 text-center text-sm font-bold shadow-sm"
          >
            🏠 Home
          </a>

          <a
            href="/messages"
            className="rounded-xl bg-white p-3 text-center text-sm font-bold shadow-sm"
          >
            💬 Messages
          </a>

          <a
            href="/notifications"
            className="rounded-xl bg-black p-3 text-center text-sm font-bold text-white"
          >
            🔔 Alerts
          </a>

        </div>

      </div>
    </main>
  );
}
