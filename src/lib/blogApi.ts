import { supabase } from '@/lib/supabase';
import type { BlogPost, BlogSection, BlogCategorySlug, BlogPostStatus } from '@/types/blog';

export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as BlogPost[];
}

export async function fetchPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw error;
  return (data as BlogPost) ?? null;
}

export async function fetchRelatedPosts(slug: string, categorySlug: BlogCategorySlug, limit: number = 3): Promise<BlogPost[]> {
  const { data: sameCat, error: err1 } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .eq('category_slug', categorySlug)
    .neq('slug', slug)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (err1) throw err1;

  const results = (sameCat as BlogPost[]) ?? [];

  if (results.length >= limit) return results.slice(0, limit);

  const remaining = limit - results.length;
  const excludeSlugs = [slug, ...results.map((r) => r.slug)];

  const { data: otherCat, error: err2 } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .neq('category_slug', categorySlug)
    .not('slug', 'in', `(${excludeSlugs.join(',')})`)
    .order('published_at', { ascending: false })
    .limit(remaining);

  if (err2) throw err2;

  return [...results, ...((otherCat as BlogPost[]) ?? [])];
}

export async function fetchAllPostsForAdmin(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as BlogPost[];
}

export async function fetchPostByIdForAdmin(id: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return (data as BlogPost) ?? null;
}

export interface UpdatePostInput {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: BlogSection[];
  category?: string;
  category_slug?: BlogCategorySlug;
  featured_image?: string | null;
  featured_image_alt?: string | null;
  author?: string;
  reading_time?: number;
  status?: BlogPostStatus;
  seo_title?: string | null;
  seo_description?: string | null;
  source_notes?: string | null;
  review_notes?: string | null;
  is_featured?: boolean;
}

export async function updatePost(id: string, updates: UpdatePostInput): Promise<BlogPost> {
  const payload: Record<string, unknown> = { ...updates };

  if (updates.status === 'published') {
    payload.published_at = new Date().toISOString();
  } else if (updates.status === 'archived' || updates.status === 'draft') {
    // keep published_at for archived, null it for draft if it was unpublished
    if (updates.status === 'draft') {
      payload.published_at = null;
    }
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as BlogPost;
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function generateDraftViaEdgeFunction(): Promise<{ slug: string; title: string; id: string } | { error: string }> {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-blog-draft`;
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;

  if (!token) {
    return { error: 'You must be signed in to generate a draft.' };
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      return { error: errBody.error || `Request failed (${response.status})` };
    }

    const result = await response.json();
    if (!result.success || !result.draft) {
      return { error: result.error || 'Failed to generate draft' };
    }

    return {
      slug: result.draft.slug,
      title: result.draft.title,
      id: result.draft.id,
    };
  } catch {
    return { error: 'Network error while generating draft' };
  }
}
