/**
 * Decorative SVG elements for Hindi compositions.
 * Mandala, lotus, rangoli patterns — inline SVG paths for zero external deps.
 */

// ─── Mandala Divider ─────────────────────────────────────────
// Ornamental line divider with central mandala motif.
// Used between headline and body in HindiTextCard.
export const MANDALA_DIVIDER_SVG = `
<svg viewBox="0 0 800 60" xmlns="http://www.w3.org/2000/svg">
  <!-- Central mandala circle -->
  <circle cx="400" cy="30" r="18" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.7"/>
  <circle cx="400" cy="30" r="10" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/>
  <circle cx="400" cy="30" r="4" fill="currentColor" opacity="0.6"/>
  <!-- Petal ring (8 petals) -->
  ${Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45) * Math.PI / 180;
    const cx = 400 + Math.cos(angle) * 24;
    const cy = 30 + Math.sin(angle) * 24;
    return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="2.5" fill="currentColor" opacity="0.4"/>`;
  }).join('\n  ')}
  <!-- Extending lines -->
  <line x1="100" y1="30" x2="370" y2="30" stroke="currentColor" stroke-width="1" opacity="0.3"/>
  <line x1="430" y1="30" x2="700" y2="30" stroke="currentColor" stroke-width="1" opacity="0.3"/>
  <!-- End dots -->
  <circle cx="100" cy="30" r="3" fill="currentColor" opacity="0.3"/>
  <circle cx="700" cy="30" r="3" fill="currentColor" opacity="0.3"/>
</svg>
`;

// ─── Lotus Ornament ──────────────────────────────────────────
// Flanking ornament for stat numbers in HindiStatCard.
// Returns left or right variant (mirrored).
export const LOTUS_ORNAMENT_SVG = `
<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
  <!-- Central bud -->
  <ellipse cx="60" cy="50" rx="8" ry="16" fill="currentColor" opacity="0.3"/>
  <!-- Left petals -->
  <ellipse cx="42" cy="45" rx="6" ry="14" fill="currentColor" opacity="0.2" transform="rotate(-25, 42, 45)"/>
  <ellipse cx="30" cy="48" rx="5" ry="12" fill="currentColor" opacity="0.15" transform="rotate(-45, 30, 48)"/>
  <!-- Right petals (mirrored) -->
  <ellipse cx="78" cy="45" rx="6" ry="14" fill="currentColor" opacity="0.2" transform="rotate(25, 78, 45)"/>
  <ellipse cx="90" cy="48" rx="5" ry="12" fill="currentColor" opacity="0.15" transform="rotate(45, 90, 48)"/>
  <!-- Base arc -->
  <path d="M 25 60 Q 60 70 95 60" fill="none" stroke="currentColor" stroke-width="1" opacity="0.25"/>
</svg>
`;

// ─── Rangoli Border Pattern ──────────────────────────────────
// Geometric corner/border pattern for HindiWisdomCard.
// Traditional rangoli-inspired — simple geometric repeats.
export const RANGOLI_CORNER_SVG = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Outer corner arc -->
  <path d="M 0 40 Q 0 0 40 0" fill="none" stroke="currentColor" stroke-width="2" opacity="0.25"/>
  <path d="M 0 60 Q 0 0 60 0" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.2"/>
  <path d="M 0 80 Q 0 0 80 0" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/>
  <!-- Dot cluster -->
  <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.3"/>
  <circle cx="35" cy="10" r="2" fill="currentColor" opacity="0.2"/>
  <circle cx="10" cy="35" r="2" fill="currentColor" opacity="0.2"/>
  <circle cx="50" cy="5" r="1.5" fill="currentColor" opacity="0.15"/>
  <circle cx="5" cy="50" r="1.5" fill="currentColor" opacity="0.15"/>
  <!-- Diamond -->
  <polygon points="30,30 38,22 46,30 38,38" fill="none" stroke="currentColor" stroke-width="1" opacity="0.2"/>
</svg>
`;

// ─── Leaf Motif ──────────────────────────────────────────────
// Simple Ayurvedic leaf for subtle decoration.
export const LEAF_MOTIF_SVG = `
<svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
  <path d="M 30 5 Q 50 25 45 55 Q 30 70 30 75 Q 30 70 15 55 Q 10 25 30 5 Z"
        fill="currentColor" opacity="0.12"/>
  <line x1="30" y1="10" x2="30" y2="70" stroke="currentColor" stroke-width="0.8" opacity="0.15"/>
  <path d="M 30 25 Q 40 30 42 40" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.1"/>
  <path d="M 30 35 Q 20 40 18 50" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.1"/>
</svg>
`;

// ─── Aged Paper Texture (CSS) ────────────────────────────────
// CSS background for parchment/manuscript feel in WisdomCard.
export const PARCHMENT_CSS = {
  background: `
    radial-gradient(ellipse at 30% 20%, rgba(210, 180, 140, 0.15) 0%, transparent 60%),
    radial-gradient(ellipse at 70% 80%, rgba(180, 150, 110, 0.1) 0%, transparent 50%),
    linear-gradient(180deg, #F5EDDA 0%, #EDE2CC 50%, #F0E6D2 100%)
  `,
  // Subtle noise overlay for paper grain
  noiseFilter: `
    <filter id="paperNoise">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feBlend in="SourceGraphic" mode="multiply"/>
    </filter>
  `,
};
