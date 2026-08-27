'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import PostInteractions from '@/components/PostInteractions';

type Post = {
  id: number;
  user_id: string;
  content: string;
  created_at: string;
};

type Comment = {
  id: number;
  post_id: number;
  user_id: string;
  content: string;
  created_at: string;
};

export default function SocialFeed({
  initialPosts
}: {
  initialPosts: Post[];
}) {
  const supabase = createClient();

  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');
  const [likes, setLikes] = useState<Record<number, number>>({});
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [commentText, setCommentText] = useState<Record<number, string>>({});
  const [openComments, setOpenComments] = useState<Record<number, boolean>>({});
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
      }

      const postIds = initialPosts.map((post) => post.id);

      if (postIds.length === 0) return;

      const { data: likeRows } = await supabase
        .from('post_likes')
        .select('id, post_id, user_id')
        .in('post_id', postIds);

      const likeCounts: Record<number, number> = {};
      const userLikes: Record<number, boolean> = {};

      (likeRows || []).forEach((like) => {
        likeCounts[like.post_id] =
          (likeCounts[like.post_id] || 0) + 1;

        if (user && like.user_id === user.id) {
          userLikes[like.post_id] = true;
        }
      });

      setLikes(likeCounts);
      setLiked(userLikes);

      const { data: commentRows } = await supabase
        .from('comments')
        .select('*')
        .in('post_id', postIds)
        .order('created_at', { ascending: true });

      const grouped: Record<number, Comment[]> = {};

      (commentRows || []).forEach((comment) => {
        if (!grouped[comment.post_id]) {
          grouped[comment.post_id] = [];
        }

        grouped[comment.post_id].push(comment);
      });

      setComments(grouped);
    }

    load();
  }, [initialPosts]);

  async function createPost() {
    const text = content.trim();

    if (!text || posting) return;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = '/login';
      return;
    }

    setPosting(true);

    const { data, error } = await supabase
      .from('posts')
      .insert({
        content: text,
        user_id: user.id
      })
      .select('*')
      .single();

    if (!error && data) {
      setPosts((current) => [data, ...current]);
      setContent('');
    }

    setPosting(false);
  }

  async function toggleLike(post: Post) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (liked[post.id]) {
      await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', post.id)
        .eq('user_id', user.id);

      setLikes((current) => ({
        ...current,
        [post.id]: Math.max((current[post.id] || 1) - 1, 0)
      }));

      setLiked((current) => ({
        ...current,
        [post.id]: false
      }));

      return;
    }

    const { error } = await supabase
      .from('post_likes')
      .insert({
        post_id: post.id,
        user_id: user.id
      });

    if (!error) {
      setLikes((current) => ({
        ...current,
        [post.id]: (current[post.id] || 0) + 1
      }));

      setLiked((current) => ({
        ...current,
        [post.id]: true
      }));

      if (post.user_id !== user.id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: post.user_id,
            type: 'like',
            message: 'Someone liked your post.',
            read: false
          });
      }
    }
  }

  async function loadComments(postId: number) {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    setComments((current) => ({
      ...current,
      [postId]: data || []
    }));
  }

  async function addComment(post: Post) {
    const text = (commentText[post.id] || '').trim();

    if (!text) return;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = '/login';
      return;
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: post.id,
        user_id: user.id,
        content: text
      })
      .select('*')
      .single();

    if (!error && data) {
      setComments((current) => ({
        ...current,
        [post.id]: [...(current[post.id] || []), data]
      }));

      setCommentText((current) => ({
        ...current,
        [post.id]: ''
      }));

      if (post.user_id !== user.id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: post.user_id,
            type: 'comment',
            message: 'Someone commented on your post.',
            read: false
          });
      }
    }
  }

  async function deleteComment(comment: Comment) {
    if (comment.user_id !== userId) return;

    await supabase
      .from('comments')
      .delete()
      .eq('id', comment.id)
      .eq('user_id', userId);

    setComments((current) => ({
      ...current,
      [comment.post_id]: (current[comment.post_id] || []).filter(
        (item) => item.id !== comment.id
      )
    }));
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          className="w-full resize-none rounded-xl border p-3 outline-none"
          rows={3}
        />

        <button
          onClick={createPost}
          disabled={posting}
          className="mt-3 w-full rounded-xl bg-black p-3 font-bold text-white disabled:opacity-50"
        >
          {posting ? 'Posting...' : 'Post'}
        </button>
      </div>

      {posts.map((post) => {
        const postComments = comments[post.id] || [];
        const commentsOpen = openComments[post.id];

        return (
          <article
            key={post.id}
            className="rounded-2xl bg-white p-5 shadow-sm"
          >

            <p className="whitespace-pre-wrap">
              {post.content}
            </p>

            <p className="mt-3 text-xs text-gray-400">
              {post.created_at
                ? new Date(post.created_at).toISOString().slice(0, 16).replace('T', ' ')
                : ''}
            </p>

            <div className="mt-4 flex gap-2">

              <button
                onClick={() => toggleLike(post)}
                className={`rounded-xl px-4 py-2 text-sm font-bold ${
                  liked[post.id]
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100'
                }`}
              >
                {liked[post.id] ? '❤️ Liked' : '🤍 Like'}
                {' '}
                {likes[post.id] || 0}
              </button>

              <button
                onClick={async () => {
                  const next = !commentsOpen;

                  setOpenComments((current) => ({
                    ...current,
                    [post.id]: next
                  }));

                  if (next) {
                    await loadComments(post.id);
                  }
                }}
                className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold"
              >
                💬 Comment {postComments.length}
              </button>

            </div>

            {commentsOpen && (
              <div className="mt-4 border-t pt-4">

                <div className="flex gap-2">
                  <input
                    value={commentText[post.id] || ''}
                    onChange={(e) =>
                      setCommentText((current) => ({
                        ...current,
                        [post.id]: e.target.value
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addComment(post);
                      }
                    }}
                    placeholder="Write a comment..."
                    className="min-w-0 flex-1 rounded-xl border p-3"
                  />

                  <button
                    onClick={() => addComment(post)}
                    className="rounded-xl bg-black px-4 font-bold text-white"
                  >
                    Send
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {postComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="rounded-xl bg-gray-50 p-3"
                    >
                      <p className="text-sm">
                        {comment.content}
                      </p>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">
                          {new Date(
                            comment.created_at
                          ).toLocaleString()}
                        </span>

                        {comment.user_id === userId && (
                          <button
                            onClick={() => deleteComment(comment)}
                            className="text-xs font-bold text-red-500"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </article>
        );
      })}

    </div>
  );
}
