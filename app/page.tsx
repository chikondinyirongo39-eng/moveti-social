import Link from 'next/link';
import SocialFeed from '@/components/SocialFeed';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] text-[#111]">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-xl font-black">
            MOVETI
          </Link>

          <div className="flex gap-2">
            <Link
              href="/search"
              className="rounded-full border px-4 py-2 text-sm font-bold"
            >
              Search
            </Link>

            <Link
              href="/login"
              className="rounded-full bg-black px-4 py-2 text-sm font-bold text-white"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-3xl font-black">Your feed</h1>

        <p className="mt-1 text-gray-500">
          Music, videos and people you follow.
        </p>

        <div className="mt-6">
          <SocialFeed />
        </div>
      </section>
    </main>
  );
}
