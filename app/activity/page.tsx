'use client'

import { useEffect, useState } from 'react'

type Notification = {
  id: string
  type: string
  message: string
  read: boolean
  created_at: string
}

export default function ActivityPage() {
  const [items, setItems] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const res = await fetch('/api/notifications')
    const data = await res.json()

    if (res.ok) {
      setItems(data.notifications || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Activity</h1>
        <p className="mt-2 text-white/60">
          Your MOVETI notifications and activity.
        </p>

        <section className="mt-6 space-y-3">
          {loading ? (
            <div className="rounded-2xl border border-white/10 p-5 text-white/50">
              Loading activity...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-white/10 p-5 text-white/50">
              No activity yet.
            </div>
          ) : (
            items.map(item => (
              <article
                key={item.id}
                className={`rounded-2xl border border-white/10 p-4 ${
                  item.read ? 'bg-white/5' : 'bg-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{item.message}</p>
                    <p className="mt-2 text-xs text-white/40">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                  {!item.read && (
                    <span className="rounded-full bg-white px-2 py-1 text-xs text-black">
                      New
                    </span>
                  )}
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  )
}
