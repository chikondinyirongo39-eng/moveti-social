'use client'

import { useEffect, useState } from 'react'

type FinancialData = {
  wallets: Array<{
    user_id: string
    balance: number
    currency: string
  }>
  transactions: Array<{
    user_id: string
    type: string
    amount: number
    currency: string
    status: string
    created_at: string
  }>
  withdrawals: Array<{
    id: string
    user_id: string
    amount: number
    method: string
    destination: string
    status: string
    provider_reference?: string | null
    created_at: string
  }>
}

const money = (value: number) =>
  `K${Number(value || 0).toLocaleString('en-MW', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`

export default function AdminPage() {
  const [data, setData] = useState<FinancialData>({
    wallets: [],
    transactions: [],
    withdrawals: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/security/session')
      .then(async response => {
        const json = await response.json()

        if (!response.ok) {
          throw new Error(json.error || 'Admin access required.')
        }

        return json
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const subscriptionRevenue = data.transactions
    .filter(t => t.type === 'subscription_payment' && t.status !== 'failed')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)

  const royalties = data.transactions
    .filter(t => t.type === 'royalty' && t.status !== 'failed')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)

  const pendingWithdrawals = data.withdrawals
    .filter(w => w.status === 'pending')
    .reduce((sum, w) => sum + Number(w.amount || 0), 0)

  const totalArtistBalances = data.wallets
    .reduce((sum, w) => sum + Number(w.balance || 0), 0)

  const artists = new Set(data.wallets.map(w => w.user_id)).size

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">MOVETI Admin Centre</h1>
            <p className="mt-1 text-gray-400">
              Private management and financial control centre
            </p>
          </div>

          <a
            href="/dashboard"
            className="rounded-lg bg-white px-4 py-2 font-semibold text-black"
          >
            Dashboard
          </a>
        </div>

        {loading && (
          <div className="mt-8 rounded-xl border border-gray-800 p-6 text-gray-300">
            Loading admin data...
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-xl border border-red-900 bg-red-950/40 p-6">
            <h2 className="font-semibold text-red-300">Access denied</h2>
            <p className="mt-2 text-red-200">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-gray-800 bg-gray-950 p-5">
                <p className="text-sm text-gray-400">Subscription Revenue</p>
                <p className="mt-2 text-2xl font-bold">{money(subscriptionRevenue)}</p>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-950 p-5">
                <p className="text-sm text-gray-400">Artist Royalties</p>
                <p className="mt-2 text-2xl font-bold">{money(royalties)}</p>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-950 p-5">
                <p className="text-sm text-gray-400">Pending Withdrawals</p>
                <p className="mt-2 text-2xl font-bold">{money(pendingWithdrawals)}</p>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-950 p-5">
                <p className="text-sm text-gray-400">Artists With Wallets</p>
                <p className="mt-2 text-2xl font-bold">{artists}</p>
              </div>
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-gray-800 bg-gray-950 p-6">
                <h2 className="text-xl font-semibold">MOVETI Business</h2>

                <div className="mt-5 space-y-4">
                  <div className="flex justify-between border-b border-gray-800 pb-3">
                    <span className="text-gray-400">5 Months</span>
                    <strong>K40,000</strong>
                  </div>

                  <div className="flex justify-between border-b border-gray-800 pb-3">
                    <span className="text-gray-400">1 Year</span>
                    <strong>K100,000</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Artist royalty share</span>
                    <strong>100%</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">MOVETI royalty commission</span>
                    <strong>0%</strong>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-950 p-6">
                <h2 className="text-xl font-semibold">Artist Balances</h2>
                <p className="mt-2 text-sm text-gray-400">
                  Private admin view. Artists only see their own balance.
                </p>

                <div className="mt-5">
                  <p className="text-sm text-gray-400">Total artist balances</p>
                  <p className="mt-1 text-3xl font-bold">{money(totalArtistBalances)}</p>
                </div>
              </div>
            </section>

            <section className="mt-6 rounded-xl border border-gray-800 bg-gray-950 p-6">
              <h2 className="text-xl font-semibold">Withdrawal Requests</h2>

              {data.withdrawals.length === 0 ? (
                <p className="mt-4 text-gray-500">No withdrawal requests yet.</p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-800 text-gray-400">
                      <tr>
                        <th className="px-3 py-3">Artist</th>
                        <th className="px-3 py-3">Amount</th>
                        <th className="px-3 py-3">Method</th>
                        <th className="px-3 py-3">Destination</th>
                        <th className="px-3 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.withdrawals.map(item => (
                        <tr key={item.id} className="border-b border-gray-900">
                          <td className="px-3 py-3 font-mono text-xs">
                            {item.user_id.slice(0, 8)}...
                          </td>
                          <td className="px-3 py-3">{money(item.amount)}</td>
                          <td className="px-3 py-3 uppercase">{item.method}</td>
                          <td className="px-3 py-3">{item.destination}</td>
                          <td className="px-3 py-3 capitalize">{item.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="mt-6 rounded-xl border border-gray-800 bg-gray-950 p-6">
              <h2 className="text-xl font-semibold">Recent Financial Activity</h2>

              {data.transactions.length === 0 ? (
                <p className="mt-4 text-gray-500">No financial transactions yet.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {data.transactions.slice(0, 20).map((item, index) => (
                    <div
                      key={`${item.user_id}-${item.created_at}-${index}`}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-800 p-4"
                    >
                      <div>
                        <p className="font-medium">{item.type.replaceAll('_', ' ')}</p>
                        <p className="text-xs text-gray-500">
                          {item.user_id.slice(0, 8)}... • {item.status}
                        </p>
                      </div>
                      <strong>{money(item.amount)}</strong>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="mt-6 rounded-xl border border-yellow-900/50 bg-yellow-950/20 p-6">
              <h2 className="font-semibold text-yellow-300">Production payment status</h2>
              <p className="mt-2 text-sm text-yellow-100/80">
                MOVETI can record subscriptions, royalties, wallet balances and
                withdrawal requests now. Actual money movement requires approved
                payment-provider credentials and live merchant/compliance access.
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  )
}
