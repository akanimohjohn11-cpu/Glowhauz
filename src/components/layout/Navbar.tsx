import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, Search, Menu, X, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { itemCount } = useCart();
  const { settings } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Shop All', href: '/shop' },
    { label: 'Serums', href: '/categories/serums-treatments' },
    { label: 'Moisturizers', href: '/categories/moisturizers-creams' },
    { label: 'Rituals', href: '/collections/everyday-radiance-ritual' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Discreet keyboard shortcut: Ctrl+Shift+A or Cmd+Shift+A triggers admin
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigate('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <header className="sticky top-0 z-40 bg-[#F8F5EF]/95 backdrop-blur-md border-b border-[#E6E0D5]">
      {/* Main Top Bar: Strict 3-zone contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in Cormorant Garamond) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#292B28] hover:text-[#34483B] focus-visible:ring-1"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <Link
            to="/"
            className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#292B28] hover:text-[#34483B] whitespace-nowrap shrink-0 transition-colors"
          >
            GlowHauz
          </Link>
        </div>

        {/* Zone 2: 4–5 single-line clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#292B28]/80">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`hover:text-[#34483B] transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                isActive(link.href) ? 'text-[#34483B] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#34483B]' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Zone 3: Actions (Search & Shopping Bag) */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-[#292B28] hover:text-[#34483B] transition-colors"
            aria-label="Search catalog"
            title="Search products"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link
            to="/cart"
            className="relative flex items-center gap-2 bg-[#34483B] hover:bg-[#243329] text-[#F8F5EF] px-4 py-2.5 rounded-xs text-xs font-semibold tracking-wide transition-all whitespace-nowrap shrink-0 shadow-xs hover:shadow-[0_8px_20px_rgba(52,72,59,0.25)]"
            aria-label={`Shopping bag with ${itemCount} items`}
          >
            <ShoppingBag className="w-4 h-4 text-[#A7B5A0]" />
            <span className="hidden sm:inline">Bag</span>
            <span className="bg-[#E8C9CC] text-[#292B28] font-bold text-[11px] px-1.5 py-0.2 rounded-full tabular-nums">
              {itemCount}
            </span>
          </Link>
        </div>
      </div>

      {/* Inline Search Panel */}
      {searchOpen && (
        <div className="border-t border-[#E6E0D5] bg-[#FFFFFF] px-4 py-3 shadow-xs">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
            <Search className="w-4 h-4 text-[#A7B5A0] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search botanical serums, cleansers, ceramides, SPF..."
              autoFocus
              className="w-full bg-transparent border-none text-sm text-[#292B28] placeholder-[#666963] focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-[#34483B] text-white text-xs font-medium rounded-xs hover:bg-[#243329] whitespace-nowrap"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-[#666963] hover:text-[#292B28] text-xs font-medium px-2 py-1"
            >
              Close
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F8F5EF] border-t border-[#E6E0D5] px-6 py-6 shadow-lg">
          <div className="flex flex-col gap-4 text-base font-medium text-[#292B28]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 border-b border-[#E6E0D5]/60 hover:text-[#34483B] transition-colors ${
                  isActive(link.href) ? 'text-[#34483B] font-semibold' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 text-xs text-[#666963]">
              <p>Official WhatsApp: <span className="font-semibold text-[#292B28]">{settings.whatsappNumber}</span></p>
              <p className="mt-1">Dispatched from Enugu, Nigeria</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
