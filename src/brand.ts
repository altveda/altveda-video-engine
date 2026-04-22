export const BRAND = {
  // Core palette (video compositions)
  sage: '#7C9A7E',
  gold: '#C9A962',
  terracotta: '#C67B5C',
  cream: '#FAF7F2',
  charcoal: '#2C2C2C',
  // Design system tokens (aligned with brandTokens.json)
  forest: '#2F3E2C',
  botanical: '#8A9A5B',
  bgLight: '#F7F3E9',
  bgDark: '#E8DFC8',
  sageDark: '#5A7A5C',
  goldDark: '#A88B42',
  graphite: '#4A4A4A',
  stone: '#E8E2D9',
  ivory: '#F5F1EA',
  // Fonts
  fontHeading: 'Poppins, sans-serif',
  fontBody: 'Poppins, sans-serif',
  fontSerif: 'Lora, Georgia, serif',
} as const;

/**
 * Playground-style product theme — used by V2 compositions.
 * Maps renderer's ArtThemePalette → playground's BRAND.products shape.
 */
export type V2ProductTheme = {
  accent: string;
  textPrimary: string;
  textSecondary: string;
  gradient: readonly [string, string, string];
  bg: string;
};

/**
 * Product themes for V2 compositions — matches playground BRAND.products structure.
 * Colors extracted from ART_THEMES palette values.
 */
export const V2_PRODUCTS: Record<string, V2ProductTheme> = {
  ashwagandha: {
    accent: '#c76b8a', textPrimary: '#4a1a2e', textSecondary: '#7a3050',
    gradient: ['#f5e6ea', '#e8c4cf', '#d4a0b0'], bg: '#f5e6ea',
  },
  amla: {
    accent: '#c9a030', textPrimary: '#4a3a10', textSecondary: '#6b5a20',
    gradient: ['#fdf6e3', '#f5e6b8', '#e8d08a'], bg: '#fdf6e3',
  },
  curcumin: {
    accent: '#b8a030', textPrimary: '#4a4010', textSecondary: '#6b5a20',
    gradient: ['#fdf8e8', '#f0e4a0', '#d4c460'], bg: '#fdf8e8',
  },
  moringa: {
    accent: '#5a8a50', textPrimary: '#1a3a16', textSecondary: '#3a5a36',
    gradient: ['#eaf5e8', '#c4dcc0', '#8ab880'], bg: '#eaf5e8',
  },
  shatavari: {
    accent: '#c06888', textPrimary: '#4a1830', textSecondary: '#7a3050',
    gradient: ['#f8e8ee', '#e8c0d0', '#d4a0b8'], bg: '#f8e8ee',
  },
};

/**
 * Resolve a V2 product theme from a backgroundImage filename.
 * Falls back to moringa (neutral green) if no match.
 */
export function resolveV2Product(backgroundImage?: string): V2ProductTheme {
  if (!backgroundImage) return V2_PRODUCTS.moringa;
  // Strip .png extension to get product key
  const key = backgroundImage.replace(/\.png$/, '');
  return V2_PRODUCTS[key] || V2_PRODUCTS.moringa;
}

export const QUICKSELL_BRAND = {
  orange: '#F97316',
  orangeDark: '#EA6C0A',
  waGreen: '#25D366',
  waGreenDark: '#1DA851',
  dark: '#111827',
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray400: '#9CA3AF',
  gray600: '#4B5563',
  gray800: '#1F2937',
  fontHeading: 'Poppins, sans-serif',
  fontBody: 'Poppins, sans-serif',
} as const;
