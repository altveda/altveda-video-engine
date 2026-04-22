import React from 'react';
import {
  AbsoluteFill, Audio, Img, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import { noise2D } from '@remotion/noise';
import { BRAND, resolveV2Product } from '../../brand';
import { GrainOverlay, BotanicalOverlay, OrnamentalDivider } from '../shared/GlassCard';
import { LottieLayer } from '../shared/LottieLayer';
import type { CaptionWord } from '../CaptionOverlay';

// ─── Amazon Ad Props ──────────────────────────────────────────
export type AmazonProductAdProps = {
  product?: string;           // 'ashwagandha' | 'amla' | etc.
  productName?: string;       // "Ashwagandha Capsules"
  tagline?: string;           // "The Ancient Adaptogen"
  benefits?: string[];        // 3 Amazon-safe benefits
  trustSignal?: string;       // "Clinically Studied KSM-66 Extract"
  differentiator?: string;    // "No Fillers. No Binders. Just Roots."
  brandTagline?: string;      // "Pure Ayurvedic Supplements"
  musicTrack?: string;
  voiceoverSrc?: string;
  voiceoverScript?: string;
  musicVolume?: number;
  durationInFrames?: number;
  backgroundImage?: string;
  captions?: CaptionWord[];
  captionStartFrame?: number;
};

// ─── Landscape font scale (1920px wide) ───────────────────────
const AD = {
  NAME: 72,
  TAGLINE: 40,
  BENEFIT: 48,
  TRUST: 40,
  DIFF: 36,
  BRAND_TAG: 32,
  BADGE: 24,
  LOGO_H: 56,
  PRODUCT_SIZE: 520,
  CHECK_SIZE: 36,
} as const;

const FONTS = {
  heading: 'Poppins, sans-serif',
  body: 'Poppins, sans-serif',
  serif: 'Lora, Georgia, serif',
};

// ─── Font loader ──────────────────────────────────────────────
const FontLoader: React.FC = () => (
  <style>{`
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-Bold.ttf')}') format('truetype'); font-weight: 700; }
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-SemiBold.ttf')}') format('truetype'); font-weight: 600; }
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-Regular.ttf')}') format('truetype'); font-weight: 400; }
    @font-face { font-family: 'Lora'; src: url('${staticFile('fonts/Lora-Italic-VariableFont_wght.ttf')}') format('truetype'); font-weight: 400 700; font-style: italic; }
  `}</style>
);

// ─── Landscape background (adapted from ProductBackground) ────
const AdBackground: React.FC<{
  product: ReturnType<typeof resolveV2Product>;
  productKey: string;
  children: React.ReactNode;
}> = ({ product, productKey, children }) => {
  const frame = useCurrentFrame();
  const gradAngle = 135 + noise2D('bg-angle', 0, frame * 0.005) * 10;
  const panX = interpolate(frame, [0, 540], [0, -8], { extrapolateRight: 'clamp' });
  const panScale = 1.05 + noise2D('bg-scale', 0, frame * 0.003) * 0.02;

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(${gradAngle}deg, ${product.gradient[0]}, ${product.gradient[1]}, ${product.gradient[2]})`,
      backgroundSize: '200% 200%',
    }}>
      {/* Background image — landscape adapted (wider, shorter) */}
      <Img src={staticFile(`backgrounds/${productKey}.png`)} style={{
        position: 'absolute', width: '100%', height: '130%', top: '-15%', left: 0,
        objectFit: 'cover', opacity: 0.15,
        transform: `translateX(${panX}%) scale(${panScale})`, filter: 'blur(3px)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 70% 80% at 35% 50%, transparent 0%, ${product.bg}cc 100%)`,
        opacity: 0.72,
      }} />
      <BotanicalOverlay opacity={0.04} />
      <GrainOverlay opacity={0.03} />
      {children}
    </AbsoluteFill>
  );
};

