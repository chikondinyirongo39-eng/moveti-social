'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setMessage('Logging in...');

    const { error } = await createClient().auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = '/dashboard';
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-md pt-16">
        <Link href="/" className="text-3xl font-black">MOVETI</Link>
        <h1 className="mt-10 text-3xl font-bold">Log in</h1>

        <form onSubmit={login} className="mt-6 space-y-4">
          <input
            className="w-full rounded-xl bg-white p-3 text-black"
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            className="w-full rounded-xl bg-white p-3 text-black"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button className="w-full rounded-xl bg-white p-3 font-bold text-black">
            Log in
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-gray-300">{message}</p>}

        <Link href="/signup" className="mt-6 block text-gray-400">
          Don't have an account? Sign up
        </Link>
      </div>
    </main>
  );
}
