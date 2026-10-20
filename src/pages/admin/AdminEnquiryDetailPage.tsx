import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Package,
  Scale,
  Calendar,
  Truck,
  FileText,
  CheckCircle2,
  Save,
  ChevronRight,
  Send,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import { useSeo } from '@/hooks/useSeo';
import { supabase } from '@/lib/supabase';
import type { Enquiry, EnquiryStatus, EmailStatus } from '@/types/enquiry';
import { ENQUIRY_STATUSES, STATUS_LABELS, STATUS_COLORS } from '@/types/enquiry';

type LoadingState = 'loading' | 'success' | 'error';

export function AdminEnquiryDetailPage() {
  useSeo({ title: 'Enquiry Detail | Setu Trade Admin', description: 'View and manage enquiry.' });

  const { id } = useParams<{ id: string }>();
  const { session, loading: authLoading } = useAuth();

  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<EnquiryStatus>('new');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (authLoading || !session || !id) return;

    setLoadingState('loading');
    supabase
      .from('enquiries')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          setLoadingState('error');
          setErrorMsg('Could not load this enquiry.');
          return;
        }
        if (!data) {
          setLoadingState('error');
          setErrorMsg('Enquiry not found.');
          return;
        }
        const enq = data as Enquiry;
        setEnquiry(enq);
        setSelectedStatus(enq.status);
        setLoadingState('success');
      });
  }, [id, session, authLoading]);

  const handleStatusChange = async () => {
    if (!enquiry || selectedStatus === enquiry.status) return;

    setSaving(true);
    setSaveMsg(null);

    const { data, error } = await supabase
      .from('enquiries')
      .update({ status: selectedStatus })
      .eq('id', enquiry.id)
      .select('*')
      .single();

    setSaving(false);

    if (error) {
      setSaveMsg({ type: 'error', text: 'Could not update status. Please try again.' });
      return;
    }

    const updated = data as Enquiry;
    setEnquiry(updated);
    setSaveMsg({ type: 'success', text: `Status updated to "${STATUS_LABELS[updated.status]}".` });
  };

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
      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-1.5 text-sm text-charcoal-500">
        <Link to="/admin" className="hover:text-brand-700">Dashboard</Link>
        <ChevronRight className="h-3.5 w-3.5 text-charcoal-300" />
        <span className="font-medium text-charcoal-800">Enquiry</span>
      </nav>

      {loadingState === 'loading' && (
        <div className="flex items-center justify-center rounded-xl border border-charcoal-200 bg-white py-20">
          <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
          <span className="ml-3 text-sm text-charcoal-500">Loading enquiry...</span>
        </div>
      )}

      {loadingState === 'error' && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 py-16 text-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="mt-3 text-sm font-medium text-red-800">{errorMsg}</p>
          <Link to="/admin" className="btn-secondary mt-5">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      )}

      {loadingState === 'success' && enquiry && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 rounded-xl border border-charcoal-200 bg-white p-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-charcoal-900">{enquiry.full_name}</h1>
                <StatusBadge status={enquiry.status} />
              </div>
              <p className="mt-1.5 text-sm text-charcoal-500">
                Submitted {formatDateTime(enquiry.created_at)}
              </p>
              {enquiry.company && (
                <p className="mt-1 text-sm text-charcoal-600">{enquiry.company}</p>
              )}
            </div>
            <Link to="/admin" className="btn-secondary text-sm">
              <ArrowLeft className="h-4 w-4" />
              Back to List
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left: enquiry details */}
            <div className="space-y-6 lg:col-span-2">
              <DetailCard title="Buyer Information" icon={User}>
                <DetailRow icon={User} label="Full Name" value={enquiry.full_name} />
                {enquiry.company && <DetailRow icon={Building2} label="Company" value={enquiry.company} />}
                <DetailRow icon={MapPin} label="Country" value={enquiry.country} />
                {enquiry.city && <DetailRow icon={MapPin} label="City" value={enquiry.city} />}
                <DetailRow icon={Mail} label="Email" value={enquiry.email} />
                {enquiry.phone && <DetailRow icon={Phone} label="Phone / WhatsApp" value={enquiry.phone} />}
                {enquiry.buyer_type && <DetailRow icon={Building2} label="Buyer Type" value={enquiry.buyer_type} />}
              </DetailCard>

              <DetailCard title="Product Requirements" icon={Package}>
                <DetailRow icon={Package} label="Product" value={enquiry.product} />
                {enquiry.variety_grade && <DetailRow icon={Scale} label="Variety / Grade" value={enquiry.variety_grade} />}
                <DetailRow icon={Scale} label="Quantity" value={`${enquiry.quantity} ${enquiry.unit}`} />
                {enquiry.packaging && <DetailRow icon={Package} label="Packaging" value={enquiry.packaging} />}
                {enquiry.specifications && (
                  <div className="border-t border-charcoal-100 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">Specifications</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-charcoal-700">
                      {enquiry.specifications}
                    </p>
                  </div>
                )}
              </DetailCard>

              <DetailCard title="Delivery & Commercial Terms" icon={Truck}>
                <DetailRow icon={MapPin} label="Destination" value={enquiry.destination} />
                {enquiry.delivery_date && (
                  <DetailRow icon={Calendar} label="Required Delivery Date" value={formatDate(enquiry.delivery_date)} />
                )}
                {enquiry.incoterm && <DetailRow icon={Truck} label="Incoterm" value={enquiry.incoterm} />}
                {enquiry.payment_terms && <DetailRow icon={FileText} label="Payment Terms" value={enquiry.payment_terms} />}
                {enquiry.message && (
                  <div className="border-t border-charcoal-100 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">Additional Message</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-charcoal-700">
                      {enquiry.message}
                    </p>
                  </div>
                )}
              </DetailCard>
            </div>

            {/* Right: status management */}
            <div className="space-y-6">
              <div className="rounded-xl border border-charcoal-200 bg-white p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-charcoal-400">
                  Status Management
                </h2>

                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium text-charcoal-700">
                    Current Status
                  </label>
                  <div className="mb-4">
                    <StatusBadge status={enquiry.status} />
                  </div>

                  <label className="mb-2 block text-sm font-medium text-charcoal-700">
                    Update Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => {
                      setSelectedStatus(e.target.value as EnquiryStatus);
                      setSaveMsg(null);
                    }}
                    className="w-full rounded-lg border border-charcoal-200 bg-white py-2.5 px-3 text-sm text-charcoal-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  >
                    {ENQUIRY_STATUSES.map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleStatusChange}
                    disabled={saving || selectedStatus === enquiry.status}
                    className="btn-primary mt-3 w-full text-sm"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Update Status
                      </>
                    )}
                  </button>

                  {saveMsg && (
                    <div
                      className={`mt-3 flex items-start gap-2 rounded-lg p-3 text-sm ${
                        saveMsg.type === 'success'
                          ? 'bg-green-50 text-green-800'
                          : 'bg-red-50 text-red-800'
                      }`}
                    >
                      {saveMsg.type === 'success' ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      ) : (
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      )}
                      {saveMsg.text}
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-charcoal-200 bg-white p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-charcoal-400">
                  Email Notification
                </h2>
                <div className="mt-4 flex items-center gap-2">
                  <EmailStatusBadge status={enquiry.email_status} />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-charcoal-400">
                  Admin notification email status for this enquiry.
                </p>
              </div>

              <div className="rounded-xl border border-charcoal-200 bg-white p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-charcoal-400">
                  Enquiry ID
                </h2>
                <p className="mt-3 break-all font-mono text-xs text-charcoal-500">{enquiry.id}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function DetailCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof User;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-charcoal-200 bg-white p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <Icon className="h-4 w-4" strokeWidth={1.9} />
        </span>
        <h2 className="text-base font-bold text-charcoal-900">{title}</h2>
      </div>
      <div className="mt-5 divide-y divide-charcoal-100">{children}</div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-charcoal-400" strokeWidth={1.8} />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">{label}</p>
        <p className="mt-0.5 break-words text-sm font-medium text-charcoal-800">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: EnquiryStatus }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function EmailStatusBadge({ status }: { status: EmailStatus }) {
  const config: Record<EmailStatus, { label: string; className: string }> = {
    pending: { label: 'Pending', className: 'bg-charcoal-100 text-charcoal-600 border-charcoal-200' },
    sent: { label: 'Sent', className: 'bg-green-100 text-green-700 border-green-200' },
    failed: { label: 'Failed', className: 'bg-red-100 text-red-700 border-red-200' },
    not_configured: { label: 'Not Configured', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${c.className}`}>
      <Send className="h-3 w-3" />
      {c.label}
    </span>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
