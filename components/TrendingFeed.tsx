'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

type Post = {
  id: string | number;
  content?: string;
  image_url?: string;
  created_at?: string;
  likes_count?: number;
};

export default function TrendingFeed() {
  const supabase = createClient();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      setPosts(data || []);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-5">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center">
          Loading trending...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-5 pb-10">
      <div className="mx-auto max-w-2xl">

        <div className="rounded-3xl bg-black p-6 text-white">
          <h1 className="text-3xl font-black">
            🔥 Trending
          </h1>
          <p className="mt-1 text-gray-300">
            What's hot on MOVETI right now.
          </p>
        </div>

        <section className="mt-5 space-y-4">

          {posts.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <div className="text-4xl">🔥</div>
              <h2 className="mt-3 font-black">
                Nothing trending yet
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Come back when artists start posting.
              </p>
            </div>
          ) : (
            posts.map((post, index) => (
              <article
                key={post.id}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-black text-white">
                    {index + 1}
                  </div>

                  <div>
                    <p className="text-sm font-black">
                      #{index + 1} Trending
                    </p>

                    {post.created_at && (
                      <p className="text-xs text-gray-400">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {post.content && (
                  <p className="whitespace-pre-wrap leading-6">
                    {post.content}
                  </p>
                )}

                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt="Trending post"
                    className="mt-4 max-h-[500px] w-full rounded-xl object-cover"
                  />
                )}

                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <span>🔥 Trending</span>
                  {typeof post.likes_count === 'number' && (
                    <span>❤️ {post.likes_count}</span>
                  )}
                </div>
              </article>
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
            href="/search"
            className="rounded-xl bg-white p-3 text-center text-sm font-bold shadow-sm"
          >
            🔎 Discover
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
