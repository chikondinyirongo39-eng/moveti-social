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

export default function MessagesCenter() {
  const supabase = createClient();

  const [userId, setUserId] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [receiverId, setReceiverId] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  async function loadMessages(id: string, otherId: string) {
    if (!otherId) {
      setMessages([]);
      return;
    }

    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${id})`
      )
      .order('created_at', { ascending: true });

    setMessages(data || []);
  }

  useEffect(() => {
    async function start() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/login';
        return;
      }

      setUserId(user.id);
      setLoading(false);
    }

    start();
  }, []);

  useEffect(() => {
    if (!userId || !receiverId) return;

    loadMessages(userId, receiverId);

    const channel = supabase
      .channel('moveti-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        () => loadMessages(userId, receiverId)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, receiverId]);

  async function sendMessage() {
    const text = content.trim();

    if (!userId || !receiverId || !text) {
      setMessage('Enter a recipient and message.');
      return;
    }

    if (userId === receiverId) {
      setMessage('You cannot message yourself.');
      return;
    }

    setSending(true);
    setMessage('');

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: userId,
        receiver_id: receiverId,
        content: text
      });

    if (error) {
      setMessage(error.message);
      setSending(false);
      return;
    }

    setContent('');
    await loadMessages(userId, receiverId);
    setSending(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-5">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center">
          Loading messages...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-5 pb-10">
      <div className="mx-auto max-w-2xl">

        <div className="rounded-2xl bg-black p-6 text-white">
          <h1 className="text-3xl font-black">💬 Messages</h1>
          <p className="mt-1 text-gray-300">
            Chat privately with people on MOVETI.
          </p>
        </div>

        <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm">

          <label className="text-sm font-bold">
            Recipient user ID
          </label>

          <input
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value.trim())}
            placeholder="Paste the user's ID"
            className="mt-2 w-full rounded-xl border p-3"
          />

          {receiverId && (
            <button
              onClick={() => loadMessages(userId, receiverId)}
              className="mt-3 rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold"
            >
              Open conversation
            </button>
          )}

        </section>

        <section className="mt-5 overflow-hidden rounded-2xl bg-white shadow-sm">

          <div className="max-h-[55vh] min-h-[250px] space-y-3 overflow-y-auto p-5">

            {!receiverId ? (
              <div className="flex min-h-[220px] items-center justify-center text-center text-gray-400">
                Enter a recipient ID to start chatting.
              </div>
            ) : messages.length === 0 ? (
              <div className="flex min-h-[220px] items-center justify-center text-center text-gray-400">
                No messages yet. Send the first message.
              </div>
            ) : (
              messages.map((item) => {
                const mine = item.sender_id === userId;

                return (
                  <div
                    key={item.id}
                    className={`flex ${
                      mine ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        mine
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-black'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {item.content}
                      </p>

                      <p
                        className={`mt-1 text-[10px] ${
                          mine
                            ? 'text-gray-300'
                            : 'text-gray-400'
                        }`}
                      >
                        {new Date(
                          item.created_at
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })
            )}

          </div>

          <div className="border-t p-4">

            {message && (
              <div className="mb-3 rounded-xl bg-gray-100 p-3 text-center text-sm">
                {message}
              </div>
            )}

            <div className="flex gap-2">

              <input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Write a message..."
                className="min-w-0 flex-1 rounded-xl border p-3"
                disabled={!receiverId || sending}
              />

              <button
                onClick={sendMessage}
                disabled={!receiverId || sending}
                className="rounded-xl bg-black px-5 font-bold text-white disabled:opacity-50"
              >
                {sending ? '...' : 'Send'}
              </button>

            </div>

          </div>

        </section>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <a
            href="/search"
            className="rounded-xl bg-white p-4 text-center font-bold shadow-sm"
          >
            🔎 Find People
          </a>

          <a
            href="/dashboard"
            className="rounded-xl bg-black p-4 text-center font-bold text-white"
          >
            📊 Dashboard
          </a>
        </div>

      </div>
    </main>
  );
}
