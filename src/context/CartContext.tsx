import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { CartItem, Product, ValidatedCartItem } from '../types';
import { db } from '../lib/storage';
import { calculateSubtotal, calculateLineTotal } from '../lib/currency';
import { trackEvent } from '../lib/analytics';

const CART_STORAGE_KEY = 'glowhauz_shopping_cart_v2';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, variantId?: string, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getValidatedItems: () => {
    validatedItems: ValidatedCartItem[];
    subtotal: number;
    hasPriceChanges: boolean;
    hasUnavailableItems: boolean;
  };
  lastToast: string | null;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [lastToast, setLastToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [items]);

  const dismissToast = useCallback(() => {
    setLastToast(null);
  }, []);

  const addItem = useCallback((product: Product, variantId?: string, quantity: number = 1) => {
    const selectedVariant = variantId ? product.variants.find((v) => v.id === variantId) : undefined;
    const price = selectedVariant ? selectedVariant.price : product.price;
    const variantName = selectedVariant?.name;
    const itemKey = `${product.id}-${variantId || 'default'}`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.id === itemKey);
      if (existingIndex >= 0) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            id: itemKey,
            productId: product.id,
            variantId,
            variantName,
            quantity,
            priceAtAddition: price,
          },
        ];
      }
    });

    trackEvent('add_to_cart', {
      productId: product.id,
      productName: product.name,
      variantName,
      price,
      quantity,
    });

    const itemLabel = variantName ? `${product.name} (${variantName})` : product.name;
    setLastToast(`Added ${quantity > 1 ? `${quantity}x ` : ''}"${itemLabel}" to your shopping bag.`);
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prevItems) => {
      const removed = prevItems.find((i) => i.id === itemId);
      if (removed) {
        trackEvent('remove_from_cart', { itemId, productId: removed.productId });
      }
      return prevItems.filter((i) => i.id !== itemId);
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          trackEvent('update_cart_quantity', {
            itemId,
            productId: item.productId,
            oldQty: item.quantity,
            newQty: quantity,
          });
          return { ...item, quantity };
        }
        return item;
      })
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  /**
   * Revalidates stored cart items against the authoritative database.
   * Checks current live price and stock availability.
   */
  const getValidatedItems = useCallback(() => {
    const allProducts = db.getProducts();
    let hasPriceChanges = false;
    let hasUnavailableItems = false;

    const validatedItems: ValidatedCartItem[] = items.map((cartItem) => {
      const currentProduct = allProducts.find((p) => p.id === cartItem.productId);

      if (!currentProduct || currentProduct.status === 'archived' || !currentProduct.isAvailable) {
        hasUnavailableItems = true;
        return {
          item: cartItem,
          product: currentProduct || {
            id: cartItem.productId,
            name: 'Unavailable Product',
            slug: '',
            sku: '',
            shortDescription: '',
            fullDescription: '',
            price: cartItem.priceAtAddition,
            compareAtPrice: null,
            categoryId: '',
            categoryName: '',
            categorySlug: '',
            collectionIds: [],
            images: [],
            variants: [],
            stockQuantity: 0,
            isAvailable: false,
            isFeatured: false,
            status: 'archived',
            sizeOrVolume: '',
            skinTypes: [],
            keyIngredients: [],
            fullIngredients: '',
            howToUse: '',
            createdAt: '',
            updatedAt: '',
          },
          currentPrice: cartItem.priceAtAddition,
          lineTotal: calculateLineTotal(cartItem.priceAtAddition, cartItem.quantity),
          isAvailable: false,
          priceChanged: false,
        };
      }

      // Check variant price
      let livePrice = currentProduct.price;
      let variantStock = currentProduct.stockQuantity;

      if (cartItem.variantId) {
        const liveVariant = currentProduct.variants.find((v) => v.id === cartItem.variantId);
        if (liveVariant) {
          livePrice = liveVariant.price;
          variantStock = liveVariant.stock;
        }
      }

      const priceChanged = livePrice !== cartItem.priceAtAddition;
      if (priceChanged) hasPriceChanges = true;

      const isItemAvailable = currentProduct.isAvailable && variantStock > 0;
      if (!isItemAvailable) hasUnavailableItems = true;

      return {
        item: cartItem,
        product: currentProduct,
        currentPrice: livePrice,
        lineTotal: calculateLineTotal(livePrice, cartItem.quantity),
        isAvailable: isItemAvailable,
        priceChanged,
      };
    });

    const subtotal = calculateSubtotal(
      validatedItems
        .filter((vi) => vi.isAvailable)
        .map((vi) => ({ price: vi.currentPrice, quantity: vi.item.quantity }))
    );

    return {
      validatedItems,
      subtotal,
      hasPriceChanges,
      hasUnavailableItems,
    };
  }, [items]);

  const itemCount = useMemo(() => {
    return items.reduce((total, i) => total + i.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    const { subtotal } = getValidatedItems();
    return subtotal;
  }, [getValidatedItems]);

  const value = {
    items,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getValidatedItems,
    lastToast,
    dismissToast,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
