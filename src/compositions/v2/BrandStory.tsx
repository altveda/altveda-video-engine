import React from 'react';
import {
  AbsoluteFill, Audio, Img, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import { Trail } from '@remotion/motion-blur';
import { BRAND, V2_PRODUCTS } from '../../brand';
import { GrainOverlay } from '../shared/GlassCard';
import { DrawingSVG } from '../shared/DrawingSVG';
import { BOTANICAL_PATHS } from '../shared/svg-paths';
import { LottieLayer } from '../shared/LottieLayer';

export type BrandStorySlide = {
  heading: string;
  body: string;
};

export type BrandStoryProps = {
  slides: BrandStorySlide[];
  musicTrack?: string;
  voiceoverSrc?: string;
  musicVolume?: number;
  durationInFrames?: number;
};

const FontLoader: React.FC = () => (
  <style>{`
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-Bold.ttf')}') format('truetype'); font-weight: 700; }
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-SemiBold.ttf')}') format('truetype'); font-weight: 600; }
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-Regular.ttf')}') format('truetype'); font-weight: 400; }
    @font-face { font-family: 'Lora'; src: url('${staticFile('fonts/Lora-VariableFont_wght.ttf')}') format('truetype'); font-weight: 400 700; }
    @font-face { font-family: 'Lora'; src: url('${staticFile('fonts/Lora-Italic-VariableFont_wght.ttf')}') format('truetype'); font-weight: 400 700; font-style: italic; }
  `}</style>
);

// ─── Floating botanical leaves (same as BrandIntro) ──────────
const FloatingLeaves: React.FC<{ frame: number; fps: number; opacity: number; centerY: string }> = ({
  frame, fps, opacity, centerY,
}) => {
  const leaves = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    // Gentle floating orbit — no convergence, just drifting
    const radius = 300 + (i % 4) * 80;
    const speed = 0.003 + (i % 3) * 0.001;
    const x = Math.cos(angle + frame * speed) * radius;
    const y = Math.sin(angle + frame * speed * 0.7) * (radius * 0.4);
    const rotation = frame * (i % 2 === 0 ? 0.5 : -0.5) + i * 45;
    const scale = 0.4 + (i % 3) * 0.15;
    const colors = [BRAND.sage, '#8A9A5B', '#5A7A5C', BRAND.gold, BRAND.terracotta];
    return { x, y, rotation, scale, color: colors[i % colors.length], i };
  });

  return (
    <div style={{ position: 'absolute', top: centerY, left: '50%', opacity, pointerEvents: 'none' }}>
      {leaves.map((leaf) => (
        <div key={leaf.i} style={{
          position: 'absolute',
          transform: `translate(${leaf.x}px, ${leaf.y}px) rotate(${leaf.rotation}deg) scale(${leaf.scale})`,
          opacity: 0.5,
        }}>
          <div style={{
            width: 14, height: 24, borderRadius: '50% 0 50% 50%',
            backgroundColor: leaf.color, boxShadow: `0 2px 8px ${leaf.color}33`,
          }} />
        </div>
      ))}
    </div>
  );
};

// ─── Main composition ─────────────────────────────────────────

