'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function MusicUploader() {
  const supabase = createClient();

  const [userId, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

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
    }

    start();
  }, []);

  async function uploadMusic() {
    if (!title.trim() || !audioFile) {
      setMessage('Add a title and choose an audio file.');
      return;
    }

    setUploading(true);
    setMessage('');

    const audioExt =
      audioFile.name.split('.').pop()?.toLowerCase() || 'mp3';

    const audioPath =
      `${userId}/${Date.now()}-${crypto.randomUUID()}.${audioExt}`;

    const audioUpload = await supabase.storage
      .from('music')
      .upload(audioPath, audioFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (audioUpload.error) {
      setMessage(audioUpload.error.message);
      setUploading(false);
      return;
    }

    const {
      data: audioPublic
    } = supabase.storage
      .from('music')
      .getPublicUrl(audioPath);

    let coverUrl: string | null = null;

    if (coverFile) {
      const coverExt =
        coverFile.name.split('.').pop()?.toLowerCase() || 'jpg';

      const coverPath =
        `${userId}/${Date.now()}-${crypto.randomUUID()}.${coverExt}`;

      const coverUpload = await supabase.storage
        .from('covers')
        .upload(coverPath, coverFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (coverUpload.error) {
        setMessage(coverUpload.error.message);
        setUploading(false);
        return;
      }

      const {
        data: coverPublic
      } = supabase.storage
        .from('covers')
        .getPublicUrl(coverPath);

      coverUrl = coverPublic.publicUrl;
    }

    const { error } = await supabase
      .from('releases')
      .insert({
        user_id: userId,
        title: title.trim(),
        artist: artist.trim() || null,
        audio_url: audioPublic.publicUrl,
        cover_url: coverUrl
      });

    if (error) {
      setMessage(error.message);
      setUploading(false);
      return;
    }

    setTitle('');
    setArtist('');
    setAudioFile(null);
    setCoverFile(null);

    const audioInput = document.getElementById(
      'audio-file'
    ) as HTMLInputElement | null;

    const coverInput = document.getElementById(
      'cover-file'
    ) as HTMLInputElement | null;

    if (audioInput) audioInput.value = '';
    if (coverInput) coverInput.value = '';

    setMessage('Music uploaded successfully.');
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
            Upload your release directly to MOVETI.
          </p>
        </div>

        <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm">

          <div className="space-y-4">

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Song title"
              className="w-full rounded-xl border p-3"
            />

            <input
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Artist name"
              className="w-full rounded-xl border p-3"
            />

            <div>
              <label className="mb-2 block text-sm font-bold">
                Audio file
              </label>

              <input
                id="audio-file"
                type="file"
                accept="audio/*"
                onChange={(e) =>
                  setAudioFile(e.target.files?.[0] || null)
                }
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Cover artwork
              </label>

              <input
                id="cover-file"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setCoverFile(e.target.files?.[0] || null)
                }
                className="w-full rounded-xl border p-3"
              />
            </div>

            <button
              onClick={uploadMusic}
              disabled={uploading}
              className="w-full rounded-xl bg-black p-4 font-bold text-white disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Release'}
            </button>

            {message && (
              <div className="rounded-xl bg-gray-100 p-4 text-center text-sm">
                {message}
              </div>
            )}

          </div>

        </section>

        <div className="mt-5 grid grid-cols-2 gap-3">

          <a
            href="/releases"
            className="rounded-xl bg-white p-4 text-center font-bold shadow-sm"
          >
            🎵 Releases
          </a>

          <a
            href="/dashboard"
            className="rounded-xl bg-black p-4 text-center font-bold text-white"
          >
            📊 Dashboard
          </a>

        </div>

      </div>
    </main>
  );
}
