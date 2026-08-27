'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function UploadCenter() {
  const supabase = createClient();

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [audio, setAudio] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  async function upload() {
    if (!title.trim() || !audio) {
      setMessage('Please enter a title and choose an audio file.');
      return;
    }

    setUploading(true);
    setMessage('');

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = '/login';
      return;
    }

    const audioPath = `${user.id}/${Date.now()}-${audio.name}`;

    const { error: audioError } = await supabase.storage
      .from('music')
      .upload(audioPath, audio);

    if (audioError) {
      setMessage(`Audio upload failed: ${audioError.message}`);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl: audioUrl }
    } = supabase.storage
      .from('music')
      .getPublicUrl(audioPath);

    let coverUrl = '';

    if (cover) {
      const coverPath = `${user.id}/${Date.now()}-${cover.name}`;

      const { error: coverError } = await supabase.storage
        .from('covers')
        .upload(coverPath, cover);

      if (!coverError) {
        const {
          data: { publicUrl }
        } = supabase.storage
          .from('covers')
          .getPublicUrl(coverPath);

        coverUrl = publicUrl;
      }
    }

    const { error } = await supabase
      .from('releases')
      .insert({
        user_id: user.id,
        title: title.trim(),
        artist: artist.trim() || 'Unknown Artist',
        audio_url: audioUrl,
        cover_url: coverUrl,
        status: 'Published'
      });

    if (error) {
      setMessage(`Release creation failed: ${error.message}`);
    } else {
      setTitle('');
      setArtist('');
      setAudio(null);
      setCover(null);
      setMessage('Release uploaded successfully! 🎉');
    }

    setUploading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-5 pb-10">
      <div className="mx-auto max-w-2xl">

        <div className="rounded-3xl bg-black p-6 text-white">
          <h1 className="text-3xl font-black">
            🎵 Upload Music
          </h1>

          <p className="mt-1 text-gray-300">
            Upload your next release to MOVETI.
          </p>
        </div>

        <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm">

          <label className="mb-2 block text-sm font-bold">
            Song title
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter song title"
            className="mb-4 w-full rounded-xl border p-3"
          />

          <label className="mb-2 block text-sm font-bold">
            Artist name
          </label>

          <input
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Artist name"
            className="mb-4 w-full rounded-xl border p-3"
          />

          <label className="mb-2 block text-sm font-bold">
            Audio file
          </label>

          <input
            type="file"
            accept="audio/*"
            onChange={(e) =>
              setAudio(e.target.files?.[0] || null)
            }
            className="mb-4 w-full rounded-xl border p-3"
          />

          <label className="mb-2 block text-sm font-bold">
            Cover artwork
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setCover(e.target.files?.[0] || null)
            }
            className="w-full rounded-xl border p-3"
          />

          <button
            onClick={upload}
            disabled={uploading}
            className="mt-5 w-full rounded-xl bg-black p-4 font-black text-white disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : '⬆️ Upload Release'}
          </button>

          {message && (
            <p className="mt-4 rounded-xl bg-gray-100 p-3 text-sm font-medium">
              {message}
            </p>
          )}

        </section>

        <div className="mt-5 grid grid-cols-3 gap-2">

          <a
            href="/dashboard"
            className="rounded-xl bg-black p-3 text-center text-sm font-bold text-white"
          >
            📊 Dashboard
          </a>

          <a
            href="/manage"
            className="rounded-xl bg-white p-3 text-center text-sm font-bold shadow-sm"
          >
            📁 Releases
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
