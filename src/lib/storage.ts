import {
  Product,
  Category,
  Collection,
  StoreSettings,
  StoreContent,
  StorePolicies,
} from '../types';
import { normalizeWhatsAppNumber } from './whatsapp';
import { resolveImageUrl } from './imageUtils';

// LocalStorage Keys
const STORAGE_KEYS = {
  PRODUCTS: 'glowhauz_db_products_v2',
  CATEGORIES: 'glowhauz_db_categories_v2',
  COLLECTIONS: 'glowhauz_db_collections_v2',
  SETTINGS: 'glowhauz_db_settings_v2',
  CONTENT: 'glowhauz_db_content_v2',
  POLICIES: 'glowhauz_db_policies_v2',
};

// Initial Seed Data
const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-serums',
    name: 'Serums & Treatments',
    slug: 'serums-treatments',
    description: 'Targeted bio-active formulas engineered for discoloration, dullness, fine lines, and hydration.',
  },
  {
    id: 'cat-moisturizers',
    name: 'Moisturizers & Creams',
    slug: 'moisturizers-creams',
    description: 'Rich barrier-replenishing moisture formulas featuring bio-compatible ceramides and botanical lipids.',
  },
  {
    id: 'cat-cleansers',
    name: 'Cleansers & Washes',
    slug: 'cleansers-washes',
    description: 'Gentle pH-balanced clarifying washes that dissolve impurities without stripping skin moisture.',
  },
  {
    id: 'cat-toners',
    name: 'Toners & Facial Mists',
    slug: 'toners-mists',
    description: 'Refreshing hydrosols and micro-fine essences designed to prep, tone, and re-balance.',
  },
  {
    id: 'cat-sun',
    name: 'Sun Protection & Wellness',
    slug: 'sun-protection-wellness',
    description: 'Broad-spectrum mineral SPF defenses and restorative holistic wellness essentials.',
  },
];

