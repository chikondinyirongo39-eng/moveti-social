import PublicArtistProfile from '@/components/PublicArtistProfile';

export default async function ProfilePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PublicArtistProfile artistId={id} />;
}
