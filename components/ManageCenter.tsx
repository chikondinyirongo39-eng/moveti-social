'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function ManageCenter() {
  const supabase = createClient();

  const [userId, setUserId] = useState('');
  const [releases, setReleases] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = '/login';
      return;
    }

    setUserId(user.id);

    const [releaseResult, videoResult, postResult] =
      await Promise.all([
        supabase
          .from('releases')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),

        supabase
          .from('videos')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),

        supabase
          .from('posts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
      ]);

    setReleases(releaseResult.data || []);
    setVideos(videoResult.data || []);
    setPosts(postResult.data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function deleteRelease(id: number) {
    if (!confirm('Delete this release?')) return;

    const { error } = await supabase
      .from('releases')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage('Release deleted.');
    await load();
  }

  async function deleteVideo(id: number) {
    if (!confirm('Delete this video?')) return;

    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage('Video deleted.');
    await load();
  }

  async function deletePost(id: number) {
    if (!confirm('Delete this post?')) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage('Post deleted.');
    await load();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-5">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center">
          Loading management center...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-5 pb-10">
      <div className="mx-auto max-w-3xl">

        <div className="rounded-2xl bg-black p-6 text-white">
          <h1 className="text-3xl font-black">
            🛠️ Manage MOVETI
          </h1>

          <p className="mt-1 text-gray-300">
            Manage your music, videos and posts.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">

          <a
            href="/upload"
            className="rounded-2xl bg-white p-4 text-center font-bold shadow-sm"
          >
            🎵 Upload
          </a>

          <a
            href="/videos"
            className="rounded-2xl bg-white p-4 text-center font-bold shadow-sm"
          >
            🎬 Videos
          </a>

          <a
            href="/artist"
            className="rounded-2xl bg-white p-4 text-center font-bold shadow-sm"
          >
            👤 Profile
          </a>

          <a
            href="/dashboard"
            className="rounded-2xl bg-white p-4 text-center font-bold shadow-sm"
          >
            📊 Stats
          </a>

        </div>

        {message && (
          <div className="mt-5 rounded-xl bg-gray-100 p-4 text-center text-sm">
            {message}
          </div>
        )}

        <section className="mt-6">
          <h2 className="text-2xl font-black">🎵 Releases</h2>

          <div className="mt-3 space-y-3">
            {releases.length === 0 ? (
              <div className="rounded-2xl bg-white p-5 text-gray-500">
                No releases yet.
              </div>
            ) : (
              releases.map((release) => (
                <div
                  key={release.id}
                  className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm"
                >
                  {release.cover_url ? (
                    <img
                      src={release.cover_url}
                      alt={release.title}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-200 text-2xl">
                      🎵
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-bold">
                      {release.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {release.artist || 'Artist'}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteRelease(release.id)}
                    className="rounded-xl bg-red-100 px-3 py-2 text-sm font-bold text-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-2xl font-black">🎬 Videos</h2>

          <div className="mt-3 space-y-3">
            {videos.length === 0 ? (
              <div className="rounded-2xl bg-white p-5 text-gray-500">
                No videos yet.
              </div>
            ) : (
              videos.map((video) => (
                <div
                  key={video.id}
                  className="rounded-2xl bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                      🎬
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold">
                        {video.title}
                      </h3>

                      <p className="text-xs text-gray-500">
                        {video.created_at
                          ? new Date(video.created_at).toLocaleDateString()
                          : ''}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteVideo(video.id)}
                      className="rounded-xl bg-red-100 px-3 py-2 text-sm font-bold text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-2xl font-black">📝 Posts</h2>

          <div className="mt-3 space-y-3">
            {posts.length === 0 ? (
              <div className="rounded-2xl bg-white p-5 text-gray-500">
                No posts yet.
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-2xl bg-white p-5 shadow-sm"
                >
                  <p className="whitespace-pre-wrap">
                    {post.content}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      {post.created_at
                        ? new Date(post.created_at).toLocaleString()
                        : ''}
                    </p>

                    <button
                      onClick={() => deletePost(post.id)}
                      className="rounded-xl bg-red-100 px-3 py-2 text-sm font-bold text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <a
          href="/dashboard"
          className="mt-6 block rounded-xl bg-black p-4 text-center font-bold text-white"
        >
          ← Creator Dashboard
        </a>

      </div>
    </main>
  );
}
