'use client';

import { useEffect, useRef, useState } from 'react';

type Track = {
  id?: number;
  title: string;
  artist?: string;
  cover_url?: string;
  audio_url?: string;
};

export default function MusicPlayer({
  tracks = [],
  title,
  artist,
  audioUrl,
  coverUrl
}: {
  tracks?: Track[];
  title?: string;
  artist?: string;
  audioUrl?: string;
  coverUrl?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const track = tracks[0] || {
    title: title || 'MOVETI Music',
    artist: artist || 'Artist',
    audio_url: audioUrl,
    cover_url: coverUrl
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
    setPlaying(false);
    setProgress(0);
  }, [track.audio_url]);

  async function togglePlay() {
    if (!audioRef.current || !track.audio_url) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      await audioRef.current.play();
    }
  }

  function updateProgress() {
    const audio = audioRef.current;
    if (audio?.duration) {
      setProgress((audio.currentTime / audio.duration) * 100);
    }
  }

  function seek(value: number) {
    const audio = audioRef.current;
    if (audio?.duration) {
      audio.currentTime = (value / 100) * audio.duration;
      setProgress(value);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        {track.cover_url ? (
          <img
            src={track.cover_url}
            alt={track.title}
            className="h-20 w-20 rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gray-200 text-3xl">
            🎵
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-bold">{track.title}</h2>
          <p className="truncate text-sm text-gray-500">
            {track.artist || 'Artist'}
          </p>
        </div>

        <button
          onClick={togglePlay}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black text-white"
        >
          {playing ? '⏸' : '▶'}
        </button>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={(e) => seek(Number(e.target.value))}
        className="mt-4 w-full"
      />

      {!track.audio_url && (
        <p className="mt-2 text-center text-sm text-gray-500">
          Add an audio URL to play this release.
        </p>
      )}

      <audio
        ref={audioRef}
        src={track.audio_url || undefined}
        onTimeUpdate={updateProgress}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
    </div>
  );
}
