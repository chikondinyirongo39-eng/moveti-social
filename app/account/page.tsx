'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function AccountPage() {
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAccount() {
      const supabase = createClient();

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email || '');
        setUserId(user.id);
      }

      setLoading(false);
    }

    loadAccount();
  }, []);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07090d] p-6 text-white">
        Loading account...
      </main>
    );
  }

  if (!userId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07090d] p-6 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-black">MOVETI</h1>
          <p className="mt-2 text-gray-400">
            You are not logged in.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-block rounded-full bg-white px-6 py-3 font-bold text-black"
          >
            Log in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07090d] p-6 text-white">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-gray-400">
          ← Home
        </Link>

        <div className="mt-8 rounded-3xl bg-[#11151d] p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl font-black text-black">
            {(email || 'M').charAt(0).toUpperCase()}
          </div>

          <h1 className="mt-5 text-3xl font-black">
            My Account
          </h1>

          <p className="mt-2 text-gray-400">
            {email}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href="/profiles"
              className="rounded-2xl bg-[#181d27] p-4 font-bold"
            >
              👤 People
            </Link>

            <Link
              href="/following"
              className="rounded-2xl bg-[#181d27] p-4 font-bold"
            >
              ➕ Following
            </Link>

            <Link
              href="/followers"
              className="rounded-2xl bg-[#181d27] p-4 font-bold"
            >
              👥 Followers
            </Link>

            <Link
              href="/settings"
              className="rounded-2xl bg-[#181d27] p-4 font-bold"
            >
              ⚙️ Settings
            </Link>
          </div>

          <button
            onClick={logout}
            className="mt-6 w-full rounded-2xl bg-white p-4 font-bold text-black"
          >
            Log out
          </button>
        </div>
      </div>
    </main>
  );
}
