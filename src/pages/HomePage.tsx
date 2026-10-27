import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { createWhatsAppUrl } from '../lib/whatsapp';
import { trackEvent } from '../lib/analytics';
import {
  ArrowRight,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Truck,
  HeartHandshake,
  ChevronDown,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { featuredProducts, categories, collections, settings, content } = useStore();
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const heroBgImage = '/images/hero_luxury_botanical_bg_1793010027228.jpg';
  const heroImage = '/images/glowhauz_hero_botanical_1793008581757.jpg';

  const handleHeroWhatsAppClick = () => {
    trackEvent('whatsapp_contact_click', { source: 'hero_cta' });
    const url = createWhatsAppUrl(
      settings.normalizedWhatsApp,
      'Hello GlowHauz, I would like to consult with you on building a personalized skincare routine.'
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* 1. Hero Section with Botanical Travertine Background Image */}
      <section className="relative overflow-hidden border-b border-[#E6E0D5] py-16 sm:py-24">
        {/* Background Image Layer with Warm Ivory Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-multiply"
          style={{ backgroundImage: `url(${heroBgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8F5EF] via-[#F8F5EF]/92 to-[#F8F5EF]/60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
            {/* Left Content (7 cols on lg) */}
            <div className="lg:col-span-7 space-y-7">
              {/* Unboxed Brand Kicker */}
              <div className="flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.25em] text-[#34483B] font-bold">
                <Sparkles className="w-4 h-4 text-[#A7B5A0]" />
                <span>{settings.tagline}</span>
              </div>

              {/* Required Exact Headline with Prominent Editorial Typography */}
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#292B28] leading-[1.1] text-balance">
                Your Glow. Your Wellness. Your Way.
              </h1>

              {/* Required Exact Supporting Copy with Enhanced Legibility */}
              <p className="text-lg sm:text-xl text-[#292B28]/85 leading-relaxed max-w-xl font-normal">
                Discover carefully selected skincare, beauty and wellness essentials designed to complement your personal care routine.
              </p>

              {/* CTAs: Primary Shop CTA + Secondary WhatsApp CTA with Glow Effects */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2.5 bg-[#34483B] hover:bg-[#243329] text-white px-8 py-4 rounded-xs text-sm sm:text-base font-semibold shadow-md hover:shadow-[0_12px_28px_rgba(52,72,59,0.35)] hover:-translate-y-0.5 transition-all"
                >
                  <span>Shop Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={handleHeroWhatsAppClick}
                  className="inline-flex items-center justify-center gap-2.5 bg-white/95 hover:bg-white text-[#292B28] border border-[#E6E0D5] px-7 py-4 rounded-xs text-sm sm:text-base font-semibold hover:shadow-[0_10px_25px_rgba(232,201,204,0.5)] hover:-translate-y-0.5 transition-all backdrop-blur-xs"
                >
                  <MessageCircle className="w-4 h-4 text-[#34483B]" />
                  <span>WhatsApp Inquiry</span>
                </button>
              </div>

              {/* Regional Dispatch Trust marker */}
              <div className="pt-6 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-[#292B28]/75 border-t border-[#34483B]/15 max-w-xl font-medium">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#34483B]" />
                  <span>Dispatched from Enugu</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#34483B]" />
                  <span>Dermatologically Minded</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-[#34483B]" />
                  <span>Direct Guidance</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image (5 cols on lg) with Floating Effect and Soft Botanical Glow */}
            <div className="lg:col-span-5">
              <div className="relative animate-float">
                {/* Ambient Soft Glow Behind Frame */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#E8C9CC]/40 via-[#A7B5A0]/25 to-transparent rounded-sm blur-xl -z-10" />

                <div className="relative aspect-4/3 lg:aspect-4/5 w-full rounded-xs overflow-hidden bg-white border border-[#E6E0D5] shadow-[0_20px_50px_-15px_rgba(52,72,59,0.22)]">
                  <img
                    src={heroImage}
                    alt="GlowHauz botanical luxury skincare curation"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop by Category with Hover Lift and Soft Glow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#34483B] font-bold mb-1">
              Curated Formulations
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#292B28] font-normal">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-semibold text-[#34483B] hover:underline flex items-center gap-1.5"
          >
            <span>View All ({categories.reduce((acc, c) => acc + (c.productCount || 0), 0)} items)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className="group p-6 bg-white border border-[#E6E0D5] hover:border-[#A7B5A0] hover:bg-[#FDFBF7] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(52,72,59,0.1)] rounded-xs flex flex-col justify-between h-48"
            >
              <div>
                <Sparkles className="w-6 h-6 text-[#A7B5A0] group-hover:text-[#34483B] transition-colors mb-4 stroke-1" />
                <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#292B28] group-hover:text-[#34483B] transition-colors leading-snug">
                  {cat.name}
                </h3>
              </div>
              <div className="pt-3 border-t border-[#E6E0D5]/60 flex items-center justify-between text-xs text-[#666963] font-medium">
                <span>{cat.productCount || 0} products</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Products from Database */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#34483B] font-bold mb-1">
              Laboratory Tested & Curated
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#292B28] font-normal">
              Featured Formulations
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-semibold text-[#34483B] hover:underline flex items-center gap-1.5"
          >
            <span>Explore Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Curated Rituals & Collections */}
      <section className="bg-white border-y border-[#E6E0D5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-10">
            <div className="text-xs uppercase tracking-wider text-[#666963] font-semibold mb-1">
              Routine Synergy
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#292B28] font-medium">
              Curated Daily Rituals
            </h2>
            <p className="text-xs sm:text-sm text-[#666963] mt-2">
              Harmonious active regimens designed to work in synergy without barrier overload.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((col) => (
              <div
                key={col.id}
                className="bg-[#F8F5EF] border border-[#E6E0D5] p-6 rounded-xs flex flex-col justify-between"
              >
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[#34483B] font-semibold mb-2">
                    {col.tagline}
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-[#292B28] mb-3">
                    {col.name}
                  </h3>
                  <p className="text-xs text-[#666963] leading-relaxed mb-6">
                    {col.description}
                  </p>
                </div>

                <Link
                  to={`/collections/${col.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#34483B] hover:underline pt-3 border-t border-[#E6E0D5]"
                >
                  <span>Explore Ritual Products</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Brand Differentiators */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-widest text-[#34483B] font-semibold mb-1">
            The GlowHauz Standard
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#292B28] font-medium">
            Where Skin Meets Science
          </h2>
          <p className="text-xs sm:text-sm text-[#666963] mt-2">
            Every product we recommend adheres to verified formulation principles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.differentiators.map((diff, idx) => (
            <div key={idx} className="space-y-2">
              <div className="font-serif text-lg text-[#34483B] font-semibold">
                0{idx + 1}. {diff.title}
              </div>
              <p className="text-xs text-[#666963] leading-relaxed">
                {diff.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. About GlowHauz Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#34483B] text-[#F8F5EF] p-8 sm:p-12 lg:p-16 rounded-xs">
          <div className="max-w-3xl space-y-6">
            <div className="text-xs uppercase tracking-widest text-[#E8C9CC] font-semibold">
              Our Commitment
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium leading-snug">
              "We reject misleading skincare miracles in favor of patient, science-backed skin barrier health."
            </h2>
            <p className="text-xs sm:text-sm text-[#F8F5EF]/80 leading-relaxed">
              {content.aboutStory.split('\n\n')[0]}
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#E8C9CC] hover:underline"
              >
                <span>Read our full skincare philosophy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="text-xs uppercase tracking-wider text-[#666963] font-semibold mb-1">
            Clear Answers
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#292B28] font-medium">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {content.faqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white border border-[#E6E0D5] rounded-xs transition-colors"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-[#292B28]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#666963] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#666963] leading-relaxed border-t border-[#E6E0D5]/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/faq"
            className="text-xs font-semibold text-[#34483B] hover:underline"
          >
            View all store policies and questions →
          </Link>
        </div>
      </section>

      {/* 8. Final Conversion Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-[#EDF1EC] border border-[#A7B5A0]/40 p-8 sm:p-12 rounded-xs text-center space-y-4">
          <div className="text-xs uppercase tracking-wider text-[#34483B] font-semibold">
            Ready to Begin?
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#292B28] font-medium max-w-xl mx-auto">
            Experience Personal Skincare Guidance
          </h2>
          <p className="text-xs sm:text-sm text-[#666963] max-w-lg mx-auto">
            Browse our catalog, assemble your personalized cart, and send your inquiry directly through WhatsApp for prompt verification and Enugu dispatch.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/shop"
              className="bg-[#34483B] hover:bg-[#243329] text-white px-7 py-3 rounded-xs text-xs font-semibold shadow-xs"
            >
              Shop All Products
            </Link>
            <button
              onClick={handleHeroWhatsAppClick}
              className="bg-white hover:bg-[#F8F5EF] text-[#292B28] border border-[#E6E0D5] px-6 py-3 rounded-xs text-xs font-semibold shadow-2xs flex items-center gap-2"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#34483B]" />
              <span>Inquire via WhatsApp</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
