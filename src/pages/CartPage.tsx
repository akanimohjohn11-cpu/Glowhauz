import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/currency';
import { WhatsAppOrderModal } from '../components/cart/WhatsAppOrderModal';
import { resolveImageUrl } from '../lib/imageUtils';
import {
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  ArrowRight,
  AlertTriangle,
  ShoppingBag,
  ShieldAlert,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeItem, clearCart, getValidatedItems } = useCart();
  const [modalOpen, setModalOpen] = useState(false);

  const { validatedItems, subtotal, hasPriceChanges, hasUnavailableItems } = getValidatedItems();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-[#EDF1EC] text-[#34483B] rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8 stroke-1" />
        </div>
        <h1 className="font-serif text-3xl text-[#292B28]">Your Shopping Bag is Empty</h1>
        <p className="text-xs sm:text-sm text-[#666963] max-w-sm mx-auto">
          You haven't selected any skincare formulations yet. Browse our verified botanical catalog to start.
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#34483B] hover:bg-[#243329] text-white text-xs font-semibold px-6 py-3 rounded-xs shadow-xs"
          >
            <span>Explore Formulations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E6E0D5] pb-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#34483B] font-semibold mb-1">
            Order Review
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#292B28] font-medium">
            Your Shopping Bag
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-[#666963] hover:text-rose-700 transition-colors"
        >
          Clear all items
        </button>
      </div>

      {/* Warnings if live prices changed or items became out of stock */}
      {hasPriceChanges && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xs text-xs flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700" />
          <p>
            One or more product prices have been updated in our catalog since you added them. Your subtotal now reflects current verified prices.
          </p>
        </div>
      )}

      {hasUnavailableItems && (
        <div className="bg-rose-50 border border-rose-200 text-rose-900 p-4 rounded-xs text-xs flex items-center gap-3">
          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-700" />
          <p>
            Some items in your cart are currently out of stock or archived. Please remove them before proceeding to WhatsApp.
          </p>
        </div>
      )}

      {/* Main Grid: Item List (8 cols) & Order Summary (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Item List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-[#E6E0D5] rounded-xs divide-y divide-[#E6E0D5]">
            {validatedItems.map((vi) => {
              const itemKey = vi.item.id;
              const primaryImg = resolveImageUrl(vi.product.images?.[0]);

              return (
                <div key={itemKey} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                  {/* Image & Title */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-18 h-18 aspect-square bg-[#F8F5EF] rounded-xs border border-[#E6E0D5] overflow-hidden shrink-0 flex items-center justify-center">
                      {primaryImg ? (
                        <img
                          src={primaryImg}
                          alt={vi.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="w-6 h-6 text-[#A7B5A0]" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] text-[#666963] uppercase tracking-wider">
                        {vi.product.categoryName || 'Botanical Care'}
                      </div>
                      <Link
                        to={`/products/${vi.product.slug}`}
                        className="font-serif text-base sm:text-lg font-semibold text-[#292B28] hover:text-[#34483B] transition-colors truncate block"
                      >
                        {vi.product.name}
                      </Link>

                      {vi.item.variantName && (
                        <div className="text-xs text-[#666963] mt-0.5">
                          Size: <span className="font-medium text-[#292B28]">{vi.item.variantName}</span>
                        </div>
                      )}

                      <div className="text-xs text-[#292B28] font-semibold tabular-nums mt-1">
                        {formatPrice(vi.currentPrice)} each
                      </div>

                      {!vi.isAvailable && (
                        <div className="text-xs text-rose-700 font-semibold mt-1">
                          Out of stock
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper & Line Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E6E0D5]/60">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#E6E0D5] rounded-xs bg-[#F8F5EF]">
                      <button
                        onClick={() => updateQuantity(itemKey, vi.item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-xs font-semibold hover:bg-white transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold tabular-nums">
                        {vi.item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(itemKey, vi.item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-xs font-semibold hover:bg-white transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Line total */}
                    <div className="text-right min-w-[5rem]">
                      <div className="text-sm font-bold text-[#292B28] tabular-nums">
                        {formatPrice(vi.lineTotal)}
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeItem(itemKey)}
                      className="text-[#666963] hover:text-rose-700 p-1.5 rounded-xs transition-colors"
                      aria-label="Remove item from cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/shop"
              className="text-xs font-semibold text-[#34483B] hover:underline"
            >
              ← Continue shopping
            </Link>
          </div>
        </div>

        {/* Order Summary (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E6E0D5] p-6 rounded-xs space-y-6 shadow-xs">
          <div>
            <h2 className="font-serif text-xl font-semibold text-[#292B28] pb-4 border-b border-[#E6E0D5]">
              Summary
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center text-[#666963]">
              <span>Estimated Subtotal</span>
              <span className="text-sm font-bold text-[#292B28] tabular-nums">
                {formatPrice(subtotal)}
              </span>
            </div>

            <div className="flex justify-between items-center text-[#666963]">
              <span>Delivery Fee</span>
              <span className="italic text-[#666963]">Confirmed on WhatsApp</span>
            </div>

            <div className="pt-3 border-t border-[#E6E0D5] flex justify-between items-baseline text-sm font-semibold text-[#292B28]">
              <span>Estimated Total (excl. delivery)</span>
              <span className="text-lg font-bold text-[#34483B] tabular-nums">
                {formatPrice(subtotal)}
              </span>
            </div>
          </div>

          {/* Action: Proceed to WhatsApp Order */}
          <div className="space-y-3">
            <button
              onClick={() => setModalOpen(true)}
              disabled={hasUnavailableItems}
              className="w-full flex items-center justify-center gap-2 bg-[#34483B] hover:bg-[#243329] disabled:bg-[#A7B5A0] text-white py-3.5 px-4 rounded-xs text-xs font-semibold shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#A7B5A0]" />
              <span>Proceed to WhatsApp Order</span>
            </button>

            <p className="text-[11px] text-[#666963] leading-relaxed text-center">
              Clicking opens a personalized WhatsApp message with your order details. The GlowHauz team will confirm availability, provide shipping fees to your address, and share payment instructions.
            </p>
          </div>
        </div>
      </div>

      {/* WhatsApp Order Modal */}
      <WhatsAppOrderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        items={validatedItems}
        subtotal={subtotal}
      />
    </div>
  );
};
