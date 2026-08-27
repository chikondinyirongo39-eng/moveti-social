import { createClient } from '@/lib/supabase';

export async function getPosts() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getPosts error:', error);
    return [];
  }

  return data ?? [];
}
