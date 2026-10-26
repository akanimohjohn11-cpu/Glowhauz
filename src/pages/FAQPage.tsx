import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { createWhatsAppUrl } from '../lib/whatsapp';
import { ChevronDown, MessageCircle } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const { content, settings } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-2']);

  const categories = ['All', 'Ordering & WhatsApp', 'Delivery & Shipping', 'Products & Science', 'Returns'];

  const filteredFaqs = content.faqs.filter((faq) => {
    if (selectedCategory === 'All') return true;
    return faq.category === selectedCategory;
  });

  const toggleFaq = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAskWhatsApp = () => {
    const url = createWhatsAppUrl(
      settings.normalizedWhatsApp,
      'Hello GlowHauz, I have a question that is not covered in your FAQ.'
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="text-xs uppercase tracking-widest text-[#34483B] font-semibold">
          Customer Support & Clarity
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#292B28] font-medium">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-[#666963] max-w-lg mx-auto">
          Everything you need to know about our WhatsApp ordering process, Enugu dispatch logistics, and product integrity.
        </p>
      </div>

      {/* Category Pills/Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs px-3.5 py-1.5 rounded-xs transition-colors border ${
              selectedCategory === cat
                ? 'bg-[#34483B] text-white border-[#34483B]'
                : 'bg-white text-[#666963] border-[#E6E0D5] hover:border-[#A7B5A0]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordions */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openIds.includes(faq.id);
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
                <div>
                  <span className="text-[11px] text-[#A7B5A0] font-semibold uppercase tracking-wider block mb-0.5">
                    {faq.category}
                  </span>
                  <span className="text-sm font-semibold text-[#292B28]">
                    {faq.question}
                  </span>
                </div>
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

      {/* Help Banner */}
      <div className="bg-[#EDF1EC] border border-[#A7B5A0]/40 p-6 rounded-xs text-center space-y-3">
        <h3 className="font-serif text-lg font-semibold text-[#292B28]">
          Have a question not listed here?
        </h3>
        <p className="text-xs text-[#666963] max-w-md mx-auto">
          Our team is available Monday through Saturday to assist with ingredient sensitivities, order inquiries, and delivery updates.
        </p>
        <button
          onClick={handleAskWhatsApp}
          className="inline-flex items-center gap-2 bg-[#34483B] text-white text-xs font-semibold px-5 py-2.5 rounded-xs"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Ask on WhatsApp</span>
        </button>
      </div>
    </div>
  );
};