export const BrandStory: React.FC<BrandStoryProps> = ({
  slides = [],
  musicTrack, voiceoverSrc, musicVolume,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: TOTAL, width } = useVideoConfig();

  const isLandscape = width > 1200;

  // ── Timing: intro (logo) → slides → outro (logo + dots) ────
  const INTRO_FRAMES = 90;       // 3s logo intro
  const SLIDE_FRAMES = 150;      // 5s per slide (slow for reading)
  const OUTRO_FRAMES = 90;       // 3s closing
  const TRANSITION = 30;         // 1s crossfade between slides

  // ── Intro: Logo reveal (same as BrandIntro) ─────────────────
  const logoScale = spring({ frame: frame - 15, fps, config: { damping: 10, stiffness: 60 } });
  const nameReveal = spring({ frame: frame - 30, fps, config: { damping: 14 } });
  const introExit = interpolate(frame, [INTRO_FRAMES - 25, INTRO_FRAMES - 5], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Flash on logo appear
  const flash = interpolate(frame, [13, 17, 25], [0, 0.3, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Slide logic ─────────────────────────────────────────────
  const slideStart = INTRO_FRAMES;
  const currentSlideFloat = (frame - slideStart) / SLIDE_FRAMES;
  const currentSlideIndex = Math.floor(currentSlideFloat);
  const slideLocalFrame = frame - slideStart - currentSlideIndex * SLIDE_FRAMES;

  // ── Outro ───────────────────────────────────────────────────
  const outroStart = slideStart + slides.length * SLIDE_FRAMES;
  const outroProgress = spring({ frame: frame - outroStart - 10, fps, config: { damping: 14 } });
  const isOutro = frame >= outroStart;

  // ── Global exit ─────────────────────────────────────────────
  const globalExit = interpolate(frame, [TOTAL - 20, TOTAL - 5], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Font sizes (responsive) ─────────────────────────────────
  const headingSize = isLandscape ? 52 : 60;
  const bodySize = isLandscape ? 28 : 36;
  const logoSize = isLandscape ? 80 : 120;
  const brandNameSize = isLandscape ? 56 : 88;

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.cream }}>
      <FontLoader />
      <GrainOverlay opacity={0.03} />

      {musicTrack && (
        <Audio src={staticFile(`music/${musicTrack}`)} volume={voiceoverSrc ? (musicVolume ?? 0.2) : 0.25} />
      )}

      {/* Radial glow — always present, subtle */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: isLandscape ? 800 : 600, height: isLandscape ? 600 : 600, borderRadius: '50%',
        background: `radial-gradient(circle, ${BRAND.sage}15, transparent 70%)`,
        filter: 'blur(60px)', opacity: globalExit,
      }} />

      {/* Floating botanical leaves — constant gentle motion */}
      <FloatingLeaves frame={frame} fps={fps} opacity={0.6 * globalExit} centerY="50%" />

      {/* DrawingSVG mandala — subtle background */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        opacity: 0.06 * globalExit, pointerEvents: 'none',
      }}>
        <DrawingSVG pathData={BOTANICAL_PATHS.mandala} width={isLandscape ? 500 : 400} height={isLandscape ? 500 : 400}
          color={BRAND.sage} enterDelay={0} drawDuration={80} staggerPerPath={3} opacity={1} />
      </div>

      {/* Flash */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: BRAND.gold, opacity: flash * globalExit }} />

      {/* ─── INTRO: Logo + Brand Name ──────────────────────── */}
      {frame < INTRO_FRAMES && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: introExit }}>
          {/* Logo mark */}
          <Img src={staticFile('logos/logo-mark-black.png')} style={{
            width: logoSize, height: logoSize, objectFit: 'contain',
            transform: `scale(${logoScale})`, opacity: logoScale,
            filter: `drop-shadow(0 8px 30px ${BRAND.sage}44)`,
          }} />

          {/* Brand name */}
          <div style={{
            marginTop: 20,
            transform: `translateY(${interpolate(nameReveal, [0, 1], [20, 0])}px)`,
            opacity: nameReveal, textAlign: 'center',
          }}>
            <div style={{
              fontSize: brandNameSize, fontWeight: 700, fontFamily: 'Poppins, sans-serif',
              letterSpacing: 12, color: BRAND.charcoal,
            }}>ALTVEDA</div>
          </div>
        </div>
      )}

      {/* ─── SLIDES: Heading + Body text ───────────────────── */}
      {slides.map((slide, idx) => {
        const thisSlideStart = slideStart + idx * SLIDE_FRAMES;
        const localFrame = frame - thisSlideStart;

        // Only render if within range
        if (localFrame < -TRANSITION || localFrame > SLIDE_FRAMES + TRANSITION) return null;

        const enter = spring({ frame: localFrame - 10, fps, config: { damping: 16, stiffness: 40 } });
        const exit = interpolate(localFrame, [SLIDE_FRAMES - TRANSITION, SLIDE_FRAMES], [1, 0], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        });
        const headingEnter = spring({ frame: localFrame - 15, fps, config: { damping: 14 } });
        const bodyEnter = spring({ frame: localFrame - 35, fps, config: { damping: 14 } });
        const lineEnter = spring({ frame: localFrame - 25, fps, config: { damping: 12 } });

        return (
          <div key={idx} style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: isLandscape ? '0 180px' : '0 80px',
            opacity: enter * exit * globalExit,
          }}>
            {/* Heading */}
            <div style={{
              fontSize: headingSize, fontWeight: 700, fontFamily: 'Poppins, sans-serif',
              color: BRAND.charcoal, textAlign: 'center', lineHeight: 1.3,
              transform: `translateY(${interpolate(headingEnter, [0, 1], [25, 0])}px)`,
              opacity: headingEnter,
            }}>
              {slide.heading}
            </div>

            {/* Gold divider line */}
            <div style={{
              width: interpolate(lineEnter, [0, 1], [0, 120]), height: 3,
              backgroundColor: BRAND.gold, margin: '24px auto',
              borderRadius: 2,
            }} />

            {/* Body text */}
            <div style={{
              fontSize: bodySize, fontWeight: 400, fontFamily: 'Lora, Georgia, serif',
              fontStyle: 'italic', color: BRAND.graphite, textAlign: 'center',
              lineHeight: 1.7, maxWidth: isLandscape ? 900 : 700,
              transform: `translateY(${interpolate(bodyEnter, [0, 1], [20, 0])}px)`,
              opacity: bodyEnter,
            }}>
              {slide.body}
            </div>
          </div>
        );
      })}

      {/* ─── OUTRO: Logo + Tagline + Product dots ──────────── */}
      {isOutro && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: outroProgress * globalExit,
        }}>
          <Img src={staticFile('logos/logo-mark-black.png')} style={{
            width: logoSize * 0.8, height: logoSize * 0.8, objectFit: 'contain',
            transform: `scale(${outroProgress})`,
            filter: `drop-shadow(0 8px 30px ${BRAND.sage}44)`,
          }} />
          <div style={{
            marginTop: 16, fontSize: brandNameSize * 0.7, fontWeight: 700,
            fontFamily: 'Poppins, sans-serif', letterSpacing: 10, color: BRAND.charcoal,
          }}>ALTVEDA</div>
          <div style={{
            marginTop: 12, fontSize: isLandscape ? 22 : 32, fontWeight: 400,
            fontFamily: 'Lora, Georgia, serif', fontStyle: 'italic',
            color: BRAND.graphite, letterSpacing: 3,
          }}>Rooted In Nature. Guided By Wisdom.</div>

          {/* Gold divider */}
          <div style={{
            width: interpolate(outroProgress, [0, 1], [0, 160]), height: 2,
            backgroundColor: BRAND.gold, margin: '20px auto 24px', borderRadius: 1,
          }} />

          {/* Product color dots */}
          <div style={{ display: 'flex', gap: 14 }}>
            {Object.values(V2_PRODUCTS).map((p, i) => {
              const dotSpring = spring({ frame: frame - outroStart - 30 - i * 5, fps, config: { damping: 10 } });
              return (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: '50%', backgroundColor: p.accent,
                  transform: `scale(${dotSpring})`, boxShadow: `0 2px 8px ${p.accent}44`,
                }} />
              );
            })}
          </div>

          {/* Website */}
          <div style={{
            marginTop: 20, fontSize: isLandscape ? 18 : 24, fontWeight: 400,
            fontFamily: 'Poppins, sans-serif', color: BRAND.sage, letterSpacing: 4,
          }}>altveda.in</div>
        </div>
      )}

      {/* Lottie leaf — subtle bottom accent */}
      <LottieLayer src="lottie/leaf-growth.json" width={isLandscape ? 120 : 180} height={isLandscape ? 120 : 180}
        enterDelay={20} exitFrame={TOTAL - 20} opacity={0.15} playbackRate={0.5}
        style={{ position: 'absolute', bottom: isLandscape ? 40 : 80, left: '50%', transform: 'translateX(-50%)' }} />
    </AbsoluteFill>
  );
};
