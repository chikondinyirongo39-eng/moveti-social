'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

type Release = {
  id: number;
  user_id: string;
  title: string;
  artist?: string;
  cover_url?: string;
  audio_url?: string;
  created_at?: string;
};

export default function ReleasesManager() {
  const supabase = createClient();

  const [userId, setUserId] = useState('');
  const [releases, setReleases] = useState<Release[]>([]);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function loadReleases(id: string) {
    const { data } = await supabase
      .from('releases')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false });

    setReleases(data || []);
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
      await loadReleases(user.id);
      setLoading(false);
    }

    start();
  }, []);

  async function addRelease() {
    if (!title.trim() || !audioUrl.trim()) {
      setMessage('Title and audio URL are required.');
      return;
    }

    setSaving(true);
    setMessage('');

    const { data, error } = await supabase
      .from('releases')
      .insert({
        user_id: userId,
        title: title.trim(),
        artist: artist.trim() || null,
        cover_url: coverUrl.trim() || null,
        audio_url: audioUrl.trim()
      })
      .select('*')
      .single();

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    if (data) {
      setReleases((current) => [data, ...current]);
    }

    setTitle('');
    setArtist('');
    setCoverUrl('');
    setAudioUrl('');
    setMessage('Release added successfully.');
    setSaving(false);
  }

  async function deleteRelease(id: number) {
    const { error } = await supabase
      .from('releases')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (!error) {
      setReleases((current) =>
        current.filter((release) => release.id !== id)
      );
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-5">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center">
          Loading releases...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-5 pb-10">
      <div className="mx-auto max-w-2xl">

        <div className="rounded-2xl bg-black p-6 text-white">
          <h1 className="text-3xl font-black">🎵 Releases</h1>
          <p className="mt-1 text-gray-300">
            Manage your music releases.
          </p>
        </div>

        <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">
            Add a release
          </h2>

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
              placeholder="Audio file URL"
              className="w-full rounded-xl border p-3"
            />

            <button
              onClick={addRelease}
              disabled={saving}
              className="w-full rounded-xl bg-black p-3 font-bold text-white disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Add Release'}
            </button>

            {message && (
              <p className="rounded-xl bg-gray-100 p-3 text-center text-sm">
                {message}
              </p>
            )}

          </div>
        </section>

        <section className="mt-5 space-y-3">
          <h2 className="text-xl font-black">
            Your releases
          </h2>

          {releases.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center text-gray-500">
              You have no releases yet.
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
                      alt=""
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gray-100 text-3xl">
                      🎵
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-black">
                      {release.title}
                    </h3>

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

                <button
                  onClick={() => deleteRelease(release.id)}
                  className="mt-4 w-full rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600"
                >
                  Delete Release
                </button>
              </article>
            ))
          )}
        </section>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <a
            href="/player"
            className="rounded-xl bg-white p-4 text-center font-bold shadow-sm"
          >
            ▶️ Player
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
