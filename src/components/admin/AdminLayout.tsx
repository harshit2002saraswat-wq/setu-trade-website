import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Inbox, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Enquiries', href: '/admin?view=all', icon: Inbox },
  ];

  return (
    <div className="min-h-screen bg-charcoal-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-charcoal-200 bg-white">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          <Link to="/admin" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 text-white">
              <Inbox className="h-4 w-4" strokeWidth={2.2} />
            </span>
            <span className="font-display text-base font-extrabold tracking-tightest text-charcoal-900">
              SETU<span className="text-brand-500"> TRADE</span>
              <span className="ml-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal-400">
                Admin
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-brand-700 sm:inline-flex"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Website
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-charcoal-600 hover:bg-charcoal-100 hover:text-charcoal-900"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 border-r border-charcoal-200 bg-white py-6 lg:block">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-800'
                      : 'text-charcoal-600 hover:bg-charcoal-50 hover:text-charcoal-900'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <div className="container-page py-6 sm:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
