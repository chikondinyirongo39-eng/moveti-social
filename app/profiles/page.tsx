"use client";

import { useState } from "react";

export default function Profiles() {
  const [saved, setSaved] = useState(false);

  return (
    <main style={{
      minHeight: "100vh",
      background: "#07090d",
      color: "white",
      fontFamily: "Arial, sans-serif",
      padding: "24px"
    }}>
      <div style={{
        maxWidth: "700px",
        margin: "0 auto"
      }}>

        <h1>🔗 My Artist Profiles</h1>

        <p style={{ color: "#9da5b2", lineHeight: 1.6 }}>
          Connect your existing artist profiles so MOVETI can identify
          the correct artist when your music is distributed.
        </p>

        <section style={{
          marginTop: "25px",
          padding: "25px",
          background: "#11151c",
          border: "1px solid #252b35",
          borderRadius: "20px"
        }}>

          <h2>🟢 Spotify</h2>
          <input
            placeholder="Paste your Spotify artist URL or URI"
            style={inputStyle}
          />

          <h2>🍎 Apple Music</h2>
          <input
            placeholder="Paste your Apple Music artist page or Artist ID"
            style={inputStyle}
          />

          <h2>🔵 Audiomack</h2>
          <input
            placeholder="Paste your Audiomack artist profile"
            style={inputStyle}
          />

          <h2>🟠 Boomplay</h2>
          <input
            placeholder="Paste your Boomplay artist profile"
            style={inputStyle}
          />

          <h2>▶️ YouTube</h2>
          <input
            placeholder="Paste your YouTube artist/channel URL"
            style={inputStyle}
          />

          <p style={{
            color: "#7f8794",
            fontSize: "14px",
            lineHeight: 1.5,
            marginTop: "20px"
          }}>
            MOVETI will not ask for or store your platform passwords.
            These fields are for artist profile identification.
          </p>

          <button
            onClick={() => setSaved(true)}
            style={buttonStyle}
          >
            Save Artist Profiles
          </button>

          {saved && (
            <div style={{
              marginTop: "20px",
              padding: "18px",
              background: "#17251c",
              borderRadius: "14px"
            }}>
              ✅ Artist profile information saved.
            </div>
          )}

        </section>

        <button
          onClick={() => window.location.href = "/new-release"}
          style={{
            ...buttonStyle,
            background: "#181d25",
            color: "white",
            border: "1px solid #333"
          }}
        >
          🎵 Continue to New Release
        </button>

      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "14px",
  marginTop: "8px",
  marginBottom: "25px",
  borderRadius: "12px",
  border: "1px solid #333",
  background: "#181d25",
  color: "white",
  fontSize: "16px"
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
  marginTop: "10px"
};
