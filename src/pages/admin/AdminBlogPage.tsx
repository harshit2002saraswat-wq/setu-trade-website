import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, FileEdit, CheckCircle2, Archive, Loader2, AlertCircle,
  Plus, ArrowRight,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import { useSeo } from '@/hooks/useSeo';
import { fetchAllPostsForAdmin, updatePost, generateDraftViaEdgeFunction } from '@/lib/blogApi';
import type { BlogPost } from '@/types/blog';

export function AdminBlogPage() {
  useSeo({ title: 'Blog Management | Setu Trade Admin', description: 'Manage blog posts and drafts.' });

  const { session, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingState, setLoadingState] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [generating, setGenerating] = useState(false);
  const [genMsg, setGenMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');

  const loadPosts = useCallback(async () => {
    setLoadingState('loading');
    setErrorMsg('');
    try {
      const data = await fetchAllPostsForAdmin();
      setPosts(data);
      setLoadingState('success');
    } catch {
      setErrorMsg('Could not load blog posts.');
      setLoadingState('error');
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!session) return;
    loadPosts();
  }, [session, authLoading, loadPosts]);

  const stats = useMemo(() => {
    const draftCount = posts.filter((p) => p.status === 'draft').length;
    const publishedCount = posts.filter((p) => p.status === 'published').length;
    const archivedCount = posts.filter((p) => p.status === 'archived').length;
    return { draftCount, publishedCount, archivedCount, total: posts.length };
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (statusFilter === 'all') return posts;
    return posts.filter((p) => p.status === statusFilter);
  }, [posts, statusFilter]);

  const draftsForReview = useMemo(
    () => posts.filter((p) => p.status === 'draft').sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [posts],
  );

  const handleGenerate = async () => {
    setGenerating(true);
    setGenMsg(null);
    const result = await generateDraftViaEdgeFunction();
    setGenerating(false);

    if ('error' in result) {
      setGenMsg({ type: 'error', text: result.error });
    } else {
      setGenMsg({ type: 'success', text: `Draft "${result.title}" generated successfully.` });
      await loadPosts();
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await updatePost(id, { status: 'published' });
      await loadPosts();
    } catch {
      setErrorMsg('Failed to publish post.');
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await updatePost(id, { status: 'archived' });
      await loadPosts();
    } catch {
      setErrorMsg('Failed to archive post.');
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      await updatePost(id, { status: 'draft' });
      await loadPosts();
    } catch {
      setErrorMsg('Failed to unpublish post.');
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

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-charcoal-900">Blog Management</h1>
        <p className="mt-1 text-sm text-charcoal-500">Manage blog posts, drafts and AI-generated content.</p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Posts" value={stats.total} icon={FileText} color="brand" />
        <StatCard label="Drafts" value={stats.draftCount} icon={FileEdit} color="amber" />
        <StatCard label="Published" value={stats.publishedCount} icon={CheckCircle2} color="green" />
        <StatCard label="Archived" value={stats.archivedCount} icon={Archive} color="charcoal" />
      </div>

      {/* Generate draft button + message */}
      <div className="mt-6 rounded-xl border border-charcoal-200 bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-charcoal-900">AI Draft Generation</h2>
            <p className="mt-1 text-sm text-charcoal-500">
              Generate a new blog draft using the secure server-side AI. Drafts are not published until you approve them.
            </p>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="btn-primary inline-flex items-center gap-2 whitespace-nowrap disabled:opacity-60"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {generating ? 'Generating...' : 'Generate New Draft'}
          </button>
        </div>

        {genMsg && (
          <div
            className={`mt-4 rounded-lg p-3 text-sm ${
              genMsg.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {genMsg.text}
          </div>
        )}
      </div>

      {/* Drafts requiring review */}
      {draftsForReview.length > 0 && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-sm font-semibold text-amber-900">
            {draftsForReview.length} {draftsForReview.length === 1 ? 'draft' : 'drafts'} requiring review
          </h2>
          <div className="mt-3 space-y-2">
            {draftsForReview.slice(0, 5).map((draft) => (
              <div key={draft.id} className="flex items-center justify-between rounded-lg bg-white px-4 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-charcoal-900">{draft.title}</p>
                  <p className="text-xs text-charcoal-400">
                    {draft.category} · {new Date(draft.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/admin/blog/${draft.id}`} className="text-sm font-medium text-brand-700 hover:text-brand-900">
                    Edit
                  </Link>
                  <button type="button" onClick={() => handlePublish(draft.id)} className="text-sm font-medium text-green-700 hover:text-green-900">
                    Publish
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status filter */}
      <div className="mt-6 flex items-center gap-2">
        {(['all', 'draft', 'published', 'archived'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`rounded-lg px-3 py-2 text-sm font-medium capitalize transition-colors ${
              statusFilter === s
                ? 'bg-brand-700 text-white'
                : 'bg-charcoal-50 text-charcoal-700 hover:bg-brand-50 hover:text-brand-700'
            }`}
          >
            {s === 'all' ? 'All Posts' : s}
          </button>
        ))}
      </div>

      {/* Posts table */}
      <div className="mt-4">
        {loadingState === 'loading' && (
          <div className="flex items-center justify-center rounded-xl border border-charcoal-200 bg-white py-20">
            <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
            <span className="ml-3 text-sm text-charcoal-500">Loading posts...</span>
          </div>
        )}

        {loadingState === 'error' && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 py-16 text-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="mt-3 text-sm font-medium text-red-800">{errorMsg}</p>
            <button type="button" onClick={loadPosts} className="btn-secondary mt-5">Try Again</button>
          </div>
        )}

        {loadingState === 'success' && filteredPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-charcoal-200 bg-white py-16 text-center">
            <FileText className="h-8 w-8 text-charcoal-300" />
            <p className="mt-3 text-sm font-medium text-charcoal-700">No posts found.</p>
          </div>
        )}

        {loadingState === 'success' && filteredPosts.length > 0 && (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-xl border border-charcoal-200 bg-white lg:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-charcoal-200 bg-charcoal-50">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-400">Title</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-400">Category</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-400">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-400">Date</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-100">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-charcoal-50/60">
                      <td className="px-4 py-3 font-medium text-charcoal-900">
                        <Link to={`/admin/blog/${post.id}`} className="hover:text-brand-700">
                          {post.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-charcoal-600">{post.category}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={post.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-charcoal-500">
                        {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Link to={`/admin/blog/${post.id}`} className="text-sm font-medium text-brand-700 hover:text-brand-900">
                            Edit
                          </Link>
                          {post.status === 'draft' && (
                            <button type="button" onClick={() => handlePublish(post.id)} className="text-sm font-medium text-green-700 hover:text-green-900">
                              Publish
                            </button>
                          )}
                          {post.status === 'published' && (
                            <button type="button" onClick={() => handleUnpublish(post.id)} className="text-sm font-medium text-amber-700 hover:text-amber-900">
                              Unpublish
                            </button>
                          )}
                          {post.status !== 'archived' && (
                            <button type="button" onClick={() => handleArchive(post.id)} className="text-sm font-medium text-charcoal-500 hover:text-charcoal-700">
                              Archive
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 lg:hidden">
              {filteredPosts.map((post) => (
                <div key={post.id} className="rounded-xl border border-charcoal-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <Link to={`/admin/blog/${post.id}`} className="min-w-0 font-medium text-charcoal-900 hover:text-brand-700">
                      {post.title}
                    </Link>
                    <StatusBadge status={post.status} />
                  </div>
                  <p className="mt-2 text-xs text-charcoal-400">
                    {post.category} · {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <Link to={`/admin/blog/${post.id}`} className="text-sm font-medium text-brand-700 hover:text-brand-900">
                      Edit <ArrowRight className="inline h-3 w-3" />
                    </Link>
                    {post.status === 'draft' && (
                      <button type="button" onClick={() => handlePublish(post.id)} className="text-sm font-medium text-green-700">
                        Publish
                      </button>
                    )}
                    {post.status === 'published' && (
                      <button type="button" onClick={() => handleUnpublish(post.id)} className="text-sm font-medium text-amber-700">
                        Unpublish
                      </button>
                    )}
                    {post.status !== 'archived' && (
                      <button type="button" onClick={() => handleArchive(post.id)} className="text-sm font-medium text-charcoal-500">
                        Archive
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: typeof FileText; color: 'brand' | 'amber' | 'green' | 'charcoal' }) {
  const colors = {
    brand: 'bg-brand-50 text-brand-700',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-green-50 text-green-700',
    charcoal: 'bg-charcoal-100 text-charcoal-700',
  };
  return (
    <div className="rounded-xl border border-charcoal-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors[color]}`}>
          <Icon className="h-5 w-5" strokeWidth={1.9} />
        </span>
        <span className="text-2xl font-bold text-charcoal-900">{value}</span>
      </div>
      <p className="mt-3 text-sm font-medium text-charcoal-500">{label}</p>
    </div>
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
