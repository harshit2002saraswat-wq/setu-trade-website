import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, Loader2, AlertCircle, Save, CheckCircle2, Archive,
  Plus, Trash2, Eye,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import { useSeo } from '@/hooks/useSeo';
import { fetchPostByIdForAdmin, updatePost } from '@/lib/blogApi';
import { BLOG_CATEGORIES } from '@/data/blog';
import type { BlogPost, BlogSection, BlogCategorySlug } from '@/types/blog';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export function AdminBlogEditPage() {
  const { id } = useParams<{ id: string }>();
  useSeo({ title: 'Edit Blog Post | Setu Trade Admin', description: 'Edit a blog post.' });

  const { session, loading: authLoading } = useAuth();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loadingState, setLoadingState] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [saveState, setSaveState] = useState<SaveState>('idle');

  // Editable form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState<BlogSection[]>([]);
  const [category, setCategory] = useState<string>(BLOG_CATEGORIES[0].name);
  const [categorySlug, setCategorySlug] = useState<BlogCategorySlug>(BLOG_CATEGORIES[0].slug);
  const [featuredImage, setFeaturedImage] = useState('');
  const [featuredImageAlt, setFeaturedImageAlt] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [readingTime, setReadingTime] = useState(5);

  const loadPost = useCallback(async () => {
    if (!id) return;
    setLoadingState('loading');
    try {
      const data = await fetchPostByIdForAdmin(id);
      if (!data) {
        setLoadingState('error');
        setErrorMsg('Post not found.');
        return;
      }
      setPost(data);
      setTitle(data.title);
      setSlug(data.slug);
      setExcerpt(data.excerpt);
      setContent(data.content || []);
      setCategory(data.category);
      setCategorySlug(data.category_slug);
      setFeaturedImage(data.featured_image || '');
      setFeaturedImageAlt(data.featured_image_alt || '');
      setSeoTitle(data.seo_title || '');
      setSeoDescription(data.seo_description || '');
      setReviewNotes(data.review_notes || '');
      setReadingTime(data.reading_time);
      setLoadingState('success');
    } catch {
      setErrorMsg('Could not load post.');
      setLoadingState('error');
    }
  }, [id]);

  useEffect(() => {
    if (authLoading) return;
    if (!session) return;
    loadPost();
  }, [session, authLoading, loadPost]);

  const handleCategoryChange = (catName: string) => {
    const cat = BLOG_CATEGORIES.find((c) => c.name === catName);
    if (cat) {
      setCategory(cat.name);
      setCategorySlug(cat.slug);
    }
  };

  const updateSection = (idx: number, updates: Partial<BlogSection>) => {
    setContent((prev) => prev.map((s, i) => (i === idx ? { ...s, ...updates } : s)));
  };

  const addSection = () => {
    setContent((prev) => [...prev, { heading: 'New Section', paragraphs: [''] }]);
  };

  const removeSection = (idx: number) => {
    setContent((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateParagraph = (secIdx: number, paraIdx: number, text: string) => {
    setContent((prev) =>
      prev.map((s, i) =>
        i === secIdx
          ? { ...s, paragraphs: s.paragraphs.map((p, j) => (j === paraIdx ? text : p)) }
          : s,
      ),
    );
  };

  const addParagraph = (secIdx: number) => {
    setContent((prev) =>
      prev.map((s, i) => (i === secIdx ? { ...s, paragraphs: [...s.paragraphs, ''] } : s)),
    );
  };

  const updateListItem = (secIdx: number, itemIdx: number, text: string) => {
    setContent((prev) =>
      prev.map((s, i) =>
        i === secIdx
          ? { ...s, list: s.list?.map((item, j) => (j === itemIdx ? text : item)) }
          : s,
      ),
    );
  };

  const addListItem = (secIdx: number) => {
    setContent((prev) =>
      prev.map((s, i) =>
        i === secIdx ? { ...s, list: [...(s.list || []), ''] } : s,
      ),
    );
  };

  const removeListItem = (secIdx: number, itemIdx: number) => {
    setContent((prev) =>
      prev.map((s, i) =>
        i === secIdx
          ? { ...s, list: s.list?.filter((_, j) => j !== itemIdx) }
          : s,
      ),
    );
  };

  const handleSave = async (newStatus?: 'draft' | 'published' | 'archived') => {
    if (!post) return;
    setSaveState('saving');
    setErrorMsg('');

    try {
      await updatePost(post.id, {
        title,
        slug,
        excerpt,
        content,
        category,
        category_slug: categorySlug,
        featured_image: featuredImage || null,
        featured_image_alt: featuredImageAlt || null,
        seo_title: seoTitle || null,
        seo_description: seoDescription || null,
        review_notes: reviewNotes || null,
        reading_time: readingTime,
        ...(newStatus ? { status: newStatus } : {}),
      });
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2000);
      await loadPost();
    } catch (err) {
      setSaveState('error');
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save post.');
    }
  };

  if (authLoading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      </AdminLayout>
    );
  }

  if (!session) {
    return <Link to="/admin/login" replace />;
  }

  if (loadingState === 'loading') {
    return (
      <AdminLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
          <span className="ml-3 text-sm text-charcoal-500">Loading post...</span>
        </div>
      </AdminLayout>
    );
  }

  if (loadingState === 'error' || !post) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="mt-3 text-sm font-medium text-red-800">{errorMsg}</p>
          <Link to="/admin/blog" className="btn-secondary mt-5">Back to Blog Management</Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-brand-700">
            <ArrowLeft className="h-4 w-4" />
            Blog Management
          </Link>
          <span className="text-charcoal-300">/</span>
          <span className="text-sm font-medium text-charcoal-700">Edit Post</span>
        </div>
        <div className="flex items-center gap-2">
          {saveState === 'saved' && (
            <span className="inline-flex items-center gap-1 text-sm text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              Saved
            </span>
          )}
          {saveState === 'error' && (
            <span className="text-sm text-red-700">{errorMsg}</span>
          )}
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saveState === 'saving'}
            className="btn-secondary inline-flex items-center gap-1.5 disabled:opacity-60"
          >
            {saveState === 'saving' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Draft
          </button>
          {post.status !== 'published' && (
            <button
              type="button"
              onClick={() => handleSave('published')}
              disabled={saveState === 'saving'}
              className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
            >
              <CheckCircle2 className="h-4 w-4" />
              Publish
            </button>
          )}
          {post.status === 'published' && (
            <button
              type="button"
              onClick={() => handleSave('archived')}
              disabled={saveState === 'saving'}
              className="inline-flex items-center gap-1.5 rounded-lg border border-charcoal-200 bg-white px-4 py-2.5 text-sm font-semibold text-charcoal-600 hover:bg-charcoal-50 disabled:opacity-60"
            >
              <Archive className="h-4 w-4" />
              Archive
            </button>
          )}
        </div>
      </div>

      {/* Status badge + preview link */}
      <div className="mb-6 flex items-center gap-3">
        <StatusBadge status={post.status} />
        {post.status === 'published' && (
          <Link to={`/blog/${post.slug}`} target="_blank" className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-900">
            <Eye className="h-3.5 w-3.5" />
            View Public Page
          </Link>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content - 2 cols */}
        <div className="space-y-6 lg:col-span-2">
          {/* Title */}
          <div className="rounded-xl border border-charcoal-200 bg-white p-5">
            <label className="block text-sm font-medium text-charcoal-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-lg border border-charcoal-200 px-3 py-2.5 text-base text-charcoal-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
            <label className="mt-4 block text-sm font-medium text-charcoal-700">Slug (URL)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-2 w-full rounded-lg border border-charcoal-200 px-3 py-2.5 text-sm text-charcoal-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          {/* Excerpt */}
          <div className="rounded-xl border border-charcoal-200 bg-white p-5">
            <label className="block text-sm font-medium text-charcoal-700">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="mt-2 w-full rounded-lg border border-charcoal-200 px-3 py-2.5 text-sm text-charcoal-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          {/* Content sections */}
          <div className="rounded-xl border border-charcoal-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-charcoal-700">Article Content</h3>
              <button type="button" onClick={addSection} className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-900">
                <Plus className="h-3.5 w-3.5" />
                Add Section
              </button>
            </div>
            <div className="mt-4 space-y-6">
              {content.map((section, secIdx) => (
                <div key={secIdx} className="rounded-lg border border-charcoal-100 bg-charcoal-50/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">Section {secIdx + 1}</span>
                    <button type="button" onClick={() => removeSection(secIdx)} className="text-charcoal-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={section.heading}
                    onChange={(e) => updateSection(secIdx, { heading: e.target.value })}
                    placeholder="Section heading"
                    className="mt-3 w-full rounded-lg border border-charcoal-200 bg-white px-3 py-2 text-sm font-medium text-charcoal-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                  <div className="mt-3 space-y-2">
                    {section.paragraphs.map((para, paraIdx) => (
                      <textarea
                        key={paraIdx}
                        value={para}
                        onChange={(e) => updateParagraph(secIdx, paraIdx, e.target.value)}
                        rows={3}
                        placeholder="Paragraph text..."
                        className="w-full rounded-lg border border-charcoal-200 bg-white px-3 py-2 text-sm text-charcoal-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                      />
                    ))}
                    <button type="button" onClick={() => addParagraph(secIdx)} className="text-xs font-medium text-brand-700 hover:text-brand-900">
                      + Add paragraph
                    </button>
                  </div>
                  {/* List items */}
                  {section.list && section.list.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <span className="text-xs font-medium text-charcoal-500">List items:</span>
                      {section.list.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => updateListItem(secIdx, itemIdx, e.target.value)}
                            className="flex-1 rounded-lg border border-charcoal-200 bg-white px-3 py-1.5 text-sm text-charcoal-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                          />
                          <button type="button" onClick={() => removeListItem(secIdx, itemIdx)} className="text-charcoal-400 hover:text-red-600">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button type="button" onClick={() => addListItem(secIdx)} className="mt-2 text-xs font-medium text-brand-700 hover:text-brand-900">
                    + Add list item
                  </button>
                </div>
              ))}
              {content.length === 0 && (
                <p className="text-sm text-charcoal-400">No sections yet. Click "Add Section" to start.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - 1 col */}
        <div className="space-y-6">
          {/* Category + reading time */}
          <div className="rounded-xl border border-charcoal-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-charcoal-700">Post Settings</h3>
            <label className="mt-3 block text-sm font-medium text-charcoal-700">Category</label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="mt-2 w-full rounded-lg border border-charcoal-200 px-3 py-2 text-sm text-charcoal-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              {BLOG_CATEGORIES.map((c) => (
                <option key={c.slug} value={c.name}>{c.name}</option>
              ))}
            </select>
            <label className="mt-4 block text-sm font-medium text-charcoal-700">Reading Time (minutes)</label>
            <input
              type="number"
              min={1}
              max={30}
              value={readingTime}
              onChange={(e) => setReadingTime(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border border-charcoal-200 px-3 py-2 text-sm text-charcoal-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          {/* Featured image */}
          <div className="rounded-xl border border-charcoal-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-charcoal-700">Featured Image</h3>
            <label className="mt-3 block text-sm font-medium text-charcoal-700">Image URL</label>
            <input
              type="text"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://..."
              className="mt-2 w-full rounded-lg border border-charcoal-200 px-3 py-2 text-sm text-charcoal-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
            <label className="mt-3 block text-sm font-medium text-charcoal-700">Image Alt Text</label>
            <input
              type="text"
              value={featuredImageAlt}
              onChange={(e) => setFeaturedImageAlt(e.target.value)}
              className="mt-2 w-full rounded-lg border border-charcoal-200 px-3 py-2 text-sm text-charcoal-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
            {featuredImage && (
              <div className="mt-3 overflow-hidden rounded-lg border border-charcoal-100">
                <img src={featuredImage} alt={featuredImageAlt || 'Preview'} className="h-32 w-full object-cover" />
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="rounded-xl border border-charcoal-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-charcoal-700">SEO Settings</h3>
            <label className="mt-3 block text-sm font-medium text-charcoal-700">SEO Title</label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="mt-2 w-full rounded-lg border border-charcoal-200 px-3 py-2 text-sm text-charcoal-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
            <label className="mt-3 block text-sm font-medium text-charcoal-700">SEO Description</label>
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              rows={3}
              className="mt-2 w-full rounded-lg border border-charcoal-200 px-3 py-2 text-sm text-charcoal-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          {/* Review notes + source notes */}
          <div className="rounded-xl border border-charcoal-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-charcoal-700">Review Notes</h3>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={3}
              placeholder="Add notes for review..."
              className="mt-3 w-full rounded-lg border border-charcoal-200 px-3 py-2 text-sm text-charcoal-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
            {post.source_notes && (
              <>
                <h4 className="mt-4 text-sm font-semibold text-charcoal-700">Source Notes (AI)</h4>
                <p className="mt-2 rounded-lg bg-charcoal-50 p-3 text-xs leading-relaxed text-charcoal-600">
                  {post.source_notes}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatusBadge({ status }: { status: 'draft' | 'published' | 'archived' }) {
  const styles = {
    draft: 'border-amber-200 bg-amber-50 text-amber-800',
    published: 'border-green-200 bg-green-50 text-green-800',
    archived: 'border-charcoal-200 bg-charcoal-50 text-charcoal-600',
  };
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}
