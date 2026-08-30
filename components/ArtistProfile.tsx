'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function ProfileSettings() {
  const supabase = createClient();

  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function load() {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/login';
        return;
      }

      setUserId(user.id);

      const { data } = await supabase
        .from('artist_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (data) {
        setName(data.name || '');
        setUsername(data.username || '');
        setBio(data.bio || '');
        setAvatarUrl(data.avatar_url || '');
      }
    }

    load();
  }, []);

  async function saveProfile() {
    setSaving(true);
    setMessage('');

    let finalAvatarUrl = avatarUrl;

    if (avatarFile) {
      const ext =
        avatarFile.name.split('.').pop()?.toLowerCase() || 'jpg';

      const path =
        `${userId}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

      const upload = await supabase.storage
        .from('avatars')
        .upload(path, avatarFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (upload.error) {
        setMessage(upload.error.message);
        setSaving(false);
        return;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(path);

      finalAvatarUrl = data.publicUrl;
      setAvatarUrl(finalAvatarUrl);
    }

    const { error } = await supabase
      .from('artist_profiles')
      .upsert({
        id: userId,
        name: name.trim() || null,
        username: username.trim() || null,
        bio: bio.trim() || null,
        avatar_url: finalAvatarUrl || null
      });

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setAvatarFile(null);
    setMessage('Profile saved successfully.');
    setSaving(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-5 pb-10">
      <div className="mx-auto max-w-2xl">

        <div className="rounded-3xl bg-black p-6 text-white">
          <h1 className="text-3xl font-black">
            👤 Profile Settings
          </h1>
          <p className="mt-1 text-gray-300">
            Customize your MOVETI artist profile.
          </p>
        </div>

        <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm">

          <div className="space-y-4">

            {avatarUrl ? (
              <div className="flex justify-center">
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="h-28 w-28 rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gray-100 text-4xl">
                  👤
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-bold">
                Profile photo
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setAvatarFile(e.target.files?.[0] || null)
                }
                className="w-full rounded-xl border p-3"
              />
            </div>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Artist name"
              className="w-full rounded-xl border p-3"
            />

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full rounded-xl border p-3"
            />

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell people about yourself..."
              rows={5}
              className="w-full rounded-xl border p-3"
            />

            <button
              onClick={saveProfile}
              disabled={saving}
              className="w-full rounded-xl bg-black p-4 font-bold text-white disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Profile'}
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
            href="/dashboard"
            className="rounded-xl bg-white p-4 text-center font-bold shadow-sm"
          >
            📊 Dashboard
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
