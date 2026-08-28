'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Release = {
  id: number;
  artist: string;
  title: string;
  genre: string;
  date: string;
  platforms: string[];
  status: string;
  fee: string;
  royalty: string;
  createdAt: string;
};

export default function ReleasesPage() {
  const [releases, setReleases] = useState<Release[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem('moveti_releases') || '[]'
      );
      setReleases(saved);
    } catch {
      setReleases([]);
    }
  }, []);

  function deleteRelease(id: number) {
    const updated = releases.filter((release) => release.id !== id);
    localStorage.setItem('moveti_releases', JSON.stringify(updated));
    setReleases(updated);
  }

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <div>
            <div style={brandStyle}>MOVETI</div>
            <h1 style={headingStyle}>My Releases</h1>
            <p style={mutedStyle}>
              Manage your music releases and distribution status.
            </p>
          </div>

          <Link href="/new-release" style={newButtonStyle}>
            + New Release
          </Link>
        </header>

        {releases.length === 0 ? (
          <section style={emptyStyle}>
            <div style={{ fontSize: '45px' }}>🎵</div>
            <h2 style={{ margin: '12px 0 8px' }}>
              No releases yet
            </h2>
            <p style={mutedStyle}>
              Add your first release and prepare it for distribution.
            </p>

            <Link href="/new-release" style={newButtonStyle}>
              Add New Release
            </Link>
          </section>
        ) : (
          <div style={listStyle}>
            {releases.map((release) => (
              <article key={release.id} style={cardStyle}>
                <div style={topRowStyle}>
                  <div>
                    <span style={statusStyle}>
                      {release.status}
                    </span>

                    <h2 style={releaseTitleStyle}>
                      {release.title}
                    </h2>

                    <p style={artistStyle}>
                      {release.artist} • {release.genre}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteRelease(release.id)}
                    style={deleteButtonStyle}
                  >
                    Delete
                  </button>
                </div>

                <div style={infoGridStyle}>
                  <div>
                    <small style={labelStyle}>Release date</small>
                    <strong>{release.date}</strong>
                  </div>

                  <div>
                    <small style={labelStyle}>Distribution fee</small>
                    <strong>{release.fee}</strong>
                  </div>

                  <div>
                    <small style={labelStyle}>Royalty</small>
                    <strong>{release.royalty}</strong>
                  </div>
                </div>

                <div style={{ marginTop: '18px' }}>
                  <small style={labelStyle}>Platforms</small>

                  <div style={platformsStyle}>
                    {release.platforms.map((platform) => (
                      <span key={platform} style={platformBadgeStyle}>
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={paymentStyle}>
                  <strong>Payment pending</strong>
                  <span>
                    Complete payment to submit this release for
                    distribution.
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

const pageStyle = {
  minHeight: '100vh',
  background: '#07090d',
  color: 'white',
  fontFamily: 'Arial, sans-serif',
  padding: '24px',
  boxSizing: 'border-box' as const
};

const containerStyle = {
  maxWidth: '900px',
  margin: '0 auto'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '20px',
  flexWrap: 'wrap' as const,
  marginBottom: '30px'
};

const brandStyle = {
  fontSize: '14px',
  fontWeight: '900' as const,
  letterSpacing: '3px',
  marginBottom: '8px'
};

const headingStyle = {
  margin: 0,
  fontSize: '32px',
  fontWeight: '900' as const
};

const mutedStyle = {
  color: '#929aa7',
  lineHeight: 1.5
};

const newButtonStyle = {
  display: 'inline-block',
  padding: '13px 18px',
  borderRadius: '13px',
  background: 'white',
  color: 'black',
  textDecoration: 'none',
  fontWeight: '900' as const
};

const emptyStyle = {
  padding: '60px 25px',
  textAlign: 'center' as const,
  background: '#11151c',
  border: '1px solid #252a33',
  borderRadius: '20px'
};

const listStyle = {
  display: 'grid',
  gap: '18px'
};

const cardStyle = {
  background: '#11151c',
  border: '1px solid #252a33',
  borderRadius: '20px',
  padding: '22px'
};

const topRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '20px',
  alignItems: 'flex-start'
};

const statusStyle = {
  display: 'inline-block',
  padding: '6px 10px',
  borderRadius: '999px',
  background: '#27231a',
  color: '#f1c76a',
  fontSize: '12px',
  fontWeight: '800' as const
};

const releaseTitleStyle = {
  fontSize: '24px',
  margin: '12px 0 5px',
  fontWeight: '900' as const
};

const artistStyle = {
  color: '#929aa7',
  margin: 0
};

const deleteButtonStyle = {
  border: '1px solid #543333',
  background: 'transparent',
  color: '#ff8d8d',
  borderRadius: '10px',
  padding: '8px 12px',
  cursor: 'pointer'
};

const infoGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '15px',
  marginTop: '22px',
  paddingTop: '18px',
  borderTop: '1px solid #252a33'
};

const labelStyle = {
  display: 'block',
  color: '#737c89',
  marginBottom: '5px'
};

const platformsStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '8px'
};

const platformBadgeStyle = {
  padding: '7px 10px',
  borderRadius: '9px',
  background: '#1b2028',
  color: '#cbd1da',
  fontSize: '13px'
};

const paymentStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '5px',
  marginTop: '20px',
  padding: '14px',
  borderRadius: '12px',
  background: '#1b1713',
  color: '#d5c0a0',
  fontSize: '13px'
};
