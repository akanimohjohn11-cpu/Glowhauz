/**
 * Privacy-conscious client-side analytics.
 * Logs distinct customer shopping interactions without transmitting personally identifiable data.
 * Crucially, WhatsApp clicks are recorded as 'begin_whatsapp_checkout' or 'whatsapp_contact_click',
 * NEVER as a confirmed sale or completed order.
 */

export type AnalyticsEventType =
  | 'page_view'
  | 'product_view'
  | 'search'
  | 'category_select'
  | 'collection_select'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'update_cart_quantity'
  | 'begin_whatsapp_checkout'
  | 'whatsapp_contact_click'
  | 'telephone_click';

export interface AnalyticsEvent {
  type: AnalyticsEventType;
  timestamp: string;
  data?: Record<string, unknown>;
}

const ANALYTICS_STORAGE_KEY = 'glowhauz_analytics_events';

export function trackEvent(type: AnalyticsEventType, data?: Record<string, unknown>): void {
  try {
    const event: AnalyticsEvent = {
      type,
      timestamp: new Date().toISOString(),
      data,
    };

    // Keep last 50 events in local log for admin metrics & audit
    const existingRaw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    const events: AnalyticsEvent[] = existingRaw ? JSON.parse(existingRaw) : [];
    events.unshift(event);
    if (events.length > 100) events.pop();
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(events));

    // Optional dispatch for listeners
    window.dispatchEvent(new CustomEvent('glowhauz_analytics', { detail: event }));
  } catch {
    // Fail silently to avoid breaking shopper experience
  }
}

export function getStoredAnalytics(): AnalyticsEvent[] {
  try {
    const existingRaw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    return existingRaw ? JSON.parse(existingRaw) : [];
  } catch {
    return [];
  }
}
