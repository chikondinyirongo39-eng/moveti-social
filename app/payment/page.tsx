"use client";

import { useState } from "react";

export default function Payment() {
  const [method, setMethod] = useState("");
  const [paid, setPaid] = useState(false);

  function confirmPayment() {
    if (!method) {
      alert("Please choose a payment method.");
      return;
    }

    localStorage.setItem("moveti_payment_status", "Payment Submitted");

    const releases = JSON.parse(
      localStorage.getItem("moveti_releases") || "[]"
    );

    if (releases.length > 0) {
      const updated = releases.map((release: any, index: number) => {
        if (index === releases.length - 1) {
          return {
            ...release,
            status: "Under Review",
            paymentStatus: "Payment Submitted",
            paymentMethod: method
          };
        }

        return release;
      });

      localStorage.setItem(
        "moveti_releases",
        JSON.stringify(updated)
      );
    }

    setPaid(true);
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
        maxWidth: "650px",
        margin: "0 auto"
      }}>
        <h1>💳 MOVETI Payment</h1>

        <p style={{ color: "#9da5b2" }}>
          Complete the distribution payment for your release.
        </p>

        <section style={{
          marginTop: "25px",
          padding: "25px",
          background: "#11151c",
          border: "1px solid #252b35",
          borderRadius: "20px"
        }}>
          <h2>Single Distribution</h2>

          <div style={{
            fontSize: "32px",
            fontWeight: "bold",
            margin: "20px 0"
          }}>
            K5,000
          </div>

          <p style={{ color: "#9da5b2" }}>
            Royalty split
          </p>

          <p>
            <strong>95% Artist</strong> / <strong>5% MOVETI</strong>
          </p>

          <h3 style={{ marginTop: "30px" }}>
            Choose payment method
          </h3>

          <label style={optionStyle}>
            <input
              type="radio"
              name="payment"
              value="Airtel Money"
              onChange={(e) => setMethod(e.target.value)}
            />
            📱 Airtel Money
          </label>

          <label style={optionStyle}>
            <input
              type="radio"
              name="payment"
              value="TNM Mpamba"
              onChange={(e) => setMethod(e.target.value)}
            />
            📱 TNM Mpamba
          </label>

          <label style={optionStyle}>
            <input
              type="radio"
              name="payment"
              value="Bank"
              onChange={(e) => setMethod(e.target.value)}
            />
            🏦 Bank payment
          </label>

          {!paid ? (
            <button
              onClick={confirmPayment}
              style={buttonStyle}
            >
              Confirm Payment
            </button>
          ) : (
            <div style={{
              marginTop: "20px",
              padding: "20px",
              background: "#17251c",
              borderRadius: "14px"
            }}>
              <h2>✅ Payment Submitted</h2>

              <p>
                Method: <strong>{method}</strong>
              </p>

              <p>
                Amount: <strong>K5,000</strong>
              </p>

              <p style={{ color: "#9da5b2" }}>
                Your release is now waiting for payment verification.
              </p>

              <button
                onClick={() => window.location.href = "/releases"}
                style={buttonStyle}
              >
                View My Releases
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

const optionStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "16px",
  marginBottom: "12px",
  background: "#181d25",
  borderRadius: "12px",
  cursor: "pointer"
};

const buttonStyle = {
  width: "100%",
  padding: "16px",
  marginTop: "20px",
  borderRadius: "14px",
  border: "none",
  background: "white",
  color: "black",
  fontWeight: "bold" as const,
  fontSize: "16px"
};
