"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase";

export default function Login() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Logging in...");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#07090d",
      color: "white",
      padding: "30px",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "30px",
        background: "#11151c",
        borderRadius: "20px"
      }}>
        <h1>🔐 Log In to MOVETI</h1>

        <p style={{ color: "#9da5b2" }}>
          Access your artist dashboard.
        </p>

        <form onSubmit={login}>
          <label>Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={inputStyle}
          />

          <label>Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            Log In
          </button>
        </form>

        {message && (
          <div style={messageStyle}>{message}</div>
        )}

        <button
          onClick={() => window.location.href = "/signup"}
          style={linkButton}
        >
          Don't have an account? Create one
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

const messageStyle = {
  marginTop: "20px",
  padding: "15px",
  background: "#181d25",
  borderRadius: "12px"
};

const linkButton = {
  width: "100%",
  marginTop: "18px",
  padding: "12px",
  border: "none",
  background: "transparent",
  color: "#aaa",
  fontSize: "15px"
};
