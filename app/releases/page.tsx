"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase";

type Release = {
  id: string;
  song_title: string;
  artist_name: string;
  genre: string | null;
  audio_url: string | null;
  cover_url: string | null;
  status: string | null;
  play_count: number;
  like_count: number;
};

let currentlyPlaying: HTMLAudioElement | null = null;

function MusicPlayer({ release }: { release: Release }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      if (currentlyPlaying && currentlyPlaying !== audio) {
        currentlyPlaying.pause();
      }
      currentlyPlaying = audio;
      audio.play();
      setPlaying(true);

      const supabase = createClient();
      await supabase.rpc("increment_play_count", {
        release_id: release.id,
      });
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  function updateProgress() {
    const audio = audioRef.current;
    if (!audio) return;

    setCurrent(audio.currentTime);
  }

  function loadedMetadata() {
    const audio = audioRef.current;
    if (!audio) return;

    setDuration(audio.duration);
  }

  function changeProgress(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const audio = audioRef.current;
    if (!audio) return;

    const value = Number(event.target.value);
    audio.currentTime = value;
    setCurrent(value);
  }

  function formatTime(value: number) {
    if (!Number.isFinite(value)) return "0:00";

    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  return (
    <div className="player">
      <audio
                onPlay={(e) => {
                  document.querySelectorAll("audio").forEach((audio) => {
                    if (audio !== e.currentTarget) {
                      audio.pause();
                    }
                  });
                }}
        ref={audioRef}
        src={release.audio_url || ""}
        preload="metadata"
        onTimeUpdate={updateProgress}
        onLoadedMetadata={loadedMetadata}
        onEnded={() => setPlaying(false)}
      />

      <button
        className="play-button"
        type="button"
        onClick={togglePlay}
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? "❚❚" : "▶"}
      </button>

      <div className="player-main">
        <input
          className="progress"
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={current}
          onChange={changeProgress}
        />

        <div className="time">
          <span>{formatTime(current)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

export default function ReleasesPage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    async function loadComments() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("comments")
        .select("id, release_id, author_name, comment_text, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("COMMENTS LOAD ERROR:", error);
        return;
      }

      setComments(data ?? []);
    }

    loadComments();
  }, []);

  useEffect(() => {
    async function loadReleases() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("releases")
        .select(
          "id, song_title, artist_name, genre, audio_url, cover_url, status, play_count, like_count"
        )
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setError(error.message);
      } else {
        setReleases(data || []);
      }

      setLoading(false);
    }

    loadReleases();
  }, []);

  if (loading) {
    return (
    <main className="music-page">
      <h1>Music</h1>
      <p>Loading music...</p>
    </main>
  );
}

