import { createClient } from "@/lib/supabase";

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ artist: string }>;
}) {
  const { artist } = await params;
  const artistName = decodeURIComponent(artist);

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("artist_profiles")
    .select("artist_name, bio, avatar_url")
    .eq("artist_name", artistName)
    .single();

  const { data: releases } = await supabase
    .from("releases")
    .select("id, song_title, genre, audio_url, cover_url, play_count, like_count")
    .eq("artist_name", artistName)
    .order("created_at", { ascending: false });

  if (!profile) {
    return (
      <main className="music-page">
        <h1>Artist not found</h1>
        <p>We couldn't find this artist on MOVETI.</p>
      </main>
    );
  }

  return (
    <main className="music-page">
      <h1>{profile.artist_name}</h1>

      {profile.bio && <p>{profile.bio}</p>}

      <h2>Music</h2>

      {releases?.length ? (
        releases.map((release: any) => (
          <article key={release.id}>
            <h3>{release.song_title}</h3>
            <p>{release.genre ?? "Music"}</p>
            <p>
              ▶ {release.play_count ?? 0} plays ❤️ {release.like_count ?? 0}
            </p>
            {release.audio_url && (
              <audio controls src={release.audio_url} />
            )}
          </article>
        ))
      ) : (
        <p>No published releases yet.</p>
      )}
    </main>
  );
}
