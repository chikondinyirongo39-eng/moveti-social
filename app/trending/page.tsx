import { createClient } from "@/lib/supabase";
import TrendingLikeButton from "@/components/TrendingLikeButton";

export default async function TrendingPage() {
  const supabase = await createClient();

  const { data: releases } = await supabase
    .from("releases")
    .select(
      "id, song_title, artist_name, genre, cover_url, audio_url, play_count, like_count"
    )
    .order("play_count", { ascending: false })
    .limit(10);

  const songs = releases ?? [];

  const releaseIds = songs.map((song: any) => song.id);

  const { data: comments } = releaseIds.length
    ? await supabase
        .from("comments")
        .select("release_id")
        .in("release_id", releaseIds)
    : { data: [] };

  const commentCounts = (comments ?? []).reduce(
    (counts: Record<string, number>, comment: any) => {
      counts[comment.release_id] = (counts[comment.release_id] ?? 0) + 1;
      return counts;
    },
    {}
  );

  return (
    <main className="music-page">
      <h1>🔥 Trending Now</h1>
      <p>Popular music on MOVETI</p>

      {songs.length === 0 ? (
        <p>No trending music yet.</p>
      ) : (
        songs.map((song: any, index: number) => (
          <article
            key={song.id}
            style={{
              display: "flex",
              gap: "14px",
              alignItems: "center",
              marginBottom: "16px",
              padding: "14px",
              borderRadius: "12px",
              background: "#111",
            }}
          >
            {song.cover_url ? (
              <img
                src={song.cover_url}
                alt={`${song.song_title} cover`}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            ) : (
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#222",
                  fontSize: "28px",
                }}
              >
                🎵
              </div>
            )}

            <div>
              <h2>
                {index + 1}. {song.song_title}
              </h2>
            <p>
              <a
                href={`/artists/${encodeURIComponent(song.artist_name)}`}
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  fontWeight: "600",
                }}
              >
                {song.artist_name}
              </a>
            </p>
            <p>{song.genre ?? "Music"}</p>
            <p>
              ▶ {song.play_count ?? 0} plays{" "}
              <TrendingLikeButton
                releaseId={song.id}
                initialCount={song.like_count ?? 0}
              />{" "}
              💬 {commentCounts[song.id] ?? 0}
            </p>

            {song.audio_url && (
              <audio
                controls
                src={song.audio_url}
                style={{ width: "100%", marginTop: "8px" }}
              />
            )}
            </div>
          </article>
        ))
      )}
    </main>
  );
}
