'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function PostInteractions({
  postId
}: {
  postId: string | number;
}) {
  const supabase = createClient();

  const [userId, setUserId] = useState('');
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    setUserId(user.id);

    const [{ data: like }, { count }, { data: commentData }] =
      await Promise.all([
        supabase
          .from('post_likes')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .maybeSingle(),

        supabase
          .from('post_likes')
          .select('id', { count: 'exact', head: true })
          .eq('post_id', postId),

        supabase
          .from('post_comments')
          .select('*')
          .eq('post_id', postId)
          .order('created_at', { ascending: true })
      ]);

    setLiked(!!like);
    setLikes(count || 0);
    setComments(commentData || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [postId]);

  async function toggleLike() {
    if (!userId) {
      window.location.href = '/login';
      return;
    }

    if (liked) {
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (!error) {
        setLiked(false);
        setLikes((value) => Math.max(0, value - 1));
      }
    } else {
      const { error } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: userId
        });

      if (!error) {
        setLiked(true);
        setLikes((value) => value + 1);
      }
    }
  }

  async function addComment() {
    const text = comment.trim();

    if (!text) return;

    if (!userId) {
      window.location.href = '/login';
      return;
    }

    const { data, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content: text
      })
      .select('*')
      .single();

    if (!error && data) {
      setComments((current) => [...current, data]);
      setComment('');
    }
  }

  if (loading) {
    return (
      <div className="mt-4 text-sm text-gray-400">
        Loading interactions...
      </div>
    );
  }

  return (
    <div className="mt-4">

      <div className="flex items-center gap-3">

        <button
          onClick={toggleLike}
          className={`rounded-xl px-4 py-2 text-sm font-bold ${
            liked
              ? 'bg-red-50 text-red-600'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {liked ? '❤️ Liked' : '♡ Like'}
        </button>

        <span className="text-sm text-gray-500">
          {likes} {likes === 1 ? 'like' : 'likes'}
        </span>

        <span className="text-sm text-gray-500">
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </span>

      </div>

      <div className="mt-4 flex gap-2">

        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addComment();
          }}
          placeholder="Write a comment..."
          className="min-w-0 flex-1 rounded-xl border p-3 text-sm"
        />

        <button
          onClick={addComment}
          className="rounded-xl bg-black px-4 py-3 text-sm font-bold text-white"
        >
          Send
        </button>

      </div>

      {comments.length > 0 && (
        <div className="mt-4 space-y-2">

          {comments.map((item) => (
            <div
              key={item.id}
              className="rounded-xl bg-gray-50 p-3"
            >
              <p className="text-sm">
                {item.content}
              </p>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}
