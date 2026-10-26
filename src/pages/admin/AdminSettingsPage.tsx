import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { db } from '../../lib/storage';
import { StoreSettings } from '../../types';
import { updateAdminCredentials, getAdminCredentials } from '../../lib/auth';
import { Save, CheckCircle2, ShieldCheck, Phone, AlertCircle } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { settings, refreshStore } = useStore();
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [notice, setNotice] = useState<string | null>(null);

  // Password change state
  const creds = getAdminCredentials();
  const [adminEmail, setAdminEmail] = useState(creds.email);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwNotice, setPwNotice] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveSettings(formData);
    refreshStore();
    setNotice('Store settings and WhatsApp configuration updated!');
    setTimeout(() => setNotice(null), 3000);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setPwNotice(null);
    setPwError(null);

    if (newPassword && newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('Passwords do not match.');
      return;
    }

    updateAdminCredentials(adminEmail, newPassword || undefined);
    setPwNotice('Administrator credentials updated successfully!');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPwNotice(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#292B28]">
          Store Settings & Contact Channels
        </h1>
        <p className="text-xs text-[#666963]">
          Manage WhatsApp target number, dispatch hub, announcements, and administrator login credentials.
        </p>
      </div>

      {notice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xs text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* WhatsApp & Contact Channels Card */}
        <div className="bg-white border border-[#E6E0D5] p-6 rounded-xs shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E6E0D5] pb-2">
            <Phone className="w-4 h-4 text-[#34483B]" />
            <h2 className="font-serif text-lg font-semibold text-[#292B28]">
              Official WhatsApp & Ordering Channel
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                Official WhatsApp Number *
              </label>
              <input
                type="text"
                required
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="e.g. 07089581351"
                className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28] font-mono font-bold"
              />
              <span className="text-[11px] text-[#666963] block mt-1">
                Normalized international target: <code className="font-mono text-[#34483B]">+{formData.normalizedWhatsApp}</code>
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                Phone Number (Calls)
              </label>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="e.g. +234 708 958 1351"
                className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                Support Email Address
              </label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                placeholder="e.g. contact@glowhauz.ng"
                className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                Dispatch Hub & Coverage
              </label>
              <input
                type="text"
                value={formData.dispatchLocation}
                onChange={(e) => setFormData({ ...formData, dispatchLocation: e.target.value })}
                placeholder="e.g. Enugu, Nigeria (Nationwide Courier Dispatch)"
                className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                Business Hours
              </label>
              <input
                type="text"
                value={formData.businessHours}
                onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                placeholder="e.g. Monday – Saturday: 9:00 AM – 7:00 PM (WAT)"
                className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                Instagram Handle
              </label>
              <input
                type="text"
                value={formData.instagramHandle}
                onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                placeholder="e.g. @glowhauz"
                className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28]"
              />
            </div>
          </div>
        </div>

        {/* Storefront Branding & Announcement Card */}
        <div className="bg-white border border-[#E6E0D5] p-6 rounded-xs shadow-2xs space-y-4">
          <h2 className="font-serif text-lg font-semibold text-[#292B28] border-b border-[#E6E0D5] pb-2">
            Storefront Identity & Announcement Banner
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                Brand Statement / Tagline
              </label>
              <input
                type="text"
                value={formData.brandStatement}
                onChange={(e) => setFormData({ ...formData, brandStatement: e.target.value })}
                className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#292B28] mb-1">
              Top Announcement Text
            </label>
            <input
              type="text"
              value={formData.announcementText}
              onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
              placeholder="e.g. 🌿 Complimentary skincare consultation with every order | Dispatched from Enugu"
              className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28]"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs text-[#292B28] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.announcementActive}
                onChange={(e) => setFormData({ ...formData, announcementActive: e.target.checked })}
                className="rounded-xs text-[#34483B] focus:ring-[#34483B]"
              />
              <span className="font-semibold">Display top announcement banner on storefront</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#34483B] hover:bg-[#243329] text-white px-6 py-2.5 rounded-xs text-xs font-semibold shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>

      {/* Admin Credentials & Security Card */}
      <div className="bg-white border border-[#E6E0D5] p-6 rounded-xs shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E6E0D5] pb-2">
          <ShieldCheck className="w-4 h-4 text-[#34483B]" />
          <h2 className="font-serif text-lg font-semibold text-[#292B28]">
            Administrator Security Credentials
          </h2>
        </div>

        {pwError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xs text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{pwError}</span>
          </div>
        )}

        {pwNotice && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xs text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{pwNotice}</span>
          </div>
        )}

        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                New Password (min 8 chars)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-[#292B28] hover:bg-[#34483B] text-white px-5 py-2 rounded-xs text-xs font-semibold"
            >
              Update Admin Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
