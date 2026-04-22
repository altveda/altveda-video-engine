import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { noise2D } from '@remotion/noise';
import { Star } from '@remotion/shapes';
import { BRAND, type V2ProductTheme } from '../../brand';

// ─── Glassmorphism tokens ─────────────────────────────────────
const GLASS = {
  white: 'rgba(255,255,255,0.48)',
  whiteLight: 'rgba(255,255,255,0.30)',
  border: 'rgba(255,255,255,0.50)',
  blur: 'blur(32px) saturate(2.0)',
  radius: 48,
} as const;

// ─── GlassCard ────────────────────────────────────────────────
export const GlassCard: React.FC<{
  children: React.ReactNode;
  width?: string;
  padding?: number;
  enterDelay?: number;
  opacity?: number;
  noBlur?: boolean;
}> = ({ children, width = '84%', padding = 48, enterDelay = 0, opacity = 1, noBlur = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - enterDelay, fps, config: { damping: 14, stiffness: 60 } });

  return (
    <div style={{
      width, maxWidth: 900,
      background: `linear-gradient(160deg, ${GLASS.white}, ${GLASS.whiteLight})`,
      ...(noBlur ? {} : { backdropFilter: GLASS.blur, WebkitBackdropFilter: GLASS.blur }),
      borderRadius: GLASS.radius, border: `2px solid ${GLASS.border}`,
      padding,
      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.3), 0 20px 60px rgba(0,0,0,0.22)`,
      transform: `scale(${interpolate(enter, [0, 1], [0.9, 1])}) translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
      opacity: enter * opacity,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
    }}>
      {children}
    </div>
  );
};

// ─── GrainOverlay ─────────────────────────────────────────────
export const GrainOverlay: React.FC<{ opacity?: number }> = ({ opacity = 0.04 }) => {
  const frame = useCurrentFrame();
  const grainDots = Array.from({ length: 200 }, (_, i) => {
    const x = ((i * 137.508) % 100);
    const y = ((i * 97.31) % 100);
    const n = noise2D('grain', x + frame * 0.5, y + frame * 0.3);
    return { x, y, opacity: Math.max(0, n) };
  });

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: opacity * 0.8 }}>
        <filter id="grain-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" seed={Math.floor(frame / 3)} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" opacity="0.5" />
      </svg>
      {grainDots.map((dot, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${dot.x}%`, top: `${dot.y}%`,
          width: 1.5, height: 1.5, borderRadius: '50%',
          backgroundColor: '#ffffff', opacity: dot.opacity * opacity * 2,
        }} />
      ))}
    </div>
  );
};

// ─── BotanicalOverlay ─────────────────────────────────────────
export const BotanicalOverlay: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', inset: -50, opacity, pointerEvents: 'none' }}>
      {Array.from({ length: 16 }, (_, i) => {
        const baseX = ((i * 137.5) % 120) - 10;
        const baseY = ((i * 97.3) % 120) - 10;
        const driftX = noise2D('leaf-x', i, frame * 0.01) * 15;
        const driftY = noise2D('leaf-y', i, frame * 0.008) * 10;
        const rotation = i * 30 + noise2D('leaf-r', i, frame * 0.005) * 10;
        const size = 35 + (i % 4) * 18;
        const leafOpacity = 0.5 + noise2D('leaf-o', i, frame * 0.02) * 0.3;
        return (
          <div key={i} style={{
            position: 'absolute', left: `${baseX + driftX}%`, top: `${baseY + driftY}%`,
            width: size, height: size * 1.6,
            borderRadius: i % 2 === 0 ? '50% 0% 50% 50%' : '0% 50% 50% 50%',
            border: `1px solid ${BRAND.botanical}`,
            transform: `rotate(${rotation}deg)`, opacity: leafOpacity,
          }} />
        );
      })}
    </div>
  );
};

// ─── Watermark ────────────────────────────────────────────────
export const Watermark: React.FC<{ color?: string; variant?: 'badge' | 'logo' }> = ({
  color = BRAND.sage, variant = 'logo',
}) => (
  <div style={{
    position: 'absolute', top: variant === 'logo' ? 24 : 30, left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: variant === 'badge' ? `${color}dd` : 'rgba(0,0,0,0.3)',
    padding: variant === 'badge' ? '6px 20px' : '6px 18px',
    borderRadius: 20, zIndex: 50,
    backdropFilter: 'blur(6px)',
  }}>
    {variant === 'logo' ? (
      <Img src={staticFile('logos/logo-white.png')} style={{
        height: 48, filter: `drop-shadow(0 1px 3px rgba(0,0,0,0.4))`,
      }} />
    ) : (
      <span style={{
        color: '#FFFFFF', fontSize: 28, fontWeight: 600,
        fontFamily: BRAND.fontHeading, letterSpacing: 3, textTransform: 'uppercase',
      }}>ALTVEDA</span>
    )}
  </div>
);

// ─── OrnamentalDivider ────────────────────────────────────────
export const OrnamentalDivider: React.FC<{ color?: string; enterDelay?: number }> = ({
  color = BRAND.gold, enterDelay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - enterDelay, fps, config: { damping: 15 } });
  const starRotation = interpolate(enter, [0, 1], [0, 72]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: enter }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: color }} />
      <div style={{ width: interpolate(enter, [0, 1], [0, 120]), height: 2, backgroundColor: color, borderRadius: 1 }} />
      <div style={{ transform: `rotate(${starRotation}deg)` }}>
        <Star points={4} innerRadius={4} outerRadius={10} fill={color} />
      </div>
      <div style={{ width: interpolate(enter, [0, 1], [0, 120]), height: 2, backgroundColor: color, borderRadius: 1 }} />
      <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: color }} />
    </div>
  );
};

// ─── ProductBackground ────────────────────────────────────────
export const ProductBackground: React.FC<{
  product: V2ProductTheme;
  productKey: string; // e.g. 'ashwagandha' — for background image filename
  children: React.ReactNode;
}> = ({ product, productKey, children }) => {
  const frame = useCurrentFrame();
  const gradAngle = 160 + noise2D('bg-angle', 0, frame * 0.005) * 10;
  const panX = interpolate(frame, [0, 300], [0, -15], { extrapolateRight: 'clamp' });
  const panScale = 1.1 + noise2D('bg-scale', 0, frame * 0.003) * 0.02;

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(${gradAngle}deg, ${product.gradient[0]}, ${product.gradient[1]}, ${product.gradient[2]})`,
      backgroundSize: '200% 200%',
    }}>
      <Img src={staticFile(`backgrounds/${productKey}.png`)} style={{
        position: 'absolute', width: '130%', height: '60%', top: '20%', left: '-15%',
        objectFit: 'cover', opacity: 0.18,
        transform: `translateX(${panX}%) scale(${panScale})`, filter: 'blur(2px)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 80% 60% at 50% 45%, transparent 0%, ${product.bg}cc 100%)`,
        opacity: 0.72,
      }} />
      <BotanicalOverlay />
      <GrainOverlay />
      {children}
    </AbsoluteFill>
  );
};
