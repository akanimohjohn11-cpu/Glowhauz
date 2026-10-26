import { ValidatedCartItem } from '../types';
import { formatPrice } from './currency';

export const DEFAULT_RAW_WHATSAPP = '07089581351';

/**
 * Normalizes a Nigerian phone number to international E.164-compatible format without '+'
 * Handles formats like:
 * 07089581351 -> 2347089581351
 * +2347089581351 -> 2347089581351
 * 2347089581351 -> 2347089581351
 */
export function normalizeWhatsAppNumber(rawNumber: string): string {
  if (!rawNumber) return '2347089581351';
  // Strip all non-digit characters
  const clean = rawNumber.replace(/\D/g, '');
  
  if (clean.startsWith('234') && clean.length >= 13) {
    return clean;
  }
  if (clean.startsWith('0') && clean.length === 11) {
    return '234' + clean.slice(1);
  }
  if (clean.length === 10) {
    return '234' + clean;
  }
  return clean || '2347089581351';
}

/**
 * Validates whether a phone number is an acceptable Nigerian contact
 */
export function isValidNigerianNumber(number: string): boolean {
  const normalized = normalizeWhatsAppNumber(number);
  return /^234[789][01]\d{8}$/.test(normalized);
}

/**
 * Generates an itemized order message for the cart
 */
export function generateCartWhatsAppMessage(
  items: ValidatedCartItem[],
  subtotal: number,
  deliveryLocation: string = '',
  customerNotes: string = '',
  storeName: string = 'GlowHauz Skincare and Wellness Store'
): string {
  const lines: string[] = [];
  
  lines.push(`✨ *NEW ORDER INQUIRY*`);
  lines.push(`Hello ${storeName}, I would like to place an order from your online store.\n`);
  lines.push(`*ITEMS SELECTED:*`);
  
  items.forEach((item, index) => {
    const variantStr = item.item.variantName ? ` (${item.item.variantName})` : '';
    lines.push(
      `${index + 1}. *${item.product.name}*${variantStr}\n   Qty: ${item.item.quantity} × ${formatPrice(item.currentPrice)} = *${formatPrice(item.lineTotal)}*`
    );
  });
  
  lines.push(``);
  lines.push(`*ORDER SUMMARY:*`);
  lines.push(`• Estimated Subtotal: *${formatPrice(subtotal)}*`);
  lines.push(`• Delivery Fee: _To be confirmed based on location_`);
  
  if (deliveryLocation.trim()) {
    lines.push(`• Delivery Address / City: ${deliveryLocation.trim()}`);
  } else {
    lines.push(`• Delivery: Please advise on delivery options to my location.`);
  }

  if (customerNotes.trim()) {
    lines.push(`• Note: ${customerNotes.trim()}`);
  }

  lines.push(``);
  lines.push(`Could you kindly confirm product availability, advise on the delivery fee, and share payment details?`);
  lines.push(`Thank you!`);

  return lines.join('\n');
}

/**
 * Generates a direct product order inquiry message
 */
export function generateSingleProductWhatsAppMessage(
  productName: string,
  variantName: string | undefined,
  quantity: number,
  unitPrice: number,
  storeName: string = 'GlowHauz Skincare and Wellness Store'
): string {
  const lineTotal = unitPrice * quantity;
  const variantStr = variantName ? ` (${variantName})` : '';
  
  const lines: string[] = [
    `✨ *PRODUCT INQUIRY / ORDER*`,
    `Hello ${storeName},`,
    ``,
    `I would like to order:`,
    `• *${productName}*${variantStr}`,
    `• Quantity: ${quantity}`,
    `• Unit Price: ${formatPrice(unitPrice)}`,
    `• Estimated Total: *${formatPrice(lineTotal)}* (excl. delivery)`,
    ``,
    `Please confirm if this is currently in stock, and let me know the delivery cost to my location.`,
    `Thank you!`
  ];

  return lines.join('\n');
}

/**
 * Generates a general customer support message
 */
export function generateGeneralInquiryWhatsAppMessage(
  subject: string = 'Skincare Consultation & Product Inquiry',
  storeName: string = 'GlowHauz Skincare and Wellness Store'
): string {
  const lines: string[] = [
    `Hello ${storeName},`,
    ``,
    `I am reaching out regarding: *${subject}*.`,
    `I would love some guidance on selecting the best products for my skin routine.`,
    ``,
    `Looking forward to your advice!`
  ];

  return lines.join('\n');
}

/**
 * Creates the official wa.me URL
 */
export function createWhatsAppUrl(normalizedNumber: string, message: string): string {
  const cleanNumber = normalizeWhatsAppNumber(normalizedNumber);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

/**
 * Creates a telephone call URL
 */
export function createTelUrl(normalizedNumber: string): string {
  const cleanNumber = normalizeWhatsAppNumber(normalizedNumber);
  return `tel:+${cleanNumber}`;
}
