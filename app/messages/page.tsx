'use client'

import { useEffect, useState } from 'react'

type Message = {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [receiverId, setReceiverId] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function loadMessages() {
    const res = await fetch('/api/messages')
    const data = await res.json()
    if (res.ok) setMessages(data.messages || [])
  }

  useEffect(() => {
    loadMessages()
  }, [])

  async function sendMessage() {
    if (!receiverId.trim() || !content.trim()) return

    setLoading(true)
    setError('')

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        receiverId: receiverId.trim(),
        content: content.trim()
      })
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Unable to send message.')
    } else {
      setContent('')
      await loadMessages()
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="mt-2 text-white/60">
          Private messages between MOVETI users.
        </p>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <input
            value={receiverId}
            onChange={e => setReceiverId(e.target.value)}
            placeholder="Recipient user ID"
            className="w-full rounded-xl bg-black border border-white/10 px-4 py-3 outline-none"
          />

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write a message..."
            rows={4}
            className="mt-3 w-full rounded-xl bg-black border border-white/10 px-4 py-3 outline-none"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="mt-3 rounded-xl bg-white px-5 py-3 font-semibold text-black disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>

          {error && (
            <p className="mt-3 text-sm text-red-400">{error}</p>
          )}
        </section>

        <section className="mt-6 space-y-3">
          {messages.length === 0 ? (
            <div className="rounded-2xl border border-white/10 p-5 text-white/50">
              No messages yet.
            </div>
          ) : (
            messages.map(message => (
              <article
                key={message.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <p>{message.content}</p>
                <p className="mt-2 text-xs text-white/40">
                  {new Date(message.created_at).toLocaleString()}
                </p>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  )
}
