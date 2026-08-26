"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase";

export default function Signup() {
  const supabase = createClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function signup(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Creating your account...");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data.user) {
      setMessage(
        "Account created successfully! Check your email if confirmation is required."
      );
    }
  }

  return (
    <main style={pageStyle}>
      <div style={cardStyle}>
        <h1>✨ Create Your MOVETI Account</h1>

        <p style={{ color: "#9da5b2" }}>
          Create your account to continue.
        </p>

        <form onSubmit={signup}>
          <label>Name</label>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            style={inputStyle}
          />

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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            Create Account
          </button>
        </form>

        {message && (
          <div style={messageStyle}>
            {message}
          </div>
        )}

        <button
          onClick={() => (window.location.href = "/login")}
          style={linkButton}
        >
          Already have an account? Log in
        </button>
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
};

const cardStyle = {
  maxWidth: "500px",
  margin: "0 auto",
  padding: "30px",
  background: "#11151c",
  borderRadius: "20px",
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
  fontSize: "16px",
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
};

const messageStyle = {
  marginTop: "20px",
  padding: "15px",
  background: "#181d25",
  borderRadius: "12px",
};

const linkButton = {
  width: "100%",
  marginTop: "18px",
  padding: "12px",
  border: "none",
  background: "transparent",
  color: "#aaa",
  fontSize: "15px",
};
