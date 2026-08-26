"use client";

import { useState } from "react";

export default function Distribute() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main style={{
      minHeight: "100vh",
      background: "#07090d",
      color: "white",
      fontFamily: "Arial, sans-serif",
      padding: "24px"
    }}>
      <div style={{
        maxWidth: "850px",
        margin: "0 auto"
      }}>

        <h1 style={{ fontSize: "38px" }}>
          MOVETI Distribution
        </h1>

        <p style={{
          color: "#9da5b2",
          fontSize: "18px"
        }}>
          Distribute your music to major streaming platforms worldwide.
        </p>

        <section style={{
          marginTop: "30px",
          padding: "25px",
          background: "#11151c",
          border: "1px solid #252b35",
          borderRadius: "20px"
        }}>
          <h2>🎵 Single Distribution</h2>

          <p style={{ color: "#9da5b2" }}>
            Upload one song and prepare it for worldwide distribution.
          </p>

          <h2 style={{ marginTop: "25px" }}>
            K5,000
          </h2>

          <p style={{ color: "#9da5b2" }}>
            One-time distribution fee
          </p>
        </section>

        <section style={{
          marginTop: "20px",
          padding: "25px",
          background: "#11151c",
          border: "1px solid #252b35",
          borderRadius: "20px"
        }}>
          <h2>Release information</h2>

          <input placeholder="Artist name" style={inputStyle} />
          <input placeholder="Song title" style={inputStyle} />
          <input placeholder="Genre" style={inputStyle} />
          <input type="date" style={inputStyle} />

          <label style={{ display: "block", marginBottom: "8px" }}>
            Audio file
          </label>
          <input type="file" accept="audio/*" style={inputStyle} />

          <label style={{ display: "block", marginBottom: "8px" }}>
            Cover artwork
          </label>
          <input type="file" accept="image/*" style={inputStyle} />

          <textarea
            placeholder="Songwriter / copyright information"
            style={{
              ...inputStyle,
              minHeight: "100px"
            }}
          />

          <label style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            color: "#c5cad2",
            margin: "15px 0"
          }}>
            <input type="checkbox" />
            I confirm that I own or control the rights to this music.
          </label>

          <button
            onClick={() => setSubmitted(true)}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "14px",
              border: "none",
              background: "white",
              color: "black",
              fontWeight: "bold",
              fontSize: "16px"
            }}
          >
            Pay K5,000 & Submit
          </button>

          {submitted && (
            <div style={{
              marginTop: "20px",
              padding: "18px",
              borderRadius: "14px",
              background: "#17251c"
            }}>
              <strong>Release ready for payment.</strong>
              <p style={{ color: "#9da5b2" }}>
                The real payment and distribution connection will be added
                after we finish the prototype.
              </p>
            </div>
          )}
        </section>

        <section style={{
          marginTop: "20px",
          padding: "25px",
          background: "#11151c",
          border: "1px solid #252b35",
          borderRadius: "20px"
        }}>
          <h2>💰 Royalty split</h2>

          <p>Artist: <strong>95%</strong></p>
          <p>MOVETI: <strong>5%</strong></p>

          <p style={{ color: "#777f8c" }}>
            Royalty reporting and payments will be connected later.
          </p>
        </section>

      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "14px",
  marginBottom: "16px",
  borderRadius: "12px",
  border: "1px solid #333",
  background: "#181d25",
  color: "white",
  fontSize: "16px"
};
