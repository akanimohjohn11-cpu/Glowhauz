import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { createWhatsAppUrl } from '../lib/whatsapp';
import { ArrowRight, MessageCircle, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { content, settings } = useStore();

  const handleWhatsAppConsultation = () => {
    const url = createWhatsAppUrl(
      settings.normalizedWhatsApp,
      'Hello GlowHauz, I would like to consult with your skincare specialists regarding my routine.'
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="text-xs uppercase tracking-widest text-[#34483B] font-semibold">
          About GlowHauz
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#292B28] font-medium leading-tight">
          Where Skin Meets Science.
        </h1>
        <p className="text-sm sm:text-base text-[#666963] leading-relaxed">
          Founded in Enugu, Nigeria, GlowHauz is dedicated to transparent, dermatologically-grounded botanical skincare for intentional personal wellness.
        </p>
      </div>

      {/* Main Philosophy Card */}
      <div className="bg-white border border-[#E6E0D5] p-8 sm:p-12 rounded-xs space-y-6 shadow-xs">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#292B28] font-semibold">
          Our Curation Philosophy
        </h2>
        <div className="space-y-4 text-xs sm:text-sm text-[#292B28] leading-relaxed">
          <p>{content.aboutPhilosophy}</p>
          <p>{content.aboutStory}</p>
        </div>

        <div className="pt-4 border-t border-[#E6E0D5] grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="font-serif text-lg font-semibold text-[#34483B] block">Dermatological Rigor</span>
            <p className="text-xs text-[#666963]">
              Only bio-compatible actives with verified research and stable pH formulations.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-lg font-semibold text-[#34483B] block">Climate Context</span>
            <p className="text-xs text-[#666963]">
              Curations tailored for tropical Nigerian weather, barrier resilience, and rich melanin skin.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-lg font-semibold text-[#34483B] block">Personal Attention</span>
            <p className="text-xs text-[#666963]">
              One-on-one WhatsApp ordering to verify suitability before any payment is made.
            </p>
          </div>
        </div>
      </div>

      {/* Verification & Science Section */}
      <div className="bg-[#EDF1EC] border border-[#A7B5A0]/40 p-8 sm:p-10 rounded-xs space-y-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#34483B]">
          <Sparkles className="w-4 h-4" />
          <span>The Scientific Approach</span>
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl text-[#292B28]">
          Honesty Over Hype
        </h3>
        <p className="text-xs sm:text-sm text-[#292B28] leading-relaxed max-w-3xl">
          {content.aboutScience} We strictly refuse to market "miracle cures", unrealistic overnight bleachings, or unverified claims. We educate our community on sun protection, gentle exfoliation, and long-term barrier preservation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-[#243329]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#34483B]" />
            <span>Fragrance-conscious & skin-barrier friendly</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#34483B]" />
            <span>No unsupported medical claims</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#34483B]" />
            <span>Carefully packed from Enugu, Nigeria</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#34483B]" />
            <span>Direct WhatsApp order validation</span>
          </div>
        </div>
      </div>

      {/* Location & Contact Notice */}
      <div className="bg-white border border-[#E6E0D5] p-6 sm:p-8 rounded-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#34483B]">
            <MapPin className="w-4 h-4 text-[#E8C9CC]" />
            <span>{settings.dispatchLocation}</span>
          </div>
          <p className="text-xs text-[#666963]">
            Official Business WhatsApp: <strong className="text-[#292B28]">{settings.whatsappNumber}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/shop"
            className="bg-[#34483B] hover:bg-[#243329] text-white text-xs font-semibold px-5 py-2.5 rounded-xs"
          >
            Explore Catalog
          </Link>
          <button
            onClick={handleWhatsAppConsultation}
            className="border border-[#E6E0D5] hover:bg-[#F8F5EF] text-[#292B28] text-xs font-semibold px-4 py-2.5 rounded-xs flex items-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#34483B]" />
            <span>WhatsApp Us</span>
          </button>
        </div>
      </div>
    </div>
  );
};
