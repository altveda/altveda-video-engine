import React from 'react';
import {
  AbsoluteFill, Audio, Img, Sequence,
  Easing, interpolate, staticFile,
  useCurrentFrame, useVideoConfig,
} from 'remotion';
import { resolveV2Product } from '../../brand';
import { FONTS } from '../shared/fonts';
import { GrainOverlay } from '../shared/GlassCard';
import { CaptionOverlay, type CaptionWord } from '../CaptionOverlay';

export type ProductCardProps = {
  productName: string;
  tagline: string;
  benefits: string[];
  price?: string;
  cta?: string;
  backgroundImage: string;
  musicTrack?: string;
  voiceoverSrc?: string;
  musicVolume?: number;
  durationInFrames?: number;
  captions?: CaptionWord[];
  captionStartFrame?: number;
};

const FontLoader: React.FC = () => (
  <style>{`
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-Bold.ttf')}') format('truetype'); font-weight: 700; }
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-SemiBold.ttf')}') format('truetype'); font-weight: 600; }
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-Regular.ttf')}') format('truetype'); font-weight: 400; }
    @font-face { font-family: 'Lora'; src: url('${staticFile('fonts/Lora-VariableFont_wght.ttf')}') format('truetype'); font-weight: 400 700; }
    @font-face { font-family: 'Lora'; src: url('${staticFile('fonts/Lora-Italic-VariableFont_wght.ttf')}') format('truetype'); font-style: italic; }
  `}</style>
);

const EASE = Easing.bezier(0.25, 0.1, 0.25, 1);

