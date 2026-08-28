'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase';

type Profile = {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string | null;
};

export default function SearchCenter() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  async function search() {
    const value = query.trim();

    if (!value) {
      setResults([]);
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { data } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .or(`username.ilike.%${value}%,display_name.ilike.%${value}%`)
      .limit(30);

    setResults(data || []);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#07090d] px-5 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-gray-400">
          ← Home
        </Link>

        <h1 className="mt-6 text-3xl font-black">Search MOVETI</h1>

        <div className="mt-6 flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') search();
            }}
            placeholder="Search artists and creators..."
            className="min-w-0 flex-1 rounded-xl border border-gray-700 bg-[#11151d] p-4 text-white outline-none"
          />

          <button
            onClick={search}
            className="rounded-xl bg-white px-5 font-bold text-black"
          >
            Search
          </button>
        </div>

        <div className="mt-8 space-y-3">
          {loading ? (
            <p className="text-gray-400">Searching...</p>
          ) : query.trim() && results.length === 0 ? (
            <div className="rounded-2xl bg-[#11151d] p-6 text-center text-gray-400">
              No results found.
            </div>
          ) : (
            results.map((profile) => (
              <Link
                key={profile.id}
                href={`/profiles/${profile.id}`}
                className="flex items-center gap-4 rounded-2xl bg-[#11151d] p-4"
              >
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt=""
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl font-black text-black">
                    {(profile.display_name || profile.username || 'M')
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <div>
                  <p className="font-bold">
                    {profile.display_name || profile.username}
                  </p>
                  <p className="text-sm text-gray-400">
                    @{profile.username}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
