import React from 'react';
import {
  AbsoluteFill, Audio, Img, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import { BRAND, V2_PRODUCTS } from '../../brand';
import { GrainOverlay, BotanicalOverlay, Watermark } from '../shared/GlassCard';
import { LottieLayer } from '../shared/LottieLayer';
import { FONTS, SIZE, PRODUCT } from '../shared/fonts';
import type { CaptionWord } from '../CaptionOverlay';

export type ProductGridProps = {
  products?: { name: string; key?: string; tagline: string; benefit: string; price: string }[];
  cta?: string;
  musicTrack?: string;
  voiceoverSrc?: string;
  musicVolume?: number;
  durationInFrames?: number;
  backgroundImage?: string;
  captions?: CaptionWord[];
  captionStartFrame?: number;
};

const DEFAULT_PRODUCTS = [
  { name: 'Ashwagandha', key: 'ashwagandha', tagline: 'Strength of a Horse', benefit: 'Stress & Sleep', price: '₹349' },
  { name: 'Amla', key: 'amla', tagline: 'The Golden Berry', benefit: 'Immunity & Skin', price: '₹299' },
  { name: 'Curcumin', key: 'curcumin', tagline: 'Golden Healer', benefit: 'Joints & Recovery', price: '₹399' },
  { name: 'Moringa', key: 'moringa', tagline: 'The Miracle Tree', benefit: 'Energy & Nutrition', price: '₹329' },
  { name: 'Shatavari', key: 'shatavari', tagline: 'Queen of Herbs', benefit: 'Hormonal Balance', price: '₹349' },
];

const FontLoader: React.FC = () => (
  <style>{`
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-Bold.ttf')}') format('truetype'); font-weight: 700; }
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-SemiBold.ttf')}') format('truetype'); font-weight: 600; }
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-Regular.ttf')}') format('truetype'); font-weight: 400; }
    @font-face { font-family: 'Lora'; src: url('${staticFile('fonts/Lora-Italic-VariableFont_wght.ttf')}') format('truetype'); font-weight: 400 700; font-style: italic; }
  `}</style>
);

export const ProductGrid: React.FC<ProductGridProps> = ({
  products = DEFAULT_PRODUCTS,
  cta = 'Visit altveda.in →',
  musicTrack, voiceoverSrc, musicVolume,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: TOTAL } = useVideoConfig();

  const exit = interpolate(frame, [TOTAL - 15, TOTAL], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const titleReveal = spring({ frame, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, #FAF7F2, #F5F1EA)`, overflow: 'hidden',
    }}>
      <FontLoader />

      {/* Subtle panoramic strip */}
      <div style={{ position: 'absolute', top: '30%', left: 0, right: 0, height: '40%', opacity: 0.08, overflow: 'hidden' }}>
        {(['ashwagandha', 'amla', 'curcumin', 'moringa', 'shatavari'] as const).map((key, i) => (
          <Img key={key} src={staticFile(`backgrounds/${key}.png`)} style={{
            position: 'absolute', width: '50%', height: '100%', left: `${i * 20}%`,
            objectFit: 'cover', filter: 'blur(3px)',
          }} />
        ))}
      </div>

      <LottieLayer src="lottie/floating-leaves.json" width={1080} height={1920}
        enterDelay={5} exitFrame={TOTAL - 10} opacity={0.06} playbackRate={0.4}
        style={{ position: 'absolute', inset: 0 }} />
      <BotanicalOverlay opacity={0.03} />
      <GrainOverlay opacity={0.03} />
      <Watermark color={BRAND.sage} />

      {musicTrack && (
        <Audio src={staticFile(`music/${musicTrack}`)} volume={voiceoverSrc ? (musicVolume ?? 0.22) : 0.3} />
      )}
      {voiceoverSrc && (
        <Sequence from={10}><Audio src={staticFile(voiceoverSrc)} volume={1} /></Sequence>
      )}

      <AbsoluteFill style={{ opacity: exit }}>
        {/* Header */}
        <div style={{
          position: 'absolute', top: 80, left: 0, right: 0, textAlign: 'center',
          opacity: titleReveal, transform: `translateY(${interpolate(titleReveal, [0, 1], [15, 0])}px)`,
        }}>
          <div style={{ fontSize: SIZE.LABEL, fontWeight: 700, fontFamily: FONTS.heading, color: BRAND.sage, letterSpacing: 4, textTransform: 'uppercase' }}>
            Pure Ayurvedic Supplements
          </div>
          <div style={{ fontSize: SIZE.SUBTITLE, fontWeight: 700, fontFamily: FONTS.heading, color: '#2C2C2C', marginTop: 8 }}>
            Our Wellness Range
          </div>
          <div style={{ width: 80, height: 3, backgroundColor: BRAND.gold, margin: '12px auto 0', borderRadius: 2 }} />
        </div>

        {/* Product grid */}
        <div style={{
          position: 'absolute', top: 220, left: 32, right: 32,
          display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center',
        }}>
          {products.map((p, i) => {
            const productKey = p.key || p.name.toLowerCase();
            const pTheme = V2_PRODUCTS[productKey] || V2_PRODUCTS.moringa;
            const cardSpring = spring({ frame: frame - 15 - i * 12, fps, config: { damping: 12, stiffness: 60 } });
            const isWide = i === products.length - 1 && products.length % 2 === 1;
            const floatY = Math.sin(frame / 18 + i * 1.5) * 3;

            return (
              <div key={productKey} style={{
                width: isWide ? 'calc(100% - 20px)' : 'calc(50% - 12px)',
                background: `linear-gradient(160deg, ${pTheme.gradient[0]}, ${pTheme.gradient[1]}88)`,
                borderRadius: 28, border: `1.5px solid ${pTheme.accent}33`,
                padding: isWide ? '32px 36px' : '28px 24px',
                display: 'flex', flexDirection: isWide ? 'row' : 'column',
                alignItems: 'center', gap: isWide ? 28 : 16,
                opacity: cardSpring,
                transform: `translateY(${interpolate(cardSpring, [0, 1], [20, 0]) + floatY}px) scale(${interpolate(cardSpring, [0, 1], [0.95, 1])})`,
                boxShadow: `0 8px 24px ${pTheme.accent}15`,
              }}>
                <Img src={staticFile(`products/${productKey}.png`)} style={{
                  width: isWide ? PRODUCT.THUMB_SIZE : PRODUCT.THUMB_SIZE, height: isWide ? PRODUCT.THUMB_SIZE : PRODUCT.THUMB_SIZE, objectFit: 'contain', flexShrink: 0,
                  filter: `drop-shadow(0 4px 12px ${pTheme.accent}44)`,
                }} />
                <div style={{ textAlign: isWide ? 'left' : 'center', flex: 1 }}>
                  <div style={{ fontSize: SIZE.BODY_SM, fontWeight: 700, fontFamily: FONTS.heading, color: pTheme.textPrimary, lineHeight: 1.2 }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: SIZE.LABEL, fontFamily: FONTS.serif, fontStyle: 'italic', color: pTheme.accent, marginTop: 2 }}>
                    {p.tagline}
                  </div>
                  <div style={{ fontSize: SIZE.LABEL, fontFamily: FONTS.body, color: pTheme.textSecondary, marginTop: 6 }}>
                    {p.benefit}
                  </div>
                </div>
                <div style={{ backgroundColor: `${pTheme.accent}22`, borderRadius: 16, padding: '8px 20px', alignSelf: isWide ? 'center' : 'auto' }}>
                  <span style={{ fontSize: SIZE.BODY_SM, fontWeight: 800, color: pTheme.accent, fontFamily: FONTS.heading }}>{p.price}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{
          position: 'absolute', bottom: 100, left: 0, right: 0, textAlign: 'center',
          opacity: spring({ frame: frame - 90, fps, config: { damping: 14 } }),
        }}>
          <div style={{
            display: 'inline-block', backgroundColor: BRAND.sage, borderRadius: 32,
            padding: '18px 44px', boxShadow: `0 6px 20px ${BRAND.sage}33`,
          }}>
            <span style={{ color: '#fff', fontSize: SIZE.CTA_BUTTON, fontWeight: 700, fontFamily: FONTS.heading, letterSpacing: 1 }}>
              {cta}
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
