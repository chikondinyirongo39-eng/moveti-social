'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

type Post = {
  id: number;
  content: string;
  likes: number;
  comments: number;
  created_at: string;
};

export default function SocialFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  async function loadPosts() {
    const supabase = createClient();

    const { data } = await supabase
      .from('posts')
      .select('id, content, likes, comments, created_at')
      .order('created_at', { ascending: false });

    setPosts(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function createPost() {
    const text = content.trim();

    if (!text || posting) return;

    setPosting(true);

    const supabase = createClient();

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = '/login';
      return;
    }

    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        content: text
      })
      .select('id, content, likes, comments, created_at')
      .single();

    if (!error && data) {
      setPosts((current) => [data, ...current]);
      setContent('');
    }

    setPosting(false);
  }

  return (
    <div>
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          rows={3}
          className="w-full resize-none outline-none"
        />

        <button
          onClick={createPost}
          disabled={posting || !content.trim()}
          className="mt-3 rounded-full bg-black px-6 py-2 text-sm font-bold text-white disabled:opacity-40"
        >
          {posting ? 'Posting...' : 'Post'}
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="rounded-2xl bg-white p-6 text-center text-gray-500">
            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center text-gray-500">
            No posts yet. Be the first to post on MOVETI.
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="rounded-2xl bg-white p-5 shadow-sm"
            >
              <strong>@MOVETI Creator</strong>

              <p className="mt-3 whitespace-pre-wrap">
                {post.content}
              </p>

              <div className="mt-4 border-t pt-4 text-sm text-gray-500">
                ❤️ {post.likes} &nbsp;&nbsp;
                💬 {post.comments} &nbsp;&nbsp;
                🔗 Share
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
