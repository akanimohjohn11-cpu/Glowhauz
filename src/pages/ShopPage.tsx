import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { publishedProducts, categories } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'name'>('relevance');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return publishedProducts
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'all' && product.categoryId !== selectedCategory) {
          return false;
        }
        // Availability filter
        if (onlyAvailable && !product.isAvailable) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = product.name.toLowerCase().includes(q);
          const matchesDesc = product.shortDescription.toLowerCase().includes(q);
          const matchesCategory = product.categoryName.toLowerCase().includes(q);
          const matchesIngredients = product.keyIngredients.some((i) => i.toLowerCase().includes(q));
          if (!matchesName && !matchesDesc && !matchesCategory && !matchesIngredients) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0; // relevance / default order
      });
  }, [publishedProducts, selectedCategory, searchQuery, sortBy, onlyAvailable]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#E6E0D5] pb-6">
        <div className="text-xs uppercase tracking-widest text-[#34483B] font-semibold mb-1">
          Complete Formulation Catalog
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#292B28] font-medium">
          Shop All Products
        </h1>
        <p className="text-xs sm:text-sm text-[#666963] mt-1 max-w-xl">
          Explore botanical, science-aligned skincare and wellness formulations. All prices in Nigerian Naira (₦).
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-xs border border-[#E6E0D5] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#A7B5A0]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ingredient, name, or concern..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28] focus:bg-white focus:outline-hidden"
          />
        </div>

        {/* Categories, Availability, Sorting Controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Category Selector */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#666963]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#F8F5EF] border border-[#E6E0D5] text-[#292B28] py-1.5 px-2.5 rounded-xs focus:outline-hidden text-xs"
            >
              <option value="all">All Categories ({publishedProducts.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#666963]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#F8F5EF] border border-[#E6E0D5] text-[#292B28] py-1.5 px-2.5 rounded-xs focus:outline-hidden text-xs"
            >
              <option value="relevance">Featured & Relevant</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          {/* Availability Toggle */}
          <label className="flex items-center gap-1.5 text-xs text-[#666963] cursor-pointer pl-1">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="rounded-xs text-[#34483B] focus:ring-[#34483B]"
            />
            <span>In Stock Only</span>
          </label>
        </div>
      </div>

      {/* Results Count & Active Filters */}
      <div className="flex items-center justify-between text-xs text-[#666963]">
        <p>
          Showing <span className="font-semibold text-[#292B28] tabular-nums">{filteredProducts.length}</span>{' '}
          {filteredProducts.length === 1 ? 'formulation' : 'formulations'}
        </p>

        {(selectedCategory !== 'all' || searchQuery || onlyAvailable) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setOnlyAvailable(false);
            }}
            className="text-[#34483B] hover:underline font-semibold"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-[#E6E0D5] p-12 text-center rounded-xs space-y-3">
          <p className="font-serif text-xl text-[#292B28]">No formulations match your search</p>
          <p className="text-xs text-[#666963] max-w-md mx-auto">
            Try adjusting your search terms or clearing the selected category filter to discover available items.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setOnlyAvailable(false);
            }}
            className="mt-2 bg-[#34483B] text-white text-xs font-semibold px-4 py-2 rounded-xs"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
