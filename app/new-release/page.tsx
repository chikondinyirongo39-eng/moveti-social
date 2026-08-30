'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

export default function NewRelease() {
  const [artist, setArtist] = useState('Astravet CN');
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [date, setDate] = useState('');
  const [copyright, setCopyright] = useState('');
  const [spotify, setSpotify] = useState(true);
  const [apple, setApple] = useState(true);
  const [audiomack, setAudiomack] = useState(true);
  const [boomplay, setBoomplay] = useState(true);
  const [youtube, setYoutube] = useState(true);
  const [explicit, setExplicit] = useState(false);
  const [rights, setRights] = useState(false);
  const supabase = createClient();
useEffect(() => {
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) return;
  supabase.from('releases').select('*').eq('id', id).single().then(({ data }) => {
    if (!data) return;
    setArtist(data.artist || 'Astravet CN');
    setTitle(data.title || '');
    setGenre(data.genre || '');
    setDate(data.release_date || '');
    setCopyright(data.copyright || '');
  });
}, []);
const [message, setMessage] = useState('');

  function createRelease() {
    if (!artist.trim() || !title.trim() || !genre.trim() || !date) {
      setMessage('Please complete the artist, title, genre and release date.');
      return;
    }

    if (!rights) {
      setMessage('Please confirm that you have the necessary rights to distribute this music.');
      return;
    }

    const platforms: string[] = [];

    if (spotify) platforms.push('Spotify');
    if (apple) platforms.push('Apple Music');
    if (audiomack) platforms.push('Audiomack');
    if (boomplay) platforms.push('Boomplay');
    if (youtube) platforms.push('YouTube / YouTube Music');

    if (platforms.length === 0) {
      setMessage('Please select at least one distribution platform.');
      return;
    }

    const editId = new URLSearchParams(window.location.search).get('id');

    const existing = JSON.parse(
      localStorage.getItem('moveti_releases') || '[]'
    );

    if (editId) {
      const updated = existing.map((release: any) =>
        String(release.id) === String(editId)
          ? {
              ...release,
              artist: artist.trim(),
              title: title.trim(),
              genre: genre.trim(),
              date,
              release_date: date,
              copyright: copyright.trim(),
              platforms,
              explicit,
              rights
            }
          : release
      );

      localStorage.setItem(
        'moveti_releases',
        JSON.stringify(updated)
      );

      setMessage('Release updated successfully.');
      window.location.href = '/releases';
      return;
    }

    const release = {
      id: Date.now(),
      artist: artist.trim(),
      title: title.trim(),
      genre: genre.trim(),
      date,
      release_date: date,
      copyright: copyright.trim(),
      platforms,
      explicit,
      rights,
      status: 'Payment Pending',
      fee: 'K5,000',
      royalty: '95% Artist / 5% MOVETI',
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(
      'moveti_releases',
      JSON.stringify([...existing, release])
    );

    window.location.href = '/releases';
  }

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <div style={brand}>MOVETI</div>

        <h1 style={titleStyle}>🎵 Add New Release</h1>

        <p style={subtitleStyle}>
          Prepare your music for worldwide MOVETI distribution.
        </p>

        <label style={labelStyle}>Artist name</label>
        <input
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Artist name"
          style={inputStyle}
        />

        <label style={labelStyle}>Song / release title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter song title"
          style={inputStyle}
        />

        <label style={labelStyle}>Genre</label>
        <input
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="Afrobeat, Amapiano, R&B..."
          style={inputStyle}
        />

        <label style={labelStyle}>Release date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={inputStyle}
        />

        <label style={labelStyle}>Copyright information</label>
        <textarea
          value={copyright}
          onChange={(e) => setCopyright(e.target.value)}
          placeholder="Explain who owns the copyright"
          style={{
            ...inputStyle,
            minHeight: '100px',
            resize: 'vertical'
          }}
        />

        <h2 style={sectionTitle}>Distribution platforms</h2>

        <Platform
          name="Spotify"
          checked={spotify}
          setChecked={setSpotify}
        />

        <Platform
          name="Apple Music"
          checked={apple}
          setChecked={setApple}
        />

        <Platform
          name="Audiomack"
          checked={audiomack}
          setChecked={setAudiomack}
        />

        <Platform
          name="Boomplay"
          checked={boomplay}
          setChecked={setBoomplay}
        />

        <Platform
          name="YouTube / YouTube Music"
          checked={youtube}
          setChecked={setYoutube}
        />

        <label style={checkStyle}>
          <input
            type="checkbox"
            checked={rights}
            onChange={(e) => setRights(e.target.checked)}
          />
          <span>
            I confirm that I have the necessary rights to distribute this music.
          </span>
        </label>

        <label style={checkStyle}>
          <input
            type="checkbox"
            checked={explicit}
            onChange={(e) => setExplicit(e.target.checked)}
          />
          <span>This release contains explicit content.</span>
        </label>

        {message && (
          <div style={messageStyle}>
            {message}
          </div>
        )}

        <div style={paymentBox}>
          <strong>Distribution fee: K5,000</strong>
          <span>Artist royalty: 95% • MOVETI: 5%</span>
        </div>

        <button onClick={createRelease} style={buttonStyle}>
          Continue to Payment →
        </button>

        <button
          onClick={() => window.location.href = '/releases'}
          style={backButtonStyle}
        >
          Cancel
        </button>
      </section>
    </main>
  );
}

