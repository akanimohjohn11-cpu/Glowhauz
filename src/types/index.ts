export type ProductStatus = 'published' | 'draft' | 'archived';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "30ml", "50ml", "Travel Size", "Full Size"
  price: number; // in NGN
  sku?: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  fullDescription: string;
  price: number; // in NGN (Base price)
  compareAtPrice: number | null; // in NGN (optional previous price)
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  collectionIds: string[];
  images: string[];
  variants: ProductVariant[];
  stockQuantity: number;
  isAvailable: boolean;
  isFeatured: boolean;
  status: ProductStatus;
  sizeOrVolume: string; // e.g. "30ml / 1.0 fl oz"
  skinTypes: string[]; // e.g. ["All Skin Types", "Dry", "Sensitive"]
  keyIngredients: string[];
  fullIngredients: string;
  howToUse: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  productCount?: number;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  imageUrl?: string;
}

export interface CartItem {
  id: string; // unique item key: `${productId}-${variantId || 'default'}`
  productId: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  priceAtAddition: number;
}

export interface ValidatedCartItem {
  item: CartItem;
  product: Product;
  currentPrice: number;
  lineTotal: number;
  isAvailable: boolean;
  priceChanged: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  brandStatement: string;
  headline: string;
  subheadline: string;
  whatsappNumber: string; // e.g. "07089581351"
  normalizedWhatsApp: string; // e.g. "2347089581351"
  phoneNumber: string;
  supportEmail: string;
  dispatchLocation: string;
  currency: string;
  currencySymbol: string;
  announcementText: string;
  announcementActive: boolean;
  instagramHandle: string;
  businessHours: string;
}

export interface StoreContent {
  aboutStory: string;
  aboutPhilosophy: string;
  aboutScience: string;
  differentiators: Array<{
    title: string;
    description: string;
  }>;
  faqs: Array<{
    id: string;
    question: string;
    answer: string;
    category: 'Ordering & WhatsApp' | 'Delivery & Shipping' | 'Products & Science' | 'Returns';
  }>;
}

export interface StorePolicies {
  deliveryPolicy: string;
  returnsPolicy: string;
  productDisclaimer: string;
  privacyPolicy: string;
  termsOfUse: string;
  lastUpdated: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'editor';
}
