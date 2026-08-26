import { createClient } from "./supabase";

export async function publishRelease({
  title,
  artist,
  genre,
  audioFile,
  coverFile,
}: {
  title: string;
  artist: string;
  genre: string;
  audioFile: File;
  coverFile: File;
}) {
  const supabase = createClient();

  console.log("PUBLISH: starting");

  const id = crypto.randomUUID();

  const audioPath = `${id}/${audioFile.name}`;
  const artworkPath = `${id}/${coverFile.name}`;

  console.log("PUBLISH: uploading audio");

  const audioUpload = await supabase.storage
    .from("audio")
    .upload(audioPath, audioFile);

  if (audioUpload.error) {
    throw new Error(
      `AUDIO UPLOAD FAILED: ${audioUpload.error.message}`
    );
  }

  console.log("PUBLISH: audio uploaded");

  const artworkUpload = await supabase.storage
    .from("artwork")
    .upload(artworkPath, coverFile);

  if (artworkUpload.error) {
    throw new Error(
      `ARTWORK UPLOAD FAILED: ${artworkUpload.error.message}`
    );
  }

  console.log("PUBLISH: artwork uploaded");

  const { data: audioPublic } = supabase.storage
    .from("audio")
    .getPublicUrl(audioPath);

  const { data: artworkPublic } = supabase.storage
    .from("artwork")
    .getPublicUrl(artworkPath);

  console.log("PUBLISH: inserting release");

  const { error } = await supabase
    .from("releases")
    .insert({
      song_title: title,
      artist_name: artist,
      genre,
      audio_url: audioPublic.publicUrl,
      cover_url: artworkPublic.publicUrl,
      status: "published",
    });

  if (error) {
    throw new Error(
      `RELEASE INSERT FAILED: ${error.message}`
    );
  }

  console.log("PUBLISH: release created");

  return { success: true };
}
