/**
 * artThemes.ts — Single source of truth for Altveda visual identity.
 *
 * Maps 5 product art illustrations (chakra goddess series) to color palettes,
 * and maps 11 content themes to art themes for automatic visual selection.
 *
 * Used by:
 *   - Remotion compositions (BackgroundLayer.tsx) — video backgrounds
 *   - HTML screenshot templates (render.ts) — static image backgrounds
 *   - Apps Script (VideoClient.gs, ScreenshotClient.gs) — theme resolution
 */

export type ArtThemePalette = {
  gradient: string;       // CSS gradient for base layer
  overlayColor: string;   // RGB triplet for semi-transparent fades (e.g., '212,160,176')
  accent: string;         // hex — dividers, badges, highlights
  textPrimary: string;    // hex — headings
  textSecondary: string;  // hex — body text
  bgTint: string;         // hex — light background tint for templates
};

export type ArtTheme = {
  id: string;
  artFile: string;        // filename in public/backgrounds/
  palette: ArtThemePalette;
};

/**
 * 5 art themes — one per product/chakra illustration.
 * Colors sampled from the actual art images.
 */
export const ART_THEMES: Record<string, ArtTheme> = {
  ashwagandha: {
    id: 'ashwagandha',
    artFile: 'ashwagandha.png',
    palette: {
      gradient: 'linear-gradient(160deg, #f5e6ea 0%, #e8c4cf 40%, #d4a0b0 100%)',
      overlayColor: '212,160,176',
      accent: '#c76b8a',
      textPrimary: '#4a1a2e',
      textSecondary: '#7a3050',
      bgTint: '#f5e6ea',
    },
  },
  amla: {
    id: 'amla',
    artFile: 'amla.png',
    palette: {
      gradient: 'linear-gradient(160deg, #fdf6e3 0%, #f5e6b8 40%, #e8d08a 100%)',
      overlayColor: '232,208,138',
      accent: '#c9a030',
      textPrimary: '#4a3a10',
      textSecondary: '#7a6420',
      bgTint: '#fdf6e3',
    },
  },
  curcumin: {
    id: 'curcumin',
    artFile: 'curcumin.png',
    palette: {
      gradient: 'linear-gradient(160deg, #fdf8e8 0%, #f0e4a0 40%, #d4c460 100%)',
      overlayColor: '212,196,96',
      accent: '#b8a030',
      textPrimary: '#4a4010',
      textSecondary: '#6a5c18',
      bgTint: '#fdf8e8',
    },
  },
  moringa: {
    id: 'moringa',
    artFile: 'moringa.png',
    palette: {
      gradient: 'linear-gradient(160deg, #eaf5e8 0%, #c4dcc0 40%, #8ab880 100%)',
      overlayColor: '138,184,128',
      accent: '#5a8a50',
      textPrimary: '#1a3a16',
      textSecondary: '#2a5a24',
      bgTint: '#eaf5e8',
    },
  },
  shatavari: {
    id: 'shatavari',
    artFile: 'shatavari.png',
    palette: {
      gradient: 'linear-gradient(160deg, #f8e8ee 0%, #e8c0d0 40%, #d4a0b8 100%)',
      overlayColor: '212,160,184',
      accent: '#c06888',
      textPrimary: '#4a1830',
      textSecondary: '#783050',
      bgTint: '#f8e8ee',
    },
  },
};

/**
 * Map 11 content themes → art theme id.
 * 'auto' = detect product from text keywords.
 */
export const CONTENT_TO_ART: Record<string, string> = {
  PRODUCT_SPOTLIGHT: 'auto',
  WELLNESS_TIP: 'moringa',
  FACT_CARD: 'curcumin',
  FOUNDER_STORY: 'ashwagandha',
  SEASONAL: 'amla',
  PRODUCT_COMPARISON: 'auto',
  COMBO_OFFER: 'auto',
  EDUCATIONAL: 'moringa',
  MENTAL_HEALTH: 'ashwagandha',
  EVERGREEN: 'amla',
  TESTIMONIAL: 'shatavari',
};

/** Content themes that should show product photos. */
export const PRODUCT_PHOTO_THEMES = [
  'PRODUCT_SPOTLIGHT',
  'PRODUCT_COMPARISON',
  'COMBO_OFFER',
];

/** Default art theme when nothing else matches. */
const DEFAULT_THEME = 'moringa';

/**
 * Detect which product is mentioned in text.
 * Returns the art theme id, or null if no product detected.
 */
export function detectProductFromText(text?: string): string | null {
  if (!text) return null;
  const lower = text.toLowerCase();

  if (lower.includes('ashwagandha') || lower.includes('ksm-66') || lower.includes('withania'))
    return 'ashwagandha';
  if (lower.includes('amla') || lower.includes('gooseberry') || lower.includes('amalaki'))
    return 'amla';
  if (lower.includes('curcumin') || lower.includes('turmeric') || lower.includes('haldi'))
    return 'curcumin';
  if (lower.includes('moringa') || lower.includes('drumstick'))
    return 'moringa';
  if (lower.includes('shatavari') || lower.includes('asparagus racemosus'))
    return 'shatavari';

  return null;
}

/**
 * Resolve an art theme from content theme + optional text.
 *
 * Priority:
 *   1. Explicit artTheme id (if valid)
 *   2. Content theme mapping (CONTENT_TO_ART)
 *   3. Product detection from text
 *   4. Default (moringa — neutral green)
 */
export function resolveArtTheme(
  contentTheme?: string,
  text?: string,
  explicitArtTheme?: string,
): ArtTheme {
  // 1. Explicit override
  if (explicitArtTheme && ART_THEMES[explicitArtTheme]) {
    return ART_THEMES[explicitArtTheme];
  }

  // 2. Content theme mapping
  if (contentTheme && CONTENT_TO_ART[contentTheme]) {
    const mapped = CONTENT_TO_ART[contentTheme];
    if (mapped !== 'auto') {
      return ART_THEMES[mapped];
    }
    // 'auto' — try product detection
    const detected = detectProductFromText(text);
    if (detected && ART_THEMES[detected]) {
      return ART_THEMES[detected];
    }
  }

  // 3. Try product detection from text
  const detected = detectProductFromText(text);
  if (detected && ART_THEMES[detected]) {
    return ART_THEMES[detected];
  }

  // 4. Default
  return ART_THEMES[DEFAULT_THEME];
}