// ─── Main Composition ─────────────────────────────────────────
export const AmazonProductAd: React.FC<AmazonProductAdProps> = ({
  product: productKey = 'ashwagandha',
  productName = 'Ashwagandha',
  tagline = 'The Ancient Adaptogen',
  benefits = ['Supports Healthy Stress Response', 'Promotes Restful Sleep', 'Traditional Adaptogenic Herb'],
  trustSignal = 'Clinically Studied KSM-66 Extract',
  differentiator = 'No Fillers. No Binders. Just Roots.',
  brandTagline = 'Pure Ayurvedic Supplements',
  musicTrack, voiceoverSrc, musicVolume, backgroundImage,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: TOTAL } = useVideoConfig();

  const bgImage = backgroundImage || `${productKey}.png`;
  const theme = resolveV2Product(bgImage);
  const resolvedKey = bgImage.replace(/\.png$/, '');

  // ─── Phase timing (18s = 540 frames at 30fps) ──────────────
  // HERO: 0-60    (0-2s)   — product + name
  // BENEFITS: 60-240 (2-8s) — 3 benefits staggered
  // TRUST: 240-420 (8-14s)  — trust + differentiator
  // BRAND: 420-540 (14-18s) — logo + brand tagline

  // ─── Global exit (never fully black) ───────────────────────
  const exit = interpolate(frame, [TOTAL - 15, TOTAL - 5], [1, 0.3], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ─── Product bottle animations ─────────────────────────────
  const bottleEnter = spring({ frame, fps, config: { damping: 14, stiffness: 40 } });
  const bottleFloat = Math.sin(frame / 18) * 6;

  // ─── Text animations ──────────────────────────────────────
  const nameEnter = spring({ frame: frame - 5, fps, config: { damping: 12 } });
  const taglineEnter = spring({ frame: frame - 15, fps, config: { damping: 12 } });

  // Benefits stagger (start at frame 60, 60 frames apart)
  const benefitSprings = benefits.slice(0, 3).map((_, i) =>
    spring({ frame: frame - 60 - i * 60, fps, config: { damping: 14 } })
  );

  // Trust section (frame 240)
  const trustEnter = spring({ frame: frame - 240, fps, config: { damping: 12 } });
  const diffEnter = spring({ frame: frame - 280, fps, config: { damping: 12 } });

  // Brand phase (frame 420)
  const brandEnter = spring({ frame: frame - 420, fps, config: { damping: 12 } });
  const textFadeForBrand = interpolate(frame, [410, 430], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Accent ring rotation
  const ringAngle = frame * 1.5;

  return (
    <AdBackground product={theme} productKey={resolvedKey}>
      <FontLoader />

      {/* Audio */}
      {musicTrack && (
        <Audio src={staticFile(`music/${musicTrack}`)} volume={voiceoverSrc ? (musicVolume ?? 0.22) : 0.3} />
      )}
      {voiceoverSrc && (
        <Sequence from={5}><Audio src={staticFile(voiceoverSrc)} volume={1} /></Sequence>
      )}

      {/* Watermark — top-left for landscape, dark pill for contrast on light gradients */}
      <div style={{
        position: 'absolute', top: 24, left: 32, zIndex: 50,
        backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 20,
        padding: '8px 20px', backdropFilter: 'blur(8px)',
      }}>
        <Img src={staticFile('logos/logo-white.png')} style={{
          height: 36, filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.4))',
        }} />
      </div>

      {/* ─── Split Panel Layout ──────────────────────────── */}
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'row', opacity: exit }}>

        {/* LEFT: Product Zone (40%) */}
        <div style={{
          width: '40%', height: '100%', display: 'flex',
          justifyContent: 'center', alignItems: 'center',
          position: 'relative',
        }}>
          {/* Accent ring glow */}
          <div style={{
            position: 'absolute', width: AD.PRODUCT_SIZE + 80, height: AD.PRODUCT_SIZE + 80,
            borderRadius: '50%',
            background: `conic-gradient(from ${ringAngle}deg, ${theme.accent}55, transparent, ${BRAND.gold}55, transparent)`,
            filter: 'blur(12px)', opacity: bottleEnter,
          }} />

          {/* Product bottle */}
          <div style={{
            position: 'relative',
            transform: `translateY(${bottleFloat}px) scale(${interpolate(bottleEnter, [0, 1], [0.85, 1])})`,
            opacity: bottleEnter,
          }}>
            <Img src={staticFile(`products/${resolvedKey}.png`)} style={{
              width: AD.PRODUCT_SIZE, height: AD.PRODUCT_SIZE, objectFit: 'contain',
              filter: `drop-shadow(0 12px 30px ${theme.accent}44)`,
            }} />
            <LottieLayer src="lottie/sparkle-burst.json"
              width={AD.PRODUCT_SIZE + 60} height={AD.PRODUCT_SIZE + 60}
              enterDelay={20} exitFrame={TOTAL - 20} opacity={0.2} playbackRate={0.5}
              style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            />
          </div>
        </div>

        {/* RIGHT: Text Zone (60%) */}
        <div style={{
          width: '60%', height: '100%', display: 'flex',
          flexDirection: 'column', justifyContent: 'center',
          paddingRight: 80, paddingLeft: 40,
          position: 'relative',
        }}>

          {/* ── Phase 1-3: Product info + Benefits + Trust ── */}
          <div style={{ opacity: textFadeForBrand }}>
            {/* Product name */}
            <div style={{
              fontSize: AD.NAME, fontWeight: 700, fontFamily: FONTS.heading,
              color: theme.textPrimary, lineHeight: 1.15,
              transform: `translateX(${interpolate(nameEnter, [0, 1], [40, 0])}px)`,
              opacity: nameEnter,
            }}>{productName}</div>

            {/* Tagline */}
            <div style={{
              fontSize: AD.TAGLINE, fontFamily: FONTS.serif, fontStyle: 'italic',
              color: theme.textSecondary, marginTop: 4, marginBottom: 24,
              transform: `translateX(${interpolate(taglineEnter, [0, 1], [30, 0])}px)`,
              opacity: taglineEnter,
            }}>{tagline}</div>

            {/* Benefits — slide in from right */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 28 }}>
              {benefits.slice(0, 3).map((b, i) => (
                <div key={b} style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  transform: `translateX(${interpolate(benefitSprings[i], [0, 1], [60, 0])}px)`,
                  opacity: benefitSprings[i],
                }}>
                  <div style={{
                    width: AD.CHECK_SIZE, height: AD.CHECK_SIZE, borderRadius: '50%',
                    backgroundColor: `${theme.accent}22`, border: `2px solid ${theme.accent}`,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ color: theme.accent, fontSize: 20, fontWeight: 700 }}>✓</span>
                  </div>
                  <span style={{
                    fontSize: AD.BENEFIT, fontWeight: 600, fontFamily: FONTS.body,
                    color: theme.textPrimary,
                  }}>{b}</span>
                </div>
              ))}
            </div>

            {/* Divider + Trust section */}
            <div style={{
              opacity: trustEnter,
              transform: `translateY(${interpolate(trustEnter, [0, 1], [10, 0])}px)`,
            }}>
              <OrnamentalDivider color={theme.accent} enterDelay={240} />

              {/* Trust signal */}
              <div style={{
                fontSize: AD.TRUST, fontWeight: 600, fontFamily: FONTS.heading,
                color: theme.textPrimary, marginTop: 20,
                opacity: trustEnter,
              }}>{trustSignal}</div>

              {/* Differentiator */}
              <div style={{
                fontSize: AD.DIFF, fontWeight: 400, fontFamily: FONTS.body,
                color: theme.textSecondary, marginTop: 8,
                opacity: diffEnter,
                transform: `translateY(${interpolate(diffEnter, [0, 1], [8, 0])}px)`,
              }}>{differentiator}</div>
            </div>
          </div>

          {/* ── Phase 4: Brand reveal ──────────────────── */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center',
            paddingRight: 80, paddingLeft: 40,
            opacity: interpolate(brandEnter, [0, 1], [0, 1]),
            transform: `scale(${interpolate(brandEnter, [0, 1], [0.95, 1])})`,
            pointerEvents: 'none',
          }}>
            <Img src={staticFile('logos/logo-white.png')} style={{
              height: AD.LOGO_H,
              filter: `drop-shadow(0 4px 12px ${theme.accent}44)`,
              marginBottom: 16,
            }} />
            <div style={{
              fontSize: AD.BRAND_TAG, fontWeight: 600, fontFamily: FONTS.heading,
              color: theme.textPrimary, letterSpacing: 2, textTransform: 'uppercase',
              textAlign: 'center',
            }}>{brandTagline}</div>
          </div>
        </div>
      </AbsoluteFill>

      {/* Safe zone indicator — lower-right is Amazon mute button area */}
      {/* No text placed there by design */}
    </AdBackground>
  );
};
