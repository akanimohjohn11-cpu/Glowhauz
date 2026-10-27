import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { db } from '../../lib/storage';
import { Product, ProductVariant } from '../../types';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Image,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { DeviceImageUploader } from '../../components/admin/DeviceImageUploader';

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, categories, refreshStore } = useStore();

  const isEditing = Boolean(id);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState<number>(15000);
  const [compareAtPrice, setCompareAtPrice] = useState<string>('');
  const [stockQuantity, setStockQuantity] = useState<number>(20);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [sizeOrVolume, setSizeOrVolume] = useState('30ml / 1.0 fl oz');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [skinTypes, setSkinTypes] = useState('All Skin Types, Normal, Sensitive');
  const [keyIngredients, setKeyIngredients] = useState<string[]>(['Vitamin C', 'Ferulic Acid']);
  const [newIngredient, setNewIngredient] = useState('');
  const [fullIngredients, setFullIngredients] = useState('');
  const [howToUse, setHowToUse] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [hasImageChanges, setHasImageChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Suggested pre-generated stock images
  const PRESET_IMAGES = [
    { label: 'Radiance Serum (Amber Dropper)', url: '/images/product_radiance_serum_1793008581412.jpg' },
    { label: 'Ceramide Moisture Creme (Jar)', url: '/images/product_ceramide_cream_1793008582747.jpg' },
    { label: 'Clarifying Salicylic Cleanser (Green)', url: '/images/product_salicylic_cleanser_1793008583027.jpg' },
    { label: 'Rosé Hydrating Mist (Spray)', url: '/images/product_rose_essence_mist_1793008583530.jpg' },
  ];

  // Load existing product if editing
  useEffect(() => {
    if (isEditing && id) {
      const existing = getProductById(id);
      if (existing) {
        setName(existing.name);
        setSlug(existing.slug);
        setSku(existing.sku);
        setCategoryId(existing.categoryId);
        setPrice(existing.price);
        setCompareAtPrice(existing.compareAtPrice ? String(existing.compareAtPrice) : '');
        setStockQuantity(existing.stockQuantity);
        setIsAvailable(existing.isAvailable);
        setIsFeatured(existing.isFeatured);
        setStatus(existing.status);
        setSizeOrVolume(existing.sizeOrVolume);
        setShortDescription(existing.shortDescription);
        setFullDescription(existing.fullDescription);
        setSkinTypes(existing.skinTypes.join(', '));
        setKeyIngredients(existing.keyIngredients || []);
        setFullIngredients(existing.fullIngredients);
        setHowToUse(existing.howToUse);
        setImages(existing.images || []);
        setVariants(existing.variants || []);
      }
    } else if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [id, isEditing, getProductById, categories, categoryId]);

  // Keyboard shortcut Ctrl+S / Cmd+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const form = document.querySelector('form');
        if (form) {
          form.requestSubmit();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-slug generator on name change if creating
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  };

  // Variant helpers
  const handleAddVariant = () => {
    const newVar: ProductVariant = {
      id: `var-${Date.now()}`,
      name: '50ml',
      price: price,
      stock: 10,
    };
    setVariants([...variants, newVar]);
  };

  const handleUpdateVariant = (idx: number, field: keyof ProductVariant, val: any) => {
    const updated = [...variants];
    updated[idx] = { ...updated[idx], [field]: val };
    setVariants(updated);
  };

  const handleRemoveVariant = (idx: number) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  // Image helpers
  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages);
    setHasImageChanges(true);
    setSavedSuccess(false);
  };

  // Ingredient helpers
  const handleAddIngredient = () => {
    if (newIngredient.trim() && !keyIngredients.includes(newIngredient.trim())) {
      setKeyIngredients([...keyIngredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (idx: number) => {
    setKeyIngredients(keyIngredients.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!name.trim()) {
      setError('Product name is required.');
      setIsSubmitting(false);
      return;
    }
    if (!slug.trim()) {
      setError('Product URL slug is required.');
      setIsSubmitting(false);
      return;
    }
    if (price <= 0) {
      setError('Price must be greater than zero.');
      setIsSubmitting(false);
      return;
    }

    const existing = isEditing && id ? getProductById(id) : undefined;
    const selectedCategory = categories.find((c) => c.id === categoryId);

    const productPayload: Product = {
      id: isEditing && id ? id : `prod-${Date.now()}`,
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      sku: sku.trim() || `GH-${Date.now().toString().slice(-4)}`,
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      price: Math.round(Number(price)),
      compareAtPrice: compareAtPrice ? Math.round(Number(compareAtPrice)) : null,
      categoryId: categoryId || categories[0]?.id || 'cat-serums',
      categoryName: selectedCategory ? selectedCategory.name : (existing?.categoryName || 'Botanical Care'),
      categorySlug: selectedCategory ? selectedCategory.slug : (existing?.categorySlug || 'serums-treatments'),
      collectionIds: existing?.collectionIds || ['col-radiance'], // Preserve collections
      images: images.length > 0 ? images : ['/images/product_radiance_serum_1793008581412.jpg'],
      variants: variants.length > 0 ? variants : [{ id: `var-def-${Date.now()}`, name: sizeOrVolume || 'Standard', price: Math.round(Number(price)), stock: stockQuantity }],
      stockQuantity: Number(stockQuantity),
      isAvailable: Boolean(isAvailable),
      isFeatured: Boolean(isFeatured),
      status,
      sizeOrVolume: sizeOrVolume.trim(),
      skinTypes: skinTypes.split(',').map((s) => s.trim()).filter(Boolean),
      keyIngredients,
      fullIngredients: fullIngredients.trim(),
      howToUse: howToUse.trim(),
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save synchronously to local database and in-memory cache
    db.saveProduct(productPayload);
    // Trigger store refresh for current application tree
    refreshStore();

    setIsSubmitting(false);
    setHasImageChanges(false);
    setSavedSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header with Instant Save & Live View Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 border border-[#E6E0D5] rounded-xs shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 bg-[#F8F5EF] border border-[#E6E0D5] hover:bg-white text-[#292B28] rounded-xs transition-colors"
            aria-label="Back to products"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-semibold text-[#292B28]">
              {isEditing ? `Edit Formulation: ${name || 'Product'}` : 'Create New Formulation'}
            </h1>
            <p className="text-xs text-[#666963]">
              {isEditing ? 'Changes publish immediately across the entire website.' : 'Add a new formulation to your catalog.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing && (
            <Link
              to={`/products/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-white border border-[#E6E0D5] hover:bg-[#F8F5EF] text-[#34483B] rounded-xs text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Open product page on storefront in a new tab"
            >
              <span>View on Website</span>
              <span className="text-[10px]">↗</span>
            </Link>
          )}

          <button
            type="button"
            onClick={(e) => {
              const form = document.querySelector('form');
              if (form) form.requestSubmit();
            }}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-[#34483B] hover:bg-[#243329] text-white px-5 py-2 rounded-xs text-xs font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Saving...' : 'Save Formulation'}</span>
          </button>
        </div>
      </div>

      {/* Unsaved Changes Banner */}
      {hasImageChanges && !savedSuccess && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 p-3.5 rounded-xs text-xs flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-medium">
              You edited product images! Remember to click <strong>Save Formulation</strong> to make them live on the website.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              const form = document.querySelector('form');
              if (form) form.requestSubmit();
            }}
            className="bg-[#34483B] text-white px-3 py-1.5 rounded-xs text-xs font-semibold shrink-0 hover:bg-[#243329]"
          >
            Save Now (Ctrl+S)
          </button>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xs text-xs flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-xs text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-semibold text-emerald-950">
                Formulation & Images Saved Successfully!
              </p>
              <p className="text-emerald-800 text-[11px] mt-0.5">
                The updated image is now live on the storefront homepage, shop catalog, and detail pages.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2 sm:pt-0">
            <Link
              to={`/products/${slug}`}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xs text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <span>View Live Product</span>
              <span>→</span>
            </Link>
            <Link
              to="/admin/products"
              className="px-3 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 rounded-xs text-xs font-semibold transition-colors"
            >
              Back to Catalog
            </Link>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Product Information Card */}
        <div className="bg-white border border-[#E6E0D5] p-6 rounded-xs shadow-2xs space-y-4">
          <h2 className="font-serif text-lg font-semibold text-[#292B28] border-b border-[#E6E0D5] pb-2">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                Formulation Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Aura Radiance Vitamin C Serum"
                className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. aura-radiance-vitamin-c-serum"
                className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28] focus:bg-white focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                SKU (Stock Keeping Unit)
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. GH-SER-001"
                className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28] focus:bg-white focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#F8F5EF] border border-[#E6E0D5] rounded-xs text-[#292B28] focus:bg-white focus:outline-hidden"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#292B28] mb-1">
              Short Summary Description (for card & preview)
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="e.g. 15% stabilized L-Ascorbic Acid paired with Ferulic Acid and Vitamin E."
              className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28] focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#292B28] mb-1">
              Full Product Description
            </label>
            <textarea
              rows={4}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="Comprehensive clinical details and benefits..."
              className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28] focus:bg-white focus:outline-hidden resize-none"
            />
          </div>
        </div>

        {/* Pricing & Stock Card */}
        <div className="bg-white border border-[#E6E0D5] p-6 rounded-xs shadow-2xs space-y-4">
          <h2 className="font-serif text-lg font-semibold text-[#292B28] border-b border-[#E6E0D5] pb-2">
            Pricing, Stock & Availability
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                Base Price in NGN (₦) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28] focus:bg-white focus:outline-hidden font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                Compare-at Price (₦) <span className="font-normal text-[#666963]">(Optional)</span>
              </label>
              <input
                type="number"
                min={0}
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                placeholder="e.g. 22000"
                className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                min={0}
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28] focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                Size or Volume
              </label>
              <input
                type="text"
                value={sizeOrVolume}
                onChange={(e) => setSizeOrVolume(e.target.value)}
                placeholder="e.g. 30ml / 1.0 fl oz"
                className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full text-xs p-2.5 bg-[#F8F5EF] border border-[#E6E0D5] rounded-xs text-[#292B28] focus:bg-white focus:outline-hidden"
              >
                <option value="published">Published</option>
                <option value="draft">Draft (hidden from store)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex flex-col justify-center space-y-2 pt-2">
              <label className="flex items-center gap-2 text-xs text-[#292B28] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="rounded-xs text-[#34483B] focus:ring-[#34483B]"
                />
                <span className="font-semibold">Mark as In Stock</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#292B28] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded-xs text-[#34483B] focus:ring-[#34483B]"
                />
                <span className="font-semibold">Feature on Homepage</span>
              </label>
            </div>
          </div>
        </div>

        {/* Variants Manager Card */}
        <div className="bg-white border border-[#E6E0D5] p-6 rounded-xs shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E6E0D5] pb-2">
            <div>
              <h2 className="font-serif text-lg font-semibold text-[#292B28]">
                Size & Volume Variants
              </h2>
              <p className="text-[11px] text-[#666963]">
                Optional variants with unique prices (e.g. 30ml vs 50ml).
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddVariant}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#34483B] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Variant</span>
            </button>
          </div>

          {variants.length > 0 ? (
            <div className="space-y-3">
              {variants.map((v, idx) => (
                <div key={v.id || idx} className="flex items-center gap-3 bg-[#F8F5EF] p-2.5 rounded-xs border border-[#E6E0D5]">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={v.name}
                      onChange={(e) => handleUpdateVariant(idx, 'name', e.target.value)}
                      placeholder="Variant name (e.g. 50ml Value Size)"
                      className="w-full text-xs p-1.5 bg-white border border-[#E6E0D5] rounded-xs"
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      value={v.price}
                      onChange={(e) => handleUpdateVariant(idx, 'price', Number(e.target.value))}
                      placeholder="Price in ₦"
                      className="w-full text-xs p-1.5 bg-white border border-[#E6E0D5] rounded-xs font-semibold"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) => handleUpdateVariant(idx, 'stock', Number(e.target.value))}
                      placeholder="Stock"
                      className="w-full text-xs p-1.5 bg-white border border-[#E6E0D5] rounded-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    className="p-1.5 text-[#666963] hover:text-rose-700"
                    aria-label="Remove variant"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#666963]">
              No custom variants configured. The base price and stock above will be used.
            </p>
          )}
        </div>

        {/* Images Manager Card */}
        <div className="bg-white border border-[#E6E0D5] p-6 rounded-xs shadow-2xs space-y-4">
          <div className="border-b border-[#E6E0D5] pb-2">
            <h2 className="font-serif text-lg font-semibold text-[#292B28]">
              Product Images
            </h2>
            <p className="text-[11px] text-[#666963]">
              Upload photos directly from your device folder, drag and drop, or paste image URLs.
            </p>
          </div>

          <DeviceImageUploader
            images={images}
            onChange={handleImagesChange}
            maxImages={12}
          />
        </div>

        {/* Dermatological & Ingredients Details Card */}
        <div className="bg-white border border-[#E6E0D5] p-6 rounded-xs shadow-2xs space-y-4">
          <h2 className="font-serif text-lg font-semibold text-[#292B28] border-b border-[#E6E0D5] pb-2">
            Ingredients, Skin Compatibility & Directions
          </h2>

          <div>
            <label className="block text-xs font-semibold text-[#292B28] mb-1">
              Suitable Skin Types (Comma separated)
            </label>
            <input
              type="text"
              value={skinTypes}
              onChange={(e) => setSkinTypes(e.target.value)}
              placeholder="e.g. All Skin Types, Oily, Sensitive"
              className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28] focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#292B28] mb-1">
              Key Active Ingredients
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {keyIngredients.map((ing, idx) => (
                <span
                  key={idx}
                  className="bg-[#EDF1EC] text-[#34483B] text-xs px-2.5 py-1 rounded-xs border border-[#A7B5A0]/40 flex items-center gap-1.5"
                >
                  <span>{ing}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(idx)}
                    className="text-[#666963] hover:text-rose-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder="Add key active (e.g. 15% L-Ascorbic Acid)"
                className="flex-1 text-xs p-2 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs"
              />
              <button
                type="button"
                onClick={handleAddIngredient}
                className="bg-[#34483B] text-white text-xs font-semibold px-3 py-2 rounded-xs"
              >
                Add Active
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#292B28] mb-1">
              Full Ingredients List (INCI)
            </label>
            <textarea
              rows={3}
              value={fullIngredients}
              onChange={(e) => setFullIngredients(e.target.value)}
              placeholder="Full formulation ingredients list..."
              className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28] focus:bg-white focus:outline-hidden font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#292B28] mb-1">
              How to Use / Application Directions
            </label>
            <textarea
              rows={2}
              value={howToUse}
              onChange={(e) => setHowToUse(e.target.value)}
              placeholder="e.g. Apply 4-5 drops in the morning onto clean, dry skin..."
              className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28] focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E6E0D5]">
          <Link
            to="/admin/products"
            className="px-4 py-2.5 bg-white border border-[#E6E0D5] hover:bg-[#F8F5EF] text-[#292B28] rounded-xs text-xs font-semibold"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="flex items-center gap-2 bg-[#34483B] hover:bg-[#243329] text-white px-6 py-2.5 rounded-xs text-xs font-semibold shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Formulation</span>
          </button>
        </div>
      </form>
    </div>
  );
};
