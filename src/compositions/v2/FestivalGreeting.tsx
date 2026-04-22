import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import { noise2D } from '@remotion/noise';
import { BRAND, resolveV2Product } from '../../brand';
import { GlassCard, GrainOverlay, Watermark } from '../shared/GlassCard';
import { DrawingSVG } from '../shared/DrawingSVG';
import { BOTANICAL_PATHS } from '../shared/svg-paths';
import { FONTS, SIZE, LAYOUT } from '../shared/fonts';
import type { CaptionWord } from '../CaptionOverlay';

export type FestivalGreetingProps = {
  festival: string;          // e.g. "Diwali", "Holi", "Navratri"
  greeting: string;          // e.g. "May the light of wellness guide your path"
  subGreeting?: string;      // e.g. "Wishing you health, peace & radiance"
  productTieIn?: string;     // e.g. "Gift wellness this Diwali → altveda.in"
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
    @font-face { font-family: 'Lora'; src: url('${staticFile('fonts/Lora-VariableFont_wght.ttf')}') format('truetype'); font-weight: 400 700; }
    @font-face { font-family: 'Lora'; src: url('${staticFile('fonts/Lora-Italic-VariableFont_wght.ttf')}') format('truetype'); font-weight: 400 700; font-style: italic; }
  `}</style>
);

// Festive warm palette — overrides product theme for emotional warmth
const FESTIVE = {
  gold: '#D4A730',
  goldLight: '#F5E6B8',
  saffron: '#E8862A',
  deepRed: '#8B2323',
  warmCream: '#FFF8E7',
  textDark: '#3D1F00',
  textWarm: '#6B3A00',
} as const;

// Rangoli-inspired decorative corner pattern (SVG paths)
const RangoliCorner: React.FC<{
  position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  enterDelay: number;
  color: string;
}> = ({ position, enterDelay, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - enterDelay, fps, config: { damping: 18, stiffness: 40 } });

  const transforms: Record<string, string> = {
    topLeft: 'rotate(0deg)',
    topRight: 'rotate(90deg)',
    bottomRight: 'rotate(180deg)',
    bottomLeft: 'rotate(270deg)',
  };
  const positions: Record<string, React.CSSProperties> = {
    topLeft: { top: 80, left: 30 },
    topRight: { top: 80, right: 30 },
    bottomRight: { bottom: 80, right: 30 },
    bottomLeft: { bottom: 80, left: 30 },
  };

  return (
    <div style={{
      position: 'absolute', ...positions[position],
      transform: `${transforms[position]} scale(${enter})`,
      opacity: enter * 0.5,
      pointerEvents: 'none',
    }}>
      <svg viewBox="0 0 120 120" width={100} height={100}>
        {/* Outer arc */}
        <path d="M10 110 Q10 10 110 10" stroke={color} strokeWidth={2.5} fill="none"
          strokeLinecap="round" />
        {/* Inner arc */}
        <path d="M25 95 Q25 25 95 25" stroke={color} strokeWidth={1.5} fill="none"
          strokeLinecap="round" opacity={0.6} />
        {/* Corner dot cluster (rangoli-style) */}
        <circle cx={15} cy={105} r={4} fill={color} opacity={0.7} />
        <circle cx={30} cy={90} r={3} fill={color} opacity={0.5} />
        <circle cx={45} cy={75} r={2.5} fill={color} opacity={0.4} />
        {/* Petal shapes */}
        <path d="M12 80 Q20 70 12 60 Q4 70 12 80Z" fill={color} opacity={0.25} />
        <path d="M40 108 Q50 100 60 108 Q50 116 40 108Z" fill={color} opacity={0.25} />
      </svg>
    </div>
  );
};

// Floating diya (lamp) particles
const FloatingDiyas: React.FC<{ count: number; color: string }> = ({ count, color }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {Array.from({ length: count }, (_, i) => {
        const baseX = ((i * 137.508 + 20) % 90) + 5;
        const startY = 100 + (i % 3) * 10;
        const speed = 0.15 + (i % 4) * 0.05;
        const y = startY - frame * speed;
        const drift = noise2D('diya-x', i, frame * 0.01) * 8;
        const flicker = 0.5 + noise2D('diya-f', i, frame * 0.08) * 0.3;

        if (y < -10) return null;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${baseX + drift}%`,
            top: `${y}%`,
            opacity: flicker * 0.6,
          }}>
            {/* Flame shape */}
            <div style={{
              width: 8, height: 14,
              background: `radial-gradient(ellipse, ${color}, ${FESTIVE.saffron}80, transparent)`,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              boxShadow: `0 0 12px ${color}60`,
            }} />
          </div>
        );
      })}
    </div>
  );
};

