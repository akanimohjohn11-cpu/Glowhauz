import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="text-xs uppercase tracking-widest text-[#34483B] font-semibold">
        Error 404
      </div>
      <h1 className="font-serif text-4xl sm:text-5xl text-[#292B28] font-medium">
        Page Not Located
      </h1>
      <p className="text-sm text-[#666963] max-w-md mx-auto leading-relaxed">
        The link you followed may be outdated, the product or page may have moved, or the URL might have been typed incorrectly.
      </p>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#34483B] hover:bg-[#243329] text-white text-xs font-semibold px-5 py-2.5 rounded-xs shadow-xs"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-white hover:bg-[#F8F5EF] text-[#292B28] border border-[#E6E0D5] text-xs font-semibold px-5 py-2.5 rounded-xs shadow-2xs"
        >
          <Search className="w-4 h-4 text-[#34483B]" />
          <span>Browse Catalog</span>
        </Link>
      </div>
    </div>
  );
};
