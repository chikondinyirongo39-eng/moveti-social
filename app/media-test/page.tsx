"use client";

import { useState } from "react";
import { saveDraftMedia } from "@/lib/draftMedia";

export default function MediaTestPage() {
  const [audio, setAudio] = useState<File | null>(null);
  const [artwork, setArtwork] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  async function save() {
    await saveDraftMedia(audio, artwork);
    setMessage("Media saved privately on this device.");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "30px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Private Media Test</h1>

      <p>Audio</p>
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setAudio(e.target.files?.[0] || null)}
      />

      <p>Artwork</p>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setArtwork(e.target.files?.[0] || null)}
      />

      <br />

      <button
        type="button"
        onClick={save}
        style={{ marginTop: "20px", padding: "12px 20px" }}
      >
        Save Media Privately
      </button>

      {message && <p style={{ color: "green" }}>{message}</p>}
    </main>
  );
}
