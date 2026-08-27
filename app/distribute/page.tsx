import Link from "next/link";

const plans = [
  { name: "5 Months", price: "K40,000", text: "Unlimited releases for 5 months." },
  { name: "1 Year", price: "K100,000", text: "Unlimited releases for 12 months." },
];

export default function Distribute() {
  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#111]">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-2xl font-black">MOVETI</Link>
          <Link href="/dashboard" className="text-sm font-bold">Dashboard</Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-4xl font-black">Distribute your music</h1>
        <p className="mt-2 text-gray-500">
          Release your music worldwide through MOVETI.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {plans.map((plan) => (
            <div key={plan.name} className="rounded-3xl bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-black">{plan.name}</h2>
              <p className="mt-3 text-3xl font-black">{plan.price}</p>
              <p className="mt-2 text-gray-500">{plan.text}</p>
              <button className="mt-6 w-full rounded-full bg-black px-6 py-3 font-bold text-white">
                Choose Plan
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl bg-black p-7 text-white">
          <h2 className="text-2xl font-black">Worldwide distribution</h2>
          <p className="mt-3 text-gray-300">
            Submit singles, EPs and albums for distribution to supported
            streaming platforms.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {["Single", "EP", "Album"].map((type) => (
              <div key={type} className="rounded-xl bg-white/10 p-4 text-center font-bold">
                {type}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-7 shadow-sm">
          <h2 className="text-xl font-black">Artist earnings</h2>
          <p className="mt-2 text-gray-500">
            Artist royalties are tracked separately from the MOVETI
            distribution subscription.
          </p>
          <p className="mt-4 font-bold">Payout methods: Airtel Money • Mpamba • Bank</p>
        </div>
      </section>
    </main>
  );
}
