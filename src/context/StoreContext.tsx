import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Product, Category, Collection, StoreSettings, StoreContent, StorePolicies } from '../types';
import { db } from '../lib/storage';
import {
  fetchProductsFromSupabase,
  fetchCategoriesFromSupabase,
  fetchCollectionsFromSupabase,
  fetchSettingsFromSupabase,
  fetchContentFromSupabase,
  fetchPoliciesFromSupabase,
  isSupabaseConfigured,
} from '../lib/supabase';

interface StoreContextType {
  products: Product[];
  publishedProducts: Product[];
  featuredProducts: Product[];
  categories: Category[];
  collections: Collection[];
  settings: StoreSettings;
  content: StoreContent;
  policies: StorePolicies;
  loading: boolean;
  supabaseConnected: boolean;
  refreshStore: () => void;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  getCategoryBySlug: (slug: string) => Category | undefined;
  getCollectionBySlug: (slug: string) => Collection | undefined;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => db.getProducts());
  const [categories, setCategories] = useState<Category[]>(() => db.getCategories());
  const [collections, setCollections] = useState<Collection[]>(() => db.getCollections());
  const [settings, setSettings] = useState<StoreSettings>(() => db.getSettings());
  const [content, setContent] = useState<StoreContent>(() => db.getContent());
  const [policies, setPolicies] = useState<StorePolicies>(() => db.getPolicies());
  const [loading, setLoading] = useState<boolean>(false);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(isSupabaseConfigured);

  const loadData = () => {
    setProducts(db.getProducts());
    setCategories(db.getCategories());
    setCollections(db.getCollections());
    setSettings(db.getSettings());
    setContent(db.getContent());
    setPolicies(db.getPolicies());
    setLoading(false);
  };

  // Sync with Supabase on mount
  useEffect(() => {
    async function initSupabaseData() {
      if (!isSupabaseConfigured) return;

      try {
        const [sbProducts, sbCategories, sbCollections, sbSettings, sbContent, sbPolicies] =
          await Promise.allSettled([
            fetchProductsFromSupabase(),
            fetchCategoriesFromSupabase(),
            fetchCollectionsFromSupabase(),
            fetchSettingsFromSupabase(),
            fetchContentFromSupabase(),
            fetchPoliciesFromSupabase(),
          ]);

        if (sbProducts.status === 'fulfilled' && sbProducts.value && sbProducts.value.length > 0) {
          const localProducts = db.getProducts();
          const localMap = new Map(localProducts.map((p) => [p.id, p]));

          const merged: Product[] = sbProducts.value.map((sbProd) => {
            const localProd = localMap.get(sbProd.id);
            if (!localProd) return sbProd;

            const localTime = new Date(localProd.updatedAt || localProd.createdAt || 0).getTime();
            const sbTime = new Date(sbProd.updatedAt || sbProd.createdAt || 0).getTime();

            // If local product has newer or equal modifications, preserve local product & images!
            if (localTime >= sbTime) {
              return localProd;
            }

            // Otherwise, adopt Supabase product while preserving essential metadata if empty in Supabase
            return {
              ...sbProd,
              categoryName: sbProd.categoryName || localProd.categoryName,
              categorySlug: sbProd.categorySlug || localProd.categorySlug,
              collectionIds: sbProd.collectionIds && sbProd.collectionIds.length > 0 ? sbProd.collectionIds : localProd.collectionIds,
              images: sbProd.images && sbProd.images.length > 0 ? sbProd.images : localProd.images,
            };
          });

          // Retain any locally created products that aren't yet in Supabase
          for (const lp of localProducts) {
            if (!merged.some((p) => p.id === lp.id)) {
              merged.push(lp);
            }
          }

          setProducts(merged);
          db.setProducts(merged);
        }

        if (sbCategories.status === 'fulfilled' && sbCategories.value && sbCategories.value.length > 0) {
          setCategories(sbCategories.value);
        }
        if (sbCollections.status === 'fulfilled' && sbCollections.value && sbCollections.value.length > 0) {
          setCollections(sbCollections.value);
        }
        if (sbSettings.status === 'fulfilled' && sbSettings.value) {
          setSettings(sbSettings.value);
        }
        if (sbContent.status === 'fulfilled' && sbContent.value) {
          setContent(sbContent.value);
        }
        if (sbPolicies.status === 'fulfilled' && sbPolicies.value) {
          setPolicies(sbPolicies.value);
        }
        setSupabaseConnected(true);
      } catch (err) {
        console.warn('Initial Supabase sync note (using local cache):', err);
      }
    }

    initSupabaseData();
  }, []);

  useEffect(() => {
    const handleDbChange = () => {
      loadData();
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (!e.key || e.key.startsWith('glowhauz_db_') || e.key === 'glowhauz_db_sync_ping') {
        loadData();
      }
    };

    window.addEventListener('glowhauz_db_change', handleDbChange);
    window.addEventListener('storage', handleStorageEvent);
    return () => {
      window.removeEventListener('glowhauz_db_change', handleDbChange);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  const publishedProducts = useMemo(() => {
    return products.filter((p) => p.status === 'published');
  }, [products]);

  const featuredProducts = useMemo(() => {
    return publishedProducts.filter((p) => p.isFeatured && p.isAvailable);
  }, [publishedProducts]);

  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug && p.status !== 'archived');
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const getCategoryBySlug = (slug: string) => {
    return categories.find((c) => c.slug === slug);
  };

  const getCollectionBySlug = (slug: string) => {
    return collections.find((c) => c.slug === slug);
  };

  const value = {
    products,
    publishedProducts,
    featuredProducts,
    categories,
    collections,
    settings,
    content,
    policies,
    loading,
    supabaseConnected,
    refreshStore: loadData,
    getProductBySlug,
    getProductById,
    getCategoryBySlug,
    getCollectionBySlug,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export function useStore(): StoreContextType {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
