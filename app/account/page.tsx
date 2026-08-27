import Link from "next/link";

export default function Account() {
  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#111]">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-2xl font-black">MOVETI</Link>
          <Link href="/dashboard" className="text-sm font-bold">Dashboard</Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-3xl bg-black p-7 text-white">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-2xl font-black text-black">
            A
          </div>
          <h1 className="mt-4 text-3xl font-black">Astravet CN</h1>
          <p className="text-gray-300">@astravetcn</p>
          <p className="mt-3 text-sm text-gray-300">Artist & Creator</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Followers</p>
            <b className="text-2xl">27K</b>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Posts</p>
            <b className="text-2xl">61</b>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Earnings</p>
            <b className="text-2xl">K0.00</b>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Link href="/dashboard" className="block rounded-2xl bg-white p-5 font-bold shadow-sm">
            📊 Creator Dashboard
          </Link>
          <Link href="/payment" className="block rounded-2xl bg-white p-5 font-bold shadow-sm">
            💰 Payments & Payouts
          </Link>
          <Link href="/releases" className="block rounded-2xl bg-white p-5 font-bold shadow-sm">
            🎵 My Music
          </Link>
          <Link href="/profiles" className="block rounded-2xl bg-white p-5 font-bold shadow-sm">
            👤 View Profile
          </Link>
          <Link href="/login" className="block rounded-2xl bg-white p-5 font-bold text-red-600 shadow-sm">
            Log out
          </Link>
        </div>
      </section>
    </main>
  );
}
