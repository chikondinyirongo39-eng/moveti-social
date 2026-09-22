'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Notification = {
  id: string
  text: string
  createdAt: string
  read: boolean
}

const KEY = 'moveti_notifications'

function load(): Notification[] {
  try {
    const value = localStorage.getItem(KEY)
    return value ? JSON.parse(value) : []
  } catch {
    return []
  }
}

function save(value: Notification[]) {
  localStorage.setItem(KEY, JSON.stringify(value))
}

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([])

  useEffect(() => {
    const current = load()
    setItems(current.map(item => ({ ...item, read: true })))
    save(current.map(item => ({ ...item, read: true })))
  }, [])

  function clearAll() {
    setItems([])
    save([])
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <div style={styles.logo}>MOVETI</div>
          <h1 style={styles.heading}>Notifications</h1>
          <p style={styles.sub}>Stay up to date with your activity.</p>
        </div>

        <div style={styles.links}>
          <Link href="/discover" style={styles.secondary}>Discover</Link>
          <Link href="/dashboard" style={styles.secondary}>Dashboard</Link>
        </div>
      </header>

      <section style={styles.card}>
        <div style={styles.cardHead}>
          <h2 style={styles.title}>Activity</h2>
          {items.length > 0 && (
            <button onClick={clearAll} style={styles.clear}>
              Clear all
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.icon}>♡</div>
            <h3>No notifications</h3>
            <p>New activity will appear here.</p>
          </div>
        ) : (
          <div>
            {items.map(item => (
              <div key={item.id} style={styles.notification}>
                <div style={styles.dot} />
                <div style={{ flex: 1 }}>
                  <p style={styles.notificationText}>{item.text}</p>
                  <small style={styles.date}>
                    {new Date(item.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#0b0b0f',
    color: '#fff',
    padding: '28px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    maxWidth: '900px',
    margin: '0 auto 25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '15px',
    flexWrap: 'wrap'
  },
  logo: {
    fontWeight: 900,
    letterSpacing: '2px',
    fontSize: '18px'
  },
  heading: {
    margin: '8px 0 5px',
    fontSize: '32px'
  },
  sub: {
    margin: 0,
    color: '#999'
  },
  links: {
    display: 'flex',
    gap: '9px'
  },
  secondary: {
    color: '#fff',
    textDecoration: 'none',
    border: '1px solid #333',
    borderRadius: '9px',
    padding: '10px 14px'
  },
  card: {
    maxWidth: '900px',
    margin: '0 auto',
    background: '#111116',
    border: '1px solid #29292f',
    borderRadius: '15px',
    overflow: 'hidden'
  },
  cardHead: {
    padding: '18px',
    borderBottom: '1px solid #29292f',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    margin: 0,
    fontSize: '20px'
  },
  clear: {
    border: '1px solid #444',
    borderRadius: '8px',
    padding: '8px 11px',
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer'
  },
  empty: {
    padding: '55px 20px',
    textAlign: 'center',
    color: '#888'
  },
  icon: {
    fontSize: '38px',
    color: '#fff'
  },
  notification: {
    display: 'flex',
    gap: '12px',
    padding: '16px 18px',
    borderBottom: '1px solid #222229'
  },
  dot: {
    width: '9px',
    height: '9px',
    borderRadius: '50%',
    background: '#fff',
    marginTop: '6px',
    flexShrink: 0
  },
  notificationText: {
    margin: 0,
    color: '#ddd'
  },
  date: {
    display: 'block',
    marginTop: '5px',
    color: '#666'
  }
}