const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col-radiance',
    name: 'Everyday Radiance Ritual',
    slug: 'everyday-radiance-ritual',
    tagline: 'Brightening & Antioxidant Protection',
    description: 'A scientifically balanced 3-step routine designed to revitalize dull skin and restore natural luminosity in equatorial climates.',
  },
  {
    id: 'col-barrier',
    name: 'Barrier Restoration & Soothing',
    slug: 'barrier-restoration-soothing',
    tagline: 'Deep Lipid Nourishment',
    description: 'Formulated for sensitized, compromised, or weather-stressed skin needing intensive ceramide reinforcement.',
  },
  {
    id: 'col-clarifying',
    name: 'Clarifying Blemish Defense',
    slug: 'clarifying-blemish-defense',
    tagline: 'Gentle Pore Purification',
    description: 'Unclogs congested pores, balances sebum secretion, and calms redness without over-drying.',
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Aura Radiance Vitamin C + Ferulic Serum',
    slug: 'radiance-vitamin-c-ferulic-serum',
    sku: 'GH-SER-001',
    shortDescription: '15% stabilized L-Ascorbic Acid paired with Ferulic Acid and Vitamin E for potent environmental defense.',
    fullDescription: 'A clinical-strength brightening antioxidant serum that works synergistically to neutralize free radicals, diminish stubborn dark spots, and enhance skin radiance. Specifically formulated with a low-irritation profile suitable for rich melanin tones.',
    price: 18500,
    compareAtPrice: 22000,
    categoryId: 'cat-serums',
    categoryName: 'Serums & Treatments',
    categorySlug: 'serums-treatments',
    collectionIds: ['col-radiance'],
    images: ['/images/product_radiance_serum_1793008581412.jpg'],
    variants: [
      { id: 'var-001-30', name: '30ml / 1.0 fl oz', price: 18500, sku: 'GH-SER-001-30', stock: 18 },
      { id: 'var-001-50', name: '50ml / 1.7 fl oz', price: 26000, sku: 'GH-SER-001-50', stock: 9 },
    ],
    stockQuantity: 27,
    isAvailable: true,
    isFeatured: true,
    status: 'published',
    sizeOrVolume: '30ml & 50ml',
    skinTypes: ['All Skin Types', 'Dullness', 'Hyperpigmentation'],
    keyIngredients: ['15% L-Ascorbic Acid', '1% Ferulic Acid', 'Vitamin E (Tocopherol)', 'Hyaluronic Acid'],
    fullIngredients: 'Aqua (Deionized Water), Ethoxydiglycol, L-Ascorbic Acid (Vitamin C), Propylene Glycol, Glycerin, Laureth-23, Ferulic Acid, Tocopherol (Vitamin E), Sodium Hyaluronate, Panthenol, Phenoxyethanol, Ethylhexylglycerin.',
    howToUse: 'Apply 4–5 drops in the morning onto clean, dry skin on the face, neck, and décolleté before moisturizers and sunscreen.',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-03-20T12:00:00Z',
  },
  {
    id: 'prod-002',
    name: 'Aura Barrier Restoring Ceramide & Peptide Creme',
    slug: 'barrier-restoring-ceramide-peptide-creme',
    sku: 'GH-CRM-002',
    shortDescription: 'A replenishing moisture cushion featuring 5 essential ceramides, botanical squalane, and multi-peptides.',
    fullDescription: 'An ultra-nourishing, lightweight moisturizer designed to lock in hydration and rebuild the moisture barrier. Absorbs effortlessly without greasy residue, leaving skin supple, velvety, and calmed against environmental stressors.',
    price: 22000,
    compareAtPrice: 25000,
    categoryId: 'cat-moisturizers',
    categoryName: 'Moisturizers & Creams',
    categorySlug: 'moisturizers-creams',
    collectionIds: ['col-barrier', 'col-radiance'],
    images: ['/images/product_ceramide_cream_1793008582747.jpg'],
    variants: [
      { id: 'var-002-50', name: '50ml / 1.7 oz', price: 22000, sku: 'GH-CRM-002-50', stock: 14 },
      { id: 'var-002-100', name: '100ml / 3.4 oz (Value Jar)', price: 34500, sku: 'GH-CRM-002-100', stock: 7 },
    ],
    stockQuantity: 21,
    isAvailable: true,
    isFeatured: true,
    status: 'published',
    sizeOrVolume: '50ml & 100ml',
    skinTypes: ['Dry', 'Sensitive', 'Normal to Combination'],
    keyIngredients: ['Ceramide NP, AP, EOP', 'Phytosphingosine', 'Plant Squalane', 'Tripeptide-1'],
    fullIngredients: 'Aqua, Caprylic/Capric Triglyceride, Squalane, Glycerin, Cetearyl Alcohol, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Palmitoyl Tripeptide-1, Allantoin, Carbomer, Sodium Lauroyl Lactylate, Disodium EDTA, Phenoxyethanol.',
    howToUse: 'Smooth a dime-sized amount over face and neck twice daily, morning and evening, following your serum.',
    createdAt: '2026-01-18T10:30:00Z',
    updatedAt: '2026-03-18T15:20:00Z',
  },
  {
    id: 'prod-003',
    name: 'Aura Clarifying Salicylic Botanical Gel Cleanser',
    slug: 'clarifying-salicylic-gel-cleanser',
    sku: 'GH-CLN-003',
    shortDescription: '2% Salicylic Acid (BHA) infused with green tea extract and tea tree water for gentle daily pore cleansing.',
    fullDescription: 'A silky foaming gel cleanser formulated to purify congested pores, sweep away daily surface sebum and urban debris, while preserving skin balance. Non-drying and infused with soothing botanical extracts to prevent post-cleanse tightness.',
    price: 14500,
    compareAtPrice: 17000,
    categoryId: 'cat-cleansers',
    categoryName: 'Cleansers & Washes',
    categorySlug: 'cleansers-washes',
    collectionIds: ['col-clarifying'],
    images: ['/images/product_salicylic_cleanser_1793008583027.jpg'],
    variants: [
      { id: 'var-003-200', name: '200ml / 6.7 fl oz', price: 14500, sku: 'GH-CLN-003-200', stock: 22 },
    ],
    stockQuantity: 22,
    isAvailable: true,
    isFeatured: true,
    status: 'published',
    sizeOrVolume: '200ml / 6.7 fl oz',
    skinTypes: ['Oily', 'Blemish-Prone', 'Combination'],
    keyIngredients: ['2% Salicylic Acid', 'Camellia Sinensis (Green Tea) Extract', 'Melaleuca Alternifolia Leaf Water', 'Aloe Barbadensis Leaf Juice'],
    fullIngredients: 'Aqua, Cocamidopropyl Betaine, Sodium Cocoyl Isethionate, Salicylic Acid, Glycerin, Camellia Sinensis Leaf Extract, Melaleuca Alternifolia Leaf Water, Aloe Barbadensis Leaf Juice, Zinc PCA, Citric Acid, Sodium Hydroxide, Sodium Benzoate, Potassium Sorbate.',
    howToUse: 'Dispense 1–2 pumps onto damp hands. Gently massage onto face in circular motions for 60 seconds, then rinse thoroughly with lukewarm water.',
    createdAt: '2026-02-01T11:00:00Z',
    updatedAt: '2026-03-22T08:00:00Z',
  },
  {
    id: 'prod-004',
    name: 'Aura Rosé Hydrating & Calming Botanical Mist',
    slug: 'rose-hydrating-calming-botanical-mist',
    sku: 'GH-MST-004',
    shortDescription: 'Pure Damask rose hydrosol enriched with multi-weight Hyaluronic Acid and Centella Asiatica for instant dewy hydration.',
    fullDescription: 'An ultra-fine restorative face mist that delivers an instant surge of hydration and anti-inflammatory botanicals. Perfect for prepping the skin post-cleanse, locking in active serums, or refreshing dull skin throughout warm Nigerian afternoons.',
    price: 12500,
    compareAtPrice: null,
    categoryId: 'cat-toners',
    categoryName: 'Toners & Facial Mists',
    categorySlug: 'toners-mists',
    collectionIds: ['col-radiance', 'col-barrier'],
    images: ['/images/product_rose_essence_mist_1793008583530.jpg'],
    variants: [
      { id: 'var-004-100', name: '100ml / 3.4 fl oz', price: 12500, sku: 'GH-MST-004-100', stock: 25 },
    ],
    stockQuantity: 25,
    isAvailable: true,
    isFeatured: true,
    status: 'published',
    sizeOrVolume: '100ml / 3.4 fl oz',
    skinTypes: ['All Skin Types', 'Sensitive', 'Dehydrated'],
    keyIngredients: ['Rosa Damascena Flower Water', 'Centella Asiatica (Cica) Extract', 'Sodium Hyaluronate', 'Niacinamide (2%)'],
    fullIngredients: 'Rosa Damascena Flower Water, Aqua, Propanediol, Niacinamide, Glycerin, Sodium Hyaluronate, Centella Asiatica Extract, Chamomilla Recutita Flower Extract, Allantoin, Panthenol, Disodium EDTA, Ethylhexylglycerin.',
    howToUse: 'Hold mist 8–10 inches from face with eyes closed. Mist generously over face and neck morning, night, and throughout the day whenever skin needs refreshment.',
    createdAt: '2026-02-05T14:15:00Z',
    updatedAt: '2026-03-19T17:45:00Z',
  },
  {
    id: 'prod-005',
    name: 'Aura Niacinamide 10% + Zinc 1% Clarifying Elixir',
    slug: 'niacinamide-zinc-clarifying-elixir',
    sku: 'GH-SER-005',
    shortDescription: 'Concentrated serum formulated to refine pores, regulate sebum, and clarify uneven skin texture.',
    fullDescription: 'A scientifically balanced water-based formula targeting blemishes and enlarged pores. Combines 10% pure Niacinamide with Zinc PCA to balance visible sebum activity while promoting an even, calm complexion.',
    price: 16000,
    compareAtPrice: 19000,
    categoryId: 'cat-serums',
    categoryName: 'Serums & Treatments',
    categorySlug: 'serums-treatments',
    collectionIds: ['col-clarifying'],
    images: ['/images/product_radiance_serum_1793008581412.jpg'],
    variants: [
      { id: 'var-005-30', name: '30ml / 1.0 fl oz', price: 16000, sku: 'GH-SER-005-30', stock: 15 },
    ],
    stockQuantity: 15,
    isAvailable: true,
    isFeatured: false,
    status: 'published',
    sizeOrVolume: '30ml / 1.0 fl oz',
    skinTypes: ['Oily', 'Combination', 'Enlarged Pores'],
    keyIngredients: ['10% Niacinamide', '1% Zinc PCA', 'Tamarindus Indica Seed Extract'],
    fullIngredients: 'Aqua, Niacinamide, Pentylene Glycol, Zinc PCA, Dimethyl Isosorbide, Tamarindus Indica Seed Gum, Xanthan Gum, Isoceteth-20, Ethoxydiglycol, Phenoxyethanol, Chlorphenesin.',
    howToUse: 'Apply a few drops across the face morning and evening before heavier creams. Patch test prior to first use.',
    createdAt: '2026-02-10T12:00:00Z',
    updatedAt: '2026-03-24T09:30:00Z',
  },
  {
    id: 'prod-006',
    name: 'Aura Invisible Daily Mineral Sun Shield SPF 50+',
    slug: 'invisible-mineral-daily-sun-shield-spf50',
    sku: 'GH-SPF-006',
    shortDescription: 'Non-nano zinc oxide broad-spectrum SPF 50+ with zero white cast on deep skin tones.',
    fullDescription: 'An invisible mineral fluid that defends against UVA, UVB, and environmental free radicals without leaving a chalky residue. Infused with soothing bisabolol and vitamin E to prevent sun-induced hyperpigmentation.',
    price: 19500,
    compareAtPrice: 23000,
    categoryId: 'cat-sun',
    categoryName: 'Sun Protection & Wellness',
    categorySlug: 'sun-protection-wellness',
    collectionIds: ['col-radiance', 'col-barrier'],
    images: ['/images/product_ceramide_cream_1793008582747.jpg'],
    variants: [
      { id: 'var-006-50', name: '50ml / 1.7 fl oz', price: 19500, sku: 'GH-SPF-006-50', stock: 20 },
    ],
    stockQuantity: 20,
    isAvailable: true,
    isFeatured: true,
    status: 'published',
    sizeOrVolume: '50ml / 1.7 fl oz',
    skinTypes: ['All Skin Types', 'Sensitive', 'Dark Skin Tones'],
    keyIngredients: ['12% Non-Nano Zinc Oxide', 'Bisabolol', 'Niacinamide', 'Tocopheryl Acetate'],
    fullIngredients: 'Zinc Oxide 12%, Water, Butyloctyl Salicylate, Caprylic/Capric Triglyceride, Propanediol, Dimethicone, Cetyl Alcohol, Niacinamide, Bisabolol, Tocopheryl Acetate, Silica, Polyglyceryl-4 Diisostearate, Ethylhexylglycerin.',
    howToUse: 'Apply generously and evenly 15 minutes before sun exposure as the final step of your morning skincare routine. Reapply at least every 2 hours.',
    createdAt: '2026-02-12T10:00:00Z',
    updatedAt: '2026-03-25T11:00:00Z',
  },
];

