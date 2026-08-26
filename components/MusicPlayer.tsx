"use client";

import { useRef, useState } from "react";

type MusicPlayerProps = {
  title?: string;
  artist?: string;
  audioUrl?: string;
};

export default function MusicPlayer({
  title = "No song selected",
  artist = "MOVETI",
  audioUrl = "",
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      await audio.play();
      setPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60);
    return `${minutes}:${remaining.toString().padStart(2, "0")}`;
  };

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: "#111",
      color: "#fff",
      padding: "12px 16px",
      boxShadow: "0 -4px 20px rgba(0,0,0,0.2)"
    }}>
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
          onEnded={() => {
            setPlaying(false);
            setCurrentTime(0);
          }}
        />
      )}

      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        gap: "12px"
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "8px",
          background: "#333",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px"
        }}>
          🎵
        </div>

        <div style={{ width: "160px", minWidth: 0 }}>
          <strong>{title}</strong>
          <div style={{ color: "#aaa", fontSize: "13px" }}>{artist}</div>
        </div>

        <button
          onClick={togglePlay}
          disabled={!audioUrl}
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            border: "none",
            background: "#fff",
            color: "#111",
            fontSize: "16px"
          }}
        >
          {playing ? "Ⅱ" : "▶"}
        </button>

        <span style={{ fontSize: "12px", color: "#aaa" }}>
          {formatTime(currentTime)}
        </span>

        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={Math.min(currentTime, duration || 0)}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (audioRef.current) audioRef.current.currentTime = value;
            setCurrentTime(value);
          }}
          disabled={!audioUrl}
          style={{ flex: 1 }}
        />

        <span style={{ fontSize: "12px", color: "#aaa" }}>
          {formatTime(duration)}
        </span>

        <span>🔊</span>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (audioRef.current) audioRef.current.volume = value;
            setVolume(value);
          }}
          style={{ width: "80px" }}
        />
      </div>
    </div>
  );
}
