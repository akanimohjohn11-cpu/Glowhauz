import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/product/ProductCard';
import { formatPrice } from '../lib/currency';
import {
  generateSingleProductWhatsAppMessage,
  createWhatsAppUrl,
} from '../lib/whatsapp';
import { trackEvent } from '../lib/analytics';
import { resolveImageUrl } from '../lib/imageUtils';
import {
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  Check,
  Sparkles,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getProductBySlug, publishedProducts, settings } = useStore();
  const { addItem } = useCart();

  const product = slug ? getProductBySlug(slug) : undefined;

  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [imgError, setImgError] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'how-to-use'>('details');

  // Set default variant
  useEffect(() => {
    if (product && product.variants?.length > 0) {
      setSelectedVariantId(product.variants[0].id);
    }
    setQuantity(1);
    setSelectedImageIndex(0);
    setImgError(false);

    if (product) {
      trackEvent('product_view', {
        id: product.id,
        name: product.name,
        price: product.price,
      });
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-serif text-3xl text-[#292B28]">Product Not Found</h1>
        <p className="text-sm text-[#666963]">
          The formulation you are looking for may have been archived or is temporarily unavailable.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-[#34483B] text-white text-xs font-semibold px-5 py-2.5 rounded-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Shop</span>
        </Link>
      </div>
    );
  }

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const activePrice = selectedVariant ? selectedVariant.price : product.price;
  const currentImages = (product.images?.length > 0 ? product.images : []).map(resolveImageUrl);
  const activeImage = currentImages[selectedImageIndex] || currentImages[0];

  const handleAddToCart = () => {
    addItem(product, selectedVariant?.id, quantity);
  };

  const handleDirectWhatsAppOrder = () => {
    trackEvent('begin_whatsapp_checkout', {
      source: 'pdp_direct_whatsapp',
      productId: product.id,
      productName: product.name,
      variantName: selectedVariant?.name,
      quantity,
    });
    const message = generateSingleProductWhatsAppMessage(
      product.name,
      selectedVariant?.name,
      quantity,
      activePrice,
      settings.storeName
    );
    const url = createWhatsAppUrl(settings.normalizedWhatsApp, message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Related products from the same category
  const relatedProducts = publishedProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#666963]">
        <Link to="/" className="hover:text-[#34483B]">Home</Link>
        <ChevronRight className="w-3 h-3 text-[#A7B5A0]" />
        <Link to="/shop" className="hover:text-[#34483B]">Shop</Link>
        <ChevronRight className="w-3 h-3 text-[#A7B5A0]" />
        <Link to={`/categories/${product.categorySlug}`} className="hover:text-[#34483B]">
          {product.categoryName}
        </Link>
        <ChevronRight className="w-3 h-3 text-[#A7B5A0]" />
        <span className="text-[#292B28] font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Contiguous Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Gallery (6 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/3 w-full bg-[#F8F5EF] border border-[#E6E0D5] overflow-hidden rounded-xs flex items-center justify-center">
            {activeImage && !imgError ? (
              <img
                src={activeImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-[#A7B5A0]">
                <Sparkles className="w-12 h-12 stroke-1 text-[#34483B]/30 mb-2" />
                <span className="text-xs uppercase tracking-wider text-[#666963]">GlowHauz Botanical</span>
              </div>
            )}
          </div>

          {/* Gallery Thumbnails if multiple */}
          {currentImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {currentImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 shrink-0 border overflow-hidden rounded-2xs ${
                    selectedImageIndex === idx ? 'border-[#34483B] ring-1 ring-[#34483B]' : 'border-[#E6E0D5]'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Contiguous Purchase Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6 bg-white p-6 sm:p-8 border border-[#E6E0D5] rounded-xs shadow-xs">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#666963] font-semibold mb-1">
              {product.categoryName}
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#292B28] leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-[#666963] mt-2 leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          {/* Price & Availability */}
          <div className="pt-4 border-t border-[#E6E0D5] flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-[#292B28] tabular-nums">
                {formatPrice(activePrice)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > activePrice && (
                <span className="text-sm text-[#666963] line-through tabular-nums">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            <div className="text-xs">
              {product.isAvailable ? (
                <span className="text-[#34483B] font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock ({product.stockQuantity})
                </span>
              ) : (
                <span className="text-rose-700 font-semibold">Temporarily Out of Stock</span>
              )}
            </div>
          </div>

          {/* Variants Selection */}
          {product.variants?.length > 1 && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#292B28] uppercase tracking-wider">
                Select Size / Variant
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.variants.map((v) => {
                  const isSelected = v.id === selectedVariantId;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`py-2 px-3 text-xs rounded-xs border text-left transition-all ${
                        isSelected
                          ? 'border-[#34483B] bg-[#EDF1EC] text-[#292B28] font-semibold'
                          : 'border-[#E6E0D5] bg-[#F8F5EF] text-[#666963] hover:border-[#A7B5A0]'
                      }`}
                    >
                      <div className="truncate">{v.name}</div>
                      <div className="text-[11px] font-medium tabular-nums text-[#34483B]">
                        {formatPrice(v.price)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <label className="text-xs font-semibold text-[#292B28] uppercase tracking-wider">
              Quantity
            </label>
            <div className="flex items-center border border-[#E6E0D5] rounded-xs bg-[#F8F5EF]">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center text-sm font-semibold hover:bg-white transition-colors"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-10 text-center text-xs font-bold tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-sm font-semibold hover:bg-white transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions: Add to Bag + Order via WhatsApp */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={!product.isAvailable}
              className="w-full flex items-center justify-center gap-2 bg-[#34483B] hover:bg-[#243329] disabled:bg-[#A7B5A0] text-white py-3.5 px-4 rounded-xs text-xs font-semibold shadow-xs transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-[#A7B5A0]" />
              <span>Add to Shopping Bag</span>
            </button>

            <button
              onClick={handleDirectWhatsAppOrder}
              disabled={!product.isAvailable}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-[#F8F5EF] text-[#292B28] border border-[#E6E0D5] py-3 px-4 rounded-xs text-xs font-semibold transition-colors shadow-2xs"
            >
              <MessageCircle className="w-4 h-4 text-[#34483B]" />
              <span>Order via WhatsApp ({settings.whatsappNumber})</span>
            </button>
          </div>

          {/* Dispatch Notice Card */}
          <div className="pt-4 border-t border-[#E6E0D5] space-y-2 text-xs text-[#666963]">
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-[#34483B] shrink-0" />
              <span>Dispatched from Enugu. South East 24–48h | Nationwide 2–4 days.</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#34483B] shrink-0" />
              <span>Hygienically sealed. Unopened items protected by inspection guarantee.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Full Details, Ingredients, How to Use */}
      <div className="bg-white border border-[#E6E0D5] p-6 sm:p-8 rounded-xs space-y-6">
        <div className="flex border-b border-[#E6E0D5] gap-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 text-xs font-semibold tracking-wider uppercase transition-colors relative ${
              activeTab === 'details'
                ? 'text-[#34483B] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#34483B]'
                : 'text-[#666963] hover:text-[#292B28]'
            }`}
          >
            Formulation Details
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`pb-3 text-xs font-semibold tracking-wider uppercase transition-colors relative ${
              activeTab === 'ingredients'
                ? 'text-[#34483B] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#34483B]'
                : 'text-[#666963] hover:text-[#292B28]'
            }`}
          >
            Key & Full Ingredients
          </button>
          <button
            onClick={() => setActiveTab('how-to-use')}
            className={`pb-3 text-xs font-semibold tracking-wider uppercase transition-colors relative ${
              activeTab === 'how-to-use'
                ? 'text-[#34483B] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#34483B]'
                : 'text-[#666963] hover:text-[#292B28]'
            }`}
          >
            Application & Routine
          </button>
        </div>

        <div className="text-xs sm:text-sm text-[#292B28] leading-relaxed max-w-3xl">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <p>{product.fullDescription}</p>
              {product.skinTypes?.length > 0 && (
                <div className="pt-2">
                  <span className="font-semibold text-[#34483B]">Suitable for: </span>
                  <span>{product.skinTypes.join(' · ')}</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-4">
              {product.keyIngredients?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#34483B] mb-1">Key Actives:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-[#666963]">
                    {product.keyIngredients.map((ing, idx) => (
                      <li key={idx}>{ing}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.fullIngredients && (
                <div>
                  <h4 className="font-semibold text-[#34483B] mb-1">Full Ingredients (INCI):</h4>
                  <p className="text-xs text-[#666963] font-mono leading-relaxed bg-[#F8F5EF] p-3 rounded-xs border border-[#E6E0D5]">
                    {product.fullIngredients}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'how-to-use' && (
            <div className="space-y-3">
              <p>{product.howToUse}</p>
              <div className="bg-[#EDF1EC] p-3 rounded-xs text-xs text-[#243329] border border-[#A7B5A0]/40">
                <strong>Patch Test Advisory:</strong> We always recommend testing a few drops on your inner arm 24 hours prior to facial use to ensure compatibility with your personal skin barrier.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Formulations */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E6E0D5] pb-4">
            <h2 className="font-serif text-2xl font-semibold text-[#292B28]">
              Complementary Formulations
            </h2>
            <Link
              to={`/categories/${product.categorySlug}`}
              className="text-xs font-semibold text-[#34483B] hover:underline"
            >
              More in {product.categoryName} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