const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'GlowHauz Skincare and Wellness Store',
  tagline: 'Where Skin Meets Science',
  brandStatement: 'Where Skin Meets Science.',
  headline: 'Your Glow. Your Wellness. Your Way.',
  subheadline: 'Discover carefully selected skincare, beauty and wellness essentials designed to complement your personal care routine.',
  whatsappNumber: '07089581351',
  normalizedWhatsApp: '2347089581351',
  phoneNumber: '+234 708 958 1351',
  supportEmail: 'contact@glowhauz.ng',
  dispatchLocation: 'Enugu, Nigeria (Nationwide Courier Dispatch)',
  currency: 'NGN',
  currencySymbol: '₦',
  announcementText: '🌿 Direct WhatsApp Ordering • Quick Consultation • Dispatched from Enugu, Nigeria',
  announcementActive: true,
  instagramHandle: '@glowhauz',
  businessHours: 'Monday – Saturday: 9:00 AM – 7:00 PM (WAT)',
};

const INITIAL_CONTENT: StoreContent = {
  aboutStory:
    'GlowHauz Skincare and Wellness Store was founded with a singular purpose: to bring scientifically verified, high-performance skincare and personal wellness solutions to individuals who value clarity, efficacy, and genuine dermatological integrity.\n\nBased in Enugu and serving customers across Nigeria, we curate formulations that respect the skin barrier and deliver noticeable, lasting vitality without unsubstantiated claims or harsh shortcuts.',
  aboutPhilosophy:
    'We believe skincare is personal science. Every product on our shelves is chosen for bio-compatible ingredients, proven research, and real-world safety. We reject misleading marketing and pseudo-science in favor of honest guidance, active formulations, and accessible ordering.',
  aboutScience:
    'From stabilized antioxidants and ceramides to gentle chemical exfoliants and invisible broad-spectrum sun care, our catalog prioritizes ingredients supported by peer-reviewed dermatological literature.',
  differentiators: [
    {
      title: 'Science-Backed Formulations',
      description: 'Active ingredients selected with proven dermatological stability, safe pH ranges, and high efficacy.',
    },
    {
      title: 'Direct WhatsApp Consultation',
      description: 'Personalized order assistance to ensure your routine matches your skin goals before completing payment.',
    },
    {
      title: 'Enugu Hub & Nationwide Dispatch',
      description: 'Carefully packed from our Enugu base with reliable interstate courier delivery across Nigeria.',
    },
    {
      title: 'Honest Skincare Integrity',
      description: 'No false miracle promises or pseudo-medical hype—just clean, dependable botanical science.',
    },
  ],
  faqs: [
    {
      id: 'faq-1',
      category: 'Ordering & WhatsApp',
      question: 'How does WhatsApp ordering work at GlowHauz?',
      answer:
        'Browsing our store is simple: add your desired items to your cart, review your quantities and variants, and click "Proceed to WhatsApp". This formats a complete itemized list with prices and sends it directly to our verified team at 07089581351. We confirm stock availability, verify delivery fees for your address, and provide payment details directly. Opening WhatsApp does NOT charge you or automatically finalize a sale.',
    },
    {
      id: 'faq-2',
      category: 'Delivery & Shipping',
      question: 'Where do you ship from and what are the delivery timelines?',
      answer:
        'All orders are carefully packed and dispatched from Enugu, Nigeria. Deliveries within Enugu typically arrive within 24 hours. For other South Eastern cities, delivery takes 24–48 hours. Orders to Lagos, Abuja, Port Harcourt, and other states take 2–4 business days via reliable logistics partners.',
    },
    {
      id: 'faq-3',
      category: 'Delivery & Shipping',
      question: 'How are delivery fees calculated?',
      answer:
        'Because delivery fees depend on your exact city, parcel weight, and courier option (dispatch rider or interstate logistics), we provide the exact delivery fee during our WhatsApp confirmation conversation before you make payment.',
    },
    {
      id: 'faq-4',
      category: 'Products & Science',
      question: 'Are your products suitable for sensitive skin and rich melanin tones?',
      answer:
        'Yes. Our selections specifically consider the needs of diverse Nigerian skin types, prioritizing barrier-supportive ceramides, non-irritating Vitamin C derivatives, and sunscreen formulas that leave zero white cast on deeper skin tones. We always recommend patch testing new products.',
    },
    {
      id: 'faq-5',
      category: 'Returns',
      question: 'What is your return and exchange policy?',
      answer:
        'Due to the hygienic nature of skincare and personal care cosmetics, opened or unsealed items cannot be returned. If an incorrect item or damaged package arrives, notify us via WhatsApp within 48 hours with unboxing photos or video, and our team will immediately arrange a replacement or refund.',
    },
  ],
};