export const FestivalGreeting: React.FC<FestivalGreetingProps> = ({
  festival, greeting, subGreeting, productTieIn,
  musicTrack, voiceoverSrc, musicVolume, backgroundImage,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: TOTAL } = useVideoConfig();

  // Use product theme if provided, but override text colors with festive warmth
  const productTheme = resolveV2Product(backgroundImage);

  const exit = interpolate(frame, [TOTAL - 25, TOTAL - 10], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Festive glow pulse
  const glowPulse = 0.5 + Math.sin(frame / 25) * 0.15;

  // Staggered reveals
  const festivalReveal = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 40 } });
  const greetingReveal = spring({ frame: frame - 40, fps, config: { damping: 14, stiffness: 50 } });
  const subReveal = spring({ frame: frame - 80, fps, config: { damping: 14, stiffness: 50 } });
  const tieInReveal = spring({ frame: frame - 120, fps, config: { damping: 14, stiffness: 50 } });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, ${FESTIVE.warmCream}, ${FESTIVE.goldLight}, ${productTheme.gradient[1]}40)`,
    }}>
      <FontLoader />

      {/* Warm radial glow behind center */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%',
        transform: `translate(-50%, -50%) scale(${glowPulse + 0.5})`,
        width: 600, height: 600, borderRadius: '50%',
        background: `radial-gradient(circle, ${FESTIVE.gold}20, ${FESTIVE.saffron}08, transparent)`,
        opacity: 0.7,
      }} />

      <GrainOverlay opacity={0.03} />
      <FloatingDiyas count={12} color={FESTIVE.gold} />

      {/* Rangoli corners */}
      <RangoliCorner position="topLeft" enterDelay={5} color={FESTIVE.gold} />
      <RangoliCorner position="topRight" enterDelay={10} color={FESTIVE.gold} />
      <RangoliCorner position="bottomLeft" enterDelay={15} color={FESTIVE.gold} />
      <RangoliCorner position="bottomRight" enterDelay={20} color={FESTIVE.gold} />

      <Watermark color={FESTIVE.gold} />

      {musicTrack && (
        <Audio src={staticFile(`music/${musicTrack}`)} volume={voiceoverSrc ? (musicVolume ?? 0.22) : 0.3} />
      )}
      {voiceoverSrc && (
        <Sequence from={10}><Audio src={staticFile(voiceoverSrc)} volume={1} /></Sequence>
      )}

      {/* Decorative mandala behind card */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: `translate(-50%, -50%) rotate(${frame * 0.15}deg)`,
        opacity: 0.06 * exit, pointerEvents: 'none',
      }}>
        <DrawingSVG pathData={BOTANICAL_PATHS.mandala} width={500} height={500}
          color={FESTIVE.gold} enterDelay={0} drawDuration={80} opacity={1} />
      </div>

      <AbsoluteFill style={{
        justifyContent: 'center', alignItems: 'center',
        paddingTop: LAYOUT.TOP_SAFE, paddingBottom: LAYOUT.BOTTOM_SAFE, opacity: exit,
      }}>
        <GlassCard width="86%" padding={48}>
          {/* Festival name — large, decorative */}
          <div style={{
            fontSize: SIZE.LABEL, fontWeight: 700, fontFamily: FONTS.heading,
            color: FESTIVE.gold, letterSpacing: 6, textTransform: 'uppercase',
            opacity: festivalReveal,
            transform: `scale(${interpolate(festivalReveal, [0, 1], [0.8, 1])})`,
          }}>
            {/* Decorative dots around festival name */}
            <span style={{ opacity: 0.5 }}>✦ </span>
            Happy {festival}
            <span style={{ opacity: 0.5 }}> ✦</span>
          </div>

          {/* Ornamental line */}
          <div style={{
            width: interpolate(festivalReveal, [0, 1], [0, 200]),
            height: 2, backgroundColor: FESTIVE.gold, borderRadius: 1,
            marginTop: 4,
          }} />

          {/* Main greeting — large serif */}
          <div style={{
            fontSize: SIZE.SUBTITLE, fontWeight: 400, fontFamily: FONTS.serif,
            fontStyle: 'italic',
            color: FESTIVE.textDark, textAlign: 'center', lineHeight: 1.5,
            maxWidth: '92%', marginTop: 12,
            opacity: greetingReveal,
            transform: `translateY(${interpolate(greetingReveal, [0, 1], [15, 0])}px)`,
          }}>
            {greeting}
          </div>

          {/* Sub-greeting */}
          {subGreeting && (
            <div style={{
              fontSize: SIZE.BODY_SM, fontWeight: 400, fontFamily: FONTS.body,
              color: FESTIVE.textWarm, textAlign: 'center', lineHeight: 1.6,
              maxWidth: '85%', marginTop: 4,
              opacity: subReveal,
              transform: `translateY(${interpolate(subReveal, [0, 1], [10, 0])}px)`,
            }}>
              {subGreeting}
            </div>
          )}

          {/* Subtle product tie-in — not a hard CTA */}
          {productTieIn && (
            <div style={{
              marginTop: 16,
              backgroundColor: `${FESTIVE.gold}20`,
              border: `1px solid ${FESTIVE.gold}40`,
              borderRadius: 24, padding: '10px 28px',
              opacity: tieInReveal,
            }}>
              <span style={{
                fontSize: SIZE.CTA_BUTTON, fontWeight: 600, fontFamily: FONTS.heading,
                color: FESTIVE.textWarm, letterSpacing: 1,
              }}>
                {productTieIn}
              </span>
            </div>
          )}
        </GlassCard>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
