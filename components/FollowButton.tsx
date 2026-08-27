'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function FollowButton({
  artistId
}: {
  artistId: string;
}) {
  const supabase = createClient();

  const [userId, setUserId] = useState('');
  const [following, setFollowing] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const [{ data: existing }, { count: followers }] =
        await Promise.all([
          supabase
            .from('followers')
            .select('id')
            .eq('follower_id', user.id)
            .eq('following_id', artistId)
            .maybeSingle(),

          supabase
            .from('followers')
            .select('id', { count: 'exact', head: true })
            .eq('following_id', artistId)
        ]);

      setFollowing(!!existing);
      setCount(followers || 0);
      setLoading(false);
    }

    load();
  }, [artistId]);

  async function toggleFollow() {
    if (!userId || userId === artistId) return;

    setLoading(true);

    if (following) {
      const { error } = await supabase
        .from('followers')
        .delete()
        .eq('follower_id', userId)
        .eq('following_id', artistId);

      if (!error) {
        setFollowing(false);
        setCount((value) => Math.max(0, value - 1));
      }
    } else {
      const { error } = await supabase
        .from('followers')
        .insert({
          follower_id: userId,
          following_id: artistId
        });

      if (!error) {
        setFollowing(true);
        setCount((value) => value + 1);
      }
    }

    setLoading(false);
  }

  if (userId === artistId) {
    return (
      <div className="rounded-xl bg-gray-100 px-4 py-3 text-center text-sm font-bold">
        {count} followers
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggleFollow}
        disabled={loading || !userId}
        className={`flex-1 rounded-xl p-3 font-bold ${
          following
            ? 'bg-gray-100 text-black'
            : 'bg-black text-white'
        } disabled:opacity-50`}
      >
        {loading
          ? 'Loading...'
          : following
            ? 'Following'
            : 'Follow'}
      </button>

      <div className="rounded-xl bg-gray-100 px-4 py-3 text-sm font-bold">
        {count} followers
      </div>
    </div>
  );
}
