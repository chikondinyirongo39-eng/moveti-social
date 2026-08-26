"use client";

import { useEffect, useState } from "react";

export default function ArtworkPicker() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div>
      <label>Artwork preview</label>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        style={{ margin: "10px 0 20px" }}
      />

      {preview && (
        <img
          src={preview}
          alt="Selected artwork"
          style={{
            width: "220px",
            height: "220px",
            objectFit: "cover",
            borderRadius: "12px",
            display: "block",
            margin: "10px auto 20px",
          }}
        />
      )}
    </div>
  );
}
