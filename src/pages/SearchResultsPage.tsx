import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { Search, ArrowLeft } from 'lucide-react';

export const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { publishedProducts } = useStore();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return publishedProducts.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.shortDescription.toLowerCase().includes(q) || p.fullDescription.toLowerCase().includes(q);
      const matchCategory = p.categoryName.toLowerCase().includes(q);
      const matchIngredients = p.keyIngredients.some((ing) => ing.toLowerCase().includes(q));
      const matchSkinType = p.skinTypes.some((st) => st.toLowerCase().includes(q));
      return matchName || matchDesc || matchCategory || matchIngredients || matchSkinType;
    });
  }, [publishedProducts, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-[#E6E0D5] pb-6">
        <div className="text-xs uppercase tracking-widest text-[#34483B] font-semibold mb-1">
          Catalog Search
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#292B28] font-medium">
          Search Results {query && `for "${query}"`}
        </h1>
        <p className="text-xs sm:text-sm text-[#666963] mt-1">
          {results.length} {results.length === 1 ? 'formulation found' : 'formulations found'}
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#E6E0D5] p-12 text-center rounded-xs space-y-4">
          <Search className="w-8 h-8 text-[#A7B5A0] mx-auto stroke-1" />
          <p className="font-serif text-xl text-[#292B28]">No results matched "{query}"</p>
          <p className="text-xs text-[#666963] max-w-md mx-auto">
            Try searching for terms like "Vitamin C", "ceramide", "cleanser", "SPF", or "hyaluronic".
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#34483B] text-white text-xs font-semibold px-4 py-2 rounded-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Full Catalog</span>
          </Link>
        </div>
      )}
    </div>
  );
};
