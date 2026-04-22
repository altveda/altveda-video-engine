import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Easing,
} from 'remotion';
import { BRAND } from '../brand';
import { BackgroundLayer, PRODUCT_THEMES, type ProductTheme } from './BackgroundLayer';
import { CaptionOverlay, type CaptionWord } from './CaptionOverlay';

export type SlideVariant = 'intro' | 'fact' | 'cta';

export type Slide = {
  text: string;
  subtext?: string;
  variant: SlideVariant;
  duration: number; // in frames (30fps)
  backgroundImage?: string; // per-slide override (filename in public/backgrounds/)
};

export type VoiceoverTrackRef = {
  slideIndex: number;
  src: string; // filename in public dir
};

export type ProductTipProps = {
  slides: Slide[];
  musicTrack: string;
  voiceoverTracks?: VoiceoverTrackRef[];
  musicVolume?: number; // lowered when VO active (default 0.3)
  backgroundImage?: string; // default for all slides (filename in public/backgrounds/)
  productImage?: string; // transparent bottle PNG (filename in public/products/)
  captionsBySlide?: Record<number, CaptionWord[]>; // word-level captions per slide index
};

// Cross-fade overlap in frames — kept very short to avoid ghost text
const CROSSFADE = 3;

// ─── Font Loader ───────────────────────────────────────────────

const FontLoader: React.FC = () => (
  <style>
    {`
      @font-face {
        font-family: 'Poppins';
        src: url('${staticFile('fonts/Poppins-Regular.ttf')}') format('truetype');
        font-weight: 400;
        font-style: normal;
      }
      @font-face {
        font-family: 'Poppins';
        src: url('${staticFile('fonts/Poppins-Medium.ttf')}') format('truetype');
        font-weight: 500;
        font-style: normal;
      }
      @font-face {
        font-family: 'Poppins';
        src: url('${staticFile('fonts/Poppins-SemiBold.ttf')}') format('truetype');
        font-weight: 600;
        font-style: normal;
      }
      @font-face {
        font-family: 'Poppins';
        src: url('${staticFile('fonts/Poppins-Bold.ttf')}') format('truetype');
        font-weight: 700;
        font-style: normal;
      }
    `}
  </style>
);

// ─── Progress Bar ──────────────────────────────────────────────

const ProgressBar: React.FC<{ totalFrames: number; accentColor?: string }> = ({ totalFrames, accentColor }) => {
  const frame = useCurrentFrame();
  const progress = frame / totalFrames;
  const barColor = accentColor || BRAND.gold;

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: 6, backgroundColor: 'rgba(0,0,0,0.15)', zIndex: 100,
    }}>
      <div style={{
        width: `${progress * 100}%`, height: '100%',
        backgroundColor: barColor, borderRadius: '0 3px 3px 0',
        boxShadow: `0 0 12px ${barColor}88`,
      }} />
    </div>
  );
};

// ─── Decorative Components ─────────────────────────────────────

const OrnamentalDivider: React.FC<{
  width: number; color?: string; dotColor?: string;
}> = ({ width, color = BRAND.gold, dotColor }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <div style={{
      width: 8, height: 8, borderRadius: '50%',
      backgroundColor: dotColor || color,
    }} />
    <div style={{
      width, height: 2, backgroundColor: color, borderRadius: 1,
    }} />
    <svg width="16" height="16" viewBox="0 0 16 16">
      <path d="M8 0 L10 6 L16 8 L10 10 L8 16 L6 10 L0 8 L6 6Z" fill={dotColor || color} />
    </svg>
    <div style={{
      width, height: 2, backgroundColor: color, borderRadius: 1,
    }} />
    <div style={{
      width: 8, height: 8, borderRadius: '50%',
      backgroundColor: dotColor || color,
    }} />
  </div>
);


// ─── Premium Glassmorphism ────────────────────────────────────

const GLASS_RADIUS = 48;
const TEXT_SHADOW = '0 2px 8px rgba(0,0,0,0.18)';