function Platform({
  name,
  checked,
  setChecked
}: {
  name: string;
  checked: boolean;
  setChecked: (value: boolean) => void;
}) {
  return (
    <label style={platformStyle}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      <span>{name}</span>
    </label>
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

const cardStyle = {
  width: '100%',
  maxWidth: '650px',
  margin: '0 auto',
  padding: '28px',
  background: '#11151c',
  border: '1px solid #252a33',
  borderRadius: '20px',
  boxSizing: 'border-box' as const
};

const brand = {
  fontSize: '15px',
  fontWeight: '900' as const,
  letterSpacing: '2px',
  marginBottom: '20px'
};

const titleStyle = {
  fontSize: '30px',
  fontWeight: '900' as const,
  margin: '0 0 8px'
};

const subtitleStyle = {
  color: '#9da5b2',
  marginBottom: '28px',
  lineHeight: 1.5
};

const labelStyle = {
  display: 'block',
  fontWeight: '700' as const,
  fontSize: '14px',
  marginBottom: '8px'
};

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box' as const,
  padding: '14px',
  marginBottom: '18px',
  borderRadius: '12px',
  border: '1px solid #333a46',
  background: '#181d25',
  color: 'white',
  fontSize: '15px',
  outline: 'none'
};

const sectionTitle = {
  fontSize: '18px',
  fontWeight: '800' as const,
  margin: '10px 0 14px'
};

const platformStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '15px',
  marginBottom: '10px',
  background: '#181d25',
  border: '1px solid #292f39',
  borderRadius: '12px',
  fontWeight: '600' as const
};

const checkStyle = {
  display: 'flex',
  gap: '10px',
  alignItems: 'flex-start',
  margin: '18px 0',
  color: '#b5bcc7',
  fontSize: '14px',
  lineHeight: 1.5
};

const paymentBox = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '7px',
  marginTop: '24px',
  padding: '16px',
  borderRadius: '14px',
  background: '#191f28',
  border: '1px solid #303744'
};

const buttonStyle = {
  width: '100%',
  padding: '16px',
  marginTop: '18px',
  borderRadius: '14px',
  border: 'none',
  background: 'white',
  color: 'black',
  fontWeight: '900' as const,
  fontSize: '16px',
  cursor: 'pointer'
};

const backButtonStyle = {
  width: '100%',
  padding: '13px',
  marginTop: '10px',
  borderRadius: '14px',
  border: '1px solid #333a46',
  background: 'transparent',
  color: '#aeb6c2',
  fontWeight: '700' as const,
  fontSize: '14px',
  cursor: 'pointer'
};

const messageStyle = {
  marginTop: '15px',
  padding: '13px',
  background: '#2a2020',
  border: '1px solid #513737',
  borderRadius: '12px',
  color: '#ffb4b4',
  fontSize: '14px'
};
