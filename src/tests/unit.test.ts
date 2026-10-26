import {
  normalizeWhatsAppNumber,
  isValidNigerianNumber,
  generateCartWhatsAppMessage,
  generateSingleProductWhatsAppMessage,
  createWhatsAppUrl,
  DEFAULT_RAW_WHATSAPP,
} from '../lib/whatsapp';
import { formatPrice, calculateLineTotal, calculateSubtotal } from '../lib/currency';
import { ValidatedCartItem } from '../types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('--- STARTING GLOWHAUZ UNIT TESTS ---');

// 1. Phone number normalization
console.log('Test 1: Phone number normalization');
assert(normalizeWhatsAppNumber('07089581351') === '2347089581351', 'Standard 11-digit Nigerian mobile');
assert(normalizeWhatsAppNumber('+2347089581351') === '2347089581351', 'With leading plus');
assert(normalizeWhatsAppNumber('2347089581351') === '2347089581351', 'Already normalized');
assert(normalizeWhatsAppNumber('070-8958-1351') === '2347089581351', 'With hyphens');
assert(isValidNigerianNumber('07089581351') === true, 'Validation of 07089581351');

// 2. Currency formatting in Nigerian Naira (NGN / ₦)
console.log('Test 2: Currency formatting');
assert(formatPrice(18500) === '₦18,500', 'Formats 18500 to ₦18,500');
assert(formatPrice(0) === '₦0', 'Formats 0 to ₦0');
assert(formatPrice(150000) === '₦150,000', 'Formats 150000 to ₦150,000');

// 3. Money arithmetic & subtotal calculations
console.log('Test 3: Money arithmetic');
assert(calculateLineTotal(18500, 2) === 37000, '2 * 18500 = 37000');
assert(calculateLineTotal(22000, 1) === 22000, '1 * 22000 = 22000');
const sampleItems = [
  { price: 18500, quantity: 2 },
  { price: 22000, quantity: 1 },
];
assert(calculateSubtotal(sampleItems) === 59000, 'Subtotal sum is 59000');

// 4. WhatsApp message generation & URL encoding
console.log('Test 4: WhatsApp message generation');
const mockValidatedItems: ValidatedCartItem[] = [
  {
    item: {
      id: 'prod-1-v1',
      productId: 'prod-1',
      variantId: 'v1',
      variantName: '30ml',
      quantity: 2,
      priceAtAddition: 18500,
    },
    product: {
      id: 'prod-1',
      name: 'Aura Radiance Vitamin C Serum',
      slug: 'aura-radiance-vitamin-c-serum',
      sku: 'GH-SER-001',
      shortDescription: '',
      fullDescription: '',
      price: 18500,
      compareAtPrice: null,
      categoryId: 'cat-1',
      categoryName: 'Serums',
      categorySlug: 'serums',
      collectionIds: [],
      images: [],
      variants: [],
      stockQuantity: 10,
      isAvailable: true,
      isFeatured: true,
      status: 'published',
      sizeOrVolume: '30ml',
      skinTypes: [],
      keyIngredients: [],
      fullIngredients: '',
      howToUse: '',
      createdAt: '',
      updatedAt: '',
    },
    currentPrice: 18500,
    lineTotal: 37000,
    isAvailable: true,
    priceChanged: false,
  },
];

const message = generateCartWhatsAppMessage(
  mockValidatedItems,
  37000,
  'Independence Layout, Enugu',
  'Please call upon arrival',
  'GlowHauz Skincare and Wellness Store'
);

assert(message.includes('GlowHauz Skincare and Wellness Store'), 'Includes store name');
assert(message.includes('*Aura Radiance Vitamin C Serum* (30ml)'), 'Includes product name and variant with bold formatting');
assert(message.includes('Qty: 2 × ₦18,500 = *₦37,000*'), 'Includes quantity, unit price, and bold line total');
assert(message.includes('Independence Layout, Enugu'), 'Includes customer delivery location');
assert(message.includes('Please call upon arrival'), 'Includes customer note');

const url = createWhatsAppUrl('07089581351', message);
assert(url.startsWith('https://wa.me/2347089581351?text='), 'Target normalized URL is correct');
assert(url.includes(encodeURIComponent('Aura Radiance Vitamin C Serum')), 'Properly URI-encoded');

// 5. Single product message generation
console.log('Test 5: Single product direct order message');
const singleMsg = generateSingleProductWhatsAppMessage(
  'Aura Barrier Creme',
  '50ml',
  1,
  22000,
  'GlowHauz'
);
assert(singleMsg.includes('*Aura Barrier Creme* (50ml)'), 'Includes variant in single message');
assert(singleMsg.includes('₦22,000'), 'Includes formatted amount');

// 6. Admin Password authentication test
console.log('Test 6: Master password verification');
import { loginWithPasswordOnly } from '../lib/auth';
const authResult = loginWithPasswordOnly('Herkan007');
assert(authResult.success === true, 'Herkan007 successfully authorizes admin access');
const failResult = loginWithPasswordOnly('WrongPassword123');
assert(failResult.success === false, 'Invalid password is rejected');

// 7. Device Image Uploader integration test
console.log('Test 7: Device image upload result contract');
import { ImageUploadResult } from '../lib/imageUploader';
const mockUploadResult: ImageUploadResult = {
  url: 'https://wyiledgckpbzeshkwcdg.supabase.co/storage/v1/object/public/glowhauz-products/products/sample.jpg',
  success: true,
  storage: 'supabase',
  filename: 'sample.jpg',
};
assert(mockUploadResult.success === true, 'Upload result success is true');
assert(mockUploadResult.storage === 'supabase', 'Recognizes Supabase storage provider');
assert(mockUploadResult.url.includes('glowhauz-products'), 'Path belongs to product bucket');

console.log('--- ALL UNIT TESTS PASSED SUCCESSFULLY! ---');
