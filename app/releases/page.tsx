'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type ReleaseStatus = 'Draft' | 'Submitted' | 'Approved' | 'Distributed'

type Release = {
  id: string
  title: string
  artistName: string
  genre: string
  releaseDate: string
  copyright: string
  platforms: string[]
  explicit: boolean
  artwork: string
  audioName: string
  status: ReleaseStatus
  createdAt: string
  updatedAt: string
}

const KEY = 'moveti_releases'

const emptyRelease: Release = {
  id: '',
  title: '',
  artistName: '',
  genre: '',
  releaseDate: '',
  copyright: '',
  platforms: [],
  explicit: false,
  artwork: '',
  audioName: '',
  status: 'Draft',
  createdAt: '',
  updatedAt: ''
}

const platforms = [
  'Spotify',
  'Apple Music',
  'YouTube Music',
  'Boomplay',
  'Audiomack'
]

function loadReleases(): Release[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveReleases(items: Release[]) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

export default function ReleasesPage() {
  const [releases, setReleases] = useState<Release[]>([])
  const [editing, setEditing] = useState<Release | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setReleases(loadReleases())
  }, [])

  const sorted = useMemo(
    () => [...releases].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [releases]
  )

  function update(field: keyof Release, value: string | boolean | string[]) {
    if (!editing) return
    setEditing({ ...editing, [field]: value })
  }

  function createRelease() {
    const now = new Date().toISOString()
    setEditing({
      ...emptyRelease,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    })
    setMessage('')
  }

  function editRelease(release: Release) {
    setEditing({ ...release })
    setMessage('')
  }

  function saveDraft() {
    if (!editing) return

    if (!editing.title.trim() || !editing.artistName.trim()) {
      setMessage('Song/release title and artist name are required.')
      return
    }

    const now = new Date().toISOString()
    const item = { ...editing, updatedAt: now }
    const next = releases.some(r => r.id === item.id)
      ? releases.map(r => r.id === item.id ? item : r)
      : [item, ...releases]

    saveReleases(next)
    setReleases(next)
    setEditing(null)
    setMessage('Release saved successfully.')
  }

  function submitRelease() {
    if (!editing) return

    if (
      !editing.title.trim() ||
      !editing.artistName.trim() ||
      !editing.genre.trim() ||
      !editing.releaseDate ||
      !editing.copyright.trim() ||
      editing.platforms.length === 0
    ) {
      setMessage('Complete all required release information before submitting.')
      return
    }

    const item = {
      ...editing,
      status: 'Submitted' as ReleaseStatus,
      updatedAt: new Date().toISOString()
    }

    const next = releases.some(r => r.id === item.id)
      ? releases.map(r => r.id === item.id ? item : r)
      : [item, ...releases]

    saveReleases(next)
    setReleases(next)
    setEditing(null)
    setMessage('Release submitted to MOVETI.')
  }

  function deleteRelease(id: string) {
    const next = releases.filter(r => r.id !== id)
    saveReleases(next)
    setReleases(next)
    if (editing?.id === id) setEditing(null)
  }

  function togglePlatform(platform: string) {
    if (!editing) return
    const selected = editing.platforms.includes(platform)
      ? editing.platforms.filter(p => p !== platform)
      : [...editing.platforms, platform]
    update('platforms', selected)
  }

  return (
    <main style={styles.page}>
      <div style={styles.top}>
        <div>
          <div style={styles.logo}>MOVETI</div>
          <h1 style={styles.heading}>Music Releases</h1>
          <p style={styles.sub}>Manage your music before distribution.</p>
        </div>

        <div style={styles.actions}>
          <Link href="/dashboard" style={styles.secondary}>Dashboard</Link>
          <button onClick={createRelease} style={styles.primary}>
            + New Release
          </button>
        </div>
      </div>

      {message && <div style={styles.message}>{message}</div>}

      {editing && (
        <section style={styles.editor}>
          <div style={styles.editorHead}>
            <div>
              <h2 style={styles.sectionTitle}>
                {editing.status === 'Draft' ? 'Create Release' : 'Edit Release'}
              </h2>
              <p style={styles.sub}>Prepare this release for future distribution.</p>
            </div>
            <button onClick={() => setEditing(null)} style={styles.close}>Cancel</button>
          </div>

          <div style={styles.grid}>
            <label style={styles.label}>
              Artist name *
              <input
                value={editing.artistName}
                onChange={e => update('artistName', e.target.value)}
                style={styles.input}
                placeholder="Artist name"
              />
            </label>

            <label style={styles.label}>
              Song / release title *
              <input
                value={editing.title}
                onChange={e => update('title', e.target.value)}
                style={styles.input}
                placeholder="Song title"
              />
            </label>

            <label style={styles.label}>
              Genre *
              <input
                value={editing.genre}
                onChange={e => update('genre', e.target.value)}
                style={styles.input}
                placeholder="Afrobeat, Hip-Hop, R&B..."
              />
            </label>

            <label style={styles.label}>
              Release date *
              <input
                type="date"
                value={editing.releaseDate}
                onChange={e => update('releaseDate', e.target.value)}
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              Copyright information *
              <input
                value={editing.copyright}
                onChange={e => update('copyright', e.target.value)}
                style={styles.input}
                placeholder="© 2026 Artist / MOVETI"
              />
            </label>

            <label style={styles.label}>
              Audio file
              <input
                type="file"
                accept="audio/*"
                onChange={e => update('audioName', e.target.files?.[0]?.name || '')}
                style={styles.input}
              />
              {editing.audioName && <small style={styles.small}>{editing.audioName}</small>}
            </label>
          </div>

          <div style={styles.block}>
            <div style={styles.labelTitle}>Distribution platforms *</div>
            <div style={styles.platforms}>
              {platforms.map(platform => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => togglePlatform(platform)}
                  style={{
                    ...styles.platform,
                    ...(editing.platforms.includes(platform) ? styles.platformActive : {})
                  }}
                >
                  {editing.platforms.includes(platform) ? '✓ ' : ''}{platform}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.block}>
            <label style={styles.checkbox}>
              <input
                type="checkbox"
                checked={editing.explicit}
                onChange={e => update('explicit', e.target.checked)}
              />
              This release contains explicit content
            </label>
          </div>

          <div style={styles.royalty}>
            <strong>Artist royalties: 100%</strong>
            <span>MOVETI royalty commission: 0%</span>
          </div>

          <div style={styles.buttons}>
            <button onClick={saveDraft} style={styles.secondaryButton}>
              Save Draft
            </button>
            <button onClick={submitRelease} style={styles.primary}>
              Submit Release
            </button>
          </div>
        </section>
      )}

      <section>
        <h2 style={styles.sectionTitle}>Your Releases</h2>

        {sorted.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>♫</div>
            <h3>No releases yet</h3>
            <p>Create your first release and prepare it for distribution.</p>
            <button onClick={createRelease} style={styles.primary}>
              Create First Release
            </button>
          </div>
        ) : (
          <div style={styles.list}>
            {sorted.map(release => (
              <article key={release.id} style={styles.card}>
                <div style={styles.cardMain}>
                  <div style={styles.art}>
                    {release.artwork ? (
                      <img src={release.artwork} alt="" style={styles.artImg} />
                    ) : (
                      <span>♫</span>
                    )}
                  </div>

                  <div style={styles.cardInfo}>
                    <h3 style={styles.title}>{release.title}</h3>
                    <p style={styles.artist}>{release.artistName}</p>
                    <div style={styles.meta}>
                      <span>{release.genre || 'Genre not set'}</span>
                      <span>{release.releaseDate || 'Release date not set'}</span>
                    </div>
                    <div style={styles.badges}>
                      {release.platforms.map(p => (
                        <span key={p} style={styles.badge}>{p}</span>
                      ))}
                    </div>
                  </div>

                  <div style={styles.status}>
                    <span style={{
                      ...styles.statusBadge,
                      ...(release.status === 'Submitted' ? styles.submitted :
                        release.status === 'Approved' ? styles.approved :
                        release.status === 'Distributed' ? styles.distributed : {})
                    }}>
                      {release.status}
                    </span>
                  </div>
                </div>

                <div style={styles.cardActions}>
                  <button onClick={() => editRelease(release)} style={styles.secondaryButton}>
                    Open
                  </button>
                  <button onClick={() => deleteRelease(release.id)} style={styles.delete}>
                    Delete
                  </button>
                </div>
              </article>
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
  top: {
    maxWidth: '1100px',
    margin: '0 auto 28px',
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
    margin: '8px 0 4px',
    fontSize: '32px'
  },
  sub: {
    margin: 0,
    color: '#999',
    fontSize: '14px'
  },
  actions: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  primary: {
    border: 0,
    borderRadius: '10px',
    padding: '12px 18px',
    background: '#fff',
    color: '#000',
    fontWeight: 700,
    cursor: 'pointer'
  },
  secondary: {
    border: '1px solid #333',
    borderRadius: '10px',
    padding: '11px 16px',
    color: '#fff',
    textDecoration: 'none'
  },
  message: {
    maxWidth: '1100px',
    margin: '0 auto 18px',
    padding: '12px 14px',
    borderRadius: '10px',
    background: '#17171d',
    color: '#ddd'
  },
  editor: {
    maxWidth: '1100px',
    margin: '0 auto 35px',
    padding: '22px',
    border: '1px solid #29292f',
    borderRadius: '16px',
    background: '#111116'
  },
  editorHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '15px',
    marginBottom: '22px'
  },
  sectionTitle: {
    fontSize: '21px',
    margin: '0 0 7px'
  },
  close: {
    background: 'transparent',
    color: '#aaa',
    border: '1px solid #333',
    borderRadius: '9px',
    padding: '9px 13px',
    cursor: 'pointer'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: '16px'
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
    color: '#bbb',
    fontSize: '13px'
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #303039',
    borderRadius: '9px',
    background: '#0b0b0f',
    color: '#fff',
    padding: '12px',
    outline: 'none'
  },
  small: {
    color: '#777'
  },
  block: {
    marginTop: '22px'
  },
  labelTitle: {
    color: '#bbb',
    fontSize: '13px',
    marginBottom: '10px'
  },
  platforms: {
    display: 'flex',
    gap: '9px',
    flexWrap: 'wrap'
  },
  platform: {
    border: '1px solid #34343d',
    borderRadius: '9px',
    background: '#18181e',
    color: '#ccc',
    padding: '10px 13px',
    cursor: 'pointer'
  },
  platformActive: {
    background: '#fff',
    color: '#000',
    borderColor: '#fff'
  },
  checkbox: {
    display: 'flex',
    gap: '9px',
    alignItems: 'center',
    color: '#bbb',
    fontSize: '14px'
  },
  royalty: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '18px',
    marginTop: '22px',
    padding: '14px',
    borderRadius: '10px',
    background: '#17171d',
    color: '#aaa'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '22px'
  },
  secondaryButton: {
    border: '1px solid #38383f',
    borderRadius: '9px',
    padding: '10px 15px',
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer'
  },
  delete: {
    border: '1px solid #713737',
    borderRadius: '9px',
    padding: '10px 15px',
    background: 'transparent',
    color: '#ff7777',
    cursor: 'pointer'
  },
  empty: {
    maxWidth: '1100px',
    margin: '0 auto',
    border: '1px dashed #333',
    borderRadius: '16px',
    padding: '50px 20px',
    textAlign: 'center',
    color: '#999'
  },
  emptyIcon: {
    fontSize: '42px',
    color: '#fff',
    marginBottom: '10px'
  },
  list: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'grid',
    gap: '14px'
  },
  card: {
    border: '1px solid #29292f',
    borderRadius: '14px',
    background: '#111116',
    padding: '16px'
  },
  cardMain: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  art: {
    width: '70px',
    height: '70px',
    borderRadius: '10px',
    background: '#202027',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
    fontSize: '25px'
  },
  artImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  cardInfo: {
    flex: 1,
    minWidth: 0
  },
  title: {
    margin: 0,
    fontSize: '18px'
  },
  artist: {
    margin: '5px 0',
    color: '#aaa'
  },
  meta: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    color: '#777',
    fontSize: '12px'
  },
  badges: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    marginTop: '8px'
  },
  badge: {
    padding: '4px 7px',
    borderRadius: '6px',
    background: '#202027',
    color: '#aaa',
    fontSize: '11px'
  },
  status: {
    alignSelf: 'flex-start'
  },
  statusBadge: {
    display: 'inline-block',
    padding: '6px 9px',
    borderRadius: '7px',
    background: '#25252b',
    color: '#bbb',
    fontSize: '11px',
    fontWeight: 700
  },
  submitted: {
    background: '#29251a',
    color: '#e4c879'
  },
  approved: {
    background: '#1d3021',
    color: '#8ee29a'
  },
  distributed: {
    background: '#1d2935',
    color: '#8cc8ff'
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '9px',
    marginTop: '14px',
    paddingTop: '13px',
    borderTop: '1px solid #24242a'
  }
}
