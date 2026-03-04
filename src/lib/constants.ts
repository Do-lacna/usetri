import { Platform } from 'react-native';

// ─── Full Brand Palette ──────────────────────────────────────────────────────

export const COLORS = {
  // Violet system
  v1: '#5645CC', // Primary
  v2: '#CACAFC', // Soft violet tint
  v3: '#9595F3', // Lighter violet (dark mode primary)
  v4: '#5E51E3', // Primary hover
  v5: '#5132D6',
  v6: '#3F21B7', // Primary active

  // Indigo / dark surfaces
  i1: '#1E1E48', // Darkest – app background dark
  i2: '#404293', // Card dark
  i3: '#3C3786', // Popover / input dark
  i4: '#332B71', // Divider / muted dark
  i5: '#2B235F',
  i6: '#1E1A4C',

  // CTA / Orange
  o1: '#FB8200', // Primary CTA
  o2: '#FFDEBD', // Orange light
  o3: '#D45608', // CTA hover / dark

  // Yellow
  g1: '#FFC900',
  g2: '#FFF7D9',
  g3: '#FF9D00', // Warning strong

  // Neutral warm
  n1: '#FFF6ED',
  n2: '#FFFEF4',
  n3: '#F3E6E5',
  n4: '#E5D1DC',
  n5: '#D5C0D6', // Border subtle
  n6: '#B39FCA',

  // Base
  white: '#FFFFFF',
  black: '#000000',
  bgDefault: '#FFFFFF',    // Background base → white (light mode)
  bgSubtle: '#FFFEF4',     // Subtle section bg → n2
  textPrimary: '#001122',

  // Semantic
  success: '#4CB963',
  error: '#EE525B',
  warning: '#FF9D00', // g3
} as const;

// ─── React Navigation theme (used by ThemeProvider + NavBar) ─────────────────

export const NAV_THEME = {
  light: {
    background: COLORS.white,             // white background
    border: COLORS.v2,
    card: COLORS.white,
    notification: COLORS.error,
    primary: COLORS.v1,                   // brand violet
    text: COLORS.textPrimary,
  },
  dark: {
    background: COLORS.i1,                // deep indigo background
    border: COLORS.i3,                    // indigo border
    card: COLORS.i2,                      // elevated indigo card
    notification: COLORS.error,           // error stays consistent
    primary: COLORS.v3,                   // lighter violet readable on dark
    text: COLORS.white,                   // white text
  },
};

// ─── Legacy named exports (kept for backward compatibility) ──────────────────

/** @deprecated Use COLORS.v1 */
export const PRIMARY_HEX = COLORS.v1;

/** @deprecated Use COLORS.i1 */
export const TERCIARY_HEX = COLORS.i1;

/** @deprecated Use COLORS.n5 */
export const DIVIDER_HEX = COLORS.n5;

export const NAVBAR_HEIGHT = Platform.OS === 'ios' ? 80 : 70;

export const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';
export const DATE_FORMAT = 'dd.MM.yyyy';

export const BASE_API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  'https://usetri-api.livelypond-189c8f13.polandcentral.azurecontainerapps.io/';

export const WEBPAGE_LINKS = {
  PRIVACTY_POLICY: 'https://usetrislovensko.sk/PrivacyPolicy',
  HOW_IT_WORKS: 'https://usetrislovensko.sk/HowItWorks',
  CONTACT: 'https://usetrislovensko.sk/Contact',
  COOKIES: 'https://usetrislovensko.sk/Cookies',
  TERMS_OF_SERVICE: 'https://usetrislovensko.sk/TermsOfService',
};
