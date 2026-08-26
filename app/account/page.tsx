"use client";

import { useEffect, useState } from "react";

export default function Account() {
  const [artist, setArtist] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem("moveti_artist_profile");

    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setArtist(profile.artist || "");
      setEmail(profile.email || "");
      setCountry(profile.country || "");
      setBio(profile.bio || "");
    }
  }, []);

  function saveProfile() {
    const profile = {
      artist,
      email,
      country,
      bio
    };

    localStorage.setItem(
      "moveti_artist_profile",
      JSON.stringify(profile)
    );

    setSaved(true);
  }

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>

        <button
          onClick={() => window.location.href = "/dashboard"}
          style={backStyle}
        >
          ← Dashboard
        </button>

        <h1>👤 My Account</h1>

        <p style={{ color: "#9da5b2" }}>
          Manage your MOVETI artist information.
        </p>

        <section style={cardStyle}>

          <label>Artist Name</label>
          <input
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Your artist name"
            style={inputStyle}
          />

          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            type="email"
            style={inputStyle}
          />

          <label>Country</label>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Malawi"
            style={inputStyle}
          />

          <label>Artist Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell listeners about yourself..."
            style={{
              ...inputStyle,
              minHeight: "120px"
            }}
          />

          <button
            onClick={saveProfile}
            style={buttonStyle}
          >
            Save Profile
          </button>

          {saved && (
            <div style={successStyle}>
              ✅ Profile saved successfully!
            </div>
          )}

        </section>
      </div>
    </main>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#07090d",
  color: "white",
  padding: "30px",
  fontFamily: "Arial, sans-serif",
  boxSizing: "border-box" as const
};

const containerStyle = {
  maxWidth: "650px",
  margin: "0 auto"
};

const cardStyle = {
  marginTop: "25px",
  padding: "25px",
  background: "#11151c",
  border: "1px solid #252b35",
  borderRadius: "20px"
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "14px",
  marginTop: "8px",
  marginBottom: "20px",
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
  fontSize: "16px"
};

const backStyle = {
  padding: "10px 15px",
  borderRadius: "10px",
  border: "1px solid #333",
  background: "#181d25",
  color: "white",
  marginBottom: "20px"
};

const successStyle = {
  marginTop: "20px",
  padding: "16px",
  background: "#17251c",
  borderRadius: "12px"
};
