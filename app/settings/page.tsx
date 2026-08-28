'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function SettingsPage() {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/login';
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('username, display_name, bio')
        .eq('id', user.id)
        .maybeSingle();

      if (data) {
        setUsername(data.username || '');
        setDisplayName(data.display_name || '');
        setBio(data.bio || '');
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  async function saveProfile() {
    setSaving(true);
    setMessage('');

    const supabase = createClient();

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = '/login';
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username: username.trim(),
        display_name: displayName.trim(),
        bio: bio.trim()
      });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Profile saved successfully.');
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07090d] p-6 text-white">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07090d] px-5 py-8 text-white">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm text-gray-400">
          ← Home
        </Link>

        <div className="mt-6 rounded-3xl bg-[#11151d] p-6">
          <h1 className="text-3xl font-black">Profile Settings</h1>

          <p className="mt-2 text-gray-400">
            Update your MOVETI profile.
          </p>

          <label className="mt-6 block text-sm text-gray-400">
            Username
          </label>

          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            className="mt-2 w-full rounded-xl border border-gray-700 bg-[#181d27] p-4 text-white outline-none"
          />

          <label className="mt-5 block text-sm text-gray-400">
            Display name
          </label>

          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            className="mt-2 w-full rounded-xl border border-gray-700 bg-[#181d27] p-4 text-white outline-none"
          />

          <label className="mt-5 block text-sm text-gray-400">
            Bio
          </label>

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell people about yourself..."
            rows={5}
            className="mt-2 w-full resize-none rounded-xl border border-gray-700 bg-[#181d27] p-4 text-white outline-none"
          />

          <button
            onClick={saveProfile}
            disabled={saving}
            className="mt-6 w-full rounded-2xl bg-white p-4 font-bold text-black disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>

          {message && (
            <div className="mt-4 rounded-xl bg-[#181d27] p-4 text-sm text-gray-300">
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
