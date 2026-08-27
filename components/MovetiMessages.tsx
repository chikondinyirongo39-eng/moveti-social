'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

type Message = {
  id: string | number;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
};

export default function MovetiMessages() {
  const supabase = createClient();

  const [userId, setUserId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  async function loadMessages(currentUser: string, otherUser: string) {
    if (!otherUser) {
      setMessages([]);
      return;
    }

    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${currentUser},receiver_id.eq.${otherUser}),and(sender_id.eq.${otherUser},receiver_id.eq.${currentUser})`
      )
      .order('created_at', { ascending: true });

    setMessages(data || []);
  }

  useEffect(() => {
    async function start() {
      const {
        data: { user }
      } = await supabase.auth.getUser();

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
      .channel(`messages-${userId}-${receiverId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const message = payload.new as Message;

          if (
            (message.sender_id === userId &&
              message.receiver_id === receiverId) ||
            (message.sender_id === receiverId &&
              message.receiver_id === userId)
          ) {
            setMessages((current) => {
              if (current.some((item) => item.id === message.id)) {
                return current;
              }

              return [...current, message];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, receiverId]);

  async function sendMessage() {
    const content = text.trim();

    if (!content || !receiverId || !userId) return;

    setSending(true);

    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: userId,
        receiver_id: receiverId,
        content
      })
      .select('*')
      .single();

    if (!error && data) {
      setMessages((current) => {
        if (current.some((item) => item.id === data.id)) {
          return current;
        }

        return [...current, data];
      });

      setText('');
    }

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
    <main className="min-h-screen bg-gray-50 p-5">
      <div className="mx-auto max-w-2xl">

        <div className="rounded-3xl bg-black p-6 text-white">
          <h1 className="text-3xl font-black">
            💬 MOVETI Messages
          </h1>

          <p className="mt-1 text-gray-300">
            Chat with other MOVETI users.
          </p>
        </div>

        <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm">

          <label className="mb-2 block text-sm font-bold">
            Recipient user ID
          </label>

          <input
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value.trim())}
            placeholder="Enter the user's ID"
            className="w-full rounded-xl border p-3"
          />

        </section>

        <section className="mt-4 rounded-2xl bg-white p-5 shadow-sm">

          <div className="mb-4 max-h-[55vh] space-y-3 overflow-y-auto">

            {receiverId && messages.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No messages yet. Start the conversation.
              </div>
            ) : (
              messages.map((message) => {
                const mine = message.sender_id === userId;

                return (
                  <div
                    key={message.id}
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
                      <p className="text-sm">
                        {message.content}
                      </p>

                      <p
                        className={`mt-1 text-[10px] ${
                          mine
                            ? 'text-gray-400'
                            : 'text-gray-500'
                        }`}
                      >
                        {message.created_at
                          ? new Date(
                              message.created_at
                            ).toLocaleString()
                          : ''}
                      </p>
                    </div>
                  </div>
                );
              })
            )}

          </div>

          <div className="flex gap-2">

            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
              placeholder="Write a message..."
              disabled={!receiverId || sending}
              className="min-w-0 flex-1 rounded-xl border p-3"
            />

            <button
              onClick={sendMessage}
              disabled={!receiverId || !text.trim() || sending}
              className="rounded-xl bg-black px-5 font-bold text-white disabled:opacity-50"
            >
              {sending ? '...' : 'Send'}
            </button>

          </div>

        </section>

        <div className="mt-5 grid grid-cols-3 gap-2">

          <a
            href="/"
            className="rounded-xl bg-white p-3 text-center text-sm font-bold shadow-sm"
          >
            🏠 Home
          </a>

          <a
            href="/search"
            className="rounded-xl bg-white p-3 text-center text-sm font-bold shadow-sm"
          >
            🔎 Discover
          </a>

          <a
            href="/dashboard"
            className="rounded-xl bg-black p-3 text-center text-sm font-bold text-white"
          >
            📊 Dashboard
          </a>

        </div>

      </div>
    </main>
  );
}
