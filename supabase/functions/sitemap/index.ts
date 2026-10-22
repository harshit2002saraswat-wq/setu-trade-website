import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface BlogPost {
  slug: string;
  updated_at: string;
}

const STATIC_PAGES = [
  { loc: 'https://setutrade.com/', changefreq: 'weekly', priority: '1.0' },
  { loc: 'https://setutrade.com/products', changefreq: 'weekly', priority: '0.9' },
  { loc: 'https://setutrade.com/about', changefreq: 'monthly', priority: '0.7' },
  { loc: 'https://setutrade.com/contact', changefreq: 'monthly', priority: '0.7' },
  { loc: 'https://setutrade.com/suppliers', changefreq: 'monthly', priority: '0.7' },
  { loc: 'https://setutrade.com/request-quote', changefreq: 'monthly', priority: '0.8' },
  { loc: 'https://setutrade.com/blog', changefreq: 'weekly', priority: '0.8' },
];

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response('Method not allowed', {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response('Server configuration missing', {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Fetch only published blog posts — drafts are never included in the sitemap
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      return new Response('Failed to fetch posts', {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
      });
    }

    const blogPosts = (posts as BlogPost[]) ?? [];

    const xmlParts: string[] = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ];

    for (const page of STATIC_PAGES) {
      xmlParts.push(
        `  <url>\n    <loc>${escapeXml(page.loc)}</loc>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`,
      );
    }

    for (const post of blogPosts) {
      const loc = `https://setutrade.com/blog/${escapeXml(post.slug)}`;
      xmlParts.push(
        `  <url>\n    <loc>${loc}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
      );
    }

    xmlParts.push('</urlset>');

    const xml = xmlParts.join('\n');

    return new Response(xml, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(`Internal server error: ${message}`, {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    });
  }
});
