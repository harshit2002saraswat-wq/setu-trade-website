import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface BlogSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

interface GeneratedArticle {
  title: string;
  slug: string;
  excerpt: string;
  content: BlogSection[];
  category: string;
  category_slug: string;
  seo_title: string;
  seo_description: string;
  reading_time: number;
  source_notes: string;
}

const CATEGORIES = [
  { slug: 'agriculture', name: 'Agriculture' },
  { slug: 'agro-products', name: 'Agro Products' },
  { slug: 'export-import', name: 'Export & Import' },
  { slug: 'indian-agriculture-markets', name: 'Indian Agriculture Markets' },
  { slug: 'spices', name: 'Spices' },
  { slug: 'millets', name: 'Millets' },
  { slug: 'fresh-vegetables', name: 'Fresh Vegetables' },
  { slug: 'organic-products', name: 'Organic Products' },
  { slug: 'buyer-guides', name: 'Buyer Guides' },
  { slug: 'trade-logistics', name: 'Trade & Logistics' },
];

const TOPIC_POOL = [
  'Indian rice varieties and export considerations for international buyers',
  'Onion export from India: grading, packaging and quality parameters',
  'Understanding APEDA registration for agricultural exports from India',
  'Basmati rice: characteristics, quality grades and buyer specifications',
  'Turmeric export from India: curcumin content, grades and quality parameters',
  'Cumin seeds from India: sourcing, quality and export considerations',
  'Black pepper from India: grading, quality parameters and export documentation',
  'Cardamom export from India: varieties, grades and buyer specifications',
  'Chickpeas export from India: kabuli and desi varieties for international buyers',
  'Sesame seeds from India: sourcing, quality parameters and export markets',
  'Groundnut export from India: varieties, quality and buyer requirements',
  'Mustard seeds from India: sourcing and export considerations',
  'Maize export from India: quality, grading and buyer specifications',
  'Wheat export from India: varieties, quality parameters and documentation',
  'Cotton export from India: grades, quality and international buyer requirements',
  'Understanding DGFT export policies for agricultural products from India',
  'Phytosanitary certificate requirements for agricultural exports from India',
  'Cold chain management for fresh vegetable exports from India',
  'Reefer container logistics for agricultural exports: best practices',
  'FSSAI compliance for agricultural product exports from India',
  'Understanding ICEGATE for agricultural export customs clearance',
  'Organic certification under NPOP for Indian agricultural exports',
  'Cotton bale packaging and quality standards for export from India',
  'Red chilli export from India: varieties, colour value and quality grades',
  'Coriander seeds from India: sourcing, quality and export considerations',
  'Fenugreek export from India: quality parameters and buyer specifications',
  'Fennel seeds from India: sourcing and export considerations',
  'Cinnamon and cassia export from India: quality and buyer requirements',
  'Clove export from India: sourcing, quality and documentation',
  'Raisins export from India: varieties, quality and buyer specifications',
  'Cashew nuts from India: grading, quality and export considerations',
  'Understanding Incoterms for agricultural product exports',
  'Sea freight vs air freight for agricultural exports: choosing the right mode',
  'Maximum residue limits (MRLs) for pesticide residues in agricultural exports',
  'Steam sterilisation for spice exports: process and buyer considerations',
  'Understanding fumigation requirements for agricultural exports',
  'ISPM 15 compliance for wood packaging in agricultural exports',
  'Labelling requirements for agricultural product exports to international markets',
  'Letter of credit for agricultural export transactions: key considerations',
  'Quality inspection and third-party certification for agricultural exports',
  'Onion storage and cold chain management for export from India',
  'Tomato export from India: varieties, quality and cold chain considerations',
  'Okra export from India: sourcing, packaging and buyer requirements',
  'Ginger export from India: varieties, quality and documentation',
  'Garlic export from India: sourcing, quality and buyer specifications',
  'Foxtail millet export from India: sourcing and buyer considerations',
  'Little millet export from India: quality and documentation',
  'Barnyard millet from India: sourcing and export considerations',
  'Proso millet export from India: quality parameters and buyer requirements',
  'Pulses export from India: lentil varieties and buyer specifications',
  'Pigeon pea (toor dal) export from India: sourcing and quality',
  'Green gram (mung bean) export from India: quality and documentation',
  'Black gram (urad dal) export from India: sourcing and buyer requirements',
  'Dried fruits export from India: varieties, quality and packaging',
  'Dried dates export from India: sourcing and buyer specifications',
  'Dried figs export from India: quality and documentation',
  'Almonds from India: sourcing, quality and export considerations',
  'Walnuts export from India: grading and buyer requirements',
  'Pistachios from India: sourcing and export considerations',
  'Organic grains export from India: certification and buyer requirements',
  'Organic millets export from India: NPOP certification and documentation',
  'Organic spices export from India: certification and quality parameters',
  'Organic pulses export from India: sourcing and buyer specifications',
  'Understanding RBI regulations for agricultural export payments',
  'Export-oriented agriculture in India: farm sourcing strategies',
  'Agricultural export documentation checklist for international buyers',
  'Buyer due diligence for agricultural sourcing from India',
  'Negotiating agricultural export contracts: key terms and considerations',
  'Container loading best practices for agricultural exports',
  'Shelf life considerations for agricultural product exports',
  'Understanding quarantine requirements for agricultural imports',
  'Aflatoxin testing for spice and grain exports: buyer considerations',
  'Pesticide residue testing for agricultural exports from India',
  'Moisture content standards for grain and millet exports',
  'Grading standards for Indian agricultural products',
  'Export packaging materials: choosing the right option for agricultural products',
  'Palletisation and container stuffing for agricultural exports',
  'Understanding CBIC procedures for agricultural export clearance',
  'Export promotion schemes for Indian agricultural products',
  'Buyer specifications for agricultural products: a comprehensive guide',
  'Post-harvest handling for export-quality agricultural products',
  'Supply chain traceability for agricultural exports from India',
  'Understanding export inspection and quality control for agro products',
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

function pickCategory(topic: string): { slug: string; name: string } {
  const t = topic.toLowerCase();
  if (t.includes('spice') || t.includes('turmeric') || t.includes('cumin') || t.includes('pepper') || t.includes('cardamom') || t.includes('chilli') || t.includes('coriander') || t.includes('fenugreek') || t.includes('fennel') || t.includes('cinnamon') || t.includes('clove')) {
    return CATEGORIES.find((c) => c.slug === 'spices')!;
  }
  if (t.includes('millet') || t.includes('bajra') || t.includes('jowar') || t.includes('ragi') || t.includes('sorghum') || t.includes('foxtail') || t.includes('pearl millet')) {
    return CATEGORIES.find((c) => c.slug === 'millets')!;
  }
  if (t.includes('vegetable') || t.includes('potato') || t.includes('onion') || t.includes('tomato') || t.includes('okra') || t.includes('ginger') || t.includes('garlic') || t.includes('chilli')) {
    return CATEGORIES.find((c) => c.slug === 'fresh-vegetables')!;
  }
  if (t.includes('organic')) {
    return CATEGORIES.find((c) => c.slug === 'organic-products')!;
  }
  if (t.includes('buyer') || t.includes('checklist') || t.includes('due diligence') || t.includes('specifications') || t.includes('contract') || t.includes('negotiat')) {
    return CATEGORIES.find((c) => c.slug === 'buyer-guides')!;
  }
  if (t.includes('packaging') || t.includes('logistics') || t.includes('freight') || t.includes('container') || t.includes('cold chain') || t.includes('pallet') || t.includes('shelf life') || t.includes('loading') || t.includes('stuffing')) {
    return CATEGORIES.find((c) => c.slug === 'trade-logistics')!;
  }
  if (t.includes('document') || t.includes('phytosanitary') || t.includes('certificate') || t.includes('clearance') || t.includes('customs') || t.includes('dgft') || t.includes('icegate') || t.includes('cbic') || t.includes('inspection') || t.includes('fumigation') || t.includes('ispm') || t.includes('label')) {
    return CATEGORIES.find((c) => c.slug === 'trade-logistics')!;
  }
  if (t.includes('rice') || t.includes('wheat') || t.includes('maize') || t.includes('cotton') || t.includes('chickpea') || t.includes('lentil') || t.includes('pigeon') || t.includes('mung') || t.includes('urad') || t.includes('sesame') || t.includes('groundnut') || t.includes('mustard') || t.includes('pulse') || t.includes('grain') || t.includes('barley')) {
    return CATEGORIES.find((c) => c.slug === 'agro-products')!;
  }
  if (t.includes('market') || t.includes('rbi') || t.includes('scheme') || t.includes('promotion') || t.includes('apeda')) {
    return CATEGORIES.find((c) => c.slug === 'indian-agriculture-markets')!;
  }
  if (t.includes('export') || t.includes('import') || t.includes('mrl') || t.includes('residue') || t.includes('quarantine') || t.includes('aflatoxin') || t.includes('pesticide')) {
    return CATEGORIES.find((c) => c.slug === 'export-import')!;
  }
  return CATEGORIES.find((c) => c.slug === 'agriculture')!;
}

function generateArticleFromTopic(topic: string): GeneratedArticle {
  const category = pickCategory(topic);
  const title = topic
    .split(' ')
    .map((w, i) => i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w)
    .join(' ');
  const baseSlug = slugify(title);

  return {
    title,
    slug: baseSlug,
    excerpt: `A professional guide covering ${topic.toLowerCase()} — with sourcing considerations, quality parameters, documentation requirements and practical guidance for international B2B buyers sourcing from India.`,
    content: [
      {
        heading: 'Overview',
        paragraphs: [
          `${topic} is an important consideration for international buyers sourcing agricultural products from India. This article provides a general overview of the key factors that buyers should be aware of when engaging with Indian suppliers on this topic.`,
          'The information provided here is general in nature and does not constitute legal, regulatory or trade advice. Specific requirements should be verified with the relevant authorities before placing an order.',
        ],
      },
      {
        heading: 'Key Considerations for International Buyers',
        paragraphs: [
          'When addressing this topic, international buyers should consider the following factors to ensure their sourcing requirements are clearly communicated and met:',
        ],
        list: [
          'Product specifications and quality parameters',
          'Destination-market regulatory requirements',
          'Documentation and certification needs',
          'Packaging and labelling requirements',
          'Logistics and transit considerations',
        ],
      },
      {
        heading: 'Quality and Specification Parameters',
        paragraphs: [
          'Product quality is a critical factor in agricultural sourcing. Buyers should clearly define their quality requirements — including grade, size, variety, moisture content and any other relevant parameters — and confirm these with their supplier before placing an order.',
          'Quality standards may vary by destination market. Buyers should verify the applicable quality and safety standards with the relevant authorities in their country, as these requirements can change over time.',
        ],
      },
      {
        heading: 'Documentation and Compliance',
        paragraphs: [
          'Agricultural exports from India typically involve various documents, which may include commercial invoices, packing lists, certificates of origin, phytosanitary certificates and quality inspection certificates. The specific documentation required depends on the product, the destination country and applicable regulations.',
          'Import requirements can vary significantly by country and may change over time. Buyers should verify current requirements with the relevant authorities in their destination market before shipment.',
        ],
      },
      {
        heading: 'Best Practices for B2B Buyers',
        paragraphs: [
          'To ensure a smooth sourcing process, international buyers should follow these best practices:',
        ],
        list: [
          'Clearly communicate all product specifications in writing',
          'Confirm documentation requirements before placing an order',
          'Verify destination-market regulations with relevant authorities',
          'Discuss packaging and logistics requirements with the supplier',
          'Maintain clear records of all agreements and communications',
        ],
      },
      {
        heading: 'Important Note on Verification',
        paragraphs: [
          'This article is provided for general informational purposes only. Export and import regulations, documentation requirements and quality standards can change over time and vary by destination market.',
          'Always verify current requirements with the relevant authorities — such as DGFT, APEDA, ICEGATE, CBIC, FSSAI, the Plant Quarantine authority and the relevant regulatory bodies in the destination country — before placing an order or arranging shipment.',
        ],
      },
    ],
    category: category.name,
    category_slug: category.slug,
    seo_title: `${title} | Setu Trade Insights`,
    seo_description: `Professional guide on ${topic.toLowerCase()} for international B2B buyers sourcing agricultural products from India. Covers quality, documentation and compliance.`,
    reading_time: 5 + Math.floor(Math.random() * 3),
    source_notes: 'Generated from topic pool. Content is general B2B guidance — no specific statistics, prices or regulatory claims. Buyers should verify requirements with relevant authorities.',
  };
}

async function getExistingSlugs(supabase: ReturnType<typeof createClient>): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error || !data) return new Set();
  return new Set(data.map((r: { slug: string }) => r.slug));
}

