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

export type ProductSpotlightV2Props = {
  product?: string;         // product key: 'ashwagandha', 'amla', etc.
  headline?: string;        // product name
  subtitle?: string;        // scientific name / tagline
  benefits?: string[];      // benefit badges
  price?: string;           // e.g. '₹349'
  cta?: string;
  musicTrack?: string;
  voiceoverSrc?: string;
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

export const ProductSpotlightV2: React.FC<ProductSpotlightV2Props> = ({
  product: productKey = 'ashwagandha',
  headline = 'Ashwagandha',
  subtitle = 'Withania Somnifera — The Strength of a Horse',
  benefits = ['Stress Relief', 'Better Sleep', 'Natural Energy', 'Muscle Recovery'],
  price = '₹349',
  cta = 'Shop Now →',
  musicTrack, voiceoverSrc, musicVolume, backgroundImage,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: TOTAL } = useVideoConfig();

  const bgImage = backgroundImage || `${productKey}.png`;
  const theme = resolveV2Product(bgImage);
  const resolvedKey = bgImage.replace(/\.png$/, '');

  const exit = interpolate(frame, [TOTAL - 20, TOTAL - 10], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const bottleEnter = spring({ frame: frame - 30, fps, config: { damping: 12, stiffness: 50 } });
  const bottleFloat = Math.sin(frame / 15) * 8;
  const priceReveal = spring({ frame: frame - 80, fps, config: { damping: 10 } });

  const orbits = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2 + frame * 0.02;
    return { x: Math.cos(angle) * 240, y: Math.sin(angle) * 240 * 0.6, size: 10 + (i % 3) * 5 };
  });

  return (
    <ProductBackground product={theme} productKey={resolvedKey}>
      <FontLoader />
      <Watermark color={theme.accent} />

      {musicTrack && (
        <Audio src={staticFile(`music/${musicTrack}`)} volume={voiceoverSrc ? (musicVolume ?? 0.22) : 0.3} />
      )}
      {voiceoverSrc && (
        <Sequence from={10}><Audio src={staticFile(voiceoverSrc)} volume={1} /></Sequence>
      )}

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingTop: LAYOUT.TOP_SAFE, paddingBottom: LAYOUT.BOTTOM_SAFE, opacity: exit }}>
        <GlassCard width="92%" padding={48}>
          {/* Badge */}
          <div style={{
            backgroundColor: `${theme.accent}22`, border: `1px solid ${theme.accent}44`,
            borderRadius: 24, padding: '10px 28px', marginBottom: 8,
          }}>
            <span style={{
              fontSize: SIZE.LABEL, fontWeight: 600, fontFamily: FONTS.heading,
              color: theme.accent, letterSpacing: 3, textTransform: 'uppercase',
            }}>Product Spotlight</span>
          </div>

          {/* Product name */}
          <div style={{
            fontSize: SIZE.TITLE, fontWeight: 700, fontFamily: FONTS.heading,
            color: theme.textPrimary, textAlign: 'center', lineHeight: 1.2,
          }}>{headline}</div>
          <div style={{
            fontSize: SIZE.BODY, fontFamily: FONTS.serif, fontStyle: 'italic', color: theme.textSecondary,
            textAlign: 'center',
          }}>{subtitle}</div>

          <OrnamentalDivider color={theme.accent} enterDelay={15} />

          {/* Product bottle — HERO SIZE */}
          <div style={{
            position: 'relative', width: PRODUCT.HERO_SIZE, height: PRODUCT.HERO_SIZE,
            transform: `translateY(${bottleFloat}px) scale(${bottleEnter})`,
          }}>
            <div style={{
              position: 'absolute', inset: -30, borderRadius: '50%',
              background: `conic-gradient(from ${frame * 2}deg, ${theme.accent}44, transparent, ${BRAND.gold}44, transparent)`,
              filter: 'blur(10px)',
            }} />
            <Img src={staticFile(`products/${resolvedKey}.png`)} style={{
              width: PRODUCT.HERO_SIZE, height: PRODUCT.HERO_SIZE, objectFit: 'contain',
              filter: `drop-shadow(0 16px 40px ${theme.accent}55)`,
            }} />
            <LottieLayer src="lottie/sparkle-burst.json" width={PRODUCT.HERO_SIZE + 80} height={PRODUCT.HERO_SIZE + 80}
              enterDelay={35} exitFrame={TOTAL - 25} opacity={0.25} playbackRate={0.6}
              style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
            {orbits.map((o, i) => (
              <div key={i} style={{
                position: 'absolute', left: '50%', top: '50%',
                width: o.size, height: o.size, borderRadius: '50%', backgroundColor: `${theme.accent}66`,
                transform: `translate(calc(-50% + ${o.x}px), calc(-50% + ${o.y}px))`,
              }} />
            ))}
          </div>

          {/* Benefits */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginTop: 16 }}>
            {benefits.map((b, i) => {
              const badgeSpring = spring({ frame: frame - 50 - i * 8, fps, config: { damping: 12 } });
              return (
                <div key={b} style={{
                  backgroundColor: `${theme.accent}15`, border: `1px solid ${theme.accent}30`,
                  borderRadius: 20, padding: '12px 24px',
                  transform: `scale(${badgeSpring})`, opacity: badgeSpring,
                }}>
                  <span style={{ fontSize: SIZE.LABEL, fontWeight: 600, fontFamily: FONTS.body, color: theme.textPrimary }}>
                    ✦ {b}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Price + CTA */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 24, marginTop: 16,
            opacity: priceReveal, transform: `translateY(${interpolate(priceReveal, [0, 1], [15, 0])}px)`,
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: SIZE.LABEL, color: theme.textSecondary, fontFamily: FONTS.body }}>Starting at</div>
              <div style={{ fontSize: SIZE.PRICE, fontWeight: 800, color: theme.textPrimary, fontFamily: FONTS.heading, lineHeight: 1 }}>{price}</div>
            </div>
            <div style={{
              backgroundColor: theme.accent, borderRadius: 28, padding: '16px 36px',
              boxShadow: `0 6px 20px ${theme.accent}44`,
            }}>
              <span style={{ color: '#fff', fontSize: SIZE.CTA_BUTTON, fontWeight: 700, fontFamily: FONTS.heading, letterSpacing: 1 }}>{cta}</span>
            </div>
          </div>
        </GlassCard>
      </AbsoluteFill>
    </ProductBackground>
  );
};