if (error) {
    return (
      <main className="music-page">
        <h1>Music</h1>
        <p>Unable to load music.</p>
      </main>
    );
  }

  return (
    <main className="music-page">
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search songs, artists or genres..."
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: "10px",
            border: "1px solid #333",
            background: "#111",
            color: "#fff",
            fontSize: "16px",
            outline: "none",
          }}
        />
      </div>
      <div className="music-header">
        <h1>Music</h1>
        <p>Discover music on MOVETI</p>
      </div>

      {releases.length === 0 ? (
        <div className="empty-state">
          <h2>No published releases yet</h2>
          <p>
            New music will appear here when it is published.
          </p>
        </div>
      ) : (
        <div className="release-grid">
          {releases
          .filter((release) => {
            const query = search.trim().toLowerCase();
            if (!query) return true;

            return (
              release.song_title.toLowerCase().includes(query) ||
              release.artist_name.toLowerCase().includes(query) ||
              (release.genre ?? "").toLowerCase().includes(query)
            );
          })
          .map((release) => (
            <article className="release-card" key={release.id}>
              <div className="cover-wrapper">
                {release.cover_url ? (
                  <img
                    src={release.cover_url}
                    alt={`${release.song_title} cover`}
                    className="cover"
                  />
                ) : (
                  <div className="cover-placeholder">
                    ♪
                  </div>
                )}
              </div>

              <div className="release-info">
                <h2>{release.song_title}</h2>

                <p className="artist">
                  {release.artist_name}
                </p>

                {release.genre && (
                  <span className="genre">
                    {release.genre}
                  </span>
                )}

                <div className="stats">
                  <span>▶ {release.play_count ?? 0} plays</span>
                  <button
                    type="button"
                    onClick={async () => {
                      const key = `moveti-liked-${release.id}`;

                      if (
                        typeof window !== "undefined" &&
                        localStorage.getItem(key)
                      ) {
                        return;
                      }

                      if (typeof window !== "undefined") {
                        localStorage.setItem(key, "1");
                      }

                      const supabase = createClient();
                      const { error } = await supabase.rpc(
                        "increment_like_count",
                        {
                          release_id: release.id,
                        }
                      );

                      if (error) {
                        if (typeof window !== "undefined") {
                          localStorage.removeItem(key);
                        }
                        console.error("LIKE ERROR:", error);
                        return;
                      }

                      setReleases((items) =>
                        items.map((item) =>
                          item.id === release.id
                            ? {
                                ...item,
                                like_count: (item.like_count ?? 0) + 1,
                              }
                            : item
                        )
                      );
                    }}
                  >
                    ❤️ {release.like_count ?? 0}
                  </button>
                </div>

                {release.audio_url && (
                  <MusicPlayer release={release} />
                )}
              </div>
            <div style={{ marginTop: "20px" }}>
              <h4>Comments</h4>

              {comments
                .filter((comment) => comment.release_id === release.id)
                .map((comment) => (
                  <div
                    key={comment.id}
                    style={{
                      padding: "10px 0",
                      borderBottom: "1px solid #222",
                    }}
                  >
                    <strong>{comment.author_name}</strong>
                    <p style={{ margin: "4px 0" }}>
                      {comment.comment_text}
                    </p>
                  </div>
                ))}

              {comments.filter(
                (comment) => comment.release_id === release.id
              ).length === 0 && <p>No comments yet.</p>}
            </div>

            <div style={{ marginTop: "16px" }}>
              <input
                type="text"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                placeholder="Your name"
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  border: "1px solid #333",
                  background: "#111",
                  color: "#fff",
                }}
              />

              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  border: "1px solid #333",
                  background: "#111",
                  color: "#fff",
                  resize: "vertical",
                }}
              />

              <button
                type="button"
                onClick={async () => {
                  if (!commentName.trim() || !commentText.trim()) return;

                  const supabase = createClient();

                  const { error } = await supabase.from("comments").insert({
                    release_id: release.id,
                    author_name: commentName.trim(),
                    comment_text: commentText.trim(),
                  });

                  if (error) {
                    alert(`Comment failed: ${error.message}`);
                    console.error("COMMENT ERROR:", error);
                    return;
                  }

                  alert("Comment posted successfully!");
                  setCommentText("");
                }}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Post Comment
              </button>
            </div>

            </article>
          ))}
        </div>
      )}

      <style jsx>{`
        .music-page {
          min-height: 100vh;
          padding: 40px 24px;
          background: #080808;
          color: white;
        }

        .music-header {
          max-width: 1200px;
          margin: 0 auto 35px;
        }

        .music-header h1 {
          margin: 0;
          font-size: 42px;
          font-weight: 800;
        }

        .music-header p {
          margin-top: 8px;
          color: #999;
        }

        .release-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(
            auto-fill,
            minmax(260px, 1fr)
          );
          gap: 24px;
        }

        .release-card {
          overflow: hidden;
          border-radius: 18px;
          background: #151515;
          border: 1px solid #242424;
        }

        .cover-wrapper {
          width: 100%;
          aspect-ratio: 1;
          background: #202020;
        }

        .cover {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .cover-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 70px;
          color: #666;
        }

        .release-info {
          padding: 18px;
        }

        .release-info h2 {
          margin: 0;
          font-size: 22px;
        }

        .artist {
          margin: 7px 0;
          color: #ccc;
        }

        .stats {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 4px 0 12px;
          color: #888;
          font-size: 13px;
        }

        .stats button {
          border: none;
          background: transparent;
          color: white;
          cursor: pointer;
          font-size: 14px;
        }

        .genre {
          display: inline-block;
          margin: 4px 0 16px;
          padding: 5px 10px;
          border-radius: 20px;
          background: #222;
          color: #aaa;
          font-size: 12px;
        }

        .player {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 10px;
        }

        .play-button {
          width: 46px;
          height: 46px;
          border: none;
          border-radius: 50%;
          background: #16a34a;
          color: white;
          font-size: 18px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .play-button:active {
          transform: scale(0.95);
        }

        .player-main {
          flex: 1;
          min-width: 0;
        }

        .progress {
          width: 100%;
          cursor: pointer;
        }

        .time {
          display: flex;
          justify-content: space-between;
          color: #888;
          font-size: 11px;
          margin-top: 3px;
        }

        .empty-state {
          max-width: 1200px;
          margin: 60px auto;
          text-align: center;
          color: #999;
        }

        .empty-state h2 {
          color: white;
        }

        @media (max-width: 600px) {
          .music-page {
            padding: 25px 15px;
          }

          .music-header h1 {
            font-size: 34px;
          }

          .release-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