/*
 * LAYOUT: 3-point focal system on dark background
 * Following rule of thirds (3 × 640px zones)
 *
 * ┌──────────────────┐
 * │    ALTVEDA        │  watermark (top safe)
 * │                   │
 * │   ┌───────────┐  │  ZONE 1: HOOK (0-640px)
 * │   │  product   │  │  Product hero with accent glow
 * │   │  bottle    │  │  Focal point #1 (primary)
 * │   │  (40%)     │  │
 * │   └───────────┘  │
 * │                   │
 * │  ASHWAGANDHA      │  ZONE 2: STORY (640-1280px)
 * │  The Ancient...   │  Product name + tagline + benefits
 * │  · Benefit 1      │
 * │  · Benefit 2      │
 * │  · Benefit 3      │
 * │                   │
 * │    ┌─ ₹349 ─┐    │  ZONE 3: ACTION (1280-1920px)
 * │    └─────────┘    │  Focal point #2 (price)
 * │   Shop Now →      │  Focal point #3 (CTA)
 * │    altveda.in     │
 * └──────────────────┘
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  productName, tagline, benefits, price, cta,
  backgroundImage, musicTrack,
  voiceoverSrc, musicVolume = 0.22, captions, captionStartFrame = 20,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames: TOTAL } = useVideoConfig();
  const theme = resolveV2Product(backgroundImage);

  const exit = interpolate(frame, [TOTAL - 25, TOTAL - 5], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Staggered reveals — KB: each element 15+ frames apart
  const bgIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp', easing: EASE });
  const glowIn = interpolate(frame, [5, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const bottleIn = interpolate(frame, [8, 38], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const nameIn = interpolate(frame, [35, 58], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const taglineIn = interpolate(frame, [52, 72], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const benefitsIn = interpolate(frame, [68, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const priceIn = interpolate(frame, [90, 115], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const ctaIn = interpolate(frame, [110, 135], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });

  // Bottle float — KB: Math.sin(frame/55)*5, subtle 5px amplitude
  const bottleFloat = Math.sin(frame / 55) * 5;

  // Glow pulse — KB: single source, subtle breathing
  const glowPulse = 1 + Math.sin(frame / 35) * 0.06;

  // Product PNGs are 512x512 with padding — actual bottle fills ~70%
  // Scale to ~1100px so visible bottle appears at ~770px (40% of 1920)
  const BOTTLE_SIZE = 860;

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <FontLoader />

      {/* DARK BASE — KB: #0c0c0c to #1a1a1a, NOT pastel */}
      <AbsoluteFill style={{ background: '#0e0e0e' }} />

      {/* Subtle accent gradient — just a hint of product color in the dark */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 120% 60% at 50% 30%, ${theme.accent}18, transparent 70%)`,
        opacity: bgIn,
      }} />

      {/* Diagonal accent stripe — energy element */}
      <div style={{
        position: 'absolute',
        top: -300, right: -150,
        width: 500, height: 2400,
        background: `linear-gradient(180deg, ${theme.accent}08, transparent 60%)`,
        transform: 'rotate(18deg)',
        opacity: bgIn,
      }} />

      <GrainOverlay opacity={0.02} />

      {/* Watermark — white on dark */}
      <div style={{
        position: 'absolute', top: 36, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        opacity: bgIn * 0.3,
      }}>
        <span style={{
          fontFamily: FONTS.heading, fontSize: 22, fontWeight: 600,
          color: '#ffffff', letterSpacing: 6, textTransform: 'uppercase',
        }}>
          AltVeda
        </span>
      </div>

      {/* ══════ ZONE 1: HOOK — Product Hero (0-640px) ══════ */}

      {/* Accent glow behind product — KB: single radial, accent at 15-25% */}
      <div style={{
        position: 'absolute',
        top: 60, left: '50%',
        transform: `translate(-50%, 0) scale(${glowPulse})`,
        width: BOTTLE_SIZE + 120, height: BOTTLE_SIZE,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.accent}22, ${theme.accent}08 50%, transparent 72%)`,
        opacity: glowIn,
      }} />

      {/* Product bottle — focal point #1 */}
      <div style={{
        position: 'absolute',
        top: 60,
        left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
      }}>
        <Img
          src={staticFile(`products/${backgroundImage}`)}
          style={{
            height: BOTTLE_SIZE,
            opacity: bottleIn,
            transform: `translateY(${interpolate(bottleIn, [0, 1], [40, 0]) + bottleFloat}px)`,
            filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.4))',
          }}
        />
      </div>

      {/* ══════ ZONE 2: STORY — Text content (640-1280px) ══════ */}
      <div style={{
        position: 'absolute',
        top: BOTTLE_SIZE + 40,
        left: 60,
        right: 60,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
      }}>
        {/* Product name — KB: 64-80px, white on dark, primary focal text */}
        <div style={{
          fontFamily: FONTS.heading, fontSize: 72, fontWeight: 700,
          color: '#ffffff', textAlign: 'center', lineHeight: 1.1,
          opacity: nameIn,
          transform: `translateY(${interpolate(nameIn, [0, 1], [20, 0])}px)`,
        }}>
          {productName}
        </div>

        {/* Tagline — KB: 40-48px italic, 60-70% white */}
        <div style={{
          fontFamily: FONTS.serif, fontStyle: 'italic',
          fontSize: 42, fontWeight: 400,
          color: 'rgba(255,255,255,0.6)', textAlign: 'center',
          opacity: taglineIn,
          marginBottom: 6,
        }}>
          {tagline}
        </div>

        {/* Benefits — KB: 40-48px, accent dots, stagger i*8 frames */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 12,
          alignItems: 'center',
          opacity: benefitsIn,
          transform: `translateY(${interpolate(benefitsIn, [0, 1], [12, 0])}px)`,
        }}>
          {benefits.map((benefit, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              opacity: interpolate(frame, [68 + i * 8, 85 + i * 8], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
              }),
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                backgroundColor: theme.accent, opacity: 0.9,
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: FONTS.body, fontSize: 42, fontWeight: 500,
                color: 'rgba(255,255,255,0.7)',
              }}>
                {benefit}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════ ZONE 3: ACTION — Price + CTA (1280-1920px) ══════ */}

      {/* Price — focal point #2, accent pill, highest color contrast */}
      {price && (
        <div style={{
          position: 'absolute',
          bottom: 280,
          left: 0, right: 0,
          display: 'flex', justifyContent: 'center',
          opacity: priceIn,
          transform: `scale(${interpolate(priceIn, [0, 1], [0.85, 1])})`,
        }}>
          <div style={{
            backgroundColor: theme.accent,
            padding: '14px 56px', borderRadius: 44,
            boxShadow: `0 12px 40px ${theme.accent}40`,
          }}>
            <span style={{
              fontFamily: FONTS.heading, fontSize: 60, fontWeight: 700,
              color: '#ffffff',
            }}>
              {price}
            </span>
          </div>
        </div>
      )}

      {/* CTA — focal point #3, white button for contrast on dark */}
      {cta && (
        <div style={{
          position: 'absolute',
          bottom: 200,
          left: 0, right: 0,
          display: 'flex', justifyContent: 'center',
          opacity: ctaIn,
        }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.12)',
            border: '1.5px solid rgba(255,255,255,0.25)',
            padding: '12px 40px', borderRadius: 36,
          }}>
            <span style={{
              fontFamily: FONTS.body, fontSize: 36, fontWeight: 600,
              color: '#ffffff',
              letterSpacing: 1,
            }}>
              {cta}
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: 30, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        opacity: ctaIn * 0.2,
      }}>
        <span style={{
          fontFamily: FONTS.body, fontSize: 22, fontWeight: 400,
          color: 'rgba(255,255,255,0.4)', letterSpacing: 3,
        }}>
          altveda.in
        </span>
      </div>

      {captions && captions.length > 0 && (
        <CaptionOverlay captions={captions} startFrame={captionStartFrame} accentColor={theme.accent} />
      )}
      {musicTrack && (
        <Audio src={staticFile(`music/${musicTrack}`)} volume={voiceoverSrc ? musicVolume : 0.3} startFrom={0} />
      )}
      {voiceoverSrc && (
        <Sequence from={10}><Audio src={staticFile(voiceoverSrc)} volume={1} /></Sequence>
      )}
    </AbsoluteFill>
  );
};
