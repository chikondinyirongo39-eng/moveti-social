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
  created_at: string;
};

export default function VideoCenter() {
  const supabase = createClient();

  const [videos, setVideos] = useState<Video[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [uploading, setUploading] = useState(false);
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

  async function publishVideo() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (!title.trim() || !videoUrl.trim()) {
      setMessage('Video title and video URL are required.');
      return;
    }

    setUploading(true);
    setMessage('');

    const { error } = await supabase
      .from('videos')
      .insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim(),
        video_url: videoUrl.trim(),
        thumbnail_url: thumbnailUrl.trim()
      });

    if (error) {
      setMessage(error.message);
      setUploading(false);
      return;
    }

    setTitle('');
    setDescription('');
    setVideoUrl('');
    setThumbnailUrl('');

    setMessage('🎬 Video published successfully.');
    await loadVideos();
    setUploading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-5 pb-10">
      <div className="mx-auto max-w-3xl">

        <div className="rounded-2xl bg-black p-6 text-white">
          <h1 className="text-3xl font-black">🎬 MOVETI Videos</h1>
          <p className="mt-1 text-gray-300">
            Share your videos with the MOVETI community.
          </p>
        </div>

        <section className="mt-5 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">Upload Video</h2>

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

            {message && (
              <div className="rounded-xl bg-gray-100 p-3 text-center text-sm">
                {message}
              </div>
            )}

            <button
              onClick={publishVideo}
              disabled={uploading}
              className="w-full rounded-xl bg-black p-4 font-bold text-white disabled:opacity-50"
            >
              {uploading ? 'Publishing...' : '🚀 Publish Video'}
            </button>

          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-2xl font-black">Latest Videos</h2>

          <div className="mt-4 space-y-5">

            {videos.length === 0 ? (
              <div className="rounded-2xl bg-white p-8 text-center text-gray-500">
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
                    playsInline
                    poster={video.thumbnail_url || undefined}
                    className="aspect-video w-full bg-black object-cover"
                    src={video.video_url}
                  />

                  <div className="p-5">
                    <h3 className="text-xl font-black">
                      {video.title}
                    </h3>

                    {video.description && (
                      <p className="mt-2 whitespace-pre-wrap text-gray-600">
                        {video.description}
                      </p>
                    )}

                    <p className="mt-3 text-xs text-gray-400">
                      {new Date(video.created_at).toLocaleString()}
                    </p>
                  </div>
                </article>
              ))
            )}

          </div>
        </section>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <a
            href="/upload"
            className="rounded-xl bg-white p-4 text-center font-bold shadow-sm"
          >
            🎵 Music
          </a>

          <a
            href="/dashboard"
            className="rounded-xl bg-black p-4 text-center font-bold text-white"
          >
            ⚙️ Dashboard
          </a>
        </div>

      </div>
    </main>
  );
}
