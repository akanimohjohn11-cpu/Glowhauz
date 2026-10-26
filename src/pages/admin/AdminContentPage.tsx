import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { db } from '../../lib/storage';
import { StoreContent } from '../../types';
import { Save, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const AdminContentPage: React.FC = () => {
  const { content, refreshStore } = useStore();
  const [formData, setFormData] = useState<StoreContent>(content);
  const [notice, setNotice] = useState<string | null>(null);

  const handleFaqChange = (idx: number, field: string, val: string) => {
    const updatedFaqs = [...formData.faqs];
    updatedFaqs[idx] = { ...updatedFaqs[idx], [field]: val };
    setFormData({ ...formData, faqs: updatedFaqs });
  };

  const handleAddFaq = () => {
    const newFaq = {
      id: `faq-${Date.now()}`,
      category: 'Ordering & WhatsApp' as const,
      question: 'New Question?',
      answer: 'Detailed response...',
    };
    setFormData({ ...formData, faqs: [...formData.faqs, newFaq] });
  };

  const handleRemoveFaq = (idx: number) => {
    setFormData({
      ...formData,
      faqs: formData.faqs.filter((_, i) => i !== idx),
    });
  };

  const handleDiffChange = (idx: number, field: 'title' | 'description', val: string) => {
    const updated = [...formData.differentiators];
    updated[idx] = { ...updated[idx], [field]: val };
    setFormData({ ...formData, differentiators: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveContent(formData);
    refreshStore();
    setNotice('Website content and FAQs updated successfully!');
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#292B28]">
            Website Content & Copy
          </h1>
          <p className="text-xs text-[#666963]">
            Customize brand stories, science philosophy, and customer FAQs.
          </p>
        </div>
      </div>

      {notice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xs text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* About Story & Science */}
        <div className="bg-white border border-[#E6E0D5] p-6 rounded-xs shadow-2xs space-y-4">
          <h2 className="font-serif text-lg font-semibold text-[#292B28] border-b border-[#E6E0D5] pb-2">
            Brand Story & Philosophy
          </h2>

          <div>
            <label className="block text-xs font-semibold text-[#292B28] mb-1">
              About GlowHauz Story
            </label>
            <textarea
              rows={4}
              value={formData.aboutStory}
              onChange={(e) => setFormData({ ...formData, aboutStory: e.target.value })}
              className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#292B28] mb-1">
              Curation Philosophy
            </label>
            <textarea
              rows={3}
              value={formData.aboutPhilosophy}
              onChange={(e) => setFormData({ ...formData, aboutPhilosophy: e.target.value })}
              className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#292B28] mb-1">
              Scientific Approach Statement
            </label>
            <textarea
              rows={3}
              value={formData.aboutScience}
              onChange={(e) => setFormData({ ...formData, aboutScience: e.target.value })}
              className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28] resize-none"
            />
          </div>
        </div>

        {/* Brand Differentiators */}
        <div className="bg-white border border-[#E6E0D5] p-6 rounded-xs shadow-2xs space-y-4">
          <h2 className="font-serif text-lg font-semibold text-[#292B28] border-b border-[#E6E0D5] pb-2">
            Brand Differentiators (4 Pillars)
          </h2>

          <div className="space-y-3">
            {formData.differentiators.map((diff, idx) => (
              <div key={idx} className="bg-[#F8F5EF] p-3 rounded-xs border border-[#E6E0D5] space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-xs text-[#34483B]">0{idx + 1}.</span>
                  <input
                    type="text"
                    value={diff.title}
                    onChange={(e) => handleDiffChange(idx, 'title', e.target.value)}
                    placeholder="Pillar title"
                    className="flex-1 text-xs p-1.5 bg-white border border-[#E6E0D5] rounded-xs font-semibold"
                  />
                </div>
                <textarea
                  rows={2}
                  value={diff.description}
                  onChange={(e) => handleDiffChange(idx, 'description', e.target.value)}
                  placeholder="Pillar explanation"
                  className="w-full text-xs p-1.5 bg-white border border-[#E6E0D5] rounded-xs resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-white border border-[#E6E0D5] p-6 rounded-xs shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E6E0D5] pb-2">
            <div>
              <h2 className="font-serif text-lg font-semibold text-[#292B28]">
                Frequently Asked Questions ({formData.faqs.length})
              </h2>
              <p className="text-[11px] text-[#666963]">
                Shown on both homepage and dedicated FAQ page.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddFaq}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#34483B] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.faqs.map((faq, idx) => (
              <div key={faq.id || idx} className="bg-[#F8F5EF] p-4 rounded-xs border border-[#E6E0D5] space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                    placeholder="Question text"
                    className="flex-1 text-xs p-2 bg-white border border-[#E6E0D5] rounded-xs font-semibold"
                  />
                  <select
                    value={faq.category}
                    onChange={(e) => handleFaqChange(idx, 'category', e.target.value)}
                    className="text-xs p-2 bg-white border border-[#E6E0D5] rounded-xs"
                  >
                    <option value="Ordering & WhatsApp">Ordering & WhatsApp</option>
                    <option value="Delivery & Shipping">Delivery & Shipping</option>
                    <option value="Products & Science">Products & Science</option>
                    <option value="Returns">Returns</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(idx)}
                    className="p-1.5 text-[#666963] hover:text-rose-700"
                    aria-label="Remove FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={faq.answer}
                  onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                  placeholder="Answer explanation..."
                  className="w-full text-xs p-2 bg-white border border-[#E6E0D5] rounded-xs resize-none leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-[#E6E0D5]">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#34483B] hover:bg-[#243329] text-white px-6 py-2.5 rounded-xs text-xs font-semibold shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Website Content</span>
          </button>
        </div>
      </form>
    </div>
  );
};
