'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

type Message = {
  id: number;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
};

export default function Messages() {
  const supabase = createClient();

  const [userId, setUserId] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [receiverId, setReceiverId] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  async function loadMessages(currentUserId: string, otherUserId: string) {
    if (!otherUserId) return;

    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`
      )
      .order('created_at', { ascending: true });

    setMessages(data || []);
  }

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/login';
        return;
      }

      setUserId(user.id);
      setLoading(false);
    }

    init();
  }, []);

  async function sendMessage() {
    if (!userId || !receiverId.trim() || !content.trim()) return;

    setSending(true);
    setMessage('');

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: userId,
        receiver_id: receiverId.trim(),
        content: content.trim()
      });

    if (error) {
      setMessage(error.message);
      setSending(false);
      return;
    }

    setContent('');
    await loadMessages(userId, receiverId.trim());
    setSending(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-5">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 text-center">
          Loading messages...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-5">
      <div className="mx-auto max-w-2xl">

        <div className="rounded-2xl bg-black p-6 text-white">
          <h1 className="text-3xl font-black">💬 Messages</h1>
          <p className="mt-1 text-gray-300">
            Chat with creators on MOVETI.
          </p>
        </div>

        <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
          <label className="text-sm font-bold">
            Creator User ID
          </label>

          <input
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            onBlur={() => {
              if (userId && receiverId.trim()) {
                loadMessages(userId, receiverId.trim());
              }
            }}
            placeholder="Enter creator user ID"
            className="mt-2 w-full rounded-xl border p-3"
          />

          <button
            onClick={() => {
              if (userId && receiverId.trim()) {
                loadMessages(userId, receiverId.trim());
              }
            }}
            className="mt-3 rounded-xl bg-black px-5 py-3 font-bold text-white"
          >
            Open Chat
          </button>
        </div>

        <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm">

          <div className="min-h-[300px] space-y-3">

            {messages.length === 0 ? (
              <div className="flex min-h-[280px] items-center justify-center text-center text-gray-400">
                <div>
                  <div className="text-4xl">💬</div>
                  <p className="mt-2">
                    No messages yet.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((item) => (
                <div
                  key={item.id}
                  className={`flex ${
                    item.sender_id === userId
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      item.sender_id === userId
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-black'
                    }`}
                  >
                    <p>{item.content}</p>

                    <p
                      className={`mt-1 text-[10px] ${
                        item.sender_id === userId
                          ? 'text-gray-300'
                          : 'text-gray-400'
                      }`}
                    >
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}

          </div>

          <div className="mt-5 flex gap-2 border-t pt-4">
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
              placeholder="Write a message..."
              className="min-w-0 flex-1 rounded-xl border p-3"
            />

            <button
              onClick={sendMessage}
              disabled={sending || !receiverId.trim()}
              className="rounded-xl bg-black px-5 font-bold text-white disabled:opacity-40"
            >
              {sending ? '...' : 'Send'}
            </button>
          </div>

          {message && (
            <p className="mt-3 text-center text-sm text-red-500">
              {message}
            </p>
          )}

        </section>

        <div className="mt-5 flex gap-3">
          <a
            href="/dashboard"
            className="flex-1 rounded-xl bg-black p-3 text-center font-bold text-white"
          >
            Dashboard
          </a>

          <a
            href="/"
            className="flex-1 rounded-xl bg-white p-3 text-center font-medium shadow-sm"
          >
            Home
          </a>
        </div>

      </div>
    </main>
  );
}
