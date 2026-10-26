import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { db } from '../../lib/storage';
import { formatPrice } from '../../lib/currency';
import { Product } from '../../types';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Archive,
  Star,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const { products, categories, refreshStore } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && p.categoryId !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        if (!matchName && !matchSku) return false;
      }
      return true;
    });
  }, [products, statusFilter, categoryFilter, searchQuery]);

  const handleToggleFeatured = (product: Product) => {
    const updated = { ...product, isFeatured: !product.isFeatured };
    db.saveProduct(updated);
    refreshStore();
    showNotice(`Updated featured state for "${product.name}".`);
  };

  const handleToggleStock = (product: Product) => {
    const updated = {
      ...product,
      isAvailable: !product.isAvailable,
      stockQuantity: !product.isAvailable ? (product.stockQuantity || 10) : 0,
    };
    db.saveProduct(updated);
    refreshStore();
    showNotice(`Updated stock availability for "${product.name}".`);
  };

  const handleArchive = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to archive "${name}"? It will no longer appear on public shop pages.`)) {
      db.archiveProduct(id);
      refreshStore();
      showNotice(`Archived "${name}".`);
    }
  };

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#292B28]">
            Product Formulations ({products.length})
          </h1>
          <p className="text-xs text-[#666963]">
            Manage prices, variants, stock availability, and image galleries.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-1.5 bg-[#34483B] hover:bg-[#243329] text-white px-4 py-2 rounded-xs text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Formulation</span>
        </Link>
      </div>

      {actionNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xs text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xs border border-[#E6E0D5] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#A7B5A0]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or SKU..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28] focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#666963]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-[#F8F5EF] border border-[#E6E0D5] text-[#292B28] py-1.5 px-2.5 rounded-xs focus:outline-hidden text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#F8F5EF] border border-[#E6E0D5] text-[#292B28] py-1.5 px-2.5 rounded-xs focus:outline-hidden text-xs"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#E6E0D5] rounded-xs overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F5EF] border-b border-[#E6E0D5] text-[#666963] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Formulation</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (₦)</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E0D5]">
              {filteredProducts.map((p) => {
                const primaryImg = p.images?.[0];
                return (
                  <tr key={p.id} className="hover:bg-[#F8F5EF]/50 transition-colors">
                    {/* Thumbnail & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xs bg-[#F8F5EF] border border-[#E6E0D5] overflow-hidden shrink-0 flex items-center justify-center">
                          {primaryImg ? (
                            <img src={primaryImg} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[9px] text-[#A7B5A0] font-mono">No img</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            to={`/admin/products/${p.id}/edit`}
                            className="font-semibold text-[#292B28] hover:text-[#34483B] truncate block"
                          >
                            {p.name}
                          </Link>
                          <span className="text-[11px] text-[#666963] font-mono">SKU: {p.sku || 'N/A'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-[#666963]">
                      {p.categoryName || 'Unassigned'}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-semibold text-[#292B28] tabular-nums">
                      {formatPrice(p.price)}
                      {p.compareAtPrice && (
                        <span className="block text-[10px] text-[#666963] line-through">
                          {formatPrice(p.compareAtPrice)}
                        </span>
                      )}
                    </td>

                    {/* Stock & Stock toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStock(p)}
                        className={`text-[11px] font-semibold flex items-center gap-1.5 px-2 py-0.5 rounded-xs border ${
                          p.isAvailable && p.stockQuantity > 0
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                        title="Click to toggle availability"
                      >
                        {p.isAvailable && p.stockQuantity > 0 ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>In Stock ({p.stockQuantity})</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>Out of Stock</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleFeatured(p)}
                        className={`p-1.5 rounded-xs transition-colors ${
                          p.isFeatured ? 'text-amber-600 hover:text-amber-700' : 'text-[#666963] hover:text-[#292B28]'
                        }`}
                        title={p.isFeatured ? 'Featured on home' : 'Click to feature'}
                      >
                        <Star className={`w-4 h-4 ${p.isFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
                      </button>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs ${
                          p.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'draft'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {p.status === 'published' && (
                          <Link
                            to={`/products/${p.slug}`}
                            target="_blank"
                            className="p-1.5 text-[#666963] hover:text-[#34483B] transition-colors"
                            title="View on live storefront"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        )}

                        <Link
                          to={`/admin/products/${p.id}/edit`}
                          className="p-1.5 text-[#666963] hover:text-[#34483B] transition-colors"
                          title="Edit product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>

                        {p.status !== 'archived' && (
                          <button
                            onClick={() => handleArchive(p.id, p.name)}
                            className="p-1.5 text-[#666963] hover:text-rose-700 transition-colors"
                            title="Archive product"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-8 text-center text-xs text-[#666963]">
            No formulations matched your filters.
          </div>
        )}
      </div>
    </div>
  );
};
