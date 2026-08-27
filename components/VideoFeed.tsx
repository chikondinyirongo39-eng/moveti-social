'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

type Video = {
  id: number;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  user_id: string;
  created_at?: string;
};

export default function VideoFeed() {
  const supabase = createClient();
  const [videos, setVideos] = useState<Video[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [message, setMessage] = useState('');

  async function loadVideos() {
    const { data } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    setVideos(data || []);
  }

  useEffect(() => {
    loadVideos();
  }, []);

  async function uploadVideo() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (!title.trim() || !videoUrl.trim()) {
      setMessage('Enter a title and video URL.');
      return;
    }

    const { error } = await supabase.from('videos').insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim(),
      video_url: videoUrl.trim(),
      thumbnail_url: thumbnailUrl.trim()
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setTitle('');
    setDescription('');
    setVideoUrl('');
    setThumbnailUrl('');
    setMessage('Video uploaded successfully.');
    loadVideos();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-5 pb-10">
      <div className="mx-auto max-w-3xl">

        <div className="rounded-2xl bg-black p-6 text-white">
          <h1 className="text-3xl font-black">🎬 MOVETI Videos</h1>
          <p className="mt-1 text-gray-300">
            Upload and discover creator videos.
          </p>
        </div>

        <div className="mt-5 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Upload Video</h2>

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
              placeholder="Thumbnail URL (optional)"
              className="w-full rounded-xl border p-3"
            />

            <button
              onClick={uploadVideo}
              className="w-full rounded-xl bg-black p-3 font-bold text-white"
            >
              Upload Video
            </button>

            {message && (
              <p className="text-center text-sm text-gray-600">{message}</p>
            )}
          </div>
        </div>

        <section className="mt-6 space-y-5">
          <h2 className="text-2xl font-black">Latest Videos</h2>

          {videos.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center text-gray-500 shadow-sm">
              No videos yet.
            </div>
          ) : (
            videos.map((video) => (
              <article
                key={video.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <video
                  controls
                  poster={video.thumbnail_url || undefined}
                  className="w-full bg-black"
                  src={video.video_url}
                />

                <div className="p-5">
                  <h3 className="text-xl font-bold">{video.title}</h3>

                  {video.description && (
                    <p className="mt-2 text-gray-600">
                      {video.description}
                    </p>
                  )}

                  <p className="mt-3 text-xs text-gray-400">
                    Views will be tracked by MOVETI.
                  </p>
                </div>
              </article>
            ))
          )}
        </section>

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
