import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSeo } from '@/hooks/useSeo';

export function AdminLoginPage() {
  useSeo({
    title: 'Admin Login | Setu Trade',
    description: 'Admin login for Setu Trade enquiry management.',
  });

  const { session, loading, signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-charcoal-50">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (session) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const { error: signInError } = await signIn(email.trim(), password);
    setSubmitting(false);

    if (signInError) {
      setError('Invalid email or password. Please try again.');
      return;
    }

    navigate('/admin', { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal-50 px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 text-white shadow-sm">
              <Lock className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <span className="flex flex-col leading-none text-left">
              <span className="font-display text-lg font-extrabold tracking-tightest text-charcoal-900">
                SETU<span className="text-brand-500"> TRADE</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                Admin Dashboard
              </span>
            </span>
          </Link>
        </div>

        <div className="card p-7 sm:p-8">
          <h1 className="text-2xl font-bold text-charcoal-900">Sign In</h1>
          <p className="mt-1.5 text-sm text-charcoal-500">
            Sign in to manage buyer enquiries.
          </p>

          {error && (
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-charcoal-700">Email</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={submitting}
                  className="w-full rounded-lg border border-charcoal-200 bg-white py-2.5 pl-9 pr-3.5 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  placeholder="admin@example.com"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-charcoal-700">Password</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={submitting}
                  className="w-full rounded-lg border border-charcoal-200 bg-white py-2.5 pl-9 pr-3.5 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  placeholder="Your password"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full text-base"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-brand-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
