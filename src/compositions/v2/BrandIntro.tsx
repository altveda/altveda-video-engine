import React from 'react';
import {
  AbsoluteFill, Audio, Img, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import { Trail } from '@remotion/motion-blur';
import { BRAND, resolveV2Product, V2_PRODUCTS } from '../../brand';
import { GrainOverlay } from '../shared/GlassCard';
import { DrawingSVG } from '../shared/DrawingSVG';
import { BOTANICAL_PATHS } from '../shared/svg-paths';
import { LottieLayer } from '../shared/LottieLayer';
import { FONTS, SIZE, LOGO } from '../shared/fonts';
import type { CaptionWord } from '../CaptionOverlay';

export type BrandIntroProps = {
  tagline?: string;
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
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-Regular.ttf')}') format('truetype'); font-weight: 400; }
    @font-face { font-family: 'Lora'; src: url('${staticFile('fonts/Lora-Italic-VariableFont_wght.ttf')}') format('truetype'); font-weight: 400 700; font-style: italic; }
  `}</style>
);

export const BrandIntro: React.FC<BrandIntroProps> = ({
  tagline = "Nature's Wisdom, Your Wellness",
  musicTrack, voiceoverSrc, musicVolume, backgroundImage,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: TOTAL } = useVideoConfig();

  const leaves = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    const enterSpring = spring({ frame: frame - i * 2, fps, config: { damping: 12, stiffness: 40 } });
    const converge = spring({ frame: frame - 40, fps, config: { damping: 18, stiffness: 30 } });
    const startDist = 500 + (i % 5) * 100;
    const startX = Math.cos(angle + frame * 0.01) * startDist;
    const startY = Math.sin(angle + frame * 0.01) * startDist;
    const endDist = 20 + (i % 4) * 15;
    const endX = Math.cos(angle) * endDist;
    const endY = Math.sin(angle) * endDist;
    const x = interpolate(converge, [0, 1], [startX * enterSpring, endX]);
    const y = interpolate(converge, [0, 1], [startY * enterSpring, endY]);
    const rotation = frame * (i % 2 === 0 ? 1 : -1) * 2 + i * 30;
    const scale = interpolate(converge, [0, 1], [1, 0.5 + (i % 3) * 0.2]);
    const colors = [BRAND.sage, '#8A9A5B', '#5A7A5C', BRAND.gold, BRAND.terracotta];
    return { x, y, rotation, scale, opacity: enterSpring, color: colors[i % colors.length], i };
  });

  const logoScale = spring({ frame: frame - 55, fps, config: { damping: 10, stiffness: 60 } });
  const nameReveal = spring({ frame: frame - 70, fps, config: { damping: 14 } });
  const taglineReveal = spring({ frame: frame - 95, fps, config: { damping: 14 } });
  const flash = interpolate(frame, [52, 56, 64], [0, 0.4, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const exit = interpolate(frame, [TOTAL - 20, TOTAL - 10], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#FAF7F2' }}>
      <FontLoader />
      <GrainOverlay opacity={0.03} />

      {musicTrack && (
        <Audio src={staticFile(`music/${musicTrack}`)} volume={voiceoverSrc ? (musicVolume ?? 0.22) : 0.3} />
      )}
      {voiceoverSrc && (
        <Sequence from={10}><Audio src={staticFile(voiceoverSrc)} volume={1} /></Sequence>
      )}

      {/* Radial glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: `radial-gradient(circle, ${BRAND.sage}22, transparent 70%)`,
        filter: 'blur(40px)', opacity: logoScale * exit,
      }} />

      {/* Flash */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: BRAND.gold, opacity: flash }} />

      {/* Botanical leaves with motion blur during convergence */}
      <Trail layers={frame > 25 && frame < 70 ? 4 : 1} lagInFrames={0.3} trailOpacity={0.6}>
        <div style={{ position: 'absolute', top: '45%', left: '50%', opacity: exit }}>
          {leaves.map((leaf) => (
            <div key={leaf.i} style={{
              position: 'absolute',
              transform: `translate(${leaf.x}px, ${leaf.y}px) rotate(${leaf.rotation}deg) scale(${leaf.scale})`,
              opacity: leaf.opacity * 0.8,
            }}>
              <div style={{
                width: 16, height: 28, borderRadius: '50% 0 50% 50%',
                backgroundColor: leaf.color, boxShadow: `0 2px 8px ${leaf.color}44`,
              }} />
            </div>
          ))}
        </div>
      </Trail>

      {/* DrawingSVG mandala */}
      <div style={{
        position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)',
        opacity: logoScale * exit, pointerEvents: 'none',
      }}>
        <DrawingSVG pathData={BOTANICAL_PATHS.mandala} width={280} height={280}
          color={BRAND.sage} enterDelay={35} drawDuration={50} staggerPerPath={3} opacity={0.12} />
      </div>

      {/* Logo mark */}
      <div style={{
        position: 'absolute', top: '45%', left: '50%',
        transform: `translate(-50%, -50%) scale(${logoScale})`, opacity: logoScale * exit,
      }}>
        <Img src={staticFile('logos/logo-mark-black.png')} style={{
          width: 120, height: 120, objectFit: 'contain',
          filter: `drop-shadow(0 8px 30px ${BRAND.sage}44)`,
        }} />
      </div>

      {/* Brand name */}
      <div style={{
        position: 'absolute', top: '58%', left: '50%',
        transform: `translate(-50%, 0) translateY(${interpolate(nameReveal, [0, 1], [20, 0])}px)`,
        opacity: nameReveal * exit, textAlign: 'center',
      }}>
        <div style={{
          fontSize: SIZE.HERO, fontWeight: 700, fontFamily: FONTS.heading,
          letterSpacing: 12, color: '#2C2C2C',
        }}>ALTVEDA</div>
      </div>

      {/* Tagline */}
      <div style={{
        position: 'absolute', top: '68%', left: '50%',
        transform: `translate(-50%, 0) translateY(${interpolate(taglineReveal, [0, 1], [15, 0])}px)`,
        opacity: taglineReveal * exit, textAlign: 'center',
      }}>
        <div style={{
          fontSize: SIZE.BODY_SM, fontWeight: 400, fontFamily: FONTS.serif, fontStyle: 'italic',
          color: '#4A4A4A', letterSpacing: 4,
        }}>{tagline}</div>
        <div style={{
          width: interpolate(taglineReveal, [0, 1], [0, 200]), height: 2,
          backgroundColor: BRAND.gold, margin: '16px auto 0', borderRadius: 1,
        }} />
      </div>

      {/* Lottie leaf-growth */}
      <LottieLayer src="lottie/leaf-growth.json" width={180} height={180}
        enterDelay={80} exitFrame={TOTAL - 25} opacity={0.2} playbackRate={0.7}
        style={{ position: 'absolute', bottom: 120, left: '50%', transform: 'translateX(-50%)' }} />

      {/* Product color dots */}
      <div style={{
        position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 16, opacity: taglineReveal * exit,
      }}>
        {Object.values(V2_PRODUCTS).map((p, i) => {
          const dotSpring = spring({ frame: frame - 105 - i * 5, fps, config: { damping: 10 } });
          return (
            <div key={i} style={{
              width: 12, height: 12, borderRadius: '50%', backgroundColor: p.accent,
              transform: `scale(${dotSpring})`, boxShadow: `0 2px 8px ${p.accent}44`,
            }} />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