async function getRecentTitles(supabase: ReturnType<typeof createClient>): Promise<string[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('title')
    .order('created_at', { ascending: false })
    .limit(15);

  if (error || !data) return [];
  return data.map((r: { title: string }) => r.title.toLowerCase());
}

function ensureUniqueSlug(baseSlug: string, existingSlugs: Set<string>): string {
  if (!existingSlugs.has(baseSlug)) return baseSlug;
  let i = 2;
  while (existingSlugs.has(`${baseSlug}-${i}`)) {
    i++;
  }
  return `${baseSlug}-${i}`;
}

function selectTopic(pool: string[], recentTitles: string[]): string {
  const available = pool.filter((topic) => {
    const lower = topic.toLowerCase();
    return !recentTitles.some((recent) =>
      recent.includes(lower.substring(0, 30)) || lower.includes(recent.substring(0, 30))
    );
  });
  const candidates = available.length > 0 ? available : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

async function generateDraft(supabase: ReturnType<typeof createClient>, apiKey: string | undefined): Promise<{ success: boolean; article?: GeneratedArticle; error?: string }> {
  const existingSlugs = await getExistingSlugs(supabase);
  const recentTitles = await getRecentTitles(supabase);
  const topic = selectTopic(TOPIC_POOL, recentTitles);

  let article: GeneratedArticle;

  if (apiKey) {
    try {
      article = await generateWithAI(topic, apiKey, existingSlugs);
    } catch {
      article = generateArticleFromTopic(topic);
    }
  } else {
    article = generateArticleFromTopic(topic);
  }

  article.slug = ensureUniqueSlug(article.slug, existingSlugs);

  if (article.title.length < 10 || article.title.length > 200) {
    return { success: false, error: 'Title length validation failed' };
  }

  return { success: true, article };
}

async function generateWithAI(topic: string, apiKey: string, existingSlugs: Set<string>): Promise<GeneratedArticle> {
  const category = pickCategory(topic);
  const baseSlug = slugify(topic);

  const systemPrompt = `You are a professional B2B agricultural trade content writer for Setu Trade, an India-based agricultural export company. Write professional, factual articles for international buyers.

STRICT CONTENT RULES:
- NEVER invent prices, statistics, export figures, market data or government claims
- NEVER invent specific buyer names, company names or testimonials
- NEVER claim Setu Trade currently exports to specific countries
- Use "international buyers", "target markets" and "export-oriented" where appropriate
- For changing regulations, include a note that requirements should be verified with relevant authorities
- Mention official sources like DGFT, APEDA, ICEGATE, CBIC, FSSAI, Plant Quarantine where relevant
- Keep content professional and useful for B2B buyers

Output ONLY valid JSON with this structure:
{
  "title": "Article title (max 80 chars)",
  "excerpt": "2-3 sentence summary (max 300 chars)",
  "sections": [{"heading": "Section heading", "paragraphs": ["paragraph text..."], "list": ["optional bullet items"]}],
  "source_notes": "Notes about sources used"
}

Generate 4-7 sections. Each section should have 1-3 paragraphs. Some sections can have a list of bullet points.`;

  const userPrompt = `Write a professional B2B article about: "${topic}"

Category: ${category.name}

The article should be useful for international buyers sourcing agricultural products from India. Include practical guidance on quality parameters, documentation, sourcing considerations and compliance.

Remember: Do NOT invent statistics, prices or regulatory claims. Include a verification note for any regulatory information.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API returned ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('No content from AI');

  const parsed = JSON.parse(content);
  const sections: BlogSection[] = (parsed.sections || []).map((s: { heading: string; paragraphs: string[]; list?: string[] }) => ({
    heading: String(s.heading || ''),
    paragraphs: Array.isArray(s.paragraphs) ? s.paragraphs.map((p: unknown) => String(p)) : [],
    list: Array.isArray(s.list) ? s.list.map((l: unknown) => String(l)) : undefined,
  }));

  if (sections.length === 0) throw new Error('No sections generated');

  const title = String(parsed.title || topic).substring(0, 200);
  const wordCount = sections.reduce((acc: number, s: BlogSection) =>
    acc + s.paragraphs.join(' ').split(/\s+/).length + (s.list?.length || 0), 0);

  return {
    title,
    slug: ensureUniqueSlug(baseSlug, existingSlugs),
    excerpt: String(parsed.excerpt || '').substring(0, 300),
    content: sections,
    category: category.name,
    category_slug: category.slug,
    seo_title: `${title} | Setu Trade Insights`,
    seo_description: String(parsed.excerpt || '').substring(0, 160),
    reading_time: Math.max(3, Math.ceil(wordCount / 200)),
    source_notes: String(parsed.source_notes || 'Generated with AI assistance. Content should be reviewed before publishing.'),
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const aiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: 'Server configuration missing' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Verify the caller is authorized.
    // Two valid paths:
    //   1. Admin manual trigger — sends a user JWT via Authorization header.
    //   2. Scheduled cron trigger — sends the service role key (no JWT).
    const authHeader = req.headers.get('Authorization') ?? '';
    const isServiceRoleCall = authHeader === `Bearer ${serviceRoleKey}`;

    if (!isServiceRoleCall) {
      const token = authHeader.replace('Bearer ', '');
      if (!token) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized: missing auth token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      if (userError || !userData.user) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized: invalid session' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
    }

    const result = await generateDraft(supabase, aiApiKey);

    if (!result.success || !result.article) {
      return new Response(
        JSON.stringify({ error: result.error || 'Failed to generate draft' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const article = result.article;

    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        category_slug: article.category_slug,
        featured_image: null,
        featured_image_alt: null,
        author: 'Setu Trade Editorial',
        reading_time: article.reading_time,
        status: 'draft',
        seo_title: article.seo_title,
        seo_description: article.seo_description,
        canonical_url: `/blog/${article.slug}`,
        source_notes: article.source_notes,
        review_notes: null,
        is_featured: false,
      })
      .select('id, slug, title')
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to save draft', detail: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Draft generated successfully',
        draft: data,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', detail: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
