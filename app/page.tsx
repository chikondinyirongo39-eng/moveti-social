"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MovetiSplash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main
      style={{
        minHeight: "100svh",
        width: "100%",
        background:
          "radial-gradient(circle at 50% 30%, rgba(138,43,226,.32), transparent 38%), linear-gradient(180deg, #080014 0%, #000000 58%, #000000 100%)",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "42px 24px 28px",
        boxSizing: "border-box",
        overflow: "hidden",
        fontFamily: "Inter, Roboto, Arial, sans-serif",
      }}
    >
      <div
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 190,
            height: 190,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(65,105,225,.35), rgba(138,43,226,.12) 48%, transparent 70%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              fontSize: 118,
              lineHeight: 1,
              fontWeight: 900,
              fontStyle: "italic",
              letterSpacing: "-14px",
              paddingRight: 12,
              background:
                "linear-gradient(135deg, #8A2BE2 0%, #4169E1 52%, #FF1493 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 24px rgba(138,43,226,.45))",
            }}
          >
            M
          </div>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: 42,
            fontWeight: 900,
            letterSpacing: 5,
            background:
              "linear-gradient(90deg, #ffffff 0%, #b8a4ff 45%, #ff4da6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          MOVETI
        </h1>

        <p
          style={{
            margin: "12px 0 0",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 4,
            color: "#d5d5d5",
          }}
        >
          CREATE • CONNECT • EARN
        </p>
      </div>

      <div
        style={{
          width: "100%",
          textAlign: "center",
          paddingBottom: 8,
        }}
      >
        <p
          style={{
            maxWidth: 330,
            margin: "0 auto 24px",
            fontSize: 17,
            lineHeight: 1.5,
            fontWeight: 500,
            color: "#eeeeee",
          }}
        >
          The Global Home for Artists, Fans and Creators
        </p>

        <div
          style={{
            width: 105,
            height: 4,
            borderRadius: 10,
            background: "#ffffff",
            margin: "0 auto",
            opacity: 0.95,
          }}
        />
      </div>
    </main>
  );
}
