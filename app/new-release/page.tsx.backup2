"use client";
import { createClient } from "@/lib/supabase";

import { useState } from "react";

export default function NewRelease() {
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [date, setDate] = useState("");
  const [spotify, setSpotify] = useState(true);
  const [apple, setApple] = useState(true);
  const [audiomack, setAudiomack] = useState(true);
  const [boomplay, setBoomplay] = useState(true);
  const [youtube, setYoutube] = useState(true);

  function createRelease() {
    const platforms = [];

    if (spotify) platforms.push("Spotify");
    if (apple) platforms.push("Apple Music");
    if (audiomack) platforms.push("Audiomack");
    if (boomplay) platforms.push("Boomplay");
    if (youtube) platforms.push("YouTube / YouTube Music");

    const release = {
      artist,
      title,
      genre,
      date,
      platforms,
      status: "Payment Pending",
      fee: "K5,000",
      royalty: "95% Artist / 5% MOVETI"
    };

    const existing = JSON.parse(
      localStorage.getItem("moveti_releases") || "[]"
    );

    localStorage.setItem(
      "moveti_releases",
      JSON.stringify([...existing, release])
    );

    window.location.href = "/releases";
  }

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <h1>🎵 Add New Release</h1>

        <p style={{ color: "#9da5b2" }}>
          Prepare your song for MOVETI Distribution.
        </p>

        <label>Artist name</label>
        <input
          placeholder="Artist name"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          style={inputStyle}
        />

        <label>Song title</label>
        <input
          placeholder="Song title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />

        <label>Genre</label>
        <input
          placeholder="Afrobeat, Hip-Hop, R&B..."
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={inputStyle}
        />

        <label>Release date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={inputStyle}
        />

        <label>Audio file</label>
        <input type="file" accept="audio/*" style={inputStyle} />

        <label>Cover artwork</label>
        <input type="file" accept="image/*" style={inputStyle} />

        <h2>🌍 Distribution Platforms</h2>

        <p style={{ color: "#9da5b2" }}>
          Choose the existing artist profiles where this release should be
          delivered. MOVETI never asks for platform passwords.
        </p>

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

        <label>Songwriter information</label>
        <textarea
          placeholder="Enter songwriter/composer information"
          style={{
            ...inputStyle,
            minHeight: "100px"
          }}
        />

        <label>Copyright information</label>
        <textarea
          placeholder="Explain who owns the copyright"
          style={{
            ...inputStyle,
            minHeight: "100px"
          }}
        />

        <label style={checkStyle}>
          <input type="checkbox" />
          I confirm that I have the necessary rights to distribute this music.
        </label>

        <label style={checkStyle}>
          <input type="checkbox" />
          This release contains explicit content.
        </label>

        <button onClick={createRelease} style={buttonStyle}>
          Continue to Payment — K5,000
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
    <label style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "14px",
      marginBottom: "10px",
      background: "#181d25",
      borderRadius: "12px"
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      {name}
    </label>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#07090d",
  color: "white",
  fontFamily: "Arial, sans-serif",
  padding: "24px"
};

const cardStyle = {
  width: "100%",
  maxWidth: "650px",
  margin: "0 auto",
  padding: "28px",
  background: "#11151c",
  border: "1px solid #252b35",
  borderRadius: "20px",
  boxSizing: "border-box" as const
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "14px",
  marginTop: "8px",
  marginBottom: "18px",
  borderRadius: "12px",
  border: "1px solid #333",
  background: "#181d25",
  color: "white",
  fontSize: "16px"
};

const checkStyle = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  margin: "15px 0",
  color: "#c5cad2"
};

const buttonStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "14px",
  border: "none",
  background: "white",
  color: "black",
  fontWeight: "bold" as const,
  fontSize: "16px",
  marginTop: "15px"
};
