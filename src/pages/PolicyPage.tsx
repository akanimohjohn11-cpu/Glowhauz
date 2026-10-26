import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Truck, RotateCcw, AlertTriangle, FileText, ChevronRight } from 'lucide-react';

export const PolicyPage: React.FC = () => {
  const location = useLocation();
  const { policies } = useStore();

  const path = location.pathname.replace('/', '');

  const policyConfig = {
    delivery: {
      title: 'Delivery & Shipping Policy',
      kicker: 'Logistics & Dispatch Information',
      icon: Truck,
      content: policies.deliveryPolicy,
    },
    returns: {
      title: 'Returns & Refunds Policy',
      kicker: 'Hygiene & Product Safety Standards',
      icon: RotateCcw,
      content: policies.returnsPolicy,
    },
    'product-disclaimer': {
      title: 'Product & Cosmetic Disclaimer',
      kicker: 'Dermatological Transparency & Safety',
      icon: AlertTriangle,
      content: policies.productDisclaimer,
    },
    privacy: {
      title: 'Privacy Policy',
      kicker: 'Data Protection & Trust',
      icon: ShieldCheck,
      content: policies.privacyPolicy,
    },
    terms: {
      title: 'Terms of Use',
      kicker: 'Store Guidelines & Agreement',
      icon: FileText,
      content: policies.termsOfUse,
    },
  }[path] || {
    title: 'Store Policies',
    kicker: 'Customer Guidance',
    icon: FileText,
    content: policies.termsOfUse,
  };

  const Icon = policyConfig.icon;

  const policyLinks = [
    { label: 'Delivery Policy', path: '/delivery' },
    { label: 'Returns & Refunds', path: '/returns' },
    { label: 'Cosmetic Disclaimer', path: '/product-disclaimer' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Use', path: '/terms' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#666963]">
        <Link to="/" className="hover:text-[#34483B]">Home</Link>
        <ChevronRight className="w-3 h-3 text-[#A7B5A0]" />
        <span className="text-[#292B28] font-medium">{policyConfig.title}</span>
      </nav>

      {/* Header */}
      <div className="bg-white border border-[#E6E0D5] p-6 sm:p-8 rounded-xs space-y-2">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#34483B] font-semibold">
          <Icon className="w-4 h-4 text-[#A7B5A0]" />
          <span>{policyConfig.kicker}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#292B28] font-medium">
          {policyConfig.title}
        </h1>
        <p className="text-xs text-[#666963]">
          Last revised: {policies.lastUpdated} · Governed by Nigerian commercial and consumer standards
        </p>
      </div>

      {/* Policy Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E6E0D5] pb-3">
        {policyLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`text-xs px-3.5 py-1.5 rounded-xs transition-colors ${
                isActive
                  ? 'bg-[#34483B] text-white font-semibold'
                  : 'bg-white text-[#666963] border border-[#E6E0D5] hover:border-[#A7B5A0]'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Content Body */}
      <div className="bg-white border border-[#E6E0D5] p-6 sm:p-10 rounded-xs">
        <div className="prose prose-sm max-w-none text-[#292B28] leading-relaxed space-y-4">
          {policyConfig.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h2 key={idx} className="font-serif text-2xl font-semibold text-[#292B28] pt-4 first:pt-0">
                  {paragraph.replace('### ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('#### ')) {
              return (
                <h3 key={idx} className="font-serif text-lg font-semibold text-[#34483B] pt-3">
                  {paragraph.replace('#### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('- ')) {
              const items = paragraph.split('\n').filter((l) => l.trim().startsWith('- '));
              return (
                <ul key={idx} className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#292B28]">
                  {items.map((item, i) => (
                    <li key={i}>{item.replace('- ', '')}</li>
                  ))}
                </ul>
              );
            }
            if (paragraph.startsWith('1. ')) {
              const items = paragraph.split('\n').filter((l) => /^\d+\.\s/.test(l.trim()));
              return (
                <ol key={idx} className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-[#292B28]">
                  {items.map((item, i) => (
                    <li key={i}>{item.replace(/^\d+\.\s/, '')}</li>
                  ))}
                </ol>
              );
            }
            return (
              <p key={idx} className="text-xs sm:text-sm text-[#292B28] leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};
