import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { formatPrice } from '../../lib/currency';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { resolveImageUrl } from '../../lib/imageUtils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [imgError, setImgError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const primaryImage = resolveImageUrl(product.images?.[0]);

  React.useEffect(() => {
    setImgError(false);
  }, [primaryImage]);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    // Add base/first variant
    const firstVariantId = product.variants?.[0]?.id;
    addItem(product, firstVariantId, 1);
    setTimeout(() => setIsAdding(false), 300);
  };

  return (
    <article className="group bg-white border border-[#E6E0D5] flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-2 hover:border-[#A7B5A0] hover:shadow-[0_18px_40px_-10px_rgba(52,72,59,0.16)] rounded-xs overflow-hidden h-full">
      <Link to={`/products/${product.slug}`} className="flex flex-col flex-1">
        {/* Product Image: 65-75% visual weight with slow, breathtaking hover zoom */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-[#F8F5EF] flex items-center justify-center">
          {primaryImage && !imgError ? (
            <img
              src={primaryImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-108 group-hover:brightness-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-[#A7B5A0] bg-[#F8F5EF]">
              <Sparkles className="w-8 h-8 stroke-1 mb-2 text-[#34483B]/40" />
              <span className="text-xs uppercase tracking-wider text-[#666963] font-medium">
                GlowHauz Botanical
              </span>
            </div>
          )}

          {/* Availability note */}
          {!product.isAvailable && (
            <div className="absolute top-3 left-3 bg-[#292B28]/90 text-[#F8F5EF] text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 backdrop-blur-xs shadow-xs">
              Temporarily Sold Out
            </div>
          )}
        </div>

        {/* Product Details with boosted typography */}
        <div className="p-5 flex flex-col flex-1 justify-between gap-3">
          <div>
            {/* Category: clean unboxed metadata */}
            <div className="text-xs uppercase tracking-widest text-[#666963] mb-1.5 font-medium">
              {product.categoryName || 'Botanical Care'}
            </div>

            <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#292B28] group-hover:text-[#34483B] transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>

            {product.sizeOrVolume && (
              <p className="text-xs text-[#666963] mt-1 font-medium">
                {product.sizeOrVolume}
              </p>
            )}
          </div>

          {/* Pricing & Controls */}
          <div className="pt-3 border-t border-[#E6E0D5]/70 flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-[#292B28] tabular-nums tracking-tight">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-[#666963] line-through tabular-nums">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            {product.isAvailable ? (
              <button
                onClick={handleQuickAdd}
                disabled={isAdding}
                aria-label={`Add ${product.name} to shopping bag`}
                className="flex items-center gap-1.5 bg-[#34483B] hover:bg-[#243329] text-white text-xs font-semibold px-3.5 py-2 rounded-xs transition-all shrink-0 shadow-xs hover:shadow-[0_6px_20px_rgba(52,72,59,0.35)] hover:scale-105 active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#A7B5A0]" />
                <span>Add</span>
              </button>
            ) : (
              <span className="text-xs text-[#666963] font-medium">Out of Stock</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};
