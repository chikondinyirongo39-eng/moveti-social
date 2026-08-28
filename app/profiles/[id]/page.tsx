import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default async function ProfilePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, bio')
    .eq('id', id)
    .maybeSingle();

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#07090d] p-6 text-white">
        <Link href="/profiles" className="text-gray-400">
          ← People
        </Link>

        <div className="mx-auto mt-12 max-w-2xl rounded-3xl bg-[#11151d] p-8 text-center">
          <h1 className="text-2xl font-black">
            Profile not found
          </h1>

          <p className="mt-2 text-gray-400">
            This profile may no longer exist.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07090d] px-5 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/profiles" className="text-sm text-gray-400">
          ← People
        </Link>

        <section className="mt-6 overflow-hidden rounded-3xl bg-[#11151d]">
          <div className="h-32 bg-gradient-to-r from-[#181d27] to-[#303640]" />

          <div className="px-6 pb-7">
            <div className="-mt-12 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#11151d] bg-white text-3xl font-black text-black">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                (profile.display_name || profile.username || 'M')
                  .charAt(0)
                  .toUpperCase()
              )}
            </div>

            <h1 className="mt-5 text-3xl font-black">
              {profile.display_name || profile.username}
            </h1>

            <p className="mt-1 text-gray-400">
              @{profile.username}
            </p>

            {profile.bio && (
              <p className="mt-5 whitespace-pre-wrap text-gray-300">
                {profile.bio}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/messages"
                className="rounded-full bg-white px-6 py-3 font-bold text-black"
              >
                Message
              </Link>

              <Link
                href="/"
                className="rounded-full border border-gray-700 px-6 py-3 font-bold"
              >
                View Feed
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-[#11151d] p-6">
          <h2 className="text-xl font-black">Music & Releases</h2>

          <p className="mt-2 text-gray-400">
            This artist's releases will appear here.
          </p>
        </section>
      </div>
    </main>
  );
}
