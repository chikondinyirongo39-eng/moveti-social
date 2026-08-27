import { getPosts } from '@/lib/posts';
import SocialFeed from '@/components/SocialFeed';

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen">
      <SocialFeed initialPosts={posts} />
    </main>
  );
}
