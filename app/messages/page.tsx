'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

type Message = {
  id: string;
  content: string;
  created_at: string;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMessages() {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('messages')
        .select('id, content, created_at')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(50);

      setMessages(data || []);
      setLoading(false);
    }

    loadMessages();
  }, []);

  return (
    <main className="min-h-screen bg-[#07090d] px-5 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-gray-400">
          ← Home
        </Link>

        <h1 className="mt-6 text-3xl font-black">Messages</h1>

        <div className="mt-6 space-y-3">
          {loading ? (
            <div className="rounded-2xl bg-[#11151d] p-6 text-gray-400">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="rounded-2xl bg-[#11151d] p-8 text-center text-gray-400">
              No messages yet.
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className="rounded-2xl bg-[#11151d] p-5"
              >
                <p>{message.content}</p>
                <p className="mt-2 text-xs text-gray-500">
                  {new Date(message.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
