"use client";
import MusicPlayer from "@/components/MusicPlayer";

import Link from "next/link";

const featuredMusic = [
  { title: "New Release", artist: "MOVETI Artist", icon: "🎵" },
  { title: "Latest Track", artist: "Featured Artist", icon: "🎧" },
{ title: "Hot Song", artist: "Trending Artist", icon: "🔥" },
];

const popularArtists = [
  "Astravet CN",
  "Featured Artist",
  "Rising Artist",
];

async function getTrendingReleases() {
  return [];
}

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f7f8",
        color: "#111",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <nav
        style={{
          background: "#fff",
          borderBottom: "1px solid #e8e8e8",
          padding: "18px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <strong style={{ fontSize: "25px" }}>MOVETI</strong>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Link
            href="/login"
            style={{
              color: "#111",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Login
          </Link>

          <Link
            href="/sign-up"
            style={{
              background: "#111",
              color: "#fff",
              padding: "10px 15px",
              borderRadius: "9px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Create Account
          </Link>
        </div>
      </nav>

      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "65px 20px 35px",
        }}
      >
        <div
          style={{
            background: "#111",
            color: "#fff",
            borderRadius: "22px",
            padding: "45px 25px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              opacity: 0.7,
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            Welcome to MOVETI
          </p>

          <h1
            style={{
              fontSize: "clamp(38px, 8vw, 68px)",
              margin: "15px 0",
            }}
          >
            Discover Music.
            <br />
            Discover Artists.
          </h1>

          <p
            style={{
              maxWidth: "650px",
              margin: "0 auto 25px",
              lineHeight: 1.6,
              color: "#ccc",
            }}
          >
            Discover and support music from Malawi and beyond.
          </p>

          <Link
            href="/sign-up"
            style={{
              display: "inline-block",
              background: "#fff",
              color: "#111",
              padding: "14px 24px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Join MOVETI
          </Link>
        </div>
      </section>

      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Featured Music</h2>
          <span style={{ color: "#777", fontSize: "14px" }}>
            Coming soon
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "16px",
          }}
        >
          {featuredMusic.map((song) => (
            <div
              key={song.title}
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "16px",
                border: "1px solid #e8e8e8",
              }}
            >
              <div
                style={{
                  height: "170px",
                  borderRadius: "12px",
                  background: "#e9e9eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "55px",
                  marginBottom: "14px",
                }}
              >
                {song.icon}
              </div>

              <h3 style={{ margin: "5px 0" }}>{song.title}</h3>

              <p style={{ margin: "5px 0", color: "#777" }}>
                {song.artist}
              </p>

              <button
                style={{
                  marginTop: "10px",
                  border: "none",
                  background: "#111",
                  color: "#fff",
                  padding: "9px 15px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                ▶ Play
              </button>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "35px 20px",
        }}
      >
        <h2>🔥 Trending Now</h2>
          <p>Discover what's popular on MOVETI.</p>
          <a
            href="/trending"
            style={{
              display: "inline-block",
              marginTop: "10px",
              padding: "10px 16px",
              borderRadius: "10px",
              textDecoration: "none",
              background: "#111",
              color: "#fff",
            }}
          >
            View Trending Music →
          </a>
        <h2>⭐ Popular Artists</h2>

        <div
          style={{
            display: "flex",
            gap: "15px",
            overflowX: "auto",
            paddingBottom: "10px",
          }}
        >
          {popularArtists.map((artist) => (
            <div
              key={artist}
              style={{
                minWidth: "160px",
                background: "#fff",
                borderRadius: "16px",
                padding: "20px",
                textAlign: "center",
                border: "1px solid #e8e8e8",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto 12px",
                  borderRadius: "50%",
                  background: "#e5e5e5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "30px",
                }}
              >
                👤
              </div>

              <strong>{artist}</strong>
            </div>
          ))}
        </div>
      </section>

      <MusicPlayer title="MOVETI Music" artist="Featured Artist" />
      <footer
        style={{
          background: "#111",
          color: "#aaa",
          textAlign: "center",
          padding: "30px 20px",
        }}
      >
        <strong style={{ color: "#fff" }}>MOVETI</strong>
        <p>Music discovery and artist platform.</p>
      </footer>

</main>
  );
}
