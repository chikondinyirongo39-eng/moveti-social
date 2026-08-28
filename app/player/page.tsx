'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabase';
import MusicPlayer from '@/components/MusicPlayer';

export default function PlayerPage() {
  const supabase = createClient();
  const [tracks, setTracks] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('releases')
        .select('*')
        .order('created_at', { ascending: false });

      setTracks(data || []);
    }

    load();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-5 pb-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-black">🎧 MOVETI Player</h1>
        <p className="mt-1 text-gray-500">Listen to your music.</p>

        <div className="mt-6">
          <MusicPlayer tracks={tracks} />
        </div>

        <a
          href="/releases"
          className="mt-6 block rounded-xl bg-black p-3 text-center font-bold text-white"
        >
          Manage Releases
        </a>

        <a
          href="/"
          className="mt-3 block rounded-xl bg-white p-3 text-center font-medium shadow-sm"
        >
          ← Back to MOVETI
        </a>
      </div>
    </main>
  );
}
