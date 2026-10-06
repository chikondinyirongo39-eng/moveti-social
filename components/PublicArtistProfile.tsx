'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import FollowButton from '@/components/FollowButton';

export default function PublicArtistProfile({
  artistId
}: {
  artistId: string;
}) {
  const supabase = createClient();

  const [artist, setArtist] = useState<any>(null);
  const [releases, setReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Music');

  useEffect(() => {
    async function load() {
      const { data: profile } = await supabase
        .from('artist_profiles')
        .select('*')
        .eq('id', artistId)
        .maybeSingle();

      const { data: music } = await supabase
        .from('releases')
        .select('*')
        .eq('user_id', artistId)
        .order('created_at', { ascending: false });

      setArtist(profile);
      setReleases(music || []);
      setLoading(false);
    }

    load();
  }, [artistId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050507] px-4 py-8 text-white">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-full bg-gradient-to-r from-[#8A2BE2] to-[#4169E1]" />
          <p className="text-white/60">Loading artist...</p>
        </div>
      </main>
    );
  }

  if (!artist) {
    return (
      <main className="min-h-screen bg-[#050507] px-4 py-8 text-white">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
          <div className="text-5xl">🎤</div>
          <h1 className="mt-4 text-2xl font-black">Artist not found</h1>
          <a
            href="/search"
            className="mx-auto mt-6 block max-w-xs rounded-2xl bg-gradient-to-r from-[#8A2BE2] to-[#4169E1] p-3 font-bold"
          >
            Back to Discover
          </a>
        </div>
      </main>
    );
  }

  const name = artist.name || artist.username || 'MOVETI Artist';
  const username = artist.username ? `@${artist.username}` : '@moveti_artist';

  return (
    <main className="min-h-screen bg-[#050507] pb-28 text-white">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#050507]/90 px-4 py-4 backdrop-blur-xl">
          <a
            href="/music"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-xl"
          >
            ‹
          </a>

          <div className="text-lg font-black tracking-tight">Artist</div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-lg"
          >
            •••
          </button>
        </header>

        {/* Profile hero */}
        <section className="relative overflow-hidden px-5 pb-7 pt-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-[#8A2BE2]/20 via-[#4169E1]/5 to-transparent" />

          <div className="relative flex flex-col items-center text-center">

            {artist.avatar_url ? (
              <img
                src={artist.avatar_url}
                alt={name}
                className="h-32 w-32 rounded-full object-cover ring-4 ring-[#8A2BE2]/40 shadow-2xl"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#8A2BE2] to-[#4169E1] text-5xl shadow-2xl">
                👤
              </div>
            )}

            <div className="mt-5 flex items-center gap-2">
              <h1 className="text-3xl font-black">{name}</h1>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-[#8A2BE2] to-[#4169E1] text-xs font-black">
                ✓
              </span>
            </div>

            <p className="mt-1 text-sm text-white/45">{username}</p>
            <p className="mt-2 text-sm font-medium text-[#FF1493]">
              Artist • Malawi
            </p>

            {artist.bio && (
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/65">
                {artist.bio}
              </p>
            )}

            {/* Real release count; don't invent follower numbers */}
            <div className="mt-5 flex items-center gap-7 text-center">
              <div>
                <div className="text-lg font-black">{releases.length}</div>
                <div className="text-xs text-white/40">Releases</div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <div className="text-lg font-black">Artist</div>
                <div className="text-xs text-white/40">MOVETI</div>
              </div>
            </div>

            <div className="mt-6 flex w-full max-w-md gap-3">
              <div className="flex-1 [&>button]:w-full [&>button]:rounded-2xl [&>button]:!border-0 [&>button]:!bg-gradient-to-r [&>button]:!from-[#8A2BE2] [&>button]:!to-[#4169E1] [&>button]:!p-3 [&>button]:!font-bold">
                <FollowButton artistId={artistId} />
              </div>

              <a
                href="/messages"
                className="flex flex-1 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] p-3 font-bold"
              >
                Message
              </a>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="sticky top-[73px] z-20 border-b border-white/10 bg-[#050507]/95 px-4 backdrop-blur-xl">
          <div className="flex">
            {['Music', 'Videos', 'Posts', 'About'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={`flex-1 border-b-2 px-2 py-4 text-sm font-bold transition ${
                  tab === item
                    ? 'border-[#FF1493] text-white'
                    : 'border-transparent text-white/35'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Music */}
        {tab === 'Music' && (
          <section className="px-4 py-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black">Latest Releases</h2>
              <span className="text-xs text-white/35">{releases.length} total</span>
            </div>

            {releases.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
                <div className="text-4xl">🎵</div>
                <p className="mt-3 font-bold">No releases yet</p>
                <p className="mt-1 text-sm text-white/40">
                  This artist hasn't released music on MOVETI yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {releases.map((release) => (
                  <div
                    key={release.id}
                    className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-3"
                  >
                    {release.cover_url ? (
                      <img
                        src={release.cover_url}
                        alt={release.title || 'Release'}
                        className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8A2BE2] to-[#4169E1] text-3xl">
                        ♫
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-black">
                        {release.title || 'Untitled Release'}
                      </h3>

                      <p className="mt-1 truncate text-sm text-white/45">
                        {release.artist || name}
                      </p>

                      {release.created_at && (
                        <p className="mt-1 text-xs text-white/25">
                          {new Date(release.created_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {release.audio_url ? (
                      <audio
                        controls
                        preload="none"
                        className="w-28 max-w-[30vw]"
                        src={release.audio_url}
                      />
                    ) : (
                      <a
                        href="/player"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#8A2BE2] to-[#4169E1] font-bold"
                      >
                        ▶
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            {releases.length > 0 && (
              <div className="mt-7">
                <h2 className="mb-4 text-xl font-black">Popular Music</h2>

                <div className="grid grid-cols-2 gap-3">
                  {releases.slice(0, 4).map((release) => (
                    <a
                      key={`popular-${release.id}`}
                      href="/player"
                      className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]"
                    >
                      {release.cover_url ? (
                        <img
                          src={release.cover_url}
                          alt={release.title || 'Release'}
                          className="aspect-square w-full object-cover"
                        />
                      ) : (
                        <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-[#8A2BE2] to-[#4169E1] text-4xl">
                          ♫
                        </div>
                      )}

                      <div className="p-3">
                        <p className="truncate text-sm font-black">
                          {release.title || 'Untitled Release'}
                        </p>
                        <p className="mt-1 truncate text-xs text-white/40">
                          {release.artist || name}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Videos */}
        {tab === 'Videos' && (
          <section className="px-4 py-10">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
              <div className="text-4xl">🎬</div>
              <h2 className="mt-4 text-xl font-black">Videos</h2>
              <p className="mt-2 text-sm text-white/40">
                Artist videos will appear here when available.
              </p>
            </div>
          </section>
        )}

        {/* Posts */}
        {tab === 'Posts' && (
          <section className="px-4 py-10">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
              <div className="text-4xl">📝</div>
              <h2 className="mt-4 text-xl font-black">Posts</h2>
              <p className="mt-2 text-sm text-white/40">
                Artist posts will appear here when available.
              </p>
            </div>
          </section>
        )}

        {/* About */}
        {tab === 'About' && (
          <section className="px-4 py-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-xl font-black">About {name}</h2>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/60">
                {artist.bio || 'No artist biography has been added yet.'}
              </p>

              <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#8A2BE2]/15 to-[#4169E1]/15 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-white/35">
                  MOVETI Artist
                </p>
                <p className="mt-1 text-sm text-white/70">
                  {name} • Malawi
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Bottom navigation */}
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#050507]/95 px-3 py-2 backdrop-blur-xl">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <a href="/feed" className="flex flex-col items-center gap-1 px-3 py-1 text-[10px] font-semibold text-white/45">
              <span className="text-lg">⌂</span>
              Home
            </a>

            <a href="/discover" className="flex flex-col items-center gap-1 px-3 py-1 text-[10px] font-semibold text-white/45">
              <span className="text-lg">◉</span>
              Discover
            </a>

            <a
              href="/create"
              className="flex h-12 w-12 -translate-y-4 items-center justify-center rounded-full bg-gradient-to-r from-[#8A2BE2] to-[#4169E1] text-2xl font-light shadow-lg shadow-purple-900/40"
            >
              +
            </a>

            <a href="/messages" className="flex flex-col items-center gap-1 px-3 py-1 text-[10px] font-semibold text-white/45">
              <span className="text-lg">◌</span>
              Messages
            </a>

            <a href="/profile" className="flex flex-col items-center gap-1 px-3 py-1 text-[10px] font-semibold text-white/45">
              <span className="text-lg">◎</span>
              Profile
            </a>
          </div>
        </nav>

      </div>
    </main>
  );
}
