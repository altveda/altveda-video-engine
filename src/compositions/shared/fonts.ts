// Font family strings for V2 compositions — uses local TTF files loaded via @font-face.
// The actual @font-face declarations are in each composition's FontLoader component.
export const FONTS = {
  heading: 'Poppins, sans-serif',
  body: 'Poppins, sans-serif',
  serif: 'Lora, Georgia, serif',
  serifItalic: 'Lora, Georgia, serif',
  // Hindi (Devanagari) — Noto Sans Devanagari with Poppins fallback
  hindi: 'Noto Sans Devanagari, Poppins, sans-serif',
  hindiBold: 'Noto Sans Devanagari, Poppins, sans-serif',
} as const;

// ─── Mobile-First Font Scale ─────────────────────────────────
// Canvas: 1080×1920 (9:16 portrait). Viewed on phone screens (5-7 inches).
// These are the MINIMUM sizes for readability. Never go below these.
//
// RULE: If text matters (user should read it), use BODY or above.
//       If text is decorative/branding, use LABEL minimum.
//       NOTHING should ever be below WATERMARK (28px).
export const SIZE = {
  // Headlines & titles — big, bold, unmissable
  HERO: 88,           // Main stat, number, big fact
  TITLE: 60,          // Primary headline, product name
  SUBTITLE: 48,       // Section titles, secondary headlines

  // Body content — must be easily readable on a 5-inch phone
  BODY_LG: 44,        // Primary body text, quotes, descriptions
  BODY: 40,           // Standard body text, list items
  BODY_SM: 36,        // Secondary text, explanations

  // Labels & UI elements
  LABEL: 30,          // Badges ("Product Spotlight"), CTAs, attributions
  CAPTION: 28,        // Source citations, timestamps (smallest readable)

  // Branding
  WATERMARK: 28,      // Bottom watermark, "ALTVEDA" text
  PRICE: 52,          // Price display
  CTA_BUTTON: 30,     // Button text inside CTAs
} as const;

// ─── Product Image Scale ─────────────────────────────────────
// Product bottles/photos should command attention on a 1080px-wide canvas.
export const PRODUCT = {
  // Hero product image (e.g., ProductSpotlightV2 main bottle)
  HERO_SIZE: 440,       // width & height — ~41% of canvas width (was 380)
  // Grid/list product image
  GRID_SIZE: 260,       // for multi-product layouts (was 200)
  // Thumbnail
  THUMB_SIZE: 160,      // smallest product image (was 120)
} as const;

// ─── Logo Scale ──────────────────────────────────────────────
export const LOGO = {
  WATERMARK_HEIGHT: 48,  // Top watermark logo
  HERO_HEIGHT: 80,       // Large logo (e.g., BrandIntro)
} as const;

// ─── Layout Safe Zones ──────────────────────────────────────
// Watermark sits at top: 24px, height: 48px → bottom edge at 72px.
// Add breathing room → safe content starts at 120px from top.
// All compositions should use these to prevent watermark/content overlap.
export const LAYOUT = {
  TOP_SAFE: 120,          // px from top — content must not enter this zone
  BOTTOM_SAFE: 80,        // px from bottom — CTA/caption breathing room
  SIDE_PADDING: 60,       // px horizontal padding
} as const;

// ─── Hindi (Devanagari) Size Overrides ────────────────────────
// Devanagari script has taller ascenders/descenders and wider glyphs.
// ~10% larger line-height, slightly larger body sizes for readability.
export const HINDI_SIZE = {
  HERO: 96,           // Larger for Devanagari legibility
  TITLE: 64,
  SUBTITLE: 52,
  BODY_LG: 48,
  BODY: 44,
  BODY_SM: 40,
  LABEL: 32,
  CAPTION: 30,
} as const;

export const HINDI_LINE_HEIGHT = 1.45; // vs ~1.3 for Latin scripts
