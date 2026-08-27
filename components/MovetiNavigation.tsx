'use client';

import { usePathname } from 'next/navigation';

export default function MovetiNavigation() {
  const pathname = usePathname();

  const items = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/search', label: 'Search', icon: '🔎' },
    { href: '/player', label: 'Music', icon: '🎵' },
    { href: '/messages', label: 'Messages', icon: '💬' },
    { href: '/notifications', label: 'Alerts', icon: '🔔' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 px-2 py-2 shadow-lg backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-around">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex min-w-14 flex-col items-center rounded-xl px-2 py-2 text-xs font-bold ${
                active
                  ? 'bg-black text-white'
                  : 'text-gray-500'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
