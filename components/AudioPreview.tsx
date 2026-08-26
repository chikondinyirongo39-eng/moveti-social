"use client";

import { useEffect, useState } from "react";

export default function AudioPreview({ file }: { file: File | null }) {
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
    <audio
      controls
      src={url}
      style={{
        width: "100%",
        marginTop: "10px",
        marginBottom: "20px",
      }}
    />
  );
}
