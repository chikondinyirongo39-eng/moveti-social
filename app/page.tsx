import Link from "next/link";

const posts = [
  { artist: "MOVETI Creator", text: "New music soon", type: "Music" },
  { artist: "Astravet CN", text: "Creating new sounds for MOVETI.", type: "Music" },
  { artist: "MOVETI Community", text: "Share your music, videos and moments with the community.", type: "Post" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white pb-24">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-2xl font-black tracking-tight">
            MOVETI
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/search" className="rounded-full border border-white/10 px-3 py-2 text-sm">
              Search
            </Link>
            <Link href="/profile" className="rounded-full bg-white px-3 py-2 text-sm font-bold text-black">
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
          {["For You", "Music", "Shorts", "Discover"].map((item, i) => (
            <Link
              key={item}
              href={i === 3 ? "/discover" : "/"}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold ${
                i === 0 ? "bg-white text-black" : "bg-zinc-900 text-zinc-300"
              }`}
            >
              {item}
            </Link>
          ))}
        </nav>

        <section className="space-y-4">
          {posts.map((post, index) => (
            <article
              key={index}
              className="rounded-3xl border border-white/10 bg-zinc-950 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">@{post.artist}</p>
                  <p className="text-xs text-zinc-500">MOVETI</p>
                </div>
                <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-300">
                  {post.type}
                </span>
              </div>

              <p className="mt-5 text-lg">{post.text}</p>

              <div className="mt-5 flex items-center gap-5 border-t border-white/10 pt-4 text-sm text-zinc-400">
                <button>♡ Like</button>
                <button>💬 Comment</button>
                <button>↗ Share</button>
              </div>
            </article>
          ))}
        </section>

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
              <p className="text-xs text-zinc-500">See what&apos;s hot</p>
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
          <Link href="/" className="font-bold">⌂<br />Home</Link>
          <Link href="/discover">⌕<br />Discover</Link>
          <Link href="/create" className="font-bold text-white">＋<br />Create</Link>
          <Link href="/messages">♡<br />Messages</Link>
          <Link href="/profile">●<br />Profile</Link>
        </div>
      </nav>
    </main>
  );
}
