"use client";

import { useEffect, useState } from "react";

export default function ArtworkPreview({
  file,
}: {
  file: File | null;
}) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!file) {
      setUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!url) return null;

  return (
    <img
      src={url}
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
  );
}
