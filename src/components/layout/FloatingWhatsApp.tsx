import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { createWhatsAppUrl } from '../../lib/whatsapp';
import { trackEvent } from '../../lib/analytics';
import { MessageCircle, X } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useStore();
  const [openPrompt, setOpenPrompt] = useState(false);

  const handleOpenWhatsApp = (message: string) => {
    trackEvent('whatsapp_contact_click', { source: 'floating_widget' });
    const url = createWhatsAppUrl(settings.normalizedWhatsApp, message);
    window.open(url, '_blank', 'noopener,noreferrer');
    setOpenPrompt(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Interactive Quick Consultation Card */}
      {openPrompt && (
        <div className="mb-3 w-72 sm:w-80 bg-white border border-[#E6E0D5] rounded-lg shadow-xl p-4 text-[#292B28] transition-all animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6E0D5]">
            <div className="flex items-center gap-2">
              <span className="font-serif font-semibold text-sm text-[#34483B]">GlowHauz Support</span>
            </div>
            <button
              onClick={() => setOpenPrompt(false)}
              className="text-[#666963] hover:text-[#292B28] p-1 rounded-sm"
              aria-label="Close WhatsApp prompt"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-[#666963] mt-2 mb-3 leading-relaxed">
            Need skincare advice or have a quick question about ordering? Chat with us directly on WhatsApp.
          </p>

          <div className="space-y-1.5">
            <button
              onClick={() => handleOpenWhatsApp('Hello GlowHauz, I would like skincare advice for my routine.')}
              className="w-full text-left text-xs bg-[#F8F5EF] hover:bg-[#E8C9CC]/30 text-[#292B28] p-2 rounded-xs border border-[#E6E0D5]/70 transition-colors"
            >
              🌿 "I need routine guidance"
            </button>
            <button
              onClick={() => handleOpenWhatsApp('Hello GlowHauz, I would like to check product availability.')}
              className="w-full text-left text-xs bg-[#F8F5EF] hover:bg-[#E8C9CC]/30 text-[#292B28] p-2 rounded-xs border border-[#E6E0D5]/70 transition-colors"
            >
              📦 "Check product stock & delivery"
            </button>
          </div>

          <div className="mt-3 pt-2 border-t border-[#E6E0D5] text-[10px] text-[#666963] flex items-center justify-between">
            <span>Official WhatsApp: {settings.whatsappNumber}</span>
            <span className="text-[#34483B] font-medium">Enugu, Nigeria</span>
          </div>
        </div>
      )}

      {/* Primary Floating Action Button */}
      <button
        onClick={() => setOpenPrompt(!openPrompt)}
        aria-label="Contact GlowHauz on WhatsApp"
        className="flex items-center gap-2 bg-[#34483B] hover:bg-[#243329] text-white px-3.5 py-3 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#34483B]"
      >
        <MessageCircle className="w-5 h-5 text-[#A7B5A0]" />
        <span className="hidden sm:inline text-xs font-medium tracking-wide">
          Chat with Us
        </span>
      </button>
    </div>
  );
};
