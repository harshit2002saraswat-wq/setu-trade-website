/*
# Create blog_posts table for database-backed blog system

## Purpose
Extends the existing static blog system with a database-backed blog_posts table,
enabling AI-generated draft articles, admin management, and scheduled weekly automation.

## New Tables
- `blog_posts`: Stores all blog articles (both migrated static articles and AI-generated drafts)
  - `id` (uuid, primary key)
  - `title` (text, not null)
  - `slug` (text, unique, not null) — SEO-friendly URL slug
  - `excerpt` (text, not null) — short summary for listings
  - `content` (jsonb, not null) — array of sections with heading, paragraphs, optional list
  - `category` (text, not null) — display name e.g. "Spices"
  - `category_slug` (text, not null) — slug e.g. "spices"
  - `featured_image` (text) — image URL
  - `featured_image_alt` (text) — image alt text
  - `author` (text, not null, default 'Setu Trade Editorial')
  - `reading_time` (integer, not null, default 5) — estimated minutes
  - `status` (text, not null, default 'draft') — draft | published | archived
  - `seo_title` (text) — unique SEO page title
  - `seo_description` (text) — meta description
  - `canonical_url` (text) — canonical URL path
  - `source_notes` (text) — notes about sources used by AI generation
  - `review_notes` (text) — admin notes during review
  - `is_featured` (boolean, default false) — featured article flag
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())
  - `published_at` (timestamptz) — set when status changes to published

## Indexes
- Unique index on `slug` for fast lookups and slug uniqueness enforcement
- Index on `status` for filtering published/draft articles
- Index on `category_slug` for category filtering
- Index on `published_at` for chronological ordering

## Security (RLS)
- ENABLE RLS on blog_posts
- Public (anon + authenticated) SELECT only rows where status = 'published'
- Authenticated users can INSERT/UPDATE/DELETE all rows (admin management)
- Draft content is never visible to public users

## Notes
1. The existing 10 static articles from src/data/blog.ts will be migrated as
   published posts via a data migration in a subsequent step.
2. The content column stores sections as JSONB matching the BlogSection interface:
   [{ heading, paragraphs: [], list?: [] }]
3. updated_at is automatically maintained via a trigger.
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL,
  excerpt text NOT NULL,
  content jsonb NOT NULL,
  category text NOT NULL,
  category_slug text NOT NULL,
  featured_image text,
  featured_image_alt text,
  author text NOT NULL DEFAULT 'Setu Trade Editorial',
  reading_time integer NOT NULL DEFAULT 5,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  seo_title text,
  seo_description text,
  canonical_url text,
  source_notes text,
  review_notes text,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS blog_posts_status_idx ON blog_posts (status);
CREATE INDEX IF NOT EXISTS blog_posts_category_slug_idx ON blog_posts (category_slug);
CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx ON blog_posts (published_at DESC);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can read only published posts
DROP POLICY IF EXISTS "public_select_published_posts" ON blog_posts;
CREATE POLICY "public_select_published_posts"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- Authenticated (admin) can insert posts
DROP POLICY IF EXISTS "admin_insert_posts" ON blog_posts;
CREATE POLICY "admin_insert_posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated (admin) can update posts
DROP POLICY IF EXISTS "admin_update_posts" ON blog_posts;
CREATE POLICY "admin_update_posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

-- Authenticated (admin) can delete posts
DROP POLICY IF EXISTS "admin_delete_posts" ON blog_posts;
CREATE POLICY "admin_delete_posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_updated_at ON blog_posts;
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
