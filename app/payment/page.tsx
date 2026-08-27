import Link from "next/link";

const methods = [
  ["Airtel Money", "Receive earnings through Airtel Money."],
  ["TNM Mpamba", "Receive earnings through Mpamba."],
  ["Bank Account", "Receive earnings directly to your bank."],
];

export default function Payment() {
  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#111]">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-2xl font-black">MOVETI</Link>
          <Link href="/dashboard" className="text-sm font-bold">Dashboard</Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-black">Payments</h1>
        <p className="mt-2 text-gray-500">Manage your creator earnings and payout method.</p>

        <div className="mt-7 rounded-3xl bg-black p-7 text-white">
          <p className="text-sm text-gray-300">Available earnings</p>
          <p className="mt-2 text-4xl font-black">K0.00</p>
          <button className="mt-6 rounded-full bg-white px-6 py-3 font-bold text-black">
            Withdraw
          </button>
        </div>

        <h2 className="mt-8 text-xl font-black">Payout method</h2>

        <div className="mt-4 space-y-4">
          {methods.map(([name, text]) => (
            <button
              key={name}
              className="w-full rounded-2xl bg-white p-5 text-left shadow-sm hover:shadow-md"
            >
              <strong>{name}</strong>
              <p className="mt-1 text-sm text-gray-500">{text}</p>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
