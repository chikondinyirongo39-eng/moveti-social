"use client";

import { useEffect, useState } from "react";

type Release = {
  artist: string;
  title: string;
  genre: string;
  date: string;
  platforms: string[];
  status: string;
  fee: string;
  royalty: string;
  paymentStatus?: string;
  paymentMethod?: string;
};

export default function Admin() {
  const [releases, setReleases] = useState<Release[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("moveti_releases");

    if (saved) {
      setReleases(JSON.parse(saved));
    }
  }, []);

  function updateStatus(index: number, status: string) {
    const updated = releases.map((release, i) =>
      i === index ? { ...release, status } : release
    );

    setReleases(updated);
    localStorage.setItem(
      "moveti_releases",
      JSON.stringify(updated)
    );
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#07090d",
      color: "white",
      fontFamily: "Arial, sans-serif",
      padding: "24px"
    }}>
      <div style={{
        maxWidth: "1000px",
        margin: "0 auto"
      }}>

        <h1>🛠️ MOVETI Admin</h1>

        <p style={{ color: "#9da5b2" }}>
          Review and manage submitted music releases.
        </p>

        {releases.length === 0 ? (
          <section style={cardStyle}>
            <h2>No releases yet</h2>
            <p style={{ color: "#9da5b2" }}>
              Submitted releases will appear here.
            </p>
          </section>
        ) : (
          releases.map((release, index) => (
            <section key={index} style={cardStyle}>

              <h2>🎵 {release.title}</h2>

              <p>
                Artist: <strong>{release.artist}</strong>
              </p>

              <p>Genre: {release.genre}</p>

              <p>Release date: {release.date}</p>

              <p>
                Status: <strong>{release.status}</strong>
              </p>

              <p>
                Payment:{" "}
                <strong>
                  {release.paymentStatus || "Not submitted"}
                </strong>
              </p>

              {release.paymentMethod && (
                <p>
                  Payment method:{" "}
                  <strong>{release.paymentMethod}</strong>
                </p>
              )}

              <h3>🌍 Platforms</h3>

              <div style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap"
              }}>
                {(release.platforms || []).map((platform) => (
                  <span
                    key={platform}
                    style={{
                      padding: "8px 12px",
                      background: "#181d25",
                      borderRadius: "20px"
                    }}
                  >
                    {platform}
                  </span>
                ))}
              </div>

              <p style={{ marginTop: "20px" }}>
                💰 {release.fee || "K5,000"}
              </p>

              <p>
                💵 {release.royalty || "95% Artist / 5% MOVETI"}
              </p>

              <div style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "20px"
              }}>
                <button
                  onClick={() =>
                    updateStatus(index, "Approved")
                  }
                  style={buttonStyle}
                >
                  ✅ Approve
                </button>

                <button
                  onClick={() =>
                    updateStatus(index, "Needs Changes")
                  }
                  style={{
                    ...buttonStyle,
                    background: "#181d25",
                    color: "white",
                    border: "1px solid #333"
                  }}
                >
                  ✏️ Needs Changes
                </button>

                <button
                  onClick={() =>
                    updateStatus(index, "Rejected")
                  }
                  style={{
                    ...buttonStyle,
                    background: "#181d25",
                    color: "white",
                    border: "1px solid #333"
                  }}
                >
                  ❌ Reject
                </button>
              </div>

              {release.status === "Approved" && (
                <button
                  onClick={() =>
                    updateStatus(index, "Ready for Distribution")
                  }
                  style={{
                    ...buttonStyle,
                    marginTop: "12px"
                  }}
                >
                  🌍 Ready for Distribution
                </button>
              )}

              {release.status === "Ready for Distribution" && (
                <button
                  onClick={() =>
                    updateStatus(index, "Live")
                  }
                  style={{
                    ...buttonStyle,
                    marginTop: "12px"
                  }}
                >
                  🚀 Mark as Live
                </button>
              )}

            </section>
          ))
        )}

      </div>
    </main>
  );
}

const cardStyle = {
  marginTop: "25px",
  padding: "25px",
  background: "#11151c",
  border: "1px solid #252b35",
  borderRadius: "20px"
};

const buttonStyle = {
  padding: "13px 18px",
  borderRadius: "12px",
  border: "none",
  background: "white",
  color: "black",
  fontWeight: "bold" as const,
  cursor: "pointer"
};
