'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

type Notification = {
  id: string;
  type: string;
  message: string;
  created_at: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('notifications')
        .select('id, type, message, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      setNotifications(data || []);
      setLoading(false);
    }

    loadNotifications();
  }, []);

  return (
    <main className="min-h-screen bg-[#07090d] px-5 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-gray-400">
          ← Home
        </Link>

        <h1 className="mt-6 text-3xl font-black">Notifications</h1>

        <div className="mt-6 space-y-3">
          {loading ? (
            <div className="rounded-2xl bg-[#11151d] p-6 text-gray-400">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-2xl bg-[#11151d] p-8 text-center text-gray-400">
              No notifications yet.
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="rounded-2xl bg-[#11151d] p-5"
              >
                <p className="font-medium">{notification.message}</p>
                <p className="mt-2 text-xs text-gray-500">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
