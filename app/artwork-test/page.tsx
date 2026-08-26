"use client";

import ArtworkPicker from "@/components/ArtworkPicker";

export default function ArtworkTestPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "30px 20px",
        background: "#f7f7f8",
        color: "#111",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1>Artwork Test</h1>
        <p style={{ color: "#666" }}>
          This is only a local test. Nothing will be published.
        </p>

        <ArtworkPicker />
      </div>
    </main>
  );
}
