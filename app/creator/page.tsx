'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import MovetiCreatorCamera from '@/components/MovetiCreatorCamera'

type Release = {
  id: string
  title: string
  artistName: string
  genre: string
  releaseDate: string
  status: string
  platforms: string[]
}

type Post = {
  id?: string | number
  content?: string
  created_at?: string
  likes?: number
  comments?: number
}

function readReleases(): Release[] {
  try {
    const raw = localStorage.getItem('moveti_releases')
    if (!raw) return []
    const value = JSON.parse(raw)
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

export default function CreatorPage() {
  const [releases, setReleases] = useState<Release[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)

  useEffect(() => {
    setReleases(readReleases())

    fetch('/api/posts')
      .then(response => response.ok ? response.json() : [])
      .then(data => {
        setPosts(Array.isArray(data) ? data : Array.isArray(data?.posts) ? data.posts : [])
      })
      .catch(() => setPosts([]))
      .finally(() => setLoadingPosts(false))
  }, [])

  return (
    <main style={styles.page}>
      <MovetiCreatorCamera />
      <header style={styles.header}>
        <div>
          <div style={styles.logo}>MOVETI</div>
          <h1 style={styles.heading}>Creator Hub</h1>
          <p style={styles.sub}>
            Your content, community and music in one place.
          </p>
        </div>

        <div style={styles.actions}>
          <Link href="/dashboard" style={styles.secondary}>Dashboard</Link>
          <Link href="/releases" style={styles.primary}>Music Releases</Link>
        </div>
      </header>

      <section style={styles.hero}>
        <div>
          <span style={styles.eyebrow}>CREATOR PLATFORM</span>
          <h2 style={styles.heroTitle}>Create. Share. Release.</h2>
          <p style={styles.heroText}>
            MOVETI brings creator content and music distribution together,
            so artists can build an audience and prepare music for global
            distribution from the same platform.
          </p>
        </div>

        <div style={styles.stats}>
          <div style={styles.stat}>
            <strong>{posts.length}</strong>
            <span>Posts loaded</span>
          </div>
          <div style={styles.stat}>
            <strong>{releases.length}</strong>
            <span>Releases</span>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHead}>
          <div>
            <h2 style={styles.sectionTitle}>Creator Content</h2>
            <p style={styles.sub}>Your social content stays connected to your creator identity.</p>
          </div>
        </div>

        {loadingPosts ? (
          <div style={styles.card}>Loading creator content...</div>
        ) : posts.length === 0 ? (
          <div style={styles.empty}>
            <h3>No posts loaded</h3>
            <p>Your existing MOVETI posting system remains available from the dashboard.</p>
            <Link href="/dashboard" style={styles.primary}>Go to Dashboard</Link>
          </div>
        ) : (
          <div style={styles.postGrid}>
            {posts.slice(0, 12).map((post, index) => (
              <article key={post.id ?? index} style={styles.post}>
                <p style={styles.postText}>{post.content || 'Creator post'}</p>
                <div style={styles.postMeta}>
                  <span>♥ {post.likes ?? 0}</span>
                  <span>💬 {post.comments ?? 0}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHead}>
          <div>
            <h2 style={styles.sectionTitle}>Your Music</h2>
            <p style={styles.sub}>Releases prepared for the MOVETI distribution network.</p>
          </div>
          <Link href="/releases" style={styles.secondary}>Manage Releases</Link>
        </div>

        {releases.length === 0 ? (
          <div style={styles.empty}>
            <h3>No releases yet</h3>
            <p>Create a release to connect your music with your creator profile.</p>
            <Link href="/releases" style={styles.primary}>Create Release</Link>
          </div>
        ) : (
          <div style={styles.releaseGrid}>
            {releases.slice(0, 12).map(release => (
              <article key={release.id} style={styles.release}>
                <div style={styles.musicIcon}>♫</div>
                <div style={{ flex: 1 }}>
                  <h3 style={styles.releaseTitle}>{release.title}</h3>
                  <p style={styles.artist}>{release.artistName}</p>
                  <div style={styles.releaseMeta}>
                    <span>{release.genre || 'Music'}</span>
                    <span>{release.status}</span>
                  </div>
                  <div style={styles.badges}>
                    {release.platforms.map(platform => (
                      <span key={platform} style={styles.badge}>{platform}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section style={styles.bottom}>
        <h2 style={styles.sectionTitle}>One creator identity</h2>
        <p style={styles.sub}>
          MOVETI is designed so creators can build an audience through social
          content while keeping their music catalogue and distribution workflow
          connected.
        </p>
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
    maxWidth: '1100px',
    margin: '0 auto 25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '18px',
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
    color: '#999',
    lineHeight: 1.5
  },
  actions: {
    display: 'flex',
    gap: '9px',
    flexWrap: 'wrap'
  },
  primary: {
    display: 'inline-block',
    border: 0,
    borderRadius: '9px',
    padding: '11px 15px',
    background: '#fff',
    color: '#000',
    textDecoration: 'none',
    fontWeight: 700
  },
  secondary: {
    display: 'inline-block',
    border: '1px solid #333',
    borderRadius: '9px',
    padding: '10px 14px',
    color: '#fff',
    textDecoration: 'none'
  },
  hero: {
    maxWidth: '1100px',
    margin: '0 auto 25px',
    padding: '25px',
    border: '1px solid #29292f',
    borderRadius: '16px',
    background: '#111116',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '25px',
    flexWrap: 'wrap'
  },
  eyebrow: {
    fontSize: '11px',
    letterSpacing: '2px',
    color: '#888'
  },
  heroTitle: {
    fontSize: '28px',
    margin: '8px 0'
  },
  heroText: {
    maxWidth: '680px',
    color: '#aaa',
    lineHeight: 1.6,
    margin: 0
  },
  stats: {
    display: 'flex',
    gap: '10px',
    alignItems: 'stretch'
  },
  stat: {
    minWidth: '110px',
    padding: '15px',
    borderRadius: '11px',
    background: '#1a1a21',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  section: {
    maxWidth: '1100px',
    margin: '0 auto 28px'
  },
  sectionHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: '15px',
    flexWrap: 'wrap',
    marginBottom: '13px'
  },
  sectionTitle: {
    margin: 0,
    fontSize: '21px'
  },
  empty: {
    border: '1px dashed #333',
    borderRadius: '14px',
    padding: '35px 20px',
    textAlign: 'center',
    color: '#999'
  },
  card: {
    padding: '25px',
    border: '1px solid #29292f',
    borderRadius: '14px',
    background: '#111116',
    color: '#999'
  },
  postGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: '12px'
  },
  post: {
    minHeight: '130px',
    padding: '17px',
    border: '1px solid #29292f',
    borderRadius: '13px',
    background: '#111116',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  postText: {
    margin: 0,
    color: '#ddd',
    lineHeight: 1.5
  },
  postMeta: {
    display: 'flex',
    gap: '15px',
    color: '#777',
    fontSize: '12px',
    marginTop: '15px'
  },
  releaseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '12px'
  },
  release: {
    padding: '17px',
    border: '1px solid #29292f',
    borderRadius: '13px',
    background: '#111116',
    display: 'flex',
    gap: '13px'
  },
  musicIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '10px',
    background: '#202027',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '25px',
    flexShrink: 0
  },
  releaseTitle: {
    margin: 0,
    fontSize: '17px'
  },
  artist: {
    margin: '5px 0',
    color: '#aaa'
  },
  releaseMeta: {
    display: 'flex',
    gap: '10px',
    color: '#777',
    fontSize: '12px'
  },
  badges: {
    display: 'flex',
    gap: '5px',
    flexWrap: 'wrap',
    marginTop: '8px'
  },
  badge: {
    padding: '4px 7px',
    borderRadius: '5px',
    background: '#202027',
    color: '#999',
    fontSize: '10px'
  },
  bottom: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '22px',
    borderTop: '1px solid #29292f'
  }
}