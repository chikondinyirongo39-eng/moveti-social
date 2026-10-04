"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Post = {
  id: string;
  content?: string | null;
  text?: string | null;
  body?: string | null;
  image_url?: string | null;
  video_url?: string | null;
  created_at?: string;
  likes_count?: number;
  comments_count?: number;
  shares_count?: number;
  profiles?: {
    username?: string | null;
    display_name?: string | null;
    avatar_url?: string | null;
  } | null;
  user?: {
    username?: string | null;
    display_name?: string | null;
    avatar_url?: string | null;
  } | null;
};

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  async function loadPosts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/posts", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load posts.");
      }

      const data = await response.json();

      const loaded =
        Array.isArray(data)
          ? data
          : Array.isArray(data.posts)
            ? data.posts
            : Array.isArray(data.data)
              ? data.data
              : [];

      setPosts(loaded);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load posts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function toggleLike(post: Post) {
    const previous = liked[post.id] === true;

    setLiked((current) => ({
      ...current,
      [post.id]: !previous,
    }));

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: previous ? "unlike" : "like",
          postId: post.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Like failed");
      }
    } catch {
      setLiked((current) => ({
        ...current,
        [post.id]: previous,
      }));
    }
  }

  function getAuthor(post: Post) {
    const profile = post.profiles || post.user;
    return (
      profile?.display_name ||
      profile?.username ||
      "MOVETI Creator"
    );
  }

  function getText(post: Post) {
    return post.content || post.text || post.body || "";
  }

  return (
    <main className="min-h-screen bg-black text-white pb-24">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-2xl font-black tracking-tight">
            MOVETI
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="rounded-full border border-white/10 px-3 py-2 text-sm"
            >
              Search
            </Link>
            <Link
              href="/profile"
              className="rounded-full bg-white px-3 py-2 text-sm font-bold text-black"
            >
              Profile
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4">
        <section className="py-6">
          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
            <h1 className="text-3xl font-black">What are you creating?</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Share music, videos or a post with the MOVETI community.
            </p>

            <Link
              href="/create"
              className="mt-5 block rounded-2xl bg-white px-5 py-4 text-center font-bold text-black"
            >
              + Create a post
            </Link>
          </div>
        </section>

        <nav className="mb-5 flex gap-2 overflow-x-auto">
          <Link
            href="/"
            className="whitespace-nowrap rounded-full bg-white px-5 py-2 text-sm font-semibold text-black"
          >
            For You
          </Link>
          <Link
            href="/music"
            className="whitespace-nowrap rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-zinc-300"
          >
            Music
          </Link>
          <Link
            href="/shorts"
            className="whitespace-nowrap rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-zinc-300"
          >
            Shorts
          </Link>
          <Link
            href="/discover"
            className="whitespace-nowrap rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-zinc-300"
          >
            Discover
          </Link>
        </nav>

        {loading && (
          <section className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-3xl border border-white/10 bg-zinc-950 p-5"
              >
                <div className="h-4 w-32 rounded bg-zinc-800" />
                <div className="mt-5 h-5 w-3/4 rounded bg-zinc-800" />
                <div className="mt-3 h-4 w-1/2 rounded bg-zinc-800" />
              </div>
            ))}
          </section>
        )}

        {!loading && error && (
          <section className="rounded-3xl border border-red-500/20 bg-red-950/20 p-6 text-center">
            <h2 className="text-xl font-bold">Couldn't load your feed</h2>
            <p className="mt-2 text-sm text-zinc-400">{error}</p>
            <button
              onClick={loadPosts}
              className="mt-5 rounded-full bg-white px-5 py-3 font-bold text-black"
            >
              Try again
            </button>
          </section>
        )}

        {!loading && !error && posts.length === 0 && (
          <section className="rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center">
            <div className="text-4xl">🎵</div>
            <h2 className="mt-4 text-xl font-black">
              Your MOVETI feed is waiting
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Follow creators or create your first post to start your feed.
            </p>
            <Link
              href="/create"
              className="mt-5 inline-block rounded-full bg-white px-5 py-3 font-bold text-black"
            >
              Create a post
            </Link>
          </section>
        )}

        {!loading && !error && posts.length > 0 && (
          <section className="space-y-4">
            {posts.map((post) => {
              const author = getAuthor(post);
              const text = getText(post);
              const isLiked = liked[post.id] === true;

              return (
                <article
                  key={post.id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">@{author}</p>
                        <p className="text-xs text-zinc-500">
                          {post.created_at
                            ? new Date(post.created_at).toLocaleString()
                            : "MOVETI"}
                        </p>
                      </div>

                      <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-300">
                        MOVETI
                      </span>
                    </div>

                    {text && (
                      <p className="mt-5 whitespace-pre-wrap text-lg">
                        {text}
                      </p>
                    )}
                  </div>

                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt="Post media"
                      className="max-h-[520px] w-full object-cover"
                    />
                  )}

                  {post.video_url && (
                    <video
                      src={post.video_url}
                      controls
                      playsInline
                      className="max-h-[520px] w-full bg-black"
                    />
                  )}

                  <div className="flex items-center gap-5 border-t border-white/10 px-5 py-4 text-sm">
                    <button
                      onClick={() => toggleLike(post)}
                      className={isLiked ? "font-bold text-white" : "text-zinc-400"}
                    >
                      {isLiked ? "♥ Liked" : "♡ Like"}
                    </button>

                    <Link
                      href={`/posts/${post.id}`}
                      className="text-zinc-400"
                    >
                      💬 Comment
                    </Link>

                    <button
                      onClick={() =>
                        navigator.share?.({
                          title: `MOVETI — ${author}`,
                          text,
                          url: `${window.location.origin}/posts/${post.id}`,
                        })
                      }
                      className="text-zinc-400"
                    >
                      ↗ Share
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        <section className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-5">
          <h2 className="text-xl font-black">Discover on MOVETI</h2>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link href="/music" className="rounded-2xl bg-zinc-900 p-4">
              <span className="text-2xl">🎵</span>
              <p className="mt-2 font-bold">Music</p>
              <p className="text-xs text-zinc-500">Discover artists</p>
            </Link>

            <Link href="/creator" className="rounded-2xl bg-zinc-900 p-4">
              <span className="text-2xl">⭐</span>
              <p className="mt-2 font-bold">Creators</p>
              <p className="text-xs text-zinc-500">Support creators</p>
            </Link>

            <Link href="/discover" className="rounded-2xl bg-zinc-900 p-4">
              <span className="text-2xl">🔥</span>
              <p className="mt-2 font-bold">Trending</p>
              <p className="text-xs text-zinc-500">See what's hot</p>
            </Link>

            <Link href="/player" className="rounded-2xl bg-zinc-900 p-4">
              <span className="text-2xl">▶️</span>
              <p className="mt-2 font-bold">Player</p>
              <p className="text-xs text-zinc-500">Listen to music</p>
            </Link>
          </div>
        </section>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/95 backdrop-blur">
        <div className="mx-auto grid max-w-3xl grid-cols-5 px-2 py-3 text-center text-xs">
          <Link href="/" className="font-bold">
            ⌂<br />Home
          </Link>
          <Link href="/discover">
            ⌕<br />Discover
          </Link>
          <Link href="/create" className="font-bold">
            ＋<br />Create
          </Link>
          <Link href="/messages">
            ♡<br />Messages
          </Link>
          <Link href="/profile">
            ●<br />Profile
          </Link>
        </div>
      </nav>
    </main>
  );
}
