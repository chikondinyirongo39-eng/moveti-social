'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type Post = {
  id: number | string
  content: string
  likes: number
  comments: number
  created_at: string
}

type Creator = {
  id: string
  name: string
  username: string
  bio: string
}

type FollowMap = Record<string, boolean>

const CREATOR_KEY = 'moveti_following'

const demoCreators: Creator[] = [
  {
    id: 'creator-1',
    name: 'MOVETI Creators',
    username: 'moveticreators',
    bio: 'Music, creators and community on MOVETI.'
  },
  {
    id: 'creator-2',
    name: 'MOVETI Artists',
    username: 'movetiartists',
    bio: 'Discover artists and new music.'
  }
]

function getFollowing(): FollowMap {
  try {
    const value = localStorage.getItem(CREATOR_KEY)
    return value ? JSON.parse(value) : {}
  } catch {
    return {}
  }
}

function saveFollowing(value: FollowMap) {
  localStorage.setItem(CREATOR_KEY, JSON.stringify(value))
}

export default function DiscoverPage() {
  const [query, setQuery] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [following, setFollowing] = useState<FollowMap>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setFollowing(getFollowing())

    fetch('/api/posts')
      .then(response => response.ok ? response.json() : [])
      .then(data => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  function toggleFollow(id: string, name: string) {
    const next = { ...following, [id]: !following[id] }
    setFollowing(next)
    saveFollowing(next)

    try {
      const raw = localStorage.getItem('moveti_notifications')
      const notifications = raw ? JSON.parse(raw) : []
      if (next[id]) {
        notifications.unshift({
          id: crypto.randomUUID(),
          text: `You are now following ${name}.`,
          createdAt: new Date().toISOString(),
          read: false
        })
        localStorage.setItem(
          'moveti_notifications',
          JSON.stringify(notifications.slice(0, 100))
        )
      }
    } catch {}
  }

  const filteredCreators = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return demoCreators
    return demoCreators.filter(
      creator =>
        creator.name.toLowerCase().includes(q) ||
        creator.username.toLowerCase().includes(q) ||
        creator.bio.toLowerCase().includes(q)
    )
  }, [query])

  const filteredPosts = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return posts
    return posts.filter(post =>
      (post.content || '').toLowerCase().includes(q)
    )
  }, [posts, query])

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <div style={styles.logo}>MOVETI</div>
          <h1 style={styles.heading}>Discover</h1>
          <p style={styles.sub}>Find creators, posts and music.</p>
        </div>

        <div style={styles.links}>
          <Link href="/dashboard" style={styles.secondary}>Dashboard</Link>
          <Link href="/notifications" style={styles.secondary}>Notifications</Link>
        </div>
      </header>

      <section style={styles.searchBox}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search creators and posts..."
          style={styles.search}
        />
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHead}>
          <div>
            <h2 style={styles.title}>Creators</h2>
            <p style={styles.sub}>Discover people building on MOVETI.</p>
          </div>
        </div>

        <div style={styles.creatorGrid}>
          {filteredCreators.map(creator => (
            <article key={creator.id} style={styles.creator}>
              <div style={styles.avatar}>
                {creator.name.charAt(0).toUpperCase()}
              </div>

              <div style={styles.creatorInfo}>
                <h3 style={styles.creatorName}>{creator.name}</h3>
                <p style={styles.username}>@{creator.username}</p>
                <p style={styles.bio}>{creator.bio}</p>
              </div>

              <button
                onClick={() => toggleFollow(creator.id, creator.name)}
                style={
                  following[creator.id]
                    ? styles.followingButton
                    : styles.followButton
                }
              >
                {following[creator.id] ? 'Following' : 'Follow'}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHead}>
          <div>
            <h2 style={styles.title}>Discover Posts</h2>
            <p style={styles.sub}>Explore what people are sharing.</p>
          </div>
        </div>

        {loading ? (
          <div style={styles.empty}>Loading posts...</div>
        ) : filteredPosts.length === 0 ? (
          <div style={styles.empty}>
            No matching posts found.
          </div>
        ) : (
          <div style={styles.postGrid}>
            {filteredPosts.map(post => (
              <article key={post.id} style={styles.post}>
                <p style={styles.postContent}>{post.content}</p>
                <div style={styles.postMeta}>
                  <span>♥ {post.likes || 0}</span>
                  <span>💬 {post.comments || 0}</span>
                  <span>
                    {post.created_at
                      ? new Date(post.created_at).toLocaleDateString()
                      : ''}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section style={styles.bottom}>
        <h2 style={styles.title}>MOVETI Discovery</h2>
        <p style={styles.sub}>
          Search and discovery are designed to connect creators, social
          content and music as the platform grows.
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
  searchBox: {
    maxWidth: '1100px',
    margin: '0 auto 25px'
  },
  search: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '14px 16px',
    borderRadius: '11px',
    border: '1px solid #303039',
    background: '#111116',
    color: '#fff',
    outline: 'none',
    fontSize: '15px'
  },
  section: {
    maxWidth: '1100px',
    margin: '0 auto 28px'
  },
  sectionHead: {
    marginBottom: '13px'
  },
  title: {
    margin: 0,
    fontSize: '21px'
  },
  creatorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
    gap: '12px'
  },
  creator: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '15px',
    border: '1px solid #29292f',
    borderRadius: '13px',
    background: '#111116'
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: '#25252c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    flexShrink: 0
  },
  creatorInfo: {
    flex: 1,
    minWidth: 0
  },
  creatorName: {
    margin: 0,
    fontSize: '16px'
  },
  username: {
    margin: '3px 0',
    color: '#777',
    fontSize: '12px'
  },
  bio: {
    margin: 0,
    color: '#999',
    fontSize: '12px'
  },
  followButton: {
    border: 0,
    borderRadius: '8px',
    padding: '9px 12px',
    background: '#fff',
    color: '#000',
    fontWeight: 700,
    cursor: 'pointer'
  },
  followingButton: {
    border: '1px solid #444',
    borderRadius: '8px',
    padding: '8px 11px',
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer'
  },
  postGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
  postContent: {
    margin: 0,
    color: '#ddd',
    lineHeight: 1.55
  },
  postMeta: {
    display: 'flex',
    gap: '13px',
    color: '#777',
    fontSize: '11px',
    marginTop: '15px'
  },
  empty: {
    padding: '30px',
    border: '1px dashed #333',
    borderRadius: '13px',
    color: '#888',
    textAlign: 'center'
  },
  bottom: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '22px',
    borderTop: '1px solid #29292f'
  }
}
