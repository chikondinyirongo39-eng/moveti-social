"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#111111",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "28px" }}>MOVETI</h1>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link href="/login">Login</Link>
          <Link href="/sign-up">Create Account</Link>
        </div>
      </nav>

      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "80px 20px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "48px", marginBottom: "15px" }}>
          Discover Music. Discover Artists.
        </h2>

        <p style={{ fontSize: "18px", color: "#666", marginBottom: "30px" }}>
          Your home for discovering and supporting music from Malawi and beyond.
        </p>

        <Link
          href="/sign-up"
          style={{
            display: "inline-block",
            padding: "14px 24px",
            background: "#111111",
            color: "#ffffff",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Create Your Account
        </Link>
      </section>

      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <h3>Discover New Music</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginTop: "20px",
          }}
        >
          {["New Releases", "Popular Artists", "Trending Music"].map((item) => (
            <div
              key={item}
              style={{
                padding: "30px 20px",
                border: "1px solid #eeeeee",
                borderRadius: "14px",
                background: "#fafafa",
              }}
            >
              <h4>{item}</h4>
              <p style={{ color: "#777" }}>
                Music and artists will appear here.
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
