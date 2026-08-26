"use client";

import { useState } from "react";

export default function DraftSaveButton() {
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setSaved(true)}
        style={{
          width: "100%",
          padding: "15px",
          marginTop: "15px",
          border: "none",
          borderRadius: "10px",
          background: "#111",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Save as Draft
      </button>

      {saved && (
        <p
          style={{
            color: "green",
            textAlign: "center",
            marginTop: "15px",
          }}
        >
          Draft saved privately on this device.
        </p>
      )}
    </div>
  );
}