/**
 * On white-tinted glass, theme accent colors are too light.
 * Use textPrimary for headings, textSecondary for subtext/dividers,
 * and accent ONLY for number emphasis (large size compensates for lighter color).
 */
function getGlassTextColors(theme: ProductTheme | null | undefined) {
  if (!theme) {
    return { heading: '#1a1a1a', sub: '#444444', numAccent: '#c76b8a', divider: '#666666' };
  }
  return {
    heading: theme.textPrimary,      // #4a1a2e — dark, high contrast
    sub: theme.textSecondary,        // #7a3050 — medium-dark, readable
    numAccent: theme.accent,         // #c76b8a — lighter but used at 92px so still visible
    divider: theme.textSecondary,    // #7a3050 — matches subtext, visible on white glass
  };
}

/** iOS-style frosted glass: white-tinted overlay + heavy blur + depth shadows */
function getGlassStyles(theme: ProductTheme | null | undefined) {
  return {
    // Stronger white-tint for visible frosting on dark overlays
    background: theme
      ? `linear-gradient(135deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.30) 100%)`
      : `linear-gradient(135deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.10) 100%)`,
    // Heavier blur + saturate — makes the frosting unmistakable
    backdropFilter: 'blur(32px) saturate(2.0)',
    WebkitBackdropFilter: 'blur(32px) saturate(2.0)',
    // Stronger border for edge definition against light backgrounds
    border: '2px solid rgba(255,255,255,0.50)',
    // Multi-layer shadow: inner refraction + outer depth (stronger)
    boxShadow: [
      `inset 0 1px 2px rgba(255,255,255,0.5)`,       // top-edge light refraction
      `inset 0 -1px 0 rgba(0,0,0,0.08)`,              // bottom subtle dark edge
      `0 4px 20px rgba(0,0,0,0.18)`,                   // tight contact shadow
      `0 20px 80px rgba(0,0,0,0.22)`,                  // wide ambient shadow
    ].join(', '),
    borderRadius: GLASS_RADIUS,
  } as const;
}

