import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { db } from '../../lib/storage';
import { formatPrice } from '../../lib/currency';
import { getStoredAnalytics } from '../../lib/analytics';
import {
  Package,
  Layers,
  Sparkles,
  MessageCircle,
  AlertTriangle,
  Plus,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Database,
  ExternalLink,
} from 'lucide-react';

export const AdminOverviewPage: React.FC = () => {
  const { products, categories, collections, settings, refreshStore, supabaseConnected } = useStore();
  const [resetSuccess, setResetSuccess] = useState(false);

  const publishedCount = products.filter((p) => p.status === 'published').length;
  const outOfStock = products.filter((p) => p.stockQuantity === 0 || !p.isAvailable);
  const featuredCount = products.filter((p) => p.isFeatured && p.status === 'published').length;

  const recentAnalytics = getStoredAnalytics().slice(0, 8);

  const handleResetDemoSeed = () => {
    if (window.confirm('Reset catalog, categories, content, and settings to original verified demonstration seed?')) {
      db.resetToDemoSeed();
      refreshStore();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#292B28]">
            Dashboard Overview
          </h1>
          <p className="text-xs text-[#666963] mt-0.5">
            Real-time management for GlowHauz Skincare and Wellness Store.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-1.5 bg-[#34483B] hover:bg-[#243329] text-white px-3.5 py-2 rounded-xs text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Formulation</span>
          </Link>

          <button
            onClick={handleResetDemoSeed}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-[#F8F5EF] text-[#666963] border border-[#E6E0D5] px-3 py-2 rounded-xs text-xs font-medium transition-colors"
            title="Reset demonstration data"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo Seed</span>
          </button>
        </div>
      </div>

      {resetSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xs text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Demo seed data restored successfully! Public catalog updated.</span>
        </div>
      )}

      {/* Supabase Connection Status Banner */}
      <div className="bg-white border border-[#E6E0D5] p-4 rounded-xs shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#292B28]">Supabase Database Connected</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800">
                Live Client Active
              </span>
            </div>
            <p className="text-[11px] text-[#666963] font-mono mt-0.5 truncate max-w-md">
              https://wyiledgckpbzeshkwcdg.supabase.co
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] text-[#666963]">
            Schema file: <code className="bg-[#F8F5EF] px-1.5 py-0.5 rounded-xs border border-[#E6E0D5] text-[#34483B] font-mono">supabase/schema.sql</code>
          </span>
          <a
            href="https://supabase.com/dashboard/project/wyiledgckpbzeshkwcdg/sql"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#34483B] hover:text-[#243329] font-medium hover:underline text-[11px]"
          >
            <span>Open SQL Editor</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xs border border-[#E6E0D5] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#666963] mb-2 font-medium">
            <span>Total Formulations</span>
            <Package className="w-4 h-4 text-[#A7B5A0]" />
          </div>
          <div className="text-2xl font-bold text-[#292B28] tabular-nums">{products.length}</div>
          <div className="text-[11px] text-[#A7B5A0] mt-1 font-medium">
            {publishedCount} published · {products.length - publishedCount} draft/archived
          </div>
        </div>

        <div className="bg-white p-5 rounded-xs border border-[#E6E0D5] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#666963] mb-2 font-medium">
            <span>Categories</span>
            <Layers className="w-4 h-4 text-[#A7B5A0]" />
          </div>
          <div className="text-2xl font-bold text-[#292B28] tabular-nums">{categories.length}</div>
          <div className="text-[11px] text-[#A7B5A0] mt-1 font-medium">
            Across serums, cleansers, creams & SPF
          </div>
        </div>

        <div className="bg-white p-5 rounded-xs border border-[#E6E0D5] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#666963] mb-2 font-medium">
            <span>Featured on Home</span>
            <Sparkles className="w-4 h-4 text-[#A7B5A0]" />
          </div>
          <div className="text-2xl font-bold text-[#34483B] tabular-nums">{featuredCount}</div>
          <div className="text-[11px] text-[#A7B5A0] mt-1 font-medium">
            Displayed in primary hero grid
          </div>
        </div>

        <div className="bg-white p-5 rounded-xs border border-[#E6E0D5] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#666963] mb-2 font-medium">
            <span>WhatsApp Target</span>
            <MessageCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-sm font-bold text-[#292B28] font-mono truncate">
            {settings.whatsappNumber}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-medium">
            Normalized: +{settings.normalizedWhatsApp}
          </div>
        </div>
      </div>

      {/* Inventory & Low Stock Alerts */}
      {outOfStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xs text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>Stock Notice ({outOfStock.length} items unavailable)</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-amber-800">
            {outOfStock.map((p) => (
              <li key={p.id}>
                <Link to={`/admin/products/${p.id}/edit`} className="underline font-medium hover:text-amber-950">
                  {p.name}
                </Link>{' '}
                — currently marked out of stock or 0 quantity.
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 2 Columns: Quick Navigation & Recent Interaction Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Quick Actions & Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-[#E6E0D5] p-6 rounded-xs shadow-2xs space-y-4">
            <h2 className="font-serif text-lg font-semibold text-[#292B28] border-b border-[#E6E0D5] pb-3">
              Fast Store Actions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <Link
                to="/admin/products/new"
                className="p-3 bg-[#F8F5EF] hover:bg-[#EDF1EC] rounded-xs border border-[#E6E0D5] flex items-center justify-between text-[#292B28] transition-colors"
              >
                <div>
                  <span className="font-semibold block">Add New Product</span>
                  <span className="text-[11px] text-[#666963]">Set prices, images & variants</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#34483B]" />
              </Link>

              <Link
                to="/admin/settings"
                className="p-3 bg-[#F8F5EF] hover:bg-[#EDF1EC] rounded-xs border border-[#E6E0D5] flex items-center justify-between text-[#292B28] transition-colors"
              >
                <div>
                  <span className="font-semibold block">Update WhatsApp Number</span>
                  <span className="text-[11px] text-[#666963]">Current: {settings.whatsappNumber}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#34483B]" />
              </Link>

              <Link
                to="/admin/content"
                className="p-3 bg-[#F8F5EF] hover:bg-[#EDF1EC] rounded-xs border border-[#E6E0D5] flex items-center justify-between text-[#292B28] transition-colors"
              >
                <div>
                  <span className="font-semibold block">Edit Homepage Copy</span>
                  <span className="text-[11px] text-[#666963]">Update headlines & FAQs</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#34483B]" />
              </Link>

              <Link
                to="/admin/policies"
                className="p-3 bg-[#F8F5EF] hover:bg-[#EDF1EC] rounded-xs border border-[#E6E0D5] flex items-center justify-between text-[#292B28] transition-colors"
              >
                <div>
                  <span className="font-semibold block">Manage Store Policies</span>
                  <span className="text-[11px] text-[#666963]">Delivery, returns, disclaimer</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#34483B]" />
              </Link>
            </div>
          </div>

          {/* Catalog Highlights Table Preview */}
          <div className="bg-white border border-[#E6E0D5] p-6 rounded-xs shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6E0D5] pb-3">
              <h2 className="font-serif text-lg font-semibold text-[#292B28]">
                Catalog Highlights
              </h2>
              <Link to="/admin/products" className="text-xs font-semibold text-[#34483B] hover:underline">
                View all ({products.length}) →
              </Link>
            </div>

            <div className="divide-y divide-[#E6E0D5] text-xs">
              {products.slice(0, 5).map((p) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-[#292B28] truncate block">{p.name}</span>
                    <span className="text-[11px] text-[#666963]">{p.categoryName} · SKU: {p.sku}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-semibold tabular-nums text-[#292B28]">{formatPrice(p.price)}</div>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider ${
                        p.status === 'published' ? 'text-emerald-700' : 'text-[#666963]'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Interaction Audit Log (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E6E0D5] p-6 rounded-xs shadow-2xs space-y-4">
          <div className="border-b border-[#E6E0D5] pb-3">
            <h2 className="font-serif text-lg font-semibold text-[#292B28]">
              Customer Interaction Audit
            </h2>
            <p className="text-[11px] text-[#666963] mt-0.5">
              Privacy-conscious log of recent shopping cart actions and WhatsApp inquiries.
            </p>
          </div>

          {recentAnalytics.length > 0 ? (
            <div className="space-y-2.5 text-xs">
              {recentAnalytics.map((evt, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-[#F8F5EF] rounded-xs border border-[#E6E0D5]/70 flex items-start justify-between gap-2"
                >
                  <div className="min-w-0">
                    <span className="font-semibold text-[#34483B] block">
                      {evt.type.replace(/_/g, ' ')}
                    </span>
                    {evt.data?.productName ? (
                      <span className="text-[11px] text-[#666963] truncate block">
                        Product: {String(evt.data.productName)}
                      </span>
                    ) : null}
                    {evt.data?.subtotal ? (
                      <span className="text-[11px] text-[#666963] block">
                        Estimated: {formatPrice(Number(evt.data.subtotal))}
                      </span>
                    ) : null}
                  </div>
                  <span className="text-[10px] text-[#666963] shrink-0 font-mono">
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-[#666963]">
              No interaction events recorded in this session yet. Events will appear as shoppers browse and initiate WhatsApp checkout.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
