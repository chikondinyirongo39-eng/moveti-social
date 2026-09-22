export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">MOVETI Privacy & Security</h1>

        <div className="mt-6 space-y-5 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white">Account privacy</h2>
            <p>Artists can access their own account information, releases, wallet balance and earnings.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Financial privacy</h2>
            <p>Artist balances and earnings are private. Aggregate MOVETI business finances are restricted to authorised administrators.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Payment security</h2>
            <p>MOVETI does not request or store Airtel Money or TNM Mpamba PINs.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Withdrawals</h2>
            <p>Withdrawal requests are associated with the signed-in account. Provider credentials and secrets must remain server-side.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Administrator access</h2>
            <p>Financial administration requires explicit administrator authorisation.</p>
          </section>
        </div>
      </div>
    </main>
  )
}
