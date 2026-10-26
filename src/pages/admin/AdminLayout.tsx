import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticatedAdmin, logoutAdmin, getAdminSession } from '../../lib/auth';
import {
  LayoutDashboard,
  Package,
  Layers,
  Sparkles,
  FileText,
  Settings,
  ShieldAlert,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(getAdminSession());
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticatedAdmin()) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    logoutAdmin();
    setSession(null);
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: Layers },
    { label: 'Collections', href: '/admin/collections', icon: Sparkles },
    { label: 'Website Content', href: '/admin/content', icon: FileText },
    { label: 'Store Settings', href: '/admin/settings', icon: Settings },
    { label: 'Store Policies', href: '/admin/policies', icon: ShieldAlert },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#F0EDE6] text-[#292B28] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#243329] text-[#F8F5EF] border-r border-[#34483B] shrink-0">
        <div className="p-6 border-b border-[#34483B] flex items-center justify-between">
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#F8F5EF] block">
              GlowHauz
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#A7B5A0] font-semibold">
              Admin Portal
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xs text-xs font-medium transition-colors ${
                  active
                    ? 'bg-[#34483B] text-[#F8F5EF] font-semibold border-l-2 border-[#E8C9CC]'
                    : 'text-[#A7B5A0] hover:bg-[#34483B]/50 hover:text-[#F8F5EF]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-[#34483B] space-y-3">
          <div className="text-[11px] text-[#A7B5A0]">
            <span className="block text-[#F8F5EF] font-medium truncate">
              {session?.user.name || 'Administrator'}
            </span>
            <span className="truncate block opacity-75">{session?.user.email}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#34483B]/60">
            <Link
              to="/"
              target="_blank"
              className="text-xs text-[#A7B5A0] hover:text-[#F8F5EF] flex items-center gap-1 transition-colors"
              title="Open public storefront"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs text-rose-300 hover:text-rose-100 flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E6E0D5] px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="md:hidden p-1.5 text-[#292B28] hover:bg-[#F8F5EF] rounded-xs"
              aria-label="Toggle admin menu"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#666963]">
              Store Management Console
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 bg-[#F8F5EF] hover:bg-[#E6E0D5] text-[#292B28] px-3 py-1.5 rounded-xs text-xs font-semibold border border-[#E6E0D5] transition-colors"
            >
              <span>View Live Store</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="md:hidden bg-[#243329] text-[#F8F5EF] p-4 border-b border-[#34483B]">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-[#A7B5A0] hover:text-[#F8F5EF]"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-3 px-3 py-2 text-xs font-medium text-rose-300 pt-3 border-t border-[#34483B]"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}

        {/* Content Outlet */}
        <main className="p-6 sm:p-8 flex-1 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
