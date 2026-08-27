'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

type Video = {
  id: number;
  user_id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  created_at?: string;
};

export default function VideoManager() {
  const supabase = createClient();

  const [userId, setUserId] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  async function loadVideos(id: string) {
    const { data } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false });

    setVideos(data || []);
  }

  useEffect(() => {
    async function start() {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/login';
        return;
      }

      setUserId(user.id);
      await loadVideos(user.id);
      setLoading(false);
    }

    start();
  }, []);

  async function addVideo() {
    if (!title.trim() || !videoUrl.trim()) {
      setMessage('Video title and video URL are required.');
      return;
    }

    setSaving(true);
    setMessage('');

    const { data, error } = await supabase
      .from('videos')
      .insert({
        user_id: userId,
        title: title.trim(),
        description: description.trim() || null,
        video_url: videoUrl.trim(),
        thumbnail_url: thumbnailUrl.trim() || null
      })
      .select('*')
      .single();

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    if (data) {
      setVideos((current) => [data, ...current]);
    }

    setTitle('');
    setDescription('');
    setVideoUrl('');
    setThumbnailUrl('');
    setMessage('Video added successfully.');
    setSaving(false);
  }

  async function deleteVideo(id: number) {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (!error) {
      setVideos((current) =>
        current.filter((video) => video.id !== id)
      );
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-5">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center">
          Loading videos...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-5 pb-10">
      <div className="mx-auto max-w-2xl">

        <div className="rounded-2xl bg-black p-6 text-white">
          <h1 className="text-3xl font-black">🎬 Videos</h1>
          <p className="mt-1 text-gray-300">
            Manage your music videos and content.
          </p>
        </div>

        <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">
            Add a video
          </h2>

          <div className="mt-4 space-y-3">

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Video title"
              className="w-full rounded-xl border p-3"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows={3}
              className="w-full rounded-xl border p-3"
            />

            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Video URL"
              className="w-full rounded-xl border p-3"
            />

            <input
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="Thumbnail image URL (optional)"
              className="w-full rounded-xl border p-3"
            />

            <button
              onClick={addVideo}
              disabled={saving}
              className="w-full rounded-xl bg-black p-3 font-bold text-white disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Add Video'}
            </button>

            {message && (
              <p className="rounded-xl bg-gray-100 p-3 text-center text-sm">
                {message}
              </p>
            )}

          </div>
        </section>

        <section className="mt-5 space-y-4">
          <h2 className="text-xl font-black">
            Your videos
          </h2>

          {videos.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center text-gray-500">
              You have no videos yet.
            </div>
          ) : (
            videos.map((video) => (
              <article
                key={video.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >

                <video
                  controls
                  playsInline
                  poster={video.thumbnail_url || undefined}
                  src={video.video_url}
                  className="aspect-video w-full bg-black"
                />

                <div className="p-4">

                  <h3 className="font-black">
                    {video.title}
                  </h3>

                  {video.description && (
                    <p className="mt-1 text-sm text-gray-500">
                      {video.description}
                    </p>
                  )}

                  <button
                    onClick={() => deleteVideo(video.id)}
                    className="mt-4 w-full rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600"
                  >
                    Delete Video
                  </button>

                </div>

              </article>
            ))
          )}
        </section>

        <div className="mt-6 grid grid-cols-2 gap-3">

          <a
            href="/releases"
            className="rounded-xl bg-white p-4 text-center font-bold shadow-sm"
          >
            🎵 Releases
          </a>

          <a
            href="/"
            className="rounded-xl bg-black p-4 text-center font-bold text-white"
          >
            🏠 Home
          </a>

        </div>

      </div>
    </main>
  );
}
