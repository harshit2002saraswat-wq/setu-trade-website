import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import {
  Inbox,
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Search,
  X,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import { useSeo } from '@/hooks/useSeo';
import { supabase } from '@/lib/supabase';
import type { Enquiry, EnquiryStatus } from '@/types/enquiry';
import { ENQUIRY_STATUSES, STATUS_LABELS, STATUS_COLORS } from '@/types/enquiry';

type LoadingState = 'loading' | 'success' | 'error';

export function AdminDashboardPage() {
  useSeo({ title: 'Admin Dashboard | Setu Trade', description: 'Manage buyer enquiries.' });

  const { session, loading: authLoading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [search, setSearch] = useState('');

  const statusFilter = (searchParams.get('status') as EnquiryStatus | null) ?? 'all';
  const productFilter = searchParams.get('product') ?? 'all';
  const countryFilter = searchParams.get('country') ?? 'all';
  const dateFilter = searchParams.get('date') ?? 'all';

  useEffect(() => {
    if (authLoading) return;
    if (!session) return;

    let query = supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }
    if (productFilter !== 'all') {
      query = query.eq('product', productFilter);
    }
    if (countryFilter !== 'all') {
      query = query.eq('country', countryFilter);
    }
    if (dateFilter !== 'all') {
      const now = new Date();
      let startDate: Date | null = null;
      if (dateFilter === 'today') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (dateFilter === 'week') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      } else if (dateFilter === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      }
      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }
    }

    setLoadingState('loading');
    setErrorMsg('');

    query.then(({ data, error }) => {
      if (error) {
        setLoadingState('error');
        setErrorMsg('Could not load enquiries. Please try again.');
        return;
      }
      setEnquiries((data as Enquiry[]) ?? []);
      setLoadingState('success');
    });
  }, [session, authLoading, statusFilter, productFilter, countryFilter, dateFilter]);

  const stats = useMemo(() => {
    const total = enquiries.length;
    const newCount = enquiries.filter((e) => e.status === 'new').length;
    const inProgressCount = enquiries.filter((e) =>
      ['contacted', 'quoted', 'negotiating'].includes(e.status)
    ).length;
    const respondedCount = enquiries.filter((e) =>
      ['confirmed', 'closed', 'rejected'].includes(e.status)
    ).length;
    return { total, newCount, inProgressCount, respondedCount };
  }, [enquiries]);

  const filteredEnquiries = useMemo(() => {
    if (!search.trim()) return enquiries;
    const q = search.trim().toLowerCase();
    return enquiries.filter(
      (e) =>
        e.full_name.toLowerCase().includes(q) ||
        (e.company?.toLowerCase().includes(q) ?? false) ||
        e.email.toLowerCase().includes(q) ||
        e.product.toLowerCase().includes(q)
    );
  }, [enquiries, search]);

  const uniqueProducts = useMemo(
    () => [...new Set(enquiries.map((e) => e.product))].sort(),
    [enquiries]
  );
  const uniqueCountries = useMemo(
    () => [...new Set(enquiries.map((e) => e.country))].sort(),
    [enquiries]
  );

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === 'all') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
    setSearch('');
  };

  const hasActiveFilters =
    statusFilter !== 'all' ||
    productFilter !== 'all' ||
    countryFilter !== 'all' ||
    dateFilter !== 'all' ||
    search !== '';

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-charcoal-50">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-charcoal-900">Dashboard</h1>
        <p className="mt-1 text-sm text-charcoal-500">Manage and track buyer enquiries.</p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Enquiries" value={stats.total} icon={Inbox} color="brand" />
        <StatCard label="New" value={stats.newCount} icon={Clock} color="blue" />
        <StatCard label="In Progress" value={stats.inProgressCount} icon={TrendingUp} color="amber" />
        <StatCard label="Responded" value={stats.respondedCount} icon={CheckCircle2} color="green" />
      </div>

      {/* Filters + search */}
      <div className="mt-6 rounded-xl border border-charcoal-200 bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by buyer, company, email, or product..."
              className="w-full rounded-lg border border-charcoal-200 bg-white py-2.5 pl-9 pr-3.5 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:items-center">
            <FilterSelect
              label="Status"
              value={statusFilter}
              onChange={(v) => updateFilter('status', v)}
              options={[
                { value: 'all', label: 'All Status' },
                ...ENQUIRY_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] })),
              ]}
            />
            <FilterSelect
              label="Product"
              value={productFilter}
              onChange={(v) => updateFilter('product', v)}
              options={[
                { value: 'all', label: 'All Products' },
                ...uniqueProducts.map((p) => ({ value: p, label: p })),
              ]}
            />
            <FilterSelect
              label="Country"
              value={countryFilter}
              onChange={(v) => updateFilter('country', v)}
              options={[
                { value: 'all', label: 'All Countries' },
                ...uniqueCountries.map((c) => ({ value: c, label: c })),
              ]}
            />
            <FilterSelect
              label="Date"
              value={dateFilter}
              onChange={(v) => updateFilter('date', v)}
              options={[
                { value: 'all', label: 'All Time' },
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'Last 7 days' },
                { value: 'month', label: 'Last 30 days' },
              ]}
            />
          </div>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-900"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        )}
      </div>

      {/* Enquiries table / list */}
      <div className="mt-6">
        {loadingState === 'loading' && (
          <div className="flex items-center justify-center rounded-xl border border-charcoal-200 bg-white py-20">
            <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
            <span className="ml-3 text-sm text-charcoal-500">Loading enquiries...</span>
          </div>
        )}

        {loadingState === 'error' && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 py-16 text-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="mt-3 text-sm font-medium text-red-800">{errorMsg}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-secondary mt-5"
            >
              Try Again
            </button>
          </div>
        )}

        {loadingState === 'success' && filteredEnquiries.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-charcoal-200 bg-white py-16 text-center">
            <Inbox className="h-8 w-8 text-charcoal-300" />
            <p className="mt-3 text-sm font-medium text-charcoal-700">
              {hasActiveFilters ? 'No enquiries match your filters.' : 'No enquiries yet.'}
            </p>
            <p className="mt-1 text-xs text-charcoal-400">
              {hasActiveFilters
                ? 'Try adjusting your search or filters.'
                : 'New buyer enquiries will appear here.'}
            </p>
          </div>
        )}

        {loadingState === 'success' && filteredEnquiries.length > 0 && (
          <>
            <p className="mb-3 text-sm text-charcoal-500">
              {filteredEnquiries.length} {filteredEnquiries.length === 1 ? 'enquiry' : 'enquiries'}
            </p>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-xl border border-charcoal-200 bg-white lg:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-charcoal-200 bg-charcoal-50">
                    <Th>Date</Th>
                    <Th>Buyer</Th>
                    <Th>Company</Th>
                    <Th>Country</Th>
                    <Th>Product</Th>
                    <Th>Qty</Th>
                    <Th>Destination</Th>
                    <Th>Status</Th>
                    <Th></Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-100">
                  {filteredEnquiries.map((e) => (
                    <tr key={e.id} className="hover:bg-charcoal-50/60">
                      <Td className="whitespace-nowrap text-charcoal-500">
                        {formatDate(e.created_at)}
                      </Td>
                      <Td className="font-medium text-charcoal-900">{e.full_name}</Td>
                      <Td className="text-charcoal-600">{e.company || '—'}</Td>
                      <Td className="text-charcoal-600">{e.country}</Td>
                      <Td className="text-charcoal-600">{e.product}</Td>
                      <Td className="whitespace-nowrap text-charcoal-600">
                        {e.quantity} {e.unit}
                      </Td>
                      <Td className="text-charcoal-600">{e.destination}</Td>
                      <Td>
                        <StatusBadge status={e.status} />
                      </Td>
                      <Td>
                        <Link
                          to={`/admin/enquiries/${e.id}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-900"
                        >
                          View
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 lg:hidden">
              {filteredEnquiries.map((e) => (
                <Link
                  key={e.id}
                  to={`/admin/enquiries/${e.id}`}
                  className="block rounded-xl border border-charcoal-200 bg-white p-4 transition-colors hover:border-brand-300 hover:bg-brand-50/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-charcoal-900">{e.full_name}</p>
                      <p className="text-xs text-charcoal-400">{formatDate(e.created_at)}</p>
                    </div>
                    <StatusBadge status={e.status} />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-charcoal-600">
                    <div>
                      <span className="text-charcoal-400">Product: </span>
                      {e.product}
                    </div>
                    <div>
                      <span className="text-charcoal-400">Qty: </span>
                      {e.quantity} {e.unit}
                    </div>
                    <div>
                      <span className="text-charcoal-400">Country: </span>
                      {e.country}
                    </div>
                    <div>
                      <span className="text-charcoal-400">Destination: </span>
                      {e.destination}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: typeof Inbox;
  color: 'brand' | 'blue' | 'amber' | 'green';
}) {
  const colors = {
    brand: 'bg-brand-50 text-brand-700',
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-green-50 text-green-700',
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

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="rounded-lg border border-charcoal-200 bg-white py-2 px-3 text-sm text-charcoal-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-400">{children}</th>;
}

function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}

function StatusBadge({ status }: { status: EnquiryStatus }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
