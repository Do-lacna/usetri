import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

// ── Crashlytics ──────────────────────────────────────────────

export function setAnalyticsUser(userId: string) {
  crashlytics().setUserId(userId);
  analytics().setUserId(userId);
}

export function clearAnalyticsUser() {
  crashlytics().setUserId('');
  analytics().setUserId(null);
}

/** Log a non-fatal error to Crashlytics so it shows up in the dashboard. */
export function logError(error: unknown, context?: string) {
  if (error instanceof Error) {
    if (context) crashlytics().log(context);
    crashlytics().recordError(error);
  } else {
    crashlytics().log(context ?? 'Unknown error');
    crashlytics().recordError(new Error(String(error)));
  }
}

/** Add a breadcrumb message visible in Crashlytics crash reports. */
export function logBreadcrumb(message: string) {
  crashlytics().log(message);
}

// ── Analytics ────────────────────────────────────────────────

export function logScreenView(screenName: string) {
  analytics().logScreenView({ screen_name: screenName, screen_class: screenName });
}

export function logSignIn(method: 'email' | 'google' | 'apple') {
  analytics().logLogin({ method });
}

export function logSignUp(method: 'email' | 'google' | 'apple') {
  analytics().logSignUp({ method });
}

export function logSearch(searchTerm: string) {
  analytics().logSearch({ search_term: searchTerm });
}

export function logAddToCart(productId: number) {
  analytics().logAddToCart({ items: [{ item_id: String(productId) }] });
}

export function logRemoveFromCart(productId: number) {
  analytics().logRemoveFromCart({ items: [{ item_id: String(productId) }] });
}

export function logPurchase(productId: string, price: number, currency = 'EUR') {
  analytics().logPurchase({ value: price, currency, items: [{ item_id: productId }] });
}

export function logBarcodeScan(barcode: string) {
  analytics().logEvent('barcode_scan', { barcode });
}

export function logCompareShops() {
  analytics().logEvent('compare_shops');
}

export function logContinueAsGuest() {
  analytics().logEvent('continue_as_guest');
}
