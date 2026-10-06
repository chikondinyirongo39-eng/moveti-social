'use client';

import { useEffect, useState } from 'react';
import PublicArtistProfile from '@/components/PublicArtistProfile';
import { createClient } from '@/lib/supabase';

export default function ArtistPage({
  params,
}: {
  params: Promise<{ artist: string }>;
}) {
  const [artistId, setArtistId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findArtist() {
      const { artist } = await params;
      const supabase = createClient();

      const byId = await supabase
        .from('artist_profiles')
        .select('id')
        .eq('id', artist)
        .maybeSingle();

      if (byId.data?.id) {
        setArtistId(byId.data.id);
        setLoading(false);
        return;
      }

      const byUsername = await supabase
        .from('artist_profiles')
        .select('id')
        .eq('username', artist)
        .maybeSingle();

      if (byUsername.data?.id) {
        setArtistId(byUsername.data.id);
      }

      setLoading(false);
    }

    findArtist();
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white grid place-items-center">
        <p className="text-white/60">Loading artist...</p>
      </main>
    );
  }

  if (!artistId) {
    return (
      <main className="min-h-screen bg-black text-white grid place-items-center px-6 text-center">
        <div>
          <h1 className="text-2xl font-black">Artist not found</h1>
          <p className="mt-2 text-white/60">
            This artist profile could not be found.
          </p>
        </div>
      </main>
    );
  }

  return <PublicArtistProfile artistId={artistId} />;
}