const INITIAL_POLICIES: StorePolicies = {
  deliveryPolicy: `### Delivery Policy — GlowHauz Skincare and Wellness Store

**Dispatch Hub:** Enugu, Nigeria.
**Coverage:** Nationwide across Nigeria through established regional and interstate courier partners.

#### 1. Processing Time
- Orders confirmed and paid before 1:00 PM WAT (Monday – Saturday) are processed and handed to our courier partners the same day.
- Orders confirmed after 1:00 PM or on Sundays/Public Holidays are dispatched the next business day.

#### 2. Delivery Estimates
- **Enugu Metropolis:** Same-day or next-day delivery via local dispatch rider (typically within 24 hours).
- **South East States (Anambra, Imo, Abia, Ebonyi):** 1 to 2 business days.
- **Lagos & Abuja:** 2 to 3 business days via air or express road courier.
- **Other Nigerian States:** 2 to 4 business days.

#### 3. Delivery Fees
- Delivery fees are determined by customer location, order weight, and courier tier.
- Because fees fluctuate based on destination, the exact fee will be confirmed with you directly on WhatsApp before payment is collected. We do not charge surprise delivery fees.

#### 4. Receipt & Inspection
- Please inspect your parcel upon delivery. If the outer seal appears tampered with or damaged, notify us immediately on WhatsApp at 07089581351.`,

  returnsPolicy: `### Returns & Refunds Policy

At GlowHauz Skincare and Wellness Store, product safety, hygiene, and authentic quality are paramount.

#### 1. Hygiene & Safety Standards
Due to the sanitary nature of cosmetic skincare and personal wellness formulas, **we cannot accept returns or exchanges on opened, unsealed, or used products**. This ensures every customer receives untampered, pristine stock.

#### 2. Damaged or Incorrect Items
If you receive an incorrect product, defective pump/packaging, or an item damaged during transit:
1. Contact our WhatsApp support at **07089581351** within **48 hours** of receiving your package.
2. Provide clear photos or a short video showing the unopened item and shipping label.
3. Upon verification, we will provide a prepaid replacement dispatch or a full refund via bank transfer.

#### 3. Order Cancellations
Orders may be cancelled free of charge at any time before courier dispatch. Once a parcel has left our Enugu dispatch center, standard delivery costs cannot be refunded.`,

  productDisclaimer: `### Product & Cosmetic Disclaimer

**Brand Statement:** Where Skin Meets Science.

#### 1. Cosmetic Classification
All products sold by GlowHauz Skincare and Wellness Store are formulated and distributed for topical cosmetic and personal hygiene enhancement. **Products are not intended to diagnose, treat, cure, or prevent any medical condition or dermatological disease.**

#### 2. Patch Testing Recommended
Every individual skin biome is unique. We strongly recommend performing a small patch test behind the ear or on the inner forearm 24 hours prior to full facial application, particularly if you have sensitive or reactive skin.

#### 3. Medical Guidance
If you are pregnant, nursing, undergoing dermatological treatment (such as oral isotretinoin or prescription tretinoin), or experiencing chronic dermatological conditions, consult your certified dermatologist or healthcare professional before introducing new active ingredients.`,

  privacyPolicy: `### Privacy Policy

GlowHauz Skincare and Wellness Store ("we", "us", "our") is committed to respecting and protecting the privacy of our website visitors and customers in compliance with the Nigeria Data Protection Act (NDPA).

#### 1. Information We Collect
- **Shopping Cart & Browsing:** We temporarily store shopping cart selections on your device to enable a seamless multi-product checkout experience.
- **WhatsApp Communications:** When you choose to submit an order inquiry via WhatsApp, information you share (such as your name, delivery address, and product preferences) is used solely to fulfill your order and provide customer support.

#### 2. Information Usage
We do not sell, rent, or trade your personal contact details to third parties for marketing. Contact details are used exclusively to process your requested order, coordinate delivery with reputable logistics services, and respond to your inquiries.

#### 3. Data Security
Administrative access to our store management portal is secured with server-side authentication and session verification.`,

  termsOfUse: `### Terms of Use

Welcome to GlowHauz Skincare and Wellness Store. By accessing or using our website, you agree to these Terms of Use.

#### 1. Store Operation & Orders
Our website serves as an interactive catalog and order assembly platform. Submitting a cart via WhatsApp initiates an order inquiry; it does not constitute a legally binding sale until item availability, delivery fees, and payment instructions are confirmed and fulfilled.

#### 2. Pricing & Currency
All prices displayed on this website are in **Nigerian Naira (NGN / ₦)**. While we endeavor to maintain accurate pricing at all times, in the rare event of a typographical error, we reserve the right to correct the price during WhatsApp verification.

#### 3. Intellectual Property
All brand logos, editorial texts, design elements, and product representations on this website are the property of GlowHauz Skincare and Wellness Store or their respective licensors.`,

  lastUpdated: 'March 2026',
};

