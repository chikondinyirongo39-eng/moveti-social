'use client';

import Link from 'next/link';

type Profile = {
  id: string;
  username?: string | null;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
};

export default function ProfileCard({ profile }: { profile: Profile }) {
  const name = profile.display_name || profile.username || 'MOVETI User';

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={name}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-xl font-bold text-white">
            {name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-bold">{name}</h2>
          {profile.username && (
            <p className="truncate text-sm text-gray-500">@{profile.username}</p>
          )}
        </div>
      </div>

      {profile.bio && (
        <p className="mt-4 text-sm text-gray-600">{profile.bio}</p>
      )}

      <Link
        href={`/profiles/${profile.id}`}
        className="mt-4 block rounded-full bg-black px-4 py-2 text-center text-sm font-bold text-white"
      >
        View Profile
      </Link>
    </article>
  );
}
