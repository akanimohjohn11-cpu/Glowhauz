import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { createWhatsAppUrl, createTelUrl } from '../../lib/whatsapp';
import { trackEvent } from '../../lib/analytics';
import { MessageCircle, Phone, MapPin, Mail, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, categories } = useStore();

  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_contact_click', { source: 'footer' });
  };

  const handleTelClick = () => {
    trackEvent('telephone_click', { source: 'footer' });
  };

  return (
    <footer className="bg-[#243329] text-[#F8F5EF] pt-16 pb-12 border-t border-[#34483B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-[#34483B]/60">
          {/* Col 1: Brand & Positioning */}
          <div className="space-y-4">
            <span className="font-serif text-3xl font-semibold tracking-tight text-[#F8F5EF] block">
              GlowHauz
            </span>
            <p className="text-sm text-[#A7B5A0] italic font-serif">
              "{settings.brandStatement}"
            </p>
            <p className="text-xs text-[#F8F5EF]/80 leading-relaxed max-w-sm">
              Carefully curated skincare and wellness essentials designed to complement your personal care routine. Honest botanical science backed by dermatological integrity.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#A7B5A0]">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-[#E8C9CC]" />
              <span>{settings.dispatchLocation}</span>
            </div>
          </div>

          {/* Col 2: Catalog Navigation */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest text-[#E8C9CC] uppercase mb-4">
              Explore Curation
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F8F5EF]/80">
              <li>
                <Link to="/shop" className="hover:text-[#E8C9CC] transition-colors">
                  All Products
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/categories/${cat.slug}`}
                    className="hover:text-[#E8C9CC] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/collections/everyday-radiance-ritual"
                  className="hover:text-[#E8C9CC] transition-colors"
                >
                  Featured Rituals
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest text-[#E8C9CC] uppercase mb-4">
              Care & Policies
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F8F5EF]/80">
              <li>
                <Link to="/delivery" className="hover:text-[#E8C9CC] transition-colors">
                  Delivery & Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-[#E8C9CC] transition-colors">
                  Returns & Hygiene Standards
                </Link>
              </li>
              <li>
                <Link to="/product-disclaimer" className="hover:text-[#E8C9CC] transition-colors">
                  Product & Cosmetic Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#E8C9CC] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#E8C9CC] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#E8C9CC] transition-colors">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified WhatsApp Ordering & Support */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest text-[#E8C9CC] uppercase mb-4">
              Direct Inquiries
            </h4>
            <p className="text-xs text-[#F8F5EF]/80 mb-3 leading-relaxed">
              Have questions about your skincare routine or order status? Reach our dedicated team directly on WhatsApp.
            </p>
            <div className="space-y-2 text-xs">
              <a
                href={createWhatsAppUrl(
                  settings.normalizedWhatsApp,
                  'Hello GlowHauz, I have an inquiry regarding your skincare products.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="inline-flex items-center gap-2 bg-[#34483B] hover:bg-[#3d5545] text-[#F8F5EF] px-3.5 py-2 rounded-xs border border-[#A7B5A0]/30 transition-colors w-full justify-center"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#A7B5A0]" />
                <span className="font-medium">WhatsApp: {settings.whatsappNumber}</span>
              </a>

              <a
                href={createTelUrl(settings.normalizedWhatsApp)}
                onClick={handleTelClick}
                className="flex items-center gap-2 text-[#A7B5A0] hover:text-[#F8F5EF] transition-colors px-1 py-1"
              >
                <Phone className="w-3.5 h-3.5 text-[#E8C9CC]" />
                <span>Call: {settings.phoneNumber}</span>
              </a>

              <div className="flex items-center gap-2 text-[#A7B5A0] px-1 py-1">
                <Clock className="w-3.5 h-3.5 text-[#E8C9CC]" />
                <span>{settings.businessHours}</span>
              </div>

              <div className="flex items-center gap-2 text-[#A7B5A0] px-1 py-1">
                <Mail className="w-3.5 h-3.5 text-[#E8C9CC]" />
                <span>{settings.supportEmail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Clean copyright and order note */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A7B5A0]">
          <p>© {new Date().getFullYear()} GlowHauz Skincare and Wellness Store. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="text-[#E8C9CC]">Currency: NGN (₦)</span>
            <span>·</span>
            <span>Enugu, Nigeria</span>
            <span>·</span>
            <Link
              to="/admin"
              className="text-[#A7B5A0]/20 hover:text-[#A7B5A0]/50 transition-colors cursor-default text-[10px]"
              title="·"
              aria-label="Staff"
            >
              ·
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
