/**
 * Currency utilities for Nigerian Naira (NGN / ₦)
 * All financial calculations maintain integer arithmetic to avoid floating point bugs.
 */

export function formatPrice(amountInNaira: number): string {
  if (isNaN(amountInNaira) || amountInNaira === null || amountInNaira === undefined) {
    return '₦0';
  }
  const rounded = Math.round(amountInNaira);
  return `₦${rounded.toLocaleString('en-NG')}`;
}

export function formatPriceWithDecimals(amountInNaira: number): string {
  if (isNaN(amountInNaira) || amountInNaira === null || amountInNaira === undefined) {
    return '₦0.00';
  }
  return `₦${amountInNaira.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Calculates line item total safely
 */
export function calculateLineTotal(unitPrice: number, quantity: number): number {
  const safeQty = Math.max(1, Math.floor(quantity));
  const safePrice = Math.max(0, Math.round(unitPrice));
  return safeQty * safePrice;
}

/**
 * Calculates sum of multiple line totals safely
 */
export function calculateSubtotal(items: Array<{ price: number; quantity: number }>): number {
  return items.reduce((sum, item) => sum + calculateLineTotal(item.price, item.quantity), 0);
}
