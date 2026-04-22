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

export type ComboProduct = {
  name: string;
  image: string; // e.g. "ashwagandha.png"
};

export type ComboCardProps = {
  products: ComboProduct[];
  bundleName: string;
  tagline: string;
  bundlePrice: string;
  originalPrice?: string;
  cta?: string;
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
 * LAYOUT: Product combo / bundle promo on dark background
 * 3-point focal: Bottle group → Bundle price → CTA
 *
 * ┌──────────────────┐
 * │    ALTVEDA        │  watermark
 * │                   │
 * │  ┌──┐ ┌──┐ ┌──┐ │  ZONE 1: Bottles in fan/overlap
 * │  │  │ │  │ │  │  │  Center bottle forward, sides angled
 * │  │  │ │  │ │  │  │  Each enters with stagger
 * │  └──┘ └──┘ └──┘  │
 * │                   │
 * │  ── + ── + ──     │  Thin connector line
 * │                   │
 * │  STRESS RELIEF    │  ZONE 2: Bundle name
 * │  BUNDLE           │  + tagline
 * │                   │
 * │  ₹899  ₹1,047    │  ZONE 3: Price with strikethrough
 * │  Shop Now →       │  CTA
 * │    altveda.in     │
 * └──────────────────┘
 */
export const ComboCard: React.FC<ComboCardProps> = ({
  products, bundleName, tagline, bundlePrice, originalPrice, cta,
  musicTrack, voiceoverSrc, musicVolume = 0.22, captions, captionStartFrame = 20,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames: TOTAL } = useVideoConfig();

  // Use the first product's theme for accent color
  const theme = resolveV2Product(products[0]?.image);

  const exit = interpolate(frame, [TOTAL - 25, TOTAL - 5], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Staggered reveals
  const bgIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp', easing: EASE });

  // Each bottle enters with stagger
  const bottleIns = products.map((_, i) =>
    interpolate(frame, [10 + i * 12, 40 + i * 12], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE,
    })
  );

  const connectorIn = interpolate(frame, [50, 75], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const nameIn = interpolate(frame, [60, 85], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const taglineIn = interpolate(frame, [78, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const priceIn = interpolate(frame, [95, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const ctaIn = interpolate(frame, [115, 140], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });

  // Subtle float for center bottle
  const centerFloat = Math.sin(frame / 55) * 4;

  // Glow pulse
  const glowPulse = 1 + Math.sin(frame / 35) * 0.05;

  const count = products.length;
  // Bottle sizing: smaller per bottle when more products
  const BOTTLE_H = count <= 2 ? 620 : 520;

  // Fan layout positions — bottles overlap slightly, center is forward
  const getBottlePosition = (index: number, total: number) => {
    if (total === 1) return { x: 0, rotate: 0, z: 1, scale: 1 };
    if (total === 2) {
      const positions = [
        { x: -160, rotate: -6, z: 0, scale: 0.92 },
        { x: 160, rotate: 6, z: 1, scale: 1 },
      ];
      return positions[index];
    }
    // 3 products: fan layout, center forward
    const positions = [
      { x: -220, rotate: -8, z: 0, scale: 0.85 },
      { x: 0, rotate: 0, z: 2, scale: 1 },
      { x: 220, rotate: 8, z: 1, scale: 0.85 },
    ];
    return positions[index] || positions[0];
  };

  // Collect accent colors from all products for the connector dots
  const accents = products.map(p => resolveV2Product(p.image).accent);

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <FontLoader />

      {/* Dark base */}
      <AbsoluteFill style={{ background: '#0e0e0e' }} />

      {/* Subtle multi-accent gradient — blend of all product colors */}
      <AbsoluteFill style={{
        background: count >= 3
          ? `radial-gradient(ellipse 80% 50% at 30% 35%, ${accents[0]}12, transparent 60%),
             radial-gradient(ellipse 80% 50% at 70% 35%, ${accents[2]}12, transparent 60%)`
          : `radial-gradient(ellipse 120% 60% at 50% 30%, ${theme.accent}14, transparent 70%)`,
        opacity: bgIn,
      }} />

      <GrainOverlay opacity={0.02} />

      {/* Watermark */}
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

      {/* ══════ ZONE 1: HOOK — Product bottles in fan layout ══════ */}

      {/* Glow behind bottle group */}
      <div style={{
        position: 'absolute',
        top: 100, left: '50%',
        transform: `translate(-50%, 0) scale(${glowPulse})`,
        width: count <= 2 ? 700 : 900,
        height: BOTTLE_H + 60,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.accent}18, transparent 65%)`,
        opacity: bgIn,
      }} />

      {/* Bottles — rendered in z-order */}
      <div style={{
        position: 'absolute',
        top: 80,
        left: 0, right: 0,
        height: BOTTLE_H + 40,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
      }}>
        {products
          .map((product, i) => ({ product, i, pos: getBottlePosition(i, count) }))
          .sort((a, b) => a.pos.z - b.pos.z) // render back-to-front
          .map(({ product, i, pos }) => {
            const bottleIn = bottleIns[i];
            const isCenter = pos.z === Math.max(...products.map((_, j) => getBottlePosition(j, count).z));
            return (
              <Img
                key={i}
                src={staticFile(`products/${product.image}`)}
                style={{
                  position: 'absolute',
                  height: BOTTLE_H * pos.scale,
                  opacity: bottleIn,
                  transform: `translateX(${pos.x}px) translateY(${interpolate(bottleIn, [0, 1], [40, 0]) + (isCenter ? centerFloat : 0)}px) rotate(${pos.rotate}deg)`,
                  filter: `drop-shadow(0 25px 50px rgba(0,0,0,${isCenter ? 0.4 : 0.25}))`,
                  zIndex: pos.z,
                }}
              />
            );
          })}
      </div>

      {/* ══════ Connector — "+" dots between product names ══════ */}
      <div style={{
        position: 'absolute',
        top: BOTTLE_H + 100,
        left: 0, right: 0,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: 16,
        opacity: connectorIn,
      }}>
        {products.map((product, i) => {
          const pTheme = resolveV2Product(product.image);
          return (
            <React.Fragment key={i}>
              {i > 0 && (
                <span style={{
                  fontFamily: FONTS.heading, fontSize: 36, fontWeight: 300,
                  color: 'rgba(255,255,255,0.3)',
                }}>
                  +
                </span>
              )}
              <span style={{
                fontFamily: FONTS.body, fontSize: 34, fontWeight: 500,
                color: pTheme.accent,
              }}>
                {product.name}
              </span>
            </React.Fragment>
          );
        })}
      </div>

      {/* ══════ ZONE 2: STORY — Bundle name + tagline ══════ */}
      <div style={{
        position: 'absolute',
        top: BOTTLE_H + 160,
        left: 60, right: 60,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
      }}>
        {/* Bundle name */}
        <div style={{
          fontFamily: FONTS.heading, fontSize: 64, fontWeight: 700,
          color: '#ffffff', textAlign: 'center', lineHeight: 1.15,
          opacity: nameIn,
          transform: `translateY(${interpolate(nameIn, [0, 1], [20, 0])}px)`,
        }}>
          {bundleName}
        </div>

        {/* Tagline */}
        <div style={{
          fontFamily: FONTS.serif, fontStyle: 'italic',
          fontSize: 40, fontWeight: 400,
          color: 'rgba(255,255,255,0.55)', textAlign: 'center',
          opacity: taglineIn,
          lineHeight: 1.4,
          maxWidth: 850,
        }}>
          {tagline}
        </div>
      </div>

      {/* ══════ ZONE 3: ACTION — Price + CTA ══════ */}

      {/* Price — bundle price with optional strikethrough original */}
      <div style={{
        position: 'absolute',
        bottom: 280,
        left: 0, right: 0,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: 20,
        opacity: priceIn,
        transform: `scale(${interpolate(priceIn, [0, 1], [0.85, 1])})`,
      }}>
        <div style={{
          backgroundColor: theme.accent,
          padding: '14px 48px', borderRadius: 44,
          boxShadow: `0 12px 40px ${theme.accent}40`,
        }}>
          <span style={{
            fontFamily: FONTS.heading, fontSize: 56, fontWeight: 700,
            color: '#ffffff',
          }}>
            {bundlePrice}
          </span>
        </div>
        {originalPrice && (
          <span style={{
            fontFamily: FONTS.heading, fontSize: 40, fontWeight: 500,
            color: 'rgba(255,255,255,0.35)',
            textDecoration: 'line-through',
          }}>
            {originalPrice}
          </span>
        )}
      </div>

      {/* CTA */}
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
