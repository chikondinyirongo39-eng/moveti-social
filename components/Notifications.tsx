'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

type Notification = {
  id: string | number;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
};

export default function Notifications() {
  const supabase = createClient();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = '/login';
      return;
    }

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setNotifications(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(id: string | number) {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    );
  }

  async function markAllRead() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);

    setNotifications((current) =>
      current.map((item) => ({ ...item, read: true }))
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-5">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center">
          Loading notifications...
        </div>
      </main>
    );
  }

  const unread = notifications.filter((item) => !item.read).length;

  return (
    <main className="min-h-screen bg-gray-50 p-5 pb-10">
      <div className="mx-auto max-w-2xl">

        <div className="rounded-3xl bg-black p-6 text-white">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-black">
                🔔 Notifications
              </h1>

              <p className="mt-1 text-gray-300">
                {unread} unread notification{unread === 1 ? '' : 's'}
              </p>
            </div>

            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-black"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>

        <section className="mt-5 space-y-3">

          {notifications.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <div className="text-4xl">🔔</div>

              <h2 className="mt-3 font-black">
                No notifications yet
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                New activity will appear here.
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <button
                key={item.id}
                onClick={() => markRead(item.id)}
                className={`w-full rounded-2xl p-4 text-left shadow-sm ${
                  item.read
                    ? 'bg-white'
                    : 'bg-gray-100'
                }`}
              >
                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white">
                    {item.type === 'follow'
                      ? '👥'
                      : item.type === 'like'
                        ? '❤️'
                        : item.type === 'comment'
                          ? '💬'
                          : item.type === 'message'
                            ? '✉️'
                            : '🔔'}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="font-medium">
                      {item.message || 'You have a new notification.'}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString()
                        : ''}
                    </p>

                  </div>

                  {!item.read && (
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-black" />
                  )}

                </div>
              </button>
            ))
          )}

        </section>

        <div className="mt-6 grid grid-cols-3 gap-2">

          <a
            href="/"
            className="rounded-xl bg-white p-3 text-center text-sm font-bold shadow-sm"
          >
            🏠 Home
          </a>

          <a
            href="/messages"
            className="rounded-xl bg-white p-3 text-center text-sm font-bold shadow-sm"
          >
            💬 Messages
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
