import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { db } from '../../lib/storage';
import { StorePolicies } from '../../types';
import { Save, CheckCircle2 } from 'lucide-react';

export const AdminPoliciesPage: React.FC = () => {
  const { policies, refreshStore } = useStore();
  const [formData, setFormData] = useState<StorePolicies>(policies);
  const [activeTab, setActiveTab] = useState<'delivery' | 'returns' | 'disclaimer' | 'privacy' | 'terms'>('delivery');
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.savePolicies(formData);
    refreshStore();
    setNotice('Store policies updated and published immediately!');
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#292B28]">
          Store Policies & Disclaimers
        </h1>
        <p className="text-xs text-[#666963]">
          Edit customer care guidelines, Enugu delivery information, returns standards, and cosmetic disclaimers.
        </p>
      </div>

      {notice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xs text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* Policy Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E6E0D5] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('delivery')}
          className={`px-3.5 py-1.5 rounded-xs text-xs font-semibold transition-colors ${
            activeTab === 'delivery'
              ? 'bg-[#34483B] text-white'
              : 'bg-white text-[#666963] border border-[#E6E0D5] hover:border-[#A7B5A0]'
          }`}
        >
          Delivery & Shipping
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('returns')}
          className={`px-3.5 py-1.5 rounded-xs text-xs font-semibold transition-colors ${
            activeTab === 'returns'
              ? 'bg-[#34483B] text-white'
              : 'bg-white text-[#666963] border border-[#E6E0D5] hover:border-[#A7B5A0]'
          }`}
        >
          Returns & Hygiene
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('disclaimer')}
          className={`px-3.5 py-1.5 rounded-xs text-xs font-semibold transition-colors ${
            activeTab === 'disclaimer'
              ? 'bg-[#34483B] text-white'
              : 'bg-white text-[#666963] border border-[#E6E0D5] hover:border-[#A7B5A0]'
          }`}
        >
          Cosmetic Disclaimer
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('privacy')}
          className={`px-3.5 py-1.5 rounded-xs text-xs font-semibold transition-colors ${
            activeTab === 'privacy'
              ? 'bg-[#34483B] text-white'
              : 'bg-white text-[#666963] border border-[#E6E0D5] hover:border-[#A7B5A0]'
          }`}
        >
          Privacy Policy
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('terms')}
          className={`px-3.5 py-1.5 rounded-xs text-xs font-semibold transition-colors ${
            activeTab === 'terms'
              ? 'bg-[#34483B] text-white'
              : 'bg-white text-[#666963] border border-[#E6E0D5] hover:border-[#A7B5A0]'
          }`}
        >
          Terms of Use
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-[#E6E0D5] p-6 rounded-xs shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E6E0D5] pb-2">
            <h2 className="font-serif text-lg font-semibold text-[#292B28] capitalize">
              {activeTab === 'disclaimer' ? 'Product & Cosmetic Disclaimer' : `${activeTab} Policy`}
            </h2>
            <span className="text-[11px] text-[#666963]">
              Supports standard Markdown formatting (headers, bullet points, numbered lists)
            </span>
          </div>

          {activeTab === 'delivery' && (
            <textarea
              rows={16}
              value={formData.deliveryPolicy}
              onChange={(e) => setFormData({ ...formData, deliveryPolicy: e.target.value })}
              className="w-full text-xs font-mono p-3 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28] leading-relaxed resize-y"
            />
          )}

          {activeTab === 'returns' && (
            <textarea
              rows={16}
              value={formData.returnsPolicy}
              onChange={(e) => setFormData({ ...formData, returnsPolicy: e.target.value })}
              className="w-full text-xs font-mono p-3 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28] leading-relaxed resize-y"
            />
          )}

          {activeTab === 'disclaimer' && (
            <textarea
              rows={16}
              value={formData.productDisclaimer}
              onChange={(e) => setFormData({ ...formData, productDisclaimer: e.target.value })}
              className="w-full text-xs font-mono p-3 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28] leading-relaxed resize-y"
            />
          )}

          {activeTab === 'privacy' && (
            <textarea
              rows={16}
              value={formData.privacyPolicy}
              onChange={(e) => setFormData({ ...formData, privacyPolicy: e.target.value })}
              className="w-full text-xs font-mono p-3 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28] leading-relaxed resize-y"
            />
          )}

          {activeTab === 'terms' && (
            <textarea
              rows={16}
              value={formData.termsOfUse}
              onChange={(e) => setFormData({ ...formData, termsOfUse: e.target.value })}
              className="w-full text-xs font-mono p-3 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28] leading-relaxed resize-y"
            />
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#34483B] hover:bg-[#243329] text-white px-6 py-2.5 rounded-xs text-xs font-semibold shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Publish Policies</span>
          </button>
        </div>
      </form>
    </div>
  );
};
