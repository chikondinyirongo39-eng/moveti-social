"use client";

import { useEffect, useRef } from "react";

export default function TrendingAudioPlayer({
  src,
}: {
  src: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handlePlay = (event: Event) => {
      const playingAudio = event.target as HTMLAudioElement;

      if (playingAudio?.tagName !== "AUDIO") return;

      document.querySelectorAll<HTMLAudioElement>("audio").forEach((audio) => {
        if (audio !== playingAudio) {
          audio.pause();
        }
      });
    };

    document.addEventListener("play", handlePlay, true);

    return () => {
      document.removeEventListener("play", handlePlay, true);
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      controls
      src={src}
      style={{ width: "100%", marginTop: "14px" }}
    />
  );
}
