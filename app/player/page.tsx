'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabase';
import MusicPlayer from '@/components/MusicPlayer';

type Track = {
  id?: number;
  title?: string;
  artist?: string;
  cover_url?: string;
  audio_url?: string;
};

export default function PlayerPage() {
  const supabase = createClient();
  const [tracks, setTracks] = useState<Track[]>([]);

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

  const current = tracks[0];

  return (
    <main className="min-h-screen bg-[#050507] pb-10 text-white">
      <div className="mx-auto min-h-screen w-full max-w-2xl">

        {/* Header */}
        <header className="flex items-center justify-between px-4 py-5">
          <Link
            href="/music"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-xl"
          >
            ‹
          </Link>

          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
              MOVETI
            </p>
            <h1 className="text-sm font-bold">Now Playing</h1>
          </div>

          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-xl">
            ⋯
          </button>
        </header>

        {/* Album Artwork */}
        <section className="px-6 pt-5">
          <div className="mx-auto aspect-square w-full max-w-[360px] overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#8A2BE2] via-[#4169E1] to-[#FF1493] p-[2px] shadow-2xl shadow-purple-950/40">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[30px] bg-[#100b19]">
              {current?.cover_url ? (
                <img
                  src={current.cover_url}
                  alt={current.title || 'Album artwork'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <div className="text-8xl font-black bg-gradient-to-r from-[#8A2BE2] to-[#FF1493] bg-clip-text text-transparent">
                    M
                  </div>
                  <p className="mt-2 text-xs font-semibold tracking-[0.3em] text-white/30">
                    MOVETI
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Track Info */}
        <section className="px-6 pt-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="truncate text-2xl font-black">
                {current?.title || 'MOVETI Music'}
              </h2>

              <p className="mt-2 truncate text-sm text-white/45">
                {current?.artist || 'MOVETI Artist'}
              </p>
            </div>

            <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg">
              ♡
            </button>
          </div>
        </section>

        {/* Real Player */}
        <section className="px-4 pt-7">
          <MusicPlayer tracks={tracks} />
        </section>

        {/* Player Controls Visual */}
        <section className="px-6 pt-3">
          <div className="flex items-center justify-between text-white/35">
            <button className="text-lg">↶</button>

            <button className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl text-black shadow-xl">
              ▶
            </button>

            <button className="text-lg">↷</button>
          </div>
        </section>

        {/* About Release */}
        <section className="px-4 pt-8">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">About this release</h3>
              <span className="text-white/30">›</span>
            </div>

            <p className="mt-3 text-sm leading-6 text-white/45">
              Listen to music from MOVETI artists and creators.
              Discover more releases and support the artists you love.
            </p>
          </div>
        </section>

        {/* Available On */}
        <section className="px-4 pt-5">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="font-bold">Available on MOVETI</h3>

            <div className="mt-4 flex gap-2">
              <span className="rounded-full bg-white/5 px-4 py-2 text-xs text-white/55">
                MOVETI
              </span>
              <span className="rounded-full bg-white/5 px-4 py-2 text-xs text-white/55">
                Music
              </span>
            </div>
          </div>
        </section>

        {/* Manage Releases */}
        <section className="px-4 pb-8 pt-5">
          <Link
            href="/releases"
            className="block rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center text-sm font-semibold"
          >
            Manage Releases
          </Link>
        </section>
      </div>
    </main>
  );
}