/** Animated shimmer overlay — white light sweep across card surface */
const Shimmer: React.FC<{ durationFrames: number }> = ({ durationFrames }) => {
  const frame = useCurrentFrame();
  const sweepX = interpolate(frame, [10, durationFrames - 10], [-100, 200], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return (
    <div style={{
      position: 'absolute', inset: 0, borderRadius: GLASS_RADIUS,
      overflow: 'hidden', pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '50%', height: '100%',
        background: `linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.12) 60%, transparent 100%)`,
        transform: `translateX(${sweepX}%)`,
      }} />
    </div>
  );
};

// ─── Intro Slide (card only — no background) ──────────────────

const IntroSlide: React.FC<{
  text: string;
  subtext?: string;
  durationFrames: number;
  theme?: ProductTheme | null;
}> = ({ text, subtext, durationFrames, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const colors = getGlassTextColors(theme);
  const glass = getGlassStyles(theme);

  const fadeUpY = interpolate(frame, [0, 20], [40, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [durationFrames - CROSSFADE, durationFrames], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const exitScale = interpolate(frame, [durationFrames - CROSSFADE, durationFrames], [1, 0.92], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const finalOpacity = Math.min(opacity, fadeOut);

  const dividerScale = spring({ frame: frame - 12, fps, config: { stiffness: 60, damping: 16 }, from: 0, to: 1 });

  const subtextOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const subtextY = interpolate(frame, [15, 30], [20, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const slideX = interpolate(frame, [0, 20], [-60, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{
      opacity: finalOpacity, zIndex: 2,
      display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '16%',
    }}>
      <div style={{
        transform: `translateX(${slideX}px) translateY(${fadeUpY}px) scale(${exitScale})`,
        width: '72%',
        padding: '60px 48px 52px',
        textAlign: 'center',
        overflow: 'hidden',
        ...glass,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Shimmer durationFrames={durationFrames} />
        <div style={{ transform: `scaleX(${dividerScale})`, marginBottom: 36 }}>
          <OrnamentalDivider width={60} color={colors.divider} />
        </div>

        <p style={{
          fontFamily: 'Poppins, sans-serif', fontSize: 68, fontWeight: 700,
          color: colors.heading, textAlign: 'center', lineHeight: 1.2,
          margin: 0, letterSpacing: '-0.5px', maxWidth: 740,
          textShadow: TEXT_SHADOW,
        }}>
          {text}
        </p>

        <div style={{ transform: `scaleX(${dividerScale})`, marginTop: 36 }}>
          <OrnamentalDivider width={50} color={colors.divider} />
        </div>

        {subtext && (
          <p style={{
            fontFamily: 'Poppins, sans-serif', fontSize: 36, fontWeight: 500,
            color: colors.sub, textAlign: 'center', marginTop: 24,
            opacity: Math.min(subtextOpacity, fadeOut),
            transform: `translateY(${subtextY}px)`, maxWidth: 660,
            letterSpacing: '0.5px', textShadow: TEXT_SHADOW,
          }}>
            {subtext}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ─── Fact Slide (card only — no background) ───────────────────

const FactSlide: React.FC<{
  text: string;
  subtext?: string;
  durationFrames: number;
  index: number;
  totalFacts: number;
  theme?: ProductTheme | null;
}> = ({ text, subtext, durationFrames, index, totalFacts, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const colors = getGlassTextColors(theme);
  const glass = getGlassStyles(theme);

  const fadeUpY = interpolate(frame, [0, 25], [40, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [durationFrames - CROSSFADE, durationFrames], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const exitScale = interpolate(frame, [durationFrames - CROSSFADE, durationFrames], [1, 0.92], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const finalOpacity = Math.min(opacity, fadeOut);

  const panelScale = spring({ frame: frame - 3, fps, config: { stiffness: 60, damping: 18 }, from: 0.92, to: 1 });
  const combinedScale = panelScale * exitScale;
  const dividerScale = spring({ frame: frame - 15, fps, config: { stiffness: 60, damping: 16 }, from: 0, to: 1 });

  // Faster subtext: appears at frame 15 instead of 25
  const subtextOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const subtextY = interpolate(frame, [15, 30], [15, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Build text spans: emphasise ALL numbers (e.g. "28%" AND "60 days")
  // For non-numeric text, emphasise key words after the last comma
  const textSpans = React.useMemo(() => {
    const parts: { text: string; emphasis: boolean }[] = [];
    const numRegex = /(\d+(?:\.\d+)?[%×xX]?)/g;
    let lastIdx = 0;
    let hasNum = false;
    let m: RegExpExecArray | null;
    while ((m = numRegex.exec(text)) !== null) {
      hasNum = true;
      if (m.index > lastIdx) parts.push({ text: text.slice(lastIdx, m.index), emphasis: false });
      parts.push({ text: m[0], emphasis: true });
      lastIdx = m.index + m[0].length;
    }
    if (lastIdx < text.length) parts.push({ text: text.slice(lastIdx), emphasis: false });

    // No numbers? Emphasise the key phrase (after last comma, or last 2 words)
    if (!hasNum && parts.length > 0) {
      const full = text;
      const lastComma = full.lastIndexOf(',');
      if (lastComma > 0) {
        return [
          { text: full.slice(0, lastComma + 1), emphasis: false },
          { text: full.slice(lastComma + 1), emphasis: true },
        ];
      }
      // No comma — emphasise last 2 words
      const words = full.trim().split(/\s+/);
      if (words.length > 2) {
        const keyWords = words.slice(-2).join(' ');
        const prefix = full.slice(0, full.lastIndexOf(keyWords));
        return [
          { text: prefix, emphasis: false },
          { text: keyWords, emphasis: true },
        ];
      }
    }

    return parts.length > 0 ? parts : [{ text, emphasis: false }];
  }, [text]);

  const hasNumbers = textSpans.some((s) => s.emphasis && /\d/.test(s.text));

  // Slide-in from right for visual transition cue
  const slideX = interpolate(frame, [0, 20], [60, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{
      opacity: finalOpacity, zIndex: 2,
      display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '16%',
    }}>
      <div style={{
        transform: `translateX(${slideX}px) translateY(${fadeUpY}px) scale(${combinedScale})`,
        width: '72%',
        padding: '56px 44px 52px',
        overflow: 'hidden',
        ...glass,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <Shimmer durationFrames={durationFrames} />
        <p style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: hasNumbers ? 68 : 62,
          fontWeight: 700,
          color: colors.heading, textAlign: 'center', lineHeight: 1.25,
          margin: 0, maxWidth: 740, textShadow: TEXT_SHADOW,
        }}>
          {textSpans.map((span, i) =>
            span.emphasis ? (
              <span key={i} style={{
                fontSize: hasNumbers ? 96 : 62,
                color: hasNumbers ? colors.numAccent : colors.sub,
                fontWeight: 700,
              }}>
                {span.text}
              </span>
            ) : (
              <React.Fragment key={i}>{span.text}</React.Fragment>
            )
          )}
        </p>

        {/* Ornamental divider */}
        <div style={{ transform: `scaleX(${dividerScale})`, marginTop: 28, marginBottom: 8 }}>
          <OrnamentalDivider width={50} color={colors.divider} dotColor={colors.sub} />
        </div>

        {/* Subtext */}
        {subtext && (
          <p style={{
            fontFamily: 'Poppins, sans-serif', fontSize: 38, fontWeight: 500,
            color: colors.sub, textAlign: 'center', marginTop: 16,
            opacity: Math.min(subtextOpacity, fadeOut),
            transform: `translateY(${subtextY}px)`,
            maxWidth: 680, letterSpacing: '0.5px', lineHeight: 1.4,
            textShadow: TEXT_SHADOW,
          }}>
            {subtext}
          </p>
        )}

        {/* Slide position dots — visual hierarchy cue */}
        {totalFacts > 1 && (
          <div style={{
            display: 'flex', gap: 8, marginTop: 20,
            opacity: Math.min(subtextOpacity, fadeOut),
          }}>
            {Array.from({ length: totalFacts }, (_, i) => (
              <div key={i} style={{
                width: i === index ? 20 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === index ? colors.numAccent : `${colors.divider}44`,
                transition: 'width 0.3s',
              }} />
            ))}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ─── Product Bottle Overlay ───────────────────────────────────

const ProductBottle: React.FC<{
  src: string;
  durationFrames: number;
  delayFrames?: number;
}> = ({ src, durationFrames, delayFrames = 8 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bottleScale = spring({
    frame: frame - delayFrames,
    fps,
    config: { stiffness: 40, damping: 12 },
    from: 0.6,
    to: 1,
  });
  const bottleOpacity = interpolate(frame, [delayFrames, delayFrames + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [durationFrames - 8, durationFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // Subtle float (gentle up-down)
  const floatY = Math.sin((frame - delayFrames) * 0.06) * 6;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '18%',
        right: '8%',
        width: 360,
        height: 360,
        opacity: Math.min(bottleOpacity, fadeOut),
        transform: `scale(${bottleScale}) translateY(${floatY}px)`,
        zIndex: 5,
        filter: 'drop-shadow(0 16px 40px rgba(0,0,0,0.35)) drop-shadow(0 4px 12px rgba(0,0,0,0.2))',
      }}
    >
      <img
        src={staticFile(`products/${src}`)}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  );
};

// ─── CTA Slide (card only — no background) ────────────────────

const CTASlide: React.FC<{
  text: string;
  subtext?: string;
  durationFrames: number;
  theme?: ProductTheme | null;
  productImage?: string;
}> = ({ text, subtext, durationFrames, theme, productImage }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const colors = getGlassTextColors(theme);
  const glass = getGlassStyles(theme);
  const ctaBg = theme ? theme.textSecondary : BRAND.terracotta; // darker than accent for solid button

  const fadeUpY = interpolate(frame, [0, 25], [40, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [durationFrames - CROSSFADE, durationFrames], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const finalOpacity = Math.min(opacity, fadeOut);

  const dividerScale = spring({ frame: frame - 10, fps, config: { stiffness: 60, damping: 16 }, from: 0, to: 1 });

  // Faster subtext reveal
  const subtextOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const subtextY = interpolate(frame, [15, 30], [15, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Scale-up entrance for CTA
  const scaleIn = spring({ frame, fps, config: { stiffness: 50, damping: 14 }, from: 0.85, to: 1 });

  // CTA button pulse (subtle scale oscillation)
  const btnScale = spring({ frame: frame - 25, fps, config: { stiffness: 120, damping: 8 }, from: 0.9, to: 1 });

  return (
    <AbsoluteFill style={{
      opacity: finalOpacity, zIndex: 2,
      display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '16%',
    }}>
      <div style={{
        transform: `translateY(${fadeUpY}px) scale(${scaleIn})`,
        width: '72%',
        padding: '56px 44px 48px',
        textAlign: 'center',
        overflow: 'hidden',
        ...glass,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Shimmer durationFrames={durationFrames} />
        <div style={{ transform: `scaleX(${dividerScale})`, marginBottom: 36 }}>
          <OrnamentalDivider width={60} color={colors.divider} />
        </div>

        <p style={{
          fontFamily: 'Poppins, sans-serif', fontSize: 62, fontWeight: 700,
          color: colors.heading, textAlign: 'center', lineHeight: 1.2,
          margin: 0, maxWidth: 740, textShadow: TEXT_SHADOW,
        }}>
          {text}
        </p>

        <div style={{ transform: `scaleX(${dividerScale})`, marginTop: 36 }}>
          <OrnamentalDivider width={50} color={colors.divider} />
        </div>

        {/* CTA button pill */}
        {subtext && (
          <div style={{
            marginTop: 28,
            padding: '18px 52px',
            borderRadius: 50,
            backgroundColor: ctaBg,
            opacity: Math.min(subtextOpacity, fadeOut),
            transform: `translateY(${subtextY}px) scale(${btnScale})`,
            boxShadow: `0 6px 24px ${ctaBg}55`,
          }}>
            <span style={{
              fontFamily: 'Poppins, sans-serif', fontSize: 34, fontWeight: 600,
              color: '#ffffff', letterSpacing: '1.5px', textTransform: 'uppercase',
            }}>
              {subtext}
            </span>
          </div>
        )}
      </div>

      {/* Product bottle overlay — bottom right with float animation */}
      {productImage && (
        <ProductBottle src={productImage} durationFrames={durationFrames} delayFrames={12} />
      )}
    </AbsoluteFill>
  );
};

// ─── Main Composition ───────────────────────────────────────────

export const ProductTip: React.FC<ProductTipProps> = ({ slides, musicTrack, voiceoverTracks, musicVolume, backgroundImage, productImage, captionsBySlide }) => {
  const globalFrame = useCurrentFrame();

  // Resolve product theme from composition-level background
  const theme = backgroundImage ? PRODUCT_THEMES[backgroundImage] || null : null;

  // Build a lookup map: slideIndex → voiceover src
  const voMap = new Map<number, string>();
  if (voiceoverTracks) {
    for (const vt of voiceoverTracks) {
      voMap.set(vt.slideIndex, vt.src);
    }
  }
  const effectiveMusicVolume = voMap.size > 0 ? (musicVolume ?? 0.22) : 0.3;
  // Calculate total frames accounting for cross-fade overlaps
  const totalFrames = slides.reduce((sum, s) => sum + s.duration, 0);
  const totalFacts = slides.filter((s) => s.variant === 'fact').length;
  let factIndex = 0;

  // Continuous pan: smooth left-to-right dolly shot across the entire video.
  // Range 5→85 avoids the sparse edges of the panoramic art.
  const artPan = interpolate(globalFrame, [0, totalFrames], [8, 72], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Build sequence start positions with overlaps
  const sequences: { slide: Slide; startFrame: number; idx: number; factIdx: number }[] = [];
  let currentFrame = 0;
  for (let i = 0; i < slides.length; i++) {
    const fIdx = slides[i].variant === 'fact' ? factIndex++ : 0;
    sequences.push({ slide: slides[i], startFrame: currentFrame, idx: i, factIdx: fIdx });
    currentFrame += slides[i].duration - (i < slides.length - 1 ? CROSSFADE : 0);
  }

  // Watermark colors
  const watermarkBg = theme
    ? `rgba(${theme.overlayColor}, 0.6)`
    : 'rgba(0,0,0,0.4)';
  const watermarkColor = theme ? theme.textPrimary : BRAND.cream;

  // Reading-zone overlay: uses overlayColor RGB triplet for reliable alpha
  const overlayRGB = theme?.overlayColor || '44,44,44';

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.charcoal }}>
      <FontLoader />

      {/* SHARED background — renders once, never crossfades */}
      <BackgroundLayer
        imageSrc={backgroundImage}
        fallbackGradient={`linear-gradient(160deg, ${BRAND.charcoal} 0%, #1a1a1a 50%, #222 100%)`}
        artPan={artPan}
      />

      {/* Reading-zone overlay — radial vignette centered on card area (shifted up to 42%) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 70% 50% at 50% 42%, rgba(${overlayRGB},0.72) 0%, rgba(${overlayRGB},0.45) 50%, rgba(${overlayRGB},0.15) 100%)`,
        zIndex: 1,
      }} />
      {/* Edge vignette — darkens corners/edges to mask art gaps and add cinematic feel */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 80% 75% at 50% 42%, transparent 45%, rgba(${overlayRGB},0.45) 100%)`,
        zIndex: 1,
      }} />

      {/* Background music (ducked when voiceover is active) */}
      {musicTrack && (
        <Audio src={staticFile(`music/${musicTrack}`)} volume={effectiveMusicVolume} />
      )}

      {/* Progress bar */}
      <ProgressBar totalFrames={totalFrames} accentColor={theme?.accent} />

      {/* Render each slide's card with cross-fade overlap */}
      {sequences.map(({ slide, startFrame, idx, factIdx }) => {
        const voSrc = voMap.get(idx);
        const slideCaptions = captionsBySlide?.[idx];

        if (slide.variant === 'fact') {
          return (
            <Sequence key={idx} from={startFrame} durationInFrames={slide.duration}>
              <FactSlide
                text={slide.text}
                subtext={slide.subtext}
                durationFrames={slide.duration}
                index={factIdx}
                totalFacts={totalFacts}
                theme={theme}
              />
              {voSrc && <Audio src={staticFile(voSrc)} volume={1} />}
              {/* CaptionOverlay disabled — slide text already visible on screen */}
            </Sequence>
          );
        }

        if (slide.variant === 'cta') {
          return (
            <Sequence key={idx} from={startFrame} durationInFrames={slide.duration}>
              <CTASlide
                text={slide.text}
                subtext={slide.subtext}
                durationFrames={slide.duration}
                theme={theme}
                productImage={productImage}
              />
              {voSrc && <Audio src={staticFile(voSrc)} volume={1} />}
              {/* CaptionOverlay disabled — slide text already visible on screen */}
            </Sequence>
          );
        }

        return (
          <Sequence key={idx} from={startFrame} durationInFrames={slide.duration}>
            <IntroSlide
              text={slide.text}
              subtext={slide.subtext}
              durationFrames={slide.duration}
              theme={theme}
            />
            {voSrc && <Audio src={staticFile(voSrc)} volume={1} />}
            {slideCaptions && <CaptionOverlay captions={slideCaptions} startFrame={0} accentColor={theme?.accent} />}
          </Sequence>
        );
      })}

      {/* SHARED watermark — top center */}
      <div style={{
        position: 'absolute', top: 36, left: '50%',
        transform: 'translateX(-50%)',
        padding: '8px 24px', borderRadius: 8,
        background: watermarkBg, zIndex: 10,
      }}>
        <span style={{
          fontFamily: 'Poppins, sans-serif', fontSize: 28, fontWeight: 600,
          color: watermarkColor, letterSpacing: 5, textTransform: 'uppercase',
        }}>
          ALTVEDA
        </span>
      </div>
    </AbsoluteFill>
  );
};
