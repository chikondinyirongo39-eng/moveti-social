'use client';

import Link from 'next/link';

export default function DiscoverArtists() {
  return (
    <main style={{ minHeight: '100vh', background: '#07090d', color: 'white', padding: '24px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Link href="/" style={{ color: '#aaa', textDecoration: 'none' }}>← Home</Link>

        <h1 style={{ fontSize: '32px', fontWeight: 800, marginTop: '24px' }}>
          Discover
        </h1>
        <p style={{ color: '#999' }}>
          Find artists, creators and music on MOVETI.
        </p>

        <div style={{ marginTop: '24px', display: 'flex', gap: '10px' }}>
          <input
            placeholder="Search artists or creators..."
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid #333',
              background: '#151515',
              color: 'white'
            }}
          />
          <button
            style={{
              padding: '14px 20px',
              borderRadius: '12px',
              border: 'none',
              background: 'white',
              color: 'black',
              fontWeight: 700
            }}
          >
            Search
          </button>
        </div>

        <div style={{
          marginTop: '30px',
          padding: '30px',
          borderRadius: '18px',
          background: '#111',
          border: '1px solid #222',
          textAlign: 'center'
        }}>
          <h2>No creators found yet</h2>
          <p style={{ color: '#888' }}>
            Artists and creators will appear here when they join MOVETI.
          </p>
        </div>
      </div>
    </main>
  );
}
