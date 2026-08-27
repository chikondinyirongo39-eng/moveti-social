'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

type Release = {
  id: string | number;
  title?: string;
  artist?: string;
  cover_url?: string;
  audio_url?: string;
  status?: string;
  created_at?: string;
};

export default function ReleaseManager() {
  const supabase = createClient();

  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = '/login';
      return;
    }

    const { data } = await supabase
      .from('releases')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setReleases(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function deleteRelease(id: string | number) {
    const confirmed = window.confirm(
      'Delete this release? This cannot be undone.'
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from('releases')
      .delete()
      .eq('id', id);

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

        <div className="rounded-3xl bg-black p-6 text-white">
          <h1 className="text-3xl font-black">
            🎵 My Releases
          </h1>

          <p className="mt-1 text-gray-300">
            Manage your music releases.
          </p>
        </div>

        <a
          href="/new-release"
          className="mt-5 block rounded-2xl bg-black p-4 text-center font-black text-white shadow-sm"
        >
          ＋ Create New Release
        </a>

        <section className="mt-5 space-y-3">

          {releases.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <div className="text-4xl">🎵</div>

              <h2 className="mt-3 font-black">
                No releases yet
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Create your first release to get started.
              </p>
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
                      alt={release.title || 'Release'}
                      className="h-20 w-20 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-3xl">
                      🎵
                    </div>
                  )}

                  <div className="min-w-0 flex-1">

                    <h2 className="truncate text-lg font-black">
                      {release.title || 'Untitled Release'}
                    </h2>

                    <p className="truncate text-sm text-gray-500">
                      {release.artist || 'Unknown artist'}
                    </p>

                    <div className="mt-2 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-bold">
                      {release.status || 'Published'}
                    </div>

                  </div>

                </div>

                {release.audio_url && (
                  <audio
                    controls
                    preload="none"
                    className="mt-4 w-full"
                    src={release.audio_url}
                  />
                )}

                <div className="mt-4 flex gap-2">

                  <a
                    href={`/player`}
                    className="flex-1 rounded-xl bg-gray-100 p-3 text-center text-sm font-bold"
                  >
                    ▶ Play
                  </a>

                  <button
                    onClick={() => deleteRelease(release.id)}
                    className="rounded-xl bg-red-50 px-4 p-3 text-sm font-bold text-red-600"
                  >
                    Delete
                  </button>

                </div>

              </article>
            ))
          )}

        </section>

        <div className="mt-6 grid grid-cols-3 gap-2">

          <a
            href="/dashboard"
            className="rounded-xl bg-black p-3 text-center text-sm font-bold text-white"
          >
            📊 Dashboard
          </a>

          <a
            href="/player"
            className="rounded-xl bg-white p-3 text-center text-sm font-bold shadow-sm"
          >
            🎧 Player
          </a>

          <a
            href="/"
            className="rounded-xl bg-white p-3 text-center text-sm font-bold shadow-sm"
          >
            🏠 Home
          </a>

        </div>

      </div>
    </main>
  );
}
