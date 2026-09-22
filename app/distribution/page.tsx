'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Platform = {
  platform: string
  configured: boolean
  status: string
}

const names: Record<string, string> = {
  spotify: 'Spotify',
  apple_music: 'Apple Music',
  youtube_music: 'YouTube Music',
  boomplay: 'Boomplay',
  audiomack: 'Audiomack'
}

export default function DistributionPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/distribution/status')
      .then(r => r.json())
      .then(data => setPlatforms(data.platforms || []))
      .catch(() => setPlatforms([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main style={styles.page}>
      <div style={styles.top}>
        <div>
          <div style={styles.logo}>MOVETI</div>
          <h1 style={styles.heading}>Music Distribution</h1>
          <p style={styles.sub}>
            Distribution infrastructure for your artists and releases.
          </p>
        </div>

        <Link href="/releases" style={styles.link}>
          Releases
        </Link>
      </div>

      <section style={styles.hero}>
        <h2 style={styles.title}>Distribution Network</h2>
        <p style={styles.text}>
          MOVETI prepares release metadata and delivery jobs for supported
          streaming platforms. Live delivery is enabled only after an
          approved distribution provider is connected.
        </p>
      </section>

      <section style={styles.grid}>
        {loading ? (
          <div style={styles.card}>Loading distribution network...</div>
        ) : platforms.length === 0 ? (
          <div style={styles.card}>No distribution platforms configured.</div>
        ) : (
          platforms.map(item => (
            <div key={item.platform} style={styles.card}>
              <div style={styles.icon}>♫</div>
              <div style={{ flex: 1 }}>
                <h3 style={styles.platform}>{names[item.platform] || item.platform}</h3>
                <p style={styles.status}>
                  {item.configured
                    ? 'Provider endpoint configured'
                    : 'Provider connection required'}
                </p>
              </div>
              <span style={{
                ...styles.badge,
                ...(item.configured ? styles.ready : styles.waiting)
              }}>
                {item.configured ? 'READY' : 'SETUP'}
              </span>
            </div>
          ))
        )}
      </section>

      <section style={styles.info}>
        <h2 style={styles.title}>Release delivery flow</h2>
        <div style={styles.steps}>
          <div><b>1.</b> Artist submits release</div>
          <div><b>2.</b> MOVETI validates metadata and assets</div>
          <div><b>3.</b> Distribution package is generated</div>
          <div><b>4.</b> Delivery job is queued per platform</div>
          <div><b>5.</b> Approved provider receives the delivery</div>
          <div><b>6.</b> MOVETI records provider status and reference</div>
        </div>
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
  top: {
    maxWidth: '1100px',
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
  link: {
    color: '#fff',
    textDecoration: 'none',
    border: '1px solid #333',
    borderRadius: '9px',
    padding: '10px 15px'
  },
  hero: {
    maxWidth: '1100px',
    margin: '0 auto 18px',
    padding: '22px',
    border: '1px solid #29292f',
    borderRadius: '15px',
    background: '#111116'
  },
  title: {
    margin: '0 0 8px',
    fontSize: '21px'
  },
  text: {
    margin: 0,
    color: '#999',
    lineHeight: 1.6
  },
  grid: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '13px'
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '13px',
    padding: '17px',
    border: '1px solid #29292f',
    borderRadius: '13px',
    background: '#111116'
  },
  icon: {
    width: '45px',
    height: '45px',
    borderRadius: '10px',
    background: '#202027',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px'
  },
  platform: {
    margin: 0,
    fontSize: '16px'
  },
  status: {
    margin: '5px 0 0',
    color: '#777',
    fontSize: '12px'
  },
  badge: {
    padding: '6px 8px',
    borderRadius: '7px',
    fontSize: '10px',
    fontWeight: 800
  },
  ready: {
    background: '#19311f',
    color: '#8ee29a'
  },
  waiting: {
    background: '#29251a',
    color: '#e4c879'
  },
  info: {
    maxWidth: '1100px',
    margin: '22px auto 0',
    padding: '22px',
    border: '1px solid #29292f',
    borderRadius: '15px',
    background: '#111116'
  },
  steps: {
    display: 'grid',
    gap: '10px',
    color: '#aaa',
    lineHeight: 1.5
  }
}
