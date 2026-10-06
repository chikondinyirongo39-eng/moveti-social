'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import FollowButton from '@/components/FollowButton';

type Profile = {
  id: string;
  username?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
};

type Release = {
  id: string;
  title?: string | null;
  artist?: string | null;
  cover_url?: string | null;
  audio_url?: string | null;
  created_at?: string | null;
};

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Music');

  useEffect(() => {
    async function load() {
      const { id } = await params;
      const supabase = createClient();

      const [{ data: userProfile }, { data: music }] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, username, display_name, avatar_url, bio')
          .eq('id', id)
          .maybeSingle(),

        supabase
          .from('releases')
          .select('id, title, artist, cover_url, audio_url, created_at')
          .eq('user_id', id)
          .order('created_at', { ascending: false }),
      ]);

      setProfile(userProfile);
      setReleases(music || []);
      setLoading(false);
    }

    load();
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050507] grid place-items-center text-white">
        <p className="text-white/60">Loading artist...</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#050507] px-5 py-10 text-white">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
          <div className="text-5xl">🎤</div>
          <h1 className="mt-4 text-2xl font-black">Artist not found</h1>
          <p className="mt-2 text-white/50">
            This profile may no longer exist.
          </p>
          <Link
            href="/profiles"
            className="mt-6 inline-block rounded-full bg-gradient-to-r from-[#8A2BE2] to-[#4169E1] px-6 py-3 font-bold"
          >
            Back to Discover
          </Link>
        </div>
      </main>
    );
  }

  const name = profile.display_name || profile.username || 'MOVETI Artist';
  const username = profile.username || 'moveti_artist';

  return (
    <main className="min-h-screen bg-[#050507] pb-28 text-white">
      <div className="mx-auto max-w-3xl">

        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#050507]/90 px-4 py-4 backdrop-blur-xl">
          <Link href="/profiles" className="text-2xl">
            ‹
          </Link>

          <span className="font-black">MOVETI</span>

          <button className="text-2xl text-white/70">
            ⋮
          </button>
        </header>

        <section className="px-5 pt-8">
          <div className="flex flex-col items-center text-center">
            <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-[#8A2BE2]/50 bg-gradient-to-br from-[#8A2BE2] to-[#4169E1] p-[3px]">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#111116] text-4xl font-black">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  name.charAt(0).toUpperCase()
                )}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <h1 className="text-3xl font-black">{name}</h1>
              <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-r from-[#8A2BE2] to-[#4169E1] text-xs font-black">
                ✓
              </span>
            </div>

            <p className="mt-1 text-sm text-white/50">@{username}</p>

            <p className="mt-2 text-sm font-semibold text-[#FF1493]">
              Artist • Malawi
            </p>

            {profile.bio && (
              <p className="mt-4 max-w-lg whitespace-pre-wrap text-sm leading-6 text-white/65">
                {profile.bio}
              </p>
            )}

            <div className="mt-6 flex items-center gap-8 text-sm">
              <div>
                <strong className="block text-lg">—</strong>
                <span className="text-white/45">Followers</span>
              </div>

              <div>
                <strong className="block text-lg">—</strong>
                <span className="text-white/45">Following</span>
              </div>

              <div>
                <strong className="block text-lg">{releases.length}</strong>
                <span className="text-white/45">Releases</span>
              </div>
            </div>

            <div className="mt-6 flex w-full max-w-sm gap-3">
              <div className="flex-1">
                <FollowButton artistId={profile.id} />
              </div>

              <Link
                href="/messages"
                className="flex flex-1 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-bold"
              >
                Message
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-8 flex border-b border-white/10 px-4">
          {['Music', 'Videos', 'Posts', 'About'].map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`flex-1 border-b-2 px-2 py-4 text-sm font-bold ${
                tab === item
                  ? 'border-[#FF1493] text-white'
                  : 'border-transparent text-white/40'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <section className="px-4 pt-6">
          {tab === 'Music' && (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-black">Latest Releases</h2>
                <span className="text-xs text-white/40">
                  {releases.length} tracks
                </span>
              </div>

              {releases.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
                  <div className="text-4xl">🎵</div>
                  <p className="mt-3 font-bold">No releases yet</p>
                  <p className="mt-1 text-sm text-white/40">
                    Music released by this artist will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {releases.map((release) => (
                    <Link
                      key={release.id}
                      href="/player"
                      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#8A2BE2] to-[#4169E1]">
                        {release.cover_url ? (
                          <img
                            src={release.cover_url}
                            alt={release.title || 'Release'}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="grid h-full place-items-center text-2xl">
                            ♪
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-bold">
                          {release.title || 'Untitled Release'}
                        </h3>
                        <p className="truncate text-sm text-white/45">
                          {release.artist || name}
                        </p>
                      </div>

                      <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-r from-[#8A2BE2] to-[#4169E1]">
                        ▶
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'Videos' && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
              <div className="text-4xl">🎬</div>
              <h2 className="mt-3 font-black">Popular Videos</h2>
              <p className="mt-1 text-sm text-white/40">
                Artist videos will appear here as video content is added.
              </p>
            </div>
          )}

          {tab === 'Posts' && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
              <div className="text-4xl">💬</div>
              <h2 className="mt-3 font-black">Artist Posts</h2>
              <p className="mt-1 text-sm text-white/40">
                Posts from this artist will appear here.
              </p>
            </div>
          )}

          {tab === 'About' && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-xl font-black">About {name}</h2>
              <p className="mt-3 whitespace-pre-wrap leading-7 text-white/60">
                {profile.bio || 'This artist has not added a bio yet.'}
              </p>
            </div>
          )}
        </section>

        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#050507]/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-3xl items-center justify-around px-2 py-3">
            <Link href="/feed" className="flex flex-col items-center gap-1 text-xs text-white/45">
              <span className="text-lg">⌂</span>
              Home
            </Link>

            <Link href="/discover" className="flex flex-col items-center gap-1 text-xs text-white/45">
              <span className="text-lg">⌕</span>
              Discover
            </Link>

            <Link
              href="/create"
              className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-r from-[#8A2BE2] to-[#4169E1] text-2xl font-light"
            >
              +
            </Link>

            <Link href="/messages" className="flex flex-col items-center gap-1 text-xs text-white/45">
              <span className="text-lg">✉</span>
              Messages
            </Link>

            <Link href="/profile" className="flex flex-col items-center gap-1 text-xs text-white/45">
              <span className="text-lg">☺</span>
              Profile
            </Link>
          </div>
        </nav>
      </div>
    </main>
  );
}
