import React from 'react';
import {
  AbsoluteFill, Audio, Img, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import { BRAND, resolveV2Product } from '../../brand';
import { GlassCard, Watermark, OrnamentalDivider, ProductBackground } from '../shared/GlassCard';
import { LottieLayer } from '../shared/LottieLayer';
import { FONTS, SIZE, PRODUCT, LAYOUT } from '../shared/fonts';
import type { CaptionWord } from '../CaptionOverlay';

// ─── Props ───────────────────────────────────────────────────
export type AmazonProductAdPortraitProps = {
  product?: string;
  productName?: string;
  tagline?: string;
  benefits?: string[];
  trustSignal?: string;
  differentiator?: string;
  brandTagline?: string;
  musicTrack?: string;
  voiceoverSrc?: string;
  voiceoverScript?: string;
  musicVolume?: number;
  durationInFrames?: number;
  backgroundImage?: string;
  captions?: CaptionWord[];
  captionStartFrame?: number;
};

const FontLoader: React.FC = () => (
  <style>{`
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-Bold.ttf')}') format('truetype'); font-weight: 700; }
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-SemiBold.ttf')}') format('truetype'); font-weight: 600; }
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-Regular.ttf')}') format('truetype'); font-weight: 400; }
    @font-face { font-family: 'Lora'; src: url('${staticFile('fonts/Lora-Italic-VariableFont_wght.ttf')}') format('truetype'); font-weight: 400 700; font-style: italic; }
  `}</style>
);

// ─── Main Composition ────────────────────────────────────────
export const AmazonProductAdPortrait: React.FC<AmazonProductAdPortraitProps> = ({
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

  // ─── Global exit ─────────────────────────────────────────
  const exit = interpolate(frame, [TOTAL - 25, TOTAL - 5], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ─── PHASE 1: Product entrance (0-2.5s) ──────────────────
  const bottleEnter = spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 50 } });
  const bottleFloat = Math.sin(frame / 20) * 6;

  // ─── PHASE 2: Benefits (2.5-8s) ───────────────────────────
  const benefitSprings = benefits.slice(0, 3).map((_, i) =>
    spring({ frame: frame - 75 - i * 18, fps, config: { damping: 14, stiffness: 60 } })
  );

  // ─── PHASE 3: Trust (8-13s) ───────────────────────────────
  const trustEnter = spring({ frame: frame - 240, fps, config: { damping: 14 } });
  const diffEnter = spring({ frame: frame - 280, fps, config: { damping: 14 } });

  // ─── PHASE 4: Brand (14-18s) ──────────────────────────────
  const brandPhase = spring({ frame: frame - 420, fps, config: { damping: 14, stiffness: 40 } });
  const contentFade = interpolate(frame, [410, 430], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Orbiting accent particles around bottle
  const orbits = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2 + frame * 0.02;
    return { x: Math.cos(angle) * 180, y: Math.sin(angle) * 180 * 0.5, size: 8 + (i % 3) * 4 };
  });

  return (
    <ProductBackground product={theme} productKey={resolvedKey}>
      <FontLoader />
      <Watermark color={theme.accent} variant="badge" />

      {/* Audio */}
      {musicTrack && (
        <Audio src={staticFile(`music/${musicTrack}`)} volume={voiceoverSrc ? (musicVolume ?? 0.22) : 0.35} />
      )}
      {voiceoverSrc && (
        <Sequence from={5}><Audio src={staticFile(voiceoverSrc)} volume={1} /></Sequence>
      )}

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingTop: LAYOUT.TOP_SAFE, paddingBottom: LAYOUT.BOTTOM_SAFE, opacity: exit }}>
        <GlassCard width="92%" padding={44} noBlur>

          {/* Product name — bold, big */}
          <div style={{
            fontSize: SIZE.TITLE + 12, fontWeight: 700, fontFamily: FONTS.heading,
            color: theme.textPrimary, textAlign: 'center', lineHeight: 1.15,
            letterSpacing: 1,
          }}>{productName}</div>

          {/* Tagline — italic accent */}
          <div style={{
            fontSize: SIZE.BODY_LG, fontFamily: FONTS.serif, fontStyle: 'italic',
            color: theme.textSecondary, textAlign: 'center',
          }}>{tagline}</div>

          <OrnamentalDivider color={theme.accent} enterDelay={20} />

          {/* Product bottle — hero with particles (15% larger) */}
          <div style={{
            position: 'relative', width: (PRODUCT.HERO_SIZE + 40) * 1.15, height: (PRODUCT.HERO_SIZE + 40) * 1.15,
            transform: `translateY(${bottleFloat}px) scale(${bottleEnter})`,
          }}>
            {/* Accent ring glow */}
            <div style={{
              position: 'absolute', inset: -30, borderRadius: '50%',
              background: `conic-gradient(from ${frame * 1.5}deg, ${theme.accent}44, transparent, ${BRAND.gold}44, transparent)`,
            }} />
            <Img src={staticFile(`products/${resolvedKey}.png`)} style={{
              width: (PRODUCT.HERO_SIZE + 40) * 1.15, height: (PRODUCT.HERO_SIZE + 40) * 1.15, objectFit: 'contain',
              filter: `drop-shadow(0 16px 40px rgba(0,0,0,0.35))`,
            }} />
            <LottieLayer src="lottie/sparkle-burst.json" width={PRODUCT.HERO_SIZE + 100} height={PRODUCT.HERO_SIZE + 100}
              enterDelay={30} exitFrame={TOTAL - 25} opacity={0.2} playbackRate={0.5}
              style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
            {orbits.map((o, i) => (
              <div key={i} style={{
                position: 'absolute', left: '50%', top: '50%',
                width: o.size, height: o.size, borderRadius: '50%', backgroundColor: `${theme.accent}55`,
                transform: `translate(calc(-50% + ${o.x}px), calc(-50% + ${o.y}px))`,
              }} />
            ))}
          </div>

          {/* Content that fades for brand phase */}
          <div style={{ opacity: contentFade, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            {/* Benefits — pill badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', width: '100%' }}>
              {benefits.slice(0, 3).map((b, i) => (
                <div key={b} style={{
                  backgroundColor: `${theme.accent}18`, border: `1px solid ${theme.accent}35`,
                  borderRadius: 28, padding: '14px 32px',
                  transform: `scale(${benefitSprings[i]})`, opacity: benefitSprings[i],
                }}>
                  <span style={{
                    fontSize: SIZE.BODY, fontWeight: 600, fontFamily: FONTS.body,
                    color: theme.textPrimary, letterSpacing: 0.5,
                  }}>
                    ✦ {b}
                  </span>
                </div>
              ))}
            </div>

            {/* Trust signal + differentiator */}
            <div style={{
              marginTop: 8, textAlign: 'center',
              opacity: trustEnter,
              transform: `translateY(${interpolate(trustEnter, [0, 1], [12, 0])}px)`,
            }}>
              <div style={{
                fontSize: SIZE.BODY_SM, fontWeight: 700, fontFamily: FONTS.heading,
                color: theme.accent,
              }}>{trustSignal}</div>
              <div style={{
                fontSize: SIZE.LABEL + 4, fontWeight: 500, fontFamily: FONTS.body,
                color: theme.textSecondary, marginTop: 6,
                opacity: diffEnter,
              }}>{differentiator}</div>
            </div>
          </div>

          {/* ─── BRAND REVEAL (replaces content) ────────── */}
          {brandPhase > 0.01 && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center',
              borderRadius: 48,
              background: `linear-gradient(160deg, rgba(255,255,255,0.35), rgba(255,255,255,0.15))`,
              opacity: brandPhase,
            }}>
              <Img src={staticFile('logos/logo-white.png')} style={{
                height: 100,
                filter: `drop-shadow(0 4px 16px rgba(0,0,0,0.3))`,
                marginBottom: 16,
                transform: `scale(${interpolate(brandPhase, [0, 1], [0.85, 1])})`,
              }} />
              {/* ALTVEDA brand name — explicit text since logo PNG is icon-only */}
              <div style={{
                fontSize: 56, fontWeight: 700, fontFamily: FONTS.heading,
                color: theme.textPrimary, letterSpacing: 8, textTransform: 'uppercase',
                textShadow: '0 2px 8px rgba(0,0,0,0.15)',
                marginBottom: 12,
              }}>ALTVEDA</div>
              <div style={{
                fontSize: SIZE.BODY_SM, fontWeight: 500, fontFamily: FONTS.body,
                color: theme.textSecondary, letterSpacing: 3, textTransform: 'uppercase',
                opacity: interpolate(brandPhase, [0.3, 1], [0, 1], {
                  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                }),
              }}>{brandTagline}</div>
            </div>
          )}
        </GlassCard>
      </AbsoluteFill>
    </ProductBackground>
  );
};
