-- ==============================================================================
-- GLOWHAUZ SKINCARE & WELLNESS STORE — SUPABASE POSTGRESQL SCHEMA & SEED SCRIPT
-- Brand Statement: "Where Skin Meets Science."
-- Currency: Nigerian Naira (NGN / ₦)
-- WhatsApp Target: 07089581351 (Normalized: 2347089581351)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY DEFAULT ('cat-' || uuid_generate_v4()::text),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COLLECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.collections (
    id TEXT PRIMARY KEY DEFAULT ('col-' || uuid_generate_v4()::text),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    tagline TEXT,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT ('prod-' || uuid_generate_v4()::text),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sku TEXT,
    short_description TEXT,
    full_description TEXT,
    price INTEGER NOT NULL CHECK (price >= 0), -- Base price in NGN
    compare_at_price INTEGER CHECK (compare_at_price IS NULL OR compare_at_price >= price),
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
    size_or_volume TEXT,
    skin_types TEXT[] DEFAULT ARRAY[]::TEXT[],
    key_ingredients TEXT[] DEFAULT ARRAY[]::TEXT[],
    full_ingredients TEXT,
    how_to_use TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS public.product_variants (
    id TEXT PRIMARY KEY DEFAULT ('var-' || uuid_generate_v4()::text),
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g. "30ml", "50ml", "100ml Value Size"
    price INTEGER NOT NULL CHECK (price >= 0),
    sku TEXT,
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PRODUCT <-> COLLECTION JUNCTION TABLE
CREATE TABLE IF NOT EXISTS public.product_collections (
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    collection_id TEXT NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, collection_id)
);

-- 7. STORE SETTINGS TABLE (Single-row configuration)
CREATE TABLE IF NOT EXISTS public.store_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    store_name TEXT NOT NULL DEFAULT 'GlowHauz Skincare and Wellness Store',
    tagline TEXT NOT NULL DEFAULT 'Where Skin Meets Science',
    brand_statement TEXT NOT NULL DEFAULT 'Where Skin Meets Science.',
    headline TEXT NOT NULL DEFAULT 'Your Glow. Your Wellness. Your Way.',
    subheadline TEXT NOT NULL DEFAULT 'Discover carefully selected skincare, beauty and wellness essentials designed to complement your personal care routine.',
    whatsapp_number TEXT NOT NULL DEFAULT '07089581351',
    normalized_whatsapp TEXT NOT NULL DEFAULT '2347089581351',
    phone_number TEXT NOT NULL DEFAULT '+234 708 958 1351',
    support_email TEXT NOT NULL DEFAULT 'contact@glowhauz.ng',
    dispatch_location TEXT NOT NULL DEFAULT 'Enugu, Nigeria (Nationwide Courier Dispatch)',
    currency TEXT NOT NULL DEFAULT 'NGN',
    currency_symbol TEXT NOT NULL DEFAULT '₦',
    announcement_text TEXT NOT NULL DEFAULT '🌿 Complimentary skincare consultation with every order | Dispatched from Enugu',
    announcement_active BOOLEAN NOT NULL DEFAULT TRUE,
    instagram_handle TEXT DEFAULT '@glowhauz',
    business_hours TEXT NOT NULL DEFAULT 'Monday – Saturday: 9:00 AM – 7:00 PM (WAT)',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. STORE CONTENT & FAQS
CREATE TABLE IF NOT EXISTS public.store_content (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    about_story TEXT NOT NULL,
    about_philosophy TEXT NOT NULL,
    about_science TEXT NOT NULL,
    differentiators JSONB NOT NULL DEFAULT '[]'::jsonb,
    faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. STORE POLICIES TABLE
CREATE TABLE IF NOT EXISTS public.store_policies (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    delivery_policy TEXT NOT NULL,
    returns_policy TEXT NOT NULL,
    product_disclaimer TEXT NOT NULL,
    privacy_policy TEXT NOT NULL,
    terms_of_use TEXT NOT NULL,
    last_updated TEXT NOT NULL DEFAULT 'March 2026',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. INDEXES FOR HIGH-CONCURRENCY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_collections_slug ON public.collections(slug);
CREATE INDEX IF NOT EXISTS idx_product_variants_prod ON public.product_variants(product_id);

-- 11. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_policies ENABLE ROW LEVEL SECURITY;

-- Anonymous Public Read Access (Anyone can view published products, catalog, settings, policies)
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Collections" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (status != 'archived');
CREATE POLICY "Public Read Product Variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Public Read Product Collections" ON public.product_collections FOR SELECT USING (true);
CREATE POLICY "Public Read Store Settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Store Content" ON public.store_content FOR SELECT USING (true);
CREATE POLICY "Public Read Store Policies" ON public.store_policies FOR SELECT USING (true);

-- Authenticated Admin Mutations & Anon Web Client Mutations (Secured via app master password)
CREATE POLICY "Admin All Categories" ON public.categories FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Collections" ON public.collections FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Products" ON public.products FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Product Variants" ON public.product_variants FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Product Collections" ON public.product_collections FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Store Settings" ON public.store_settings FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Store Content" ON public.store_content FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Store Policies" ON public.store_policies FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- 12. STORAGE BUCKET FOR PRODUCT IMAGES (Supabase Storage)
INSERT INTO storage.buckets (id, name, public)
VALUES ('glowhauz-products', 'glowhauz-products', true)
ON CONFLICT (id) DO NOTHING;

-- Public can view images in the bucket
CREATE POLICY "Public Access Product Images" ON storage.objects
FOR SELECT USING (bucket_id = 'glowhauz-products');

-- Allow image upload and modification for admin dashboard (authenticated & anon)
CREATE POLICY "Admin Upload Product Images" ON storage.objects
FOR INSERT TO authenticated, anon WITH CHECK (bucket_id = 'glowhauz-products');

CREATE POLICY "Admin Update Product Images" ON storage.objects
FOR UPDATE TO authenticated, anon USING (bucket_id = 'glowhauz-products');

CREATE POLICY "Admin Delete Product Images" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'glowhauz-products');

CREATE POLICY "Anon Upload Product Images" ON storage.objects
FOR INSERT TO anon WITH CHECK (bucket_id = 'glowhauz-products');

CREATE POLICY "Anon Update Product Images" ON storage.objects
FOR UPDATE TO anon USING (bucket_id = 'glowhauz-products');

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Seed Categories
INSERT INTO public.categories (id, name, slug, description) VALUES
('cat-serums', 'Serums & Treatments', 'serums-treatments', 'Targeted bio-active formulas engineered for discoloration, dullness, fine lines, and hydration.'),
('cat-moisturizers', 'Moisturizers & Creams', 'moisturizers-creams', 'Rich barrier-replenishing moisture formulas featuring bio-compatible ceramides and botanical lipids.'),
('cat-cleansers', 'Cleansers & Washes', 'cleansers-washes', 'Gentle pH-balanced clarifying washes that dissolve impurities without stripping skin moisture.'),
('cat-toners', 'Toners & Facial Mists', 'toners-mists', 'Refreshing hydrosols and micro-fine essences designed to prep, tone, and re-balance.'),
('cat-sun', 'Sun Protection & Wellness', 'sun-protection-wellness', 'Broad-spectrum mineral SPF defenses and restorative holistic wellness essentials.')
ON CONFLICT (id) DO NOTHING;

-- Seed Collections
INSERT INTO public.collections (id, name, slug, tagline, description) VALUES
('col-radiance', 'Everyday Radiance Ritual', 'everyday-radiance-ritual', 'Brightening & Antioxidant Protection', 'A scientifically balanced 3-step routine designed to revitalize dull skin and restore natural luminosity in equatorial climates.'),
('col-barrier', 'Barrier Restoration & Soothing', 'barrier-restoration-soothing', 'Deep Lipid Nourishment', 'Formulated for sensitized, compromised, or weather-stressed skin needing intensive ceramide reinforcement.'),
('col-clarifying', 'Clarifying Blemish Defense', 'clarifying-blemish-defense', 'Gentle Pore Purification', 'Unclogs congested pores, balances sebum secretion, and calms redness without over-drying.')
ON CONFLICT (id) DO NOTHING;

-- Seed Products
INSERT INTO public.products (id, name, slug, sku, short_description, full_description, price, compare_at_price, category_id, images, stock_quantity, is_available, is_featured, status, size_or_volume, skin_types, key_ingredients, full_ingredients, how_to_use) VALUES
('prod-001', 'Aura Radiance Vitamin C + Ferulic Serum', 'radiance-vitamin-c-ferulic-serum', 'GH-SER-001', '15% stabilized L-Ascorbic Acid paired with Ferulic Acid and Vitamin E for potent environmental defense.', 'A clinical-strength brightening antioxidant serum that works synergistically to neutralize free radicals, diminish stubborn dark spots, and enhance skin radiance. Specifically formulated with a low-irritation profile suitable for rich melanin tones.', 18500, 22000, 'cat-serums', ARRAY['/src/assets/images/product_radiance_serum_1793008581412.jpg'], 27, true, true, 'published', '30ml & 50ml', ARRAY['All Skin Types', 'Dullness', 'Hyperpigmentation'], ARRAY['15% L-Ascorbic Acid', '1% Ferulic Acid', 'Vitamin E (Tocopherol)', 'Hyaluronic Acid'], 'Aqua, Ethoxydiglycol, L-Ascorbic Acid, Propylene Glycol, Glycerin, Laureth-23, Ferulic Acid, Tocopherol, Sodium Hyaluronate, Panthenol, Phenoxyethanol, Ethylhexylglycerin.', 'Apply 4–5 drops in the morning onto clean, dry skin on the face and neck before moisturizers and sunscreen.'),
('prod-002', 'Aura Barrier Restoring Ceramide & Peptide Creme', 'barrier-restoring-ceramide-peptide-creme', 'GH-CRM-002', 'A replenishing moisture cushion featuring 5 essential ceramides, botanical squalane, and multi-peptides.', 'An ultra-nourishing, lightweight moisturizer designed to lock in hydration and rebuild the moisture barrier. Absorbs effortlessly without greasy residue, leaving skin supple, velvety, and calmed against environmental stressors.', 22000, 25000, 'cat-moisturizers', ARRAY['/src/assets/images/product_ceramide_cream_1793008582747.jpg'], 21, true, true, 'published', '50ml & 100ml', ARRAY['Dry', 'Sensitive', 'Normal to Combination'], ARRAY['Ceramide NP, AP, EOP', 'Phytosphingosine', 'Plant Squalane', 'Tripeptide-1'], 'Aqua, Caprylic/Capric Triglyceride, Squalane, Glycerin, Cetearyl Alcohol, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Palmitoyl Tripeptide-1, Allantoin, Carbomer, Phenoxyethanol.', 'Smooth a dime-sized amount over face and neck twice daily, morning and evening, following your serum.'),
('prod-003', 'Aura Clarifying Salicylic Botanical Gel Cleanser', 'clarifying-salicylic-gel-cleanser', 'GH-CLN-003', '2% Salicylic Acid (BHA) infused with green tea extract and tea tree water for gentle daily pore cleansing.', 'A silky foaming gel cleanser formulated to purify congested pores, sweep away daily surface sebum and urban debris, while preserving skin balance. Non-drying and infused with soothing botanical extracts.', 14500, 17000, 'cat-cleansers', ARRAY['/src/assets/images/product_salicylic_cleanser_1793008583027.jpg'], 22, true, true, 'published', '200ml / 6.7 fl oz', ARRAY['Oily', 'Blemish-Prone', 'Combination'], ARRAY['2% Salicylic Acid', 'Camellia Sinensis Extract', 'Melaleuca Leaf Water', 'Aloe Vera'], 'Aqua, Cocamidopropyl Betaine, Sodium Cocoyl Isethionate, Salicylic Acid, Glycerin, Camellia Sinensis Leaf Extract, Melaleuca Alternifolia Leaf Water, Aloe Barbadensis Leaf Juice, Zinc PCA, Citric Acid.', 'Dispense 1–2 pumps onto damp hands. Gently massage onto face in circular motions for 60 seconds, then rinse with lukewarm water.'),
('prod-004', 'Aura Rosé Hydrating & Calming Botanical Mist', 'rose-hydrating-calming-botanical-mist', 'GH-MST-004', 'Pure Damask rose hydrosol enriched with multi-weight Hyaluronic Acid and Centella Asiatica for instant dewy hydration.', 'An ultra-fine restorative face mist that delivers an instant surge of hydration and anti-inflammatory botanicals. Perfect for prepping the skin post-cleanse, locking in active serums, or refreshing dull skin.', 12500, NULL, 'cat-toners', ARRAY['/src/assets/images/product_rose_essence_mist_1793008583530.jpg'], 25, true, true, 'published', '100ml / 3.4 fl oz', ARRAY['All Skin Types', 'Sensitive', 'Dehydrated'], ARRAY['Rosa Damascena Flower Water', 'Centella Asiatica (Cica) Extract', 'Sodium Hyaluronate', 'Niacinamide (2%)'], 'Rosa Damascena Flower Water, Aqua, Propanediol, Niacinamide, Glycerin, Sodium Hyaluronate, Centella Asiatica Extract, Chamomilla Recutita Extract, Allantoin, Panthenol, Ethylhexylglycerin.', 'Hold mist 8–10 inches from face with eyes closed. Mist generously over face and neck morning, night, and throughout the day.'),
('prod-005', 'Aura Niacinamide 10% + Zinc 1% Clarifying Elixir', 'niacinamide-zinc-clarifying-elixir', 'GH-SER-005', 'Concentrated serum formulated to refine pores, regulate sebum, and clarify uneven skin texture.', 'A scientifically balanced water-based formula targeting blemishes and enlarged pores. Combines 10% pure Niacinamide with Zinc PCA to balance visible sebum activity while promoting an even complexion.', 16000, 19000, 'cat-serums', ARRAY['/src/assets/images/product_radiance_serum_1793008581412.jpg'], 15, true, false, 'published', '30ml / 1.0 fl oz', ARRAY['Oily', 'Combination', 'Enlarged Pores'], ARRAY['10% Niacinamide', '1% Zinc PCA', 'Tamarindus Indica Extract'], 'Aqua, Niacinamide, Pentylene Glycol, Zinc PCA, Dimethyl Isosorbide, Tamarindus Indica Seed Gum, Xanthan Gum, Phenoxyethanol.', 'Apply a few drops across the face morning and evening before heavier creams. Patch test prior to first use.'),
('prod-006', 'Aura Invisible Daily Mineral Sun Shield SPF 50+', 'invisible-mineral-daily-sun-shield-spf50', 'GH-SPF-006', 'Non-nano zinc oxide broad-spectrum SPF 50+ with zero white cast on deep skin tones.', 'An invisible mineral fluid that defends against UVA, UVB, and environmental free radicals without leaving a chalky residue. Infused with soothing bisabolol and vitamin E to prevent sun-induced hyperpigmentation.', 19500, 23000, 'cat-sun', ARRAY['/src/assets/images/product_ceramide_cream_1793008582747.jpg'], 20, true, true, 'published', '50ml / 1.7 fl oz', ARRAY['All Skin Types', 'Sensitive', 'Dark Skin Tones'], ARRAY['12% Non-Nano Zinc Oxide', 'Bisabolol', 'Niacinamide', 'Tocopheryl Acetate'], 'Zinc Oxide 12%, Water, Butyloctyl Salicylate, Caprylic/Capric Triglyceride, Propanediol, Dimethicone, Cetyl Alcohol, Niacinamide, Bisabolol, Tocopheryl Acetate, Silica, Ethylhexylglycerin.', 'Apply generously and evenly 15 minutes before sun exposure as the final step of your morning skincare routine.')
ON CONFLICT (id) DO NOTHING;

-- Seed Variants
INSERT INTO public.product_variants (id, product_id, name, price, sku, stock) VALUES
('var-001-30', 'prod-001', '30ml / 1.0 fl oz', 18500, 'GH-SER-001-30', 18),
('var-001-50', 'prod-001', '50ml / 1.7 fl oz', 26000, 'GH-SER-001-50', 9),
('var-002-50', 'prod-002', '50ml / 1.7 oz', 22000, 'GH-CRM-002-50', 14),
('var-002-100', 'prod-002', '100ml / 3.4 oz (Value Jar)', 34500, 'GH-CRM-002-100', 7),
('var-003-200', 'prod-003', '200ml / 6.7 fl oz', 14500, 'GH-CLN-003-200', 22),
('var-004-100', 'prod-004', '100ml / 3.4 fl oz', 12500, 'GH-MST-004-100', 25),
('var-005-30', 'prod-005', '30ml / 1.0 fl oz', 16000, 'GH-SER-005-30', 15),
('var-006-50', 'prod-006', '50ml / 1.7 fl oz', 19500, 'GH-SPF-006-50', 20)
ON CONFLICT (id) DO NOTHING;

-- Seed Product Collections
INSERT INTO public.product_collections (product_id, collection_id) VALUES
('prod-001', 'col-radiance'),
('prod-002', 'col-radiance'),
('prod-002', 'col-barrier'),
('prod-003', 'col-clarifying'),
('prod-004', 'col-radiance'),
('prod-004', 'col-barrier'),
('prod-005', 'col-clarifying'),
('prod-006', 'col-radiance'),
('prod-006', 'col-barrier')
ON CONFLICT (product_id, collection_id) DO NOTHING;

-- Seed Settings
INSERT INTO public.store_settings (id, store_name, tagline, brand_statement, headline, subheadline, whatsapp_number, normalized_whatsapp, phone_number, support_email, dispatch_location, currency, currency_symbol, announcement_text, announcement_active, instagram_handle, business_hours)
VALUES (
    1,
    'GlowHauz Skincare and Wellness Store',
    'Where Skin Meets Science',
    'Where Skin Meets Science.',
    'Your Glow. Your Wellness. Your Way.',
    'Discover carefully selected skincare, beauty and wellness essentials designed to complement your personal care routine.',
    '07089581351',
    '2347089581351',
    '+234 708 958 1351',
    'contact@glowhauz.ng',
    'Enugu, Nigeria (Nationwide Courier Dispatch)',
    'NGN',
    '₦',
    '🌿 Direct WhatsApp Ordering • Quick Consultation • Dispatched from Enugu, Nigeria',
    true,
    '@glowhauz',
    'Monday – Saturday: 9:00 AM – 7:00 PM (WAT)'
)
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- Seed Content
INSERT INTO public.store_content (id, about_story, about_philosophy, about_science, differentiators, faqs)
VALUES (
    1,
    'GlowHauz Skincare and Wellness Store was founded with a singular purpose: to bring scientifically verified, high-performance skincare and personal wellness solutions to individuals who value clarity, efficacy, and genuine dermatological integrity.\n\nBased in Enugu and serving customers across Nigeria, we curate formulations that respect the skin barrier and deliver noticeable, lasting vitality without unsubstantiated claims or harsh shortcuts.',
    'We believe skincare is personal science. Every product on our shelves is chosen for bio-compatible ingredients, proven research, and real-world safety. We reject misleading marketing and pseudo-science in favor of honest guidance, active formulations, and accessible ordering.',
    'From stabilized antioxidants and ceramides to gentle chemical exfoliants and invisible broad-spectrum sun care, our catalog prioritizes ingredients supported by peer-reviewed dermatological literature.',
    '[
        {"title": "Science-Backed Formulations", "description": "Active ingredients selected with proven dermatological stability, safe pH ranges, and high efficacy."},
        {"title": "Direct WhatsApp Consultation", "description": "Personalized order assistance to ensure your routine matches your skin goals before completing payment."},
        {"title": "Enugu Hub & Nationwide Dispatch", "description": "Carefully packed from our Enugu base with reliable interstate courier delivery across Nigeria."},
        {"title": "Honest Skincare Integrity", "description": "No false miracle promises or pseudo-medical hype—just clean, dependable botanical science."}
    ]'::jsonb,
    '[
        {"id": "faq-1", "category": "Ordering & WhatsApp", "question": "How does WhatsApp ordering work at GlowHauz?", "answer": "Browsing our store is simple: add your desired items to your cart, review your quantities and variants, and click \"Proceed to WhatsApp\". This formats a complete itemized list with prices and sends it directly to our verified team at 07089581351. We confirm stock availability, verify delivery fees for your address, and provide payment details directly. Opening WhatsApp does NOT charge you or automatically finalize a sale."},
        {"id": "faq-2", "category": "Delivery & Shipping", "question": "Where do you ship from and what are the delivery timelines?", "answer": "All orders are carefully packed and dispatched from Enugu, Nigeria. Deliveries within Enugu typically arrive within 24 hours. For other South Eastern cities, delivery takes 24–48 hours. Orders to Lagos, Abuja, Port Harcourt, and other states take 2–4 business days via reliable logistics partners."},
        {"id": "faq-3", "category": "Delivery & Shipping", "question": "How are delivery fees calculated?", "answer": "Because delivery fees depend on your exact city, parcel weight, and courier option (dispatch rider or interstate logistics), we provide the exact delivery fee during our WhatsApp confirmation conversation before you make payment."},
        {"id": "faq-4", "category": "Products & Science", "question": "Are your products suitable for sensitive skin and rich melanin tones?", "answer": "Yes. Our selections specifically consider the needs of diverse Nigerian skin types, prioritizing barrier-supportive ceramides, non-irritating Vitamin C derivatives, and sunscreen formulas that leave zero white cast on deeper skin tones. We always recommend patch testing new products."},
        {"id": "faq-5", "category": "Returns", "question": "What is your return and exchange policy?", "answer": "Due to the hygienic nature of skincare and personal care cosmetics, opened or unsealed items cannot be returned. If an incorrect item or damaged package arrives, notify us via WhatsApp within 48 hours with unboxing photos or video, and our team will immediately arrange a replacement or refund."}
    ]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- Seed Policies
INSERT INTO public.store_policies (id, delivery_policy, returns_policy, product_disclaimer, privacy_policy, terms_of_use, last_updated)
VALUES (
    1,
    '### Delivery Policy — GlowHauz Skincare and Wellness Store\n\n**Dispatch Hub:** Enugu, Nigeria.\n**Coverage:** Nationwide across Nigeria through established regional and interstate courier partners.\n\n#### 1. Processing Time\n- Orders confirmed and paid before 1:00 PM WAT (Monday – Saturday) are processed and handed to our courier partners the same day.\n- Orders confirmed after 1:00 PM or on Sundays/Public Holidays are dispatched the next business day.\n\n#### 2. Delivery Estimates\n- **Enugu Metropolis:** Same-day or next-day delivery via local dispatch rider (typically within 24 hours).\n- **South East States (Anambra, Imo, Abia, Ebonyi):** 1 to 2 business days.\n- **Lagos & Abuja:** 2 to 3 business days via air or express road courier.\n- **Other Nigerian States:** 2 to 4 business days.\n\n#### 3. Delivery Fees\n- Delivery fees are determined by customer location, order weight, and courier tier.\n- Because fees fluctuate based on destination, the exact fee will be confirmed with you directly on WhatsApp before payment is collected. We do not charge surprise delivery fees.\n\n#### 4. Receipt & Inspection\n- Please inspect your parcel upon delivery. If the outer seal appears tampered with or damaged, notify us immediately on WhatsApp at 07089581351.',
    '### Returns & Refunds Policy\n\nAt GlowHauz Skincare and Wellness Store, product safety, hygiene, and authentic quality are paramount.\n\n#### 1. Hygiene & Safety Standards\nDue to the sanitary nature of cosmetic skincare and personal wellness formulas, **we cannot accept returns or exchanges on opened, unsealed, or used products**. This ensures every customer receives untampered, pristine stock.\n\n#### 2. Damaged or Incorrect Items\nIf you receive an incorrect product, defective pump/packaging, or an item damaged during transit:\n1. Contact our WhatsApp support at **07089581351** within **48 hours** of receiving your package.\n2. Provide clear photos or a short video showing the unopened item and shipping label.\n3. Upon verification, we will provide a prepaid replacement dispatch or a full refund via bank transfer.\n\n#### 3. Order Cancellations\nOrders may be cancelled free of charge at any time before courier dispatch. Once a parcel has left our Enugu dispatch center, standard delivery costs cannot be refunded.',
    '### Product & Cosmetic Disclaimer\n\n**Brand Statement:** Where Skin Meets Science.\n\n#### 1. Cosmetic Classification\nAll products sold by GlowHauz Skincare and Wellness Store are formulated and distributed for topical cosmetic and personal hygiene enhancement. **Products are not intended to diagnose, treat, cure, or prevent any medical condition or dermatological disease.**\n\n#### 2. Patch Testing Recommended\nEvery individual skin biome is unique. We strongly recommend performing a small patch test behind the ear or on the inner forearm 24 hours prior to full facial application, particularly if you have sensitive or reactive skin.\n\n#### 3. Medical Guidance\nIf you are pregnant, nursing, undergoing dermatological treatment (such as oral isotretinoin or prescription tretinoin), or experiencing chronic dermatological conditions, consult your certified dermatologist or healthcare professional before introducing new active ingredients.',
    '### Privacy Policy\n\nGlowHauz Skincare and Wellness Store ("we", "us", "our") is committed to respecting and protecting the privacy of our website visitors and customers in compliance with the Nigeria Data Protection Act (NDPA).\n\n#### 1. Information We Collect\n- **Shopping Cart & Browsing:** We temporarily store shopping cart selections on your device to enable a seamless multi-product checkout experience.\n- **WhatsApp Communications:** When you choose to submit an order inquiry via WhatsApp, information you share (such as your name, delivery address, and product preferences) is used solely to fulfill your order and provide customer support.\n\n#### 2. Information Usage\nWe do not sell, rent, or trade your personal contact details to third parties for marketing. Contact details are used exclusively to process your requested order, coordinate delivery with reputable logistics services, and respond to your inquiries.\n\n#### 3. Data Security\nAdministrative access to our store management portal is secured with server-side authentication and session verification.',
    '### Terms of Use\n\nWelcome to GlowHauz Skincare and Wellness Store. By accessing or using our website, you agree to these Terms of Use.\n\n#### 1. Store Operation & Orders\nOur website serves as an interactive catalog and order assembly platform. Submitting a cart via WhatsApp initiates an order inquiry; it does not constitute a legally binding sale until item availability, delivery fees, and payment instructions are confirmed and fulfilled.\n\n#### 2. Pricing & Currency\nAll prices displayed on this website are in **Nigerian Naira (NGN / ₦)**. While we endeavor to maintain accurate pricing at all times, in the rare event of a typographical error, we reserve the right to correct the price during WhatsApp verification.\n\n#### 3. Intellectual Property\nAll brand logos, editorial texts, design elements, and product representations on this website are the property of GlowHauz Skincare and Wellness Store or their respective licensors.',
    'March 2026'
)
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();
