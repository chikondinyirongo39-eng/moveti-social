'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function CreatorDashboard() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    releases: 0,
    videos: 0,
    posts: 0,
    likes: 0,
    followers: 0
  });

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/login';
        return;
      }

      const [releases, videos, posts, followers] = await Promise.all([
        supabase
          .from('releases')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),

        supabase
          .from('videos')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),

        supabase
          .from('posts')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),

        supabase
          .from('followers')
          .select('id', { count: 'exact', head: true })
          .eq('following_id', user.id)
      ]);

      const { data: userPosts } = await supabase
        .from('posts')
        .select('id')
        .eq('user_id', user.id);

      let likes = 0;

      if (userPosts && userPosts.length > 0) {
        const postIds = userPosts.map((post) => post.id);

        const { count } = await supabase
          .from('post_likes')
          .select('id', { count: 'exact', head: true })
          .in('post_id', postIds);

        likes = count || 0;
      }

      setStats({
        releases: releases.count || 0,
        videos: videos.count || 0,
        posts: posts.count || 0,
        likes,
        followers: followers.count || 0
      });

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

  const cards = [
    { label: 'Releases', value: stats.releases, icon: '🎵', href: '/releases' },
    { label: 'Videos', value: stats.videos, icon: '🎬', href: '/videos' },
    { label: 'Posts', value: stats.posts, icon: '📝', href: '/' },
    { label: 'Likes', value: stats.likes, icon: '❤️', href: '/' },
    { label: 'Followers', value: stats.followers, icon: '👥', href: '/followers' }
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-5 pb-10">
      <div className="mx-auto max-w-3xl">

        <div className="rounded-2xl bg-black p-6 text-white">
          <h1 className="text-3xl font-black">📊 Creator Dashboard</h1>
          <p className="mt-1 text-gray-300">
            Your MOVETI activity at a glance.
          </p>
        </div>

        <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {cards.map((card) => (
            <a
              key={card.label}
              href={card.href}
              className="rounded-2xl bg-white p-5 shadow-sm"
            >
              <div className="text-3xl">{card.icon}</div>
              <p className="mt-3 text-2xl font-black">
                {card.value}
              </p>
              <p className="text-sm text-gray-500">
                {card.label}
              </p>
            </a>
          ))}
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">Quick Actions</h2>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <a
              href="/upload"
              className="rounded-xl bg-black p-4 text-center font-bold text-white"
            >
              🎵 Upload Music
            </a>

            <a
              href="/videos"
              className="rounded-xl bg-gray-100 p-4 text-center font-bold"
            >
              🎬 Videos
            </a>

            <a
              href="/artist"
              className="rounded-xl bg-gray-100 p-4 text-center font-bold"
            >
              👤 My Profile
            </a>

            <a
              href="/messages"
              className="rounded-xl bg-gray-100 p-4 text-center font-bold"
            >
              💬 Messages
            </a>

            <a
              href="/notifications"
              className="rounded-xl bg-gray-100 p-4 text-center font-bold"
            >
              🔔 Notifications
            </a>

            <a
              href="/search"
              className="rounded-xl bg-gray-100 p-4 text-center font-bold"
            >
              🔎 Search
            </a>
          </div>
        </section>

        <a
          href="/"
          className="mt-5 block rounded-xl bg-black p-4 text-center font-bold text-white"
        >
          ← Back to MOVETI
        </a>

      </div>
    </main>
  );
}
