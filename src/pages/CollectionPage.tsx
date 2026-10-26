import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export const CollectionPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getCollectionBySlug, publishedProducts } = useStore();

  const collection = slug ? getCollectionBySlug(slug) : undefined;
  const products = collection
    ? publishedProducts.filter((p) => p.collectionIds?.includes(collection.id))
    : [];

  if (!collection) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-serif text-3xl text-[#292B28]">Collection Not Found</h1>
        <p className="text-sm text-[#666963]">
          The curated ritual or collection you requested could not be found.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-[#34483B] text-white text-xs font-semibold px-5 py-2.5 rounded-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#666963]">
        <Link to="/" className="hover:text-[#34483B]">Home</Link>
        <ChevronRight className="w-3 h-3 text-[#A7B5A0]" />
        <span className="text-[#292B28] font-medium">{collection.name}</span>
      </nav>

      {/* Header */}
      <div className="bg-[#34483B] text-[#F8F5EF] p-8 sm:p-12 rounded-xs">
        <div className="max-w-2xl space-y-3">
          <div className="text-xs uppercase tracking-widest text-[#E8C9CC] font-semibold">
            {collection.tagline}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium">
            {collection.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#F8F5EF]/80 leading-relaxed">
            {collection.description}
          </p>
        </div>
      </div>

      {/* Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#E6E0D5] p-12 text-center rounded-xs space-y-3">
          <p className="font-serif text-xl text-[#292B28]">No active items in this ritual yet</p>
          <Link
            to="/shop"
            className="inline-block mt-2 bg-[#34483B] text-white text-xs font-semibold px-4 py-2 rounded-xs"
          >
            Explore All Products
          </Link>
        </div>
      )}
    </div>
  );
};
