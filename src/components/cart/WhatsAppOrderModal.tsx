import React, { useState } from 'react';
import { ValidatedCartItem } from '../../types';
import { useStore } from '../../context/StoreContext';
import {
  generateCartWhatsAppMessage,
  createWhatsAppUrl,
  createTelUrl,
} from '../../lib/whatsapp';
import { formatPrice } from '../../lib/currency';
import { trackEvent } from '../../lib/analytics';
import { MessageCircle, Copy, Check, Phone, X, AlertCircle } from 'lucide-react';

interface WhatsAppOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ValidatedCartItem[];
  subtotal: number;
}

export const WhatsAppOrderModal: React.FC<WhatsAppOrderModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
}) => {
  const { settings } = useStore();
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const orderMessage = generateCartWhatsAppMessage(
    items.filter((i) => i.isAvailable),
    subtotal,
    deliveryLocation,
    notes,
    settings.storeName
  );

  const handleOpenWhatsApp = () => {
    trackEvent('begin_whatsapp_checkout', {
      itemCount: items.length,
      subtotal,
      deliveryLocation,
    });
    const url = createWhatsAppUrl(settings.normalizedWhatsApp, orderMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(orderMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-xl rounded-lg shadow-2xl border border-[#E6E0D5] p-6 text-[#292B28] max-h-[90vh] overflow-y-auto animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E0D5]">
          <div>
            <h3 className="font-serif text-xl font-semibold text-[#34483B]">
              Complete Order via WhatsApp
            </h3>
            <p className="text-xs text-[#666963] mt-0.5">
              Recipient: <span className="font-semibold text-[#292B28]">{settings.whatsappNumber}</span> (GlowHauz Official)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#666963] hover:text-[#292B28] p-1.5 rounded-sm"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Details Brief */}
        <div className="mt-4 space-y-3">
          <div className="bg-[#F8F5EF] p-3.5 rounded-sm border border-[#E6E0D5]">
            <div className="text-xs font-semibold text-[#34483B] mb-2 uppercase tracking-wider">
              Selected Items ({items.length})
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 text-xs">
              {items.map((vi, idx) => (
                <div key={idx} className="flex justify-between items-center text-[#292B28]">
                  <span className="truncate pr-2">
                    {vi.item.quantity}× {vi.product.name} {vi.item.variantName ? `(${vi.item.variantName})` : ''}
                  </span>
                  <span className="font-semibold tabular-nums shrink-0">
                    {formatPrice(vi.lineTotal)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-[#E6E0D5] flex justify-between items-center text-sm font-semibold">
              <span>Estimated Subtotal</span>
              <span className="tabular-nums text-[#34483B]">{formatPrice(subtotal)}</span>
            </div>
          </div>

          {/* Optional Inputs for Delivery Location & Customer Notes */}
          <div className="space-y-2.5">
            <div>
              <label htmlFor="delivery-location" className="block text-xs font-semibold text-[#292B28] mb-1">
                Your Delivery Address / City <span className="text-[#666963] font-normal">(optional, for courier fee estimate)</span>
              </label>
              <input
                id="delivery-location"
                type="text"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                placeholder="e.g. Independence Layout, Enugu OR Ikeja, Lagos"
                className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label htmlFor="customer-notes" className="block text-xs font-semibold text-[#292B28] mb-1">
                Additional Notes or Skin Concerns <span className="text-[#666963] font-normal">(optional)</span>
              </label>
              <textarea
                id="customer-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Any special instructions, request for routine guide, etc."
                className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs focus:bg-white focus:outline-hidden resize-none"
              />
            </div>
          </div>

          {/* Message Preview Accordion / Box */}
          <div>
            <div className="text-[11px] font-semibold text-[#666963] uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>WhatsApp Message Preview</span>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-[#34483B] hover:underline flex items-center gap-1 font-medium capitalize"
              >
                {copied ? <Check className="w-3 h-3 text-green-700" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy text'}
              </button>
            </div>
            <pre className="w-full text-[11px] font-sans bg-[#F8F5EF] p-3 rounded-xs border border-[#E6E0D5] text-[#292B28] whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed select-all">
              {orderMessage}
            </pre>
          </div>

          {/* Verification Disclaimer */}
          <div className="bg-[#EDF1EC] p-3 rounded-xs text-xs text-[#243329] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#34483B] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Order Verification:</strong> Opening WhatsApp transmits this inquiry to GlowHauz. It does not automatically charge you. Our team will verify real-time stock, confirm the exact delivery fee for your location, and share direct bank transfer payment details.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-[#E6E0D5] flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleOpenWhatsApp}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-[#34483B] hover:bg-[#243329] text-white py-3 px-4 rounded-xs text-sm font-semibold shadow-xs transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[#A7B5A0]" />
            <span>Send Order on WhatsApp</span>
          </button>

          <button
            onClick={handleCopyMessage}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-[#F8F5EF] hover:bg-[#E8C9CC]/40 text-[#292B28] py-3 px-4 rounded-xs text-xs font-semibold border border-[#E6E0D5] transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-700" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Text Copied' : 'Copy Message'}</span>
          </button>

          <a
            href={createTelUrl(settings.normalizedWhatsApp)}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-[#666963] hover:text-[#292B28] py-3 px-3 text-xs font-medium"
            title="Call Store directly"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Us</span>
          </a>
        </div>
      </div>
    </div>
  );
};
