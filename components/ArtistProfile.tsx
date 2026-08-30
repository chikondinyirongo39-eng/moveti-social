'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function ArtistProfile() {
  const supabase = createClient();

  const [profileId, setProfileId] = useState('');
  const [artistName, setArtistName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadProfile() {
      const { data, error } = await supabase
        .from('artist_profiles')
        .select('id, artist_name, bio, avatar_url')
        .limit(1)
        .maybeSingle();

      if (error) {
        setMessage(error.message);
        return;
      }

      if (data) {
        setProfileId(data.id);
        setArtistName(data.artist_name || '');
        setBio(data.bio || '');
        setAvatarUrl(data.avatar_url || '');
      }
    }

    loadProfile();
  }, []);

  async function saveProfile() {
    setMessage('');

    const values = {
      artist_name: artistName,
      bio,
      avatar_url: avatarUrl
    };

    const result = profileId
      ? await supabase
          .from('artist_profiles')
          .update(values)
          .eq('id', profileId)
      : await supabase
          .from('artist_profiles')
          .insert(values);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    setMessage('Profile saved successfully');
  }

  return (
    <main className="min-h-screen bg-gray-50 p-5">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-black">Artist Profile</h1>

        <p className="mt-1 text-gray-500">
          Manage your MOVETI artist profile.
        </p>

        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={artistName || 'Artist'}
            className="mx-auto mt-6 h-28 w-28 rounded-full object-cover"
          />
        ) : (
          <div className="mx-auto mt-6 flex h-28 w-28 items-center justify-center rounded-full bg-gray-200 text-4xl">
            🎤
          </div>
        )}

        <div className="mt-6 space-y-4">
          <input
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            placeholder="Artist name"
            className="w-full rounded-xl border p-3 outline-none"
          />

          <input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="Profile picture URL"
            className="w-full rounded-xl border p-3 outline-none"
          />

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Artist bio"
            rows={5}
            className="w-full rounded-xl border p-3 outline-none"
          />

          <button
            onClick={saveProfile}
            className="w-full rounded-xl bg-black p-3 font-bold text-white"
          >
            Save Profile
          </button>

          {message && (
            <p className="text-center text-sm text-gray-500">
              {message}
            </p>
          )}
        </div>

        <a
          href="/"
          className="mt-5 block text-center font-medium"
        >
          Back to MOVETI
        </a>
      </div>
    </main>
  );
}
