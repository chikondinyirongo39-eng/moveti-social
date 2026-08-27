'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

type Release = {
  id: number;
  title: string;
  artist?: string;
  cover_url?: string;
  audio_url?: string;
  created_at?: string;
};

export default function Releases() {
  const supabase = createClient();
  const [releases, setReleases] = useState<Release[]>([]);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [message, setMessage] = useState('');

  async function loadReleases() {
    const { data } = await supabase
      .from('releases')
      .select('*')
      .order('created_at', { ascending: false });

    setReleases(data || []);
  }

  useEffect(() => {
    loadReleases();
  }, []);

  async function addRelease() {
    setMessage('');

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (!title.trim()) {
      setMessage('Enter a release title.');
      return;
    }

    const { error } = await supabase.from('releases').insert({
      user_id: user.id,
      title: title.trim(),
      artist: artist.trim(),
      cover_url: coverUrl.trim(),
      audio_url: audioUrl.trim()
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setTitle('');
    setArtist('');
    setCoverUrl('');
    setAudioUrl('');
    setMessage('Release added successfully.');
    loadReleases();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-5">
      <div className="mx-auto max-w-2xl space-y-5">

        <div className="rounded-2xl bg-black p-6 text-white">
          <h1 className="text-3xl font-black">🎵 My Music</h1>
          <p className="mt-1 text-gray-300">
            Manage your MOVETI releases.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Add Release</h2>

          <div className="mt-4 space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Song / release title"
              className="w-full rounded-xl border p-3"
            />

            <input
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Artist name"
              className="w-full rounded-xl border p-3"
            />

            <input
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="Cover image URL"
              className="w-full rounded-xl border p-3"
            />

            <input
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              placeholder="Audio URL"
              className="w-full rounded-xl border p-3"
            />

            <button
              onClick={addRelease}
              className="w-full rounded-xl bg-black p-3 font-bold text-white"
            >
              Add Release
            </button>

            {message && (
              <p className="text-center text-sm text-gray-600">{message}</p>
            )}
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">Your Releases</h2>

          {releases.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-gray-500 shadow-sm">
              No releases yet.
            </div>
          ) : (
            releases.map((release) => (
              <article
                key={release.id}
                className="rounded-2xl bg-white p-4 shadow-sm"
              >
                <div className="flex gap-4">
                  {release.cover_url ? (
                    <img
                      src={release.cover_url}
                      alt={release.title}
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gray-200 text-2xl">
                      🎵
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold">{release.title}</h3>
                    <p className="text-sm text-gray-500">
                      {release.artist || 'Artist'}
                    </p>

                    {release.audio_url && (
                      <audio
                        controls
                        src={release.audio_url}
                        className="mt-3 w-full"
                      />
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </section>

        <div className="flex gap-3">
          <a
            href="/artist"
            className="flex-1 rounded-xl bg-white p-3 text-center font-medium shadow-sm"
          >
            Artist Profile
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
