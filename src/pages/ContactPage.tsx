import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { createWhatsAppUrl, createTelUrl } from '../lib/whatsapp';
import { trackEvent } from '../lib/analytics';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent('whatsapp_contact_click', { source: 'contact_form', name });
    
    const formattedMessage = [
      `Hello GlowHauz Support,`,
      ``,
      `My name is ${name}.`,
      phone ? `My phone/WhatsApp: ${phone}` : '',
      ``,
      `Message:`,
      message,
    ]
      .filter(Boolean)
      .join('\n');

    const url = createWhatsAppUrl(settings.normalizedWhatsApp, formattedMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="text-xs uppercase tracking-widest text-[#34483B] font-semibold">
          Get In Touch
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#292B28] font-medium">
          Contact GlowHauz
        </h1>
        <p className="text-xs sm:text-sm text-[#666963] max-w-md mx-auto">
          We are here to answer formulation questions, confirm item availability, or coordinate delivery to your doorstep.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E6E0D5] p-6 sm:p-8 rounded-xs space-y-6 shadow-xs">
          <div>
            <h2 className="font-serif text-xl font-semibold text-[#292B28] mb-1">
              Store Details
            </h2>
            <p className="text-xs text-[#666963]">
              Based in Enugu, dispatching across Nigeria.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* WhatsApp */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#EDF1EC] text-[#34483B] rounded-xs shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-[#292B28] block">WhatsApp Order Line</span>
                <a
                  href={createWhatsAppUrl(settings.normalizedWhatsApp, 'Hello GlowHauz, I have a quick question.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#34483B] hover:underline font-medium text-sm block mt-0.5"
                >
                  {settings.whatsappNumber}
                </a>
                <span className="text-[11px] text-[#666963]">Instant product & routine inquiries</span>
              </div>
            </div>

            {/* Telephone */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#EDF1EC] text-[#34483B] rounded-xs shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-[#292B28] block">Phone Consultation</span>
                <a
                  href={createTelUrl(settings.normalizedWhatsApp)}
                  className="text-[#34483B] hover:underline font-medium text-sm block mt-0.5"
                >
                  {settings.phoneNumber}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#EDF1EC] text-[#34483B] rounded-xs shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-[#292B28] block">Email Support</span>
                <span className="text-[#666963] text-sm block mt-0.5">{settings.supportEmail}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#EDF1EC] text-[#34483B] rounded-xs shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-[#292B28] block">Dispatch Hub</span>
                <span className="text-[#666963] block mt-0.5">{settings.dispatchLocation}</span>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#EDF1EC] text-[#34483B] rounded-xs shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-[#292B28] block">Operating Hours</span>
                <span className="text-[#666963] block mt-0.5">{settings.businessHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Message Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E6E0D5] p-6 sm:p-8 rounded-xs space-y-6 shadow-xs">
          <div>
            <h2 className="font-serif text-xl font-semibold text-[#292B28] mb-1">
              Send a Direct Inquiry
            </h2>
            <p className="text-xs text-[#666963]">
              Fill out your details to open a pre-formatted conversation directly with our team on WhatsApp.
            </p>
          </div>

          {submitted ? (
            <div className="bg-[#EDF1EC] p-6 rounded-xs text-center space-y-3 border border-[#A7B5A0]/40">
              <CheckCircle className="w-8 h-8 text-[#34483B] mx-auto" />
              <h3 className="font-serif text-lg font-semibold text-[#292B28]">Inquiry Generated</h3>
              <p className="text-xs text-[#666963] max-w-sm mx-auto">
                Your WhatsApp chat has been opened. Our team will review your message and reply promptly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#34483B] font-semibold underline mt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#292B28] mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Chisom Okeke"
                  className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#292B28] mb-1">
                  Your Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 08012345678"
                  className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#292B28] mb-1">
                  Your Message or Question *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what skin concerns you have or what products you are inquiring about..."
                  className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs focus:bg-white focus:outline-hidden resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#34483B] hover:bg-[#243329] text-white py-3 px-4 rounded-xs text-xs font-semibold shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send via WhatsApp</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
