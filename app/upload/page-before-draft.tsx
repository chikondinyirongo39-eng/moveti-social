"use client";

import { useState } from "react";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("");
  const [audioName, setAudioName] = useState("");
  const [coverName, setCoverName] = useState("");

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f7f8",
        color: "#111",
        fontFamily: "Arial, sans-serif",
        padding: "30px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "18px",
          padding: "30px",
          border: "1px solid #e8e8e8",
        }}
      >
        <h1>Upload Music</h1>

        <p style={{ color: "#666" }}>
          Prepare your music for MOVETI. Nothing will be published yet.
        </p>

        <label>Song title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter song title"
          style={{
            width: "100%",
            padding: "13px",
            margin: "8px 0 20px",
            border: "1px solid #ddd",
            borderRadius: "9px",
          }}
        />

        <label>Artist name</label>
        <input
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Enter artist name"
          style={{
            width: "100%",
            padding: "13px",
            margin: "8px 0 20px",
            border: "1px solid #ddd",
            borderRadius: "9px",
          }}
        />

        <label>Genre</label>
        <input
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="Afrobeat, R&B, Hip-Hop..."
          style={{
            width: "100%",
            padding: "13px",
            margin: "8px 0 20px",
            border: "1px solid #ddd",
            borderRadius: "9px",
          }}
        />

        <label>Audio file</label>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) =>
            setAudioName(e.target.files?.[0]?.name || "")
          }
          style={{ margin: "10px 0 20px" }}
        />

        {audioName && (
          <p style={{ color: "#555" }}>
            Selected: {audioName}
          </p>
        )}

        <label>Cover artwork</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setCoverName(e.target.files?.[0]?.name || "")
          }
          style={{ margin: "10px 0 20px" }}
        />

        {coverName && (
          <p style={{ color: "#555" }}>
            Selected: {coverName}
          </p>
        )}

        <button
          type="button"
          style={{
            width: "100%",
            padding: "15px",
            marginTop: "15px",
            border: "none",
            borderRadius: "10px",
            background: "#111",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Save as Draft
        </button>
      </div>
    </main>
  );
}
