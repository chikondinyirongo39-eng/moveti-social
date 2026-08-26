import { saveDraftMedia } from "./draftMedia";

export async function saveDraft({
  title,
  artist,
  genre,
  audioName,
  coverName,
  audioFile,
  coverFile,
}: {
  title: string;
  artist: string;
  genre: string;
  audioName: string;
  coverName: string;
  audioFile: File | null;
  coverFile: File | null;
}) {
  await saveDraftMedia(audioFile, coverFile);

  localStorage.setItem(
    "moveti-draft",
    JSON.stringify({
      title,
      artist,
      genre,
      audioName,
      coverName,
    })
  );
}
