'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '../../lib/supabase';

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
    <main className="min-h-screen bg-black px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-md flex-col">

        {/* Top */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-black tracking-[0.18em]"
          >
            <span className="bg-gradient-to-r from-[#8A2BE2] via-[#4169E1] to-[#FF1493] bg-clip-text text-transparent">
              MOVETI
            </span>
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-gray-400 transition hover:text-white"
          >
            Skip
          </Link>
        </div>

        {/* Welcome */}
        <section className="flex flex-1 flex-col justify-center py-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#8A2BE2] via-[#4169E1] to-[#FF1493] shadow-[0_0_40px_rgba(138,43,226,0.35)]">
              <span className="text-5xl font-black italic text-white">
                M
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight">
              Welcome to MOVETI
            </h1>

            <p className="mt-3 text-sm text-gray-400">
              Create. Connect. Earn.
            </p>
          </div>

          {/* Email login */}
          <div className="rounded-3xl border border-white/10 bg-[#0b0b0f] p-5 shadow-2xl">

            <div className="mb-5">
              <h2 className="text-lg font-bold">Continue with Email</h2>
              <p className="mt-1 text-xs text-gray-500">
                Sign in to your MOVETI account
              </p>
            </div>

            <form onSubmit={login} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-400">
                  Email
                </label>

                <input
                  className="w-full rounded-2xl border border-white/10 bg-[#15151b] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-[#8A2BE2] focus:ring-2 focus:ring-[#8A2BE2]/20"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-400">
                  Password
                </label>

                <input
                  className="w-full rounded-2xl border border-white/10 bg-[#15151b] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-[#8A2BE2] focus:ring-2 focus:ring-[#8A2BE2]/20"
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-[#8A2BE2] via-[#4169E1] to-[#FF1493] px-4 py-3.5 font-bold text-white shadow-lg shadow-purple-900/20 transition active:scale-[0.98]"
              >
                Continue with Email
              </button>
            </form>

            {message && (
              <p className="mt-4 rounded-xl bg-white/5 px-3 py-2 text-center text-sm text-gray-300">
                {message}
              </p>
            )}

            {/* Social providers - visually ready, real providers not yet configured */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-gray-500">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() =>
                  setMessage('Google sign-in will be available when Google authentication is connected.')
                }
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#15151b] px-4 py-3.5 font-semibold text-white transition active:scale-[0.98]"
              >
                <span className="text-lg font-bold">G</span>
                Continue with Google
              </button>

              <button
                type="button"
                onClick={() =>
                  setMessage('Apple sign-in will be available when Apple authentication is connected.')
                }
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#15151b] px-4 py-3.5 font-semibold text-white transition active:scale-[0.98]"
              >
                <span className="text-lg">●</span>
                Continue with Apple
              </button>
            </div>

            <div className="my-6 h-px bg-white/10" />

            <Link
              href="/signup"
              className="block w-full rounded-2xl border border-[#8A2BE2] px-4 py-3.5 text-center font-bold text-white transition active:scale-[0.98]"
            >
              Create an Account
            </Link>

            <p className="mt-5 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <span className="font-semibold text-white">
                Sign In
              </span>
            </p>
          </div>

          <p className="mx-auto mt-6 max-w-xs text-center text-[11px] leading-5 text-gray-600">
            By continuing, you agree to MOVETI&apos;s Terms of Service and
            Privacy Policy.
          </p>
        </section>
      </div>
    </main>
  );
}