// Storage Service Singleton
class StoreDatabase {
  private memoryCache: Map<string, any> = new Map();

  private get<T>(key: string, fallback: T): T {
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key) as T;
    }
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        this.memoryCache.set(key, fallback);
        try {
          localStorage.setItem(key, JSON.stringify(fallback));
        } catch {
          // In-memory fallback
        }
        return fallback;
      }
      const parsed = JSON.parse(data) as T;
      this.memoryCache.set(key, parsed);
      return parsed;
    } catch {
      this.memoryCache.set(key, fallback);
      return fallback;
    }
  }

  private set<T>(key: string, value: T): void {
    // 1. Always update in-memory cache first for instant synchronous reads
    this.memoryCache.set(key, value);

    // 2. Persist to localStorage with quota-safety
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Ping for cross-tab sync
      try {
        localStorage.setItem('glowhauz_db_sync_ping', String(Date.now()));
      } catch {
        // Ignore ping error
      }
    } catch (e) {
      console.warn('LocalStorage write note (using memory cache):', e);
    }

    // 3. Dispatch local custom event for current window
    try {
      window.dispatchEvent(new CustomEvent('glowhauz_db_change', { detail: { key, value } }));
    } catch {
      // Ignore dispatch error
    }
  }

  // Products
  getProducts(): Product[] {
    const raw = this.get<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    return raw.map((p) => ({
      ...p,
      images: (p.images || []).map(resolveImageUrl),
    }));
  }

  setProducts(products: Product[]): void {
    this.set(STORAGE_KEYS.PRODUCTS, products);
  }

  getProductBySlug(slug: string): Product | undefined {
    const products = this.getProducts();
    return products.find((p) => p.slug === slug && p.status !== 'archived');
  }

  getProductById(id: string): Product | undefined {
    const products = this.getProducts();
    return products.find((p) => p.id === id);
  }

  saveProduct(product: Product): Product {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === product.id);
    const now = new Date().toISOString();
    
    let saved: Product;
    if (index >= 0) {
      // Merge with existing to preserve fields like collectionIds and categorySlug
      saved = {
        ...products[index],
        ...product,
        updatedAt: now,
      };
      products[index] = saved;
    } else {
      saved = {
        ...product,
        id: product.id || `prod-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      products.unshift(saved);
    }
    
    this.set(STORAGE_KEYS.PRODUCTS, products);

    // Asynchronously sync to Supabase
    try {
      import('./supabase').then(({ upsertProductToSupabase }) => {
        upsertProductToSupabase(saved);
      });
    } catch {
      // Fail silently to local storage
    }

    return saved;
  }

  archiveProduct(id: string): boolean {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index >= 0) {
      products[index].status = 'archived';
      products[index].isAvailable = false;
      products[index].updatedAt = new Date().toISOString();
      this.set(STORAGE_KEYS.PRODUCTS, products);
      return true;
    }
    return false;
  }

  deleteProductPermanently(id: string): boolean {
    // Note: prompt advises archiving over permanent deletion, but provides option
    const products = this.getProducts().filter((p) => p.id !== id);
    this.set(STORAGE_KEYS.PRODUCTS, products);
    return true;
  }

  // Categories
  getCategories(): Category[] {
    const cats = this.get<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const products = this.getProducts().filter((p) => p.status === 'published');
    // Calculate live product counts
    return cats.map((cat) => ({
      ...cat,
      productCount: products.filter((p) => p.categoryId === cat.id).length,
    }));
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return this.getCategories().find((c) => c.slug === slug);
  }

  saveCategory(cat: Category): Category {
    const cats = this.get<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const index = cats.findIndex((c) => c.id === cat.id);
    if (index >= 0) {
      cats[index] = cat;
    } else {
      cats.push({ ...cat, id: cat.id || `cat-${Date.now()}` });
    }
    this.set(STORAGE_KEYS.CATEGORIES, cats);
    return cat;
  }

  deleteCategory(id: string): boolean {
    const cats = this.get<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES).filter((c) => c.id !== id);
    this.set(STORAGE_KEYS.CATEGORIES, cats);
    return true;
  }

  // Collections
  getCollections(): Collection[] {
    return this.get<Collection[]>(STORAGE_KEYS.COLLECTIONS, INITIAL_COLLECTIONS);
  }

  getCollectionBySlug(slug: string): Collection | undefined {
    return this.getCollections().find((c) => c.slug === slug);
  }

  saveCollection(col: Collection): Collection {
    const cols = this.getCollections();
    const index = cols.findIndex((c) => c.id === col.id);
    if (index >= 0) {
      cols[index] = col;
    } else {
      cols.push({ ...col, id: col.id || `col-${Date.now()}` });
    }
    this.set(STORAGE_KEYS.COLLECTIONS, cols);
    return col;
  }

  deleteCollection(id: string): boolean {
    const cols = this.getCollections().filter((c) => c.id !== id);
    this.set(STORAGE_KEYS.COLLECTIONS, cols);
    return true;
  }

  // Settings
  getSettings(): StoreSettings {
    const settings = this.get<StoreSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    // Ensure normalized WhatsApp is synced
    settings.normalizedWhatsApp = normalizeWhatsAppNumber(settings.whatsappNumber);
    return settings;
  }

  saveSettings(settings: StoreSettings): StoreSettings {
    settings.normalizedWhatsApp = normalizeWhatsAppNumber(settings.whatsappNumber);
    this.set(STORAGE_KEYS.SETTINGS, settings);

    try {
      import('./supabase').then(({ upsertSettingsToSupabase }) => {
        upsertSettingsToSupabase(settings);
      });
    } catch {
      // Fail silently to local storage
    }

    return settings;
  }

  // Content
  getContent(): StoreContent {
    return this.get<StoreContent>(STORAGE_KEYS.CONTENT, INITIAL_CONTENT);
  }

  saveContent(content: StoreContent): StoreContent {
    this.set(STORAGE_KEYS.CONTENT, content);
    return content;
  }

  // Policies
  getPolicies(): StorePolicies {
    return this.get<StorePolicies>(STORAGE_KEYS.POLICIES, INITIAL_POLICIES);
  }

  savePolicies(policies: StorePolicies): StorePolicies {
    policies.lastUpdated = new Date().toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
    this.set(STORAGE_KEYS.POLICIES, policies);
    return policies;
  }

  // Reset to demonstration seed
  resetToDemoSeed(): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(INITIAL_COLLECTIONS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(INITIAL_CONTENT));
    localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(INITIAL_POLICIES));
    window.dispatchEvent(new CustomEvent('glowhauz_db_change', { detail: { reset: true } }));
  }
}

export const db = new StoreDatabase();
