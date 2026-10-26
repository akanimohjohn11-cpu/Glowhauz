import { createClient } from '@supabase/supabase-js';
import { Product, Category, Collection, StoreSettings, StoreContent, StorePolicies } from '../types';

// Clean Supabase project URL (ensure no trailing /rest/v1/)
const RAW_URL = import.meta.env.VITE_SUPABASE_URL || 'https://wyiledgckpbzeshkwcdg.supabase.co';
export const SUPABASE_URL = RAW_URL.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5aWxlZGdja3BiemVzaGt3Y2RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwMDM4NDAsImV4cCI6MjEwODU3OTg0MH0.V5_m_xDVioJv-ORjXo9jd0zA27bMxtsGR7pu6vqI89k';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * Fetch products from Supabase with fallback
 */
export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  try {
    const { data: productsData, error: prodError } = await supabase
      .from('products')
      .select('*, product_variants(*)');

    if (prodError || !productsData || productsData.length === 0) {
      return null;
    }

    return productsData.map((row: any) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      sku: row.sku || '',
      shortDescription: row.short_description || '',
      fullDescription: row.full_description || '',
      price: row.price,
      compareAtPrice: row.compare_at_price,
      categoryId: row.category_id || '',
      categoryName: '',
      categorySlug: '',
      collectionIds: [],
      images: row.images || [],
      variants: (row.product_variants || []).map((v: any) => ({
        id: v.id,
        name: v.name,
        price: v.price,
        sku: v.sku,
        stock: v.stock,
      })),
      stockQuantity: row.stock_quantity || 0,
      isAvailable: Boolean(row.is_available),
      isFeatured: Boolean(row.is_featured),
      status: row.status || 'published',
      sizeOrVolume: row.size_or_volume || '',
      skinTypes: row.skin_types || [],
      keyIngredients: row.key_ingredients || [],
      fullIngredients: row.full_ingredients || '',
      howToUse: row.how_to_use || '',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (err) {
    console.warn('Supabase products query fallback:', err);
    return null;
  }
}

/**
 * Fetch categories from Supabase
 */
export async function fetchCategoriesFromSupabase(): Promise<Category[] | null> {
  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error || !data || data.length === 0) return null;

    return data.map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      imageUrl: c.image_url,
    }));
  } catch {
    return null;
  }
}

/**
 * Fetch collections from Supabase
 */
export async function fetchCollectionsFromSupabase(): Promise<Collection[] | null> {
  try {
    const { data, error } = await supabase.from('collections').select('*');
    if (error || !data || data.length === 0) return null;

    return data.map((col: any) => ({
      id: col.id,
      name: col.name,
      slug: col.slug,
      tagline: col.tagline || '',
      description: col.description || '',
      imageUrl: col.image_url,
    }));
  } catch {
    return null;
  }
}

/**
 * Fetch settings from Supabase
 */
export async function fetchSettingsFromSupabase(): Promise<StoreSettings | null> {
  try {
    const { data, error } = await supabase.from('store_settings').select('*').eq('id', 1).single();
    if (error || !data) return null;

    return {
      storeName: data.store_name,
      tagline: data.tagline,
      brandStatement: data.brand_statement,
      headline: data.headline,
      subheadline: data.subheadline,
      whatsappNumber: data.whatsapp_number,
      normalizedWhatsApp: data.normalized_whatsapp,
      phoneNumber: data.phone_number,
      supportEmail: data.support_email,
      dispatchLocation: data.dispatch_location,
      currency: data.currency,
      currencySymbol: data.currency_symbol,
      announcementText: data.announcement_text,
      announcementActive: data.announcement_active,
      instagramHandle: data.instagram_handle || '@glowhauz',
      businessHours: data.business_hours,
    };
  } catch {
    return null;
  }
}

/**
 * Fetch content from Supabase
 */
export async function fetchContentFromSupabase(): Promise<StoreContent | null> {
  try {
    const { data, error } = await supabase.from('store_content').select('*').eq('id', 1).single();
    if (error || !data) return null;

    return {
      aboutStory: data.about_story,
      aboutPhilosophy: data.about_philosophy,
      aboutScience: data.about_science,
      differentiators: data.differentiators || [],
      faqs: data.faqs || [],
    };
  } catch {
    return null;
  }
}

/**
 * Fetch policies from Supabase
 */
export async function fetchPoliciesFromSupabase(): Promise<StorePolicies | null> {
  try {
    const { data, error } = await supabase.from('store_policies').select('*').eq('id', 1).single();
    if (error || !data) return null;

    return {
      deliveryPolicy: data.delivery_policy,
      returnsPolicy: data.returns_policy,
      productDisclaimer: data.product_disclaimer,
      privacyPolicy: data.privacy_policy,
      termsOfUse: data.terms_of_use,
      lastUpdated: data.last_updated,
    };
  } catch {
    return null;
  }
}

/**
 * Upsert product to Supabase
 */
export async function upsertProductToSupabase(product: Product): Promise<boolean> {
  try {
    const { error: prodError } = await supabase.from('products').upsert({
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      short_description: product.shortDescription,
      full_description: product.fullDescription,
      price: product.price,
      compare_at_price: product.compareAtPrice,
      category_id: product.categoryId,
      images: product.images,
      stock_quantity: product.stockQuantity,
      is_available: product.isAvailable,
      is_featured: product.isFeatured,
      status: product.status,
      size_or_volume: product.sizeOrVolume,
      skin_types: product.skinTypes,
      key_ingredients: product.keyIngredients,
      full_ingredients: product.fullIngredients,
      how_to_use: product.howToUse,
      updated_at: new Date().toISOString(),
    });

    if (prodError) {
      console.warn('Supabase product upsert error:', prodError.message);
      return false;
    }

    // Upsert variants if present
    if (product.variants && product.variants.length > 0) {
      const variantPayload = product.variants.map((v) => ({
        id: v.id,
        product_id: product.id,
        name: v.name,
        price: v.price,
        sku: v.sku || '',
        stock: v.stock,
      }));
      await supabase.from('product_variants').upsert(variantPayload);
    }

    return true;
  } catch (err) {
    console.warn('Error syncing product to Supabase:', err);
    return false;
  }
}

/**
 * Upsert store settings to Supabase
 */
export async function upsertSettingsToSupabase(settings: StoreSettings): Promise<boolean> {
  try {
    const { error } = await supabase.from('store_settings').upsert({
      id: 1,
      store_name: settings.storeName,
      tagline: settings.tagline,
      brand_statement: settings.brandStatement,
      headline: settings.headline,
      subheadline: settings.subheadline,
      whatsapp_number: settings.whatsappNumber,
      normalized_whatsapp: settings.normalizedWhatsApp,
      phone_number: settings.phoneNumber,
      support_email: settings.supportEmail,
      dispatch_location: settings.dispatchLocation,
      currency: settings.currency,
      currency_symbol: settings.currencySymbol,
      announcement_text: settings.announcementText,
      announcement_active: settings.announcementActive,
      instagram_handle: settings.instagramHandle,
      business_hours: settings.businessHours,
      updated_at: new Date().toISOString(),
    });

    return !error;
  } catch {
    return false;
  }
}

/**
 * Check live connection to Supabase
 */
export async function checkSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    const { data, error } = await supabase.from('categories').select('count', { count: 'exact', head: true });
    if (error) {
      return { connected: false, message: error.message };
    }
    return { connected: true, message: 'Connected to Supabase PostgreSQL successfully.' };
  } catch (err: any) {
    return { connected: false, message: err?.message || 'Network error reaching Supabase.' };
  }
}
