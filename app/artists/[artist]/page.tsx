import Link from "next/link";

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ artist: string }>;
}) {
  const { artist } = await params;
  const name = artist === "astravetcn" ? "Astravet CN" : artist;

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#111]">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-2xl font-black">MOVETI</Link>
          <Link href="/profiles" className="text-sm font-bold">Creators</Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-3xl bg-black p-7 text-white">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-white text-3xl font-black text-black">
            {name[0]}
          </div>
          <h1 className="mt-5 text-3xl font-black">{name}</h1>
          <p className="mt-1 text-gray-300">@{artist}</p>
          <p className="mt-4 max-w-xl text-gray-300">
            Artist, creator and member of the MOVETI community.
          </p>

          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            <span><b>27K</b> Followers</span>
            <span><b>61</b> Posts</span>
            <span><b>12</b> Releases</span>
          </div>

          <button className="mt-6 rounded-full bg-white px-6 py-2.5 text-sm font-black text-black">
            Follow
          </button>
        </div>

        <div className="mt-7">
          <h2 className="text-2xl font-black">Music</h2>

          <div className="mt-4 space-y-3">
            {["Welcome To MOVETI", "New Wave", "Malawi Vibes"].map((title, i) => (
              <div key={title} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-black text-white">
                  ▶
                </div>
                <div className="flex-1">
                  <strong>{title}</strong>
                  <p className="text-sm text-gray-500">{name}</p>
                </div>
                <span className="hidden text-sm text-gray-500 sm:block">
                  {1200 - i * 220} plays
                </span>
                <button className="rounded-full bg-black px-4 py-2 text-sm font-bold text-white">
                  Play
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
