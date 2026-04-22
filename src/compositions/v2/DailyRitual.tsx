import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import { BRAND, V2_PRODUCTS } from '../../brand';
import { GrainOverlay, BotanicalOverlay, Watermark, OrnamentalDivider } from '../shared/GlassCard';
import { LottieLayer } from '../shared/LottieLayer';
import { DrawingSVG } from '../shared/DrawingSVG';
import { BOTANICAL_PATHS } from '../shared/svg-paths';
import { FONTS, SIZE } from '../shared/fonts';
import type { CaptionWord } from '../CaptionOverlay';

export type DailyRitualProps = {
  rituals?: { time: string; action: string; detail: string; product?: string }[];
  musicTrack?: string;
  voiceoverSrc?: string;
  musicVolume?: number;
  durationInFrames?: number;
  backgroundImage?: string;
  captions?: CaptionWord[];
  captionStartFrame?: number;
};

const DEFAULT_RITUALS = [
  { time: '6:00 AM', action: 'Warm lemon water', detail: 'Kindle your Agni', product: 'amla' },
  { time: '7:00 AM', action: 'Ashwagandha capsule', detail: 'With breakfast', product: 'ashwagandha' },
  { time: '12:00 PM', action: 'Moringa capsule', detail: 'With lunch', product: 'moringa' },
  { time: '3:00 PM', action: 'Curcumin + black pepper', detail: 'Afternoon reset', product: 'curcumin' },
  { time: '9:00 PM', action: 'Shatavari capsule', detail: 'Before bed', product: 'shatavari' },
];

const FontLoader: React.FC = () => (
  <style>{`
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-Bold.ttf')}') format('truetype'); font-weight: 700; }
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-SemiBold.ttf')}') format('truetype'); font-weight: 600; }
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-Regular.ttf')}') format('truetype'); font-weight: 400; }
    @font-face { font-family: 'Lora'; src: url('${staticFile('fonts/Lora-Italic-VariableFont_wght.ttf')}') format('truetype'); font-weight: 400 700; font-style: italic; }
  `}</style>
);

// Map ritual angle: spreads 5 rituals across the clock (6AM=-90° to 9PM=120°)
function ritualAngle(index: number, total: number): number {
  return interpolate(index, [0, total - 1], [-90, 120]);
}

export const DailyRitual: React.FC<DailyRitualProps> = ({
  rituals = DEFAULT_RITUALS,
  musicTrack, voiceoverSrc, musicVolume,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: TOTAL } = useVideoConfig();

  const exit = interpolate(frame, [TOTAL - 15, TOTAL], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const clockAngle = interpolate(frame, [20, TOTAL - 30], [-90, 120], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const centerX = 540, centerY = 750, radius = 280;

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, #FAF7F2, #F5F1EA, #E8E2D9)`, overflow: 'hidden',
    }}>
      <FontLoader />
      <BotanicalOverlay opacity={0.04} />
      <GrainOverlay opacity={0.03} />
      <Watermark color={BRAND.sage} />

      {musicTrack && (
        <Audio src={staticFile(`music/${musicTrack}`)} volume={voiceoverSrc ? (musicVolume ?? 0.22) : 0.3} />
      )}
      {voiceoverSrc && (
        <Sequence from={10}><Audio src={staticFile(voiceoverSrc)} volume={1} /></Sequence>
      )}

      <LottieLayer src="lottie/clock-timer.json" width={100} height={100}
        enterDelay={15} exitFrame={TOTAL - 20} opacity={0.2} playbackRate={0.5}
        style={{ position: 'absolute', top: 700, left: '50%', transform: 'translateX(-50%)' }} />

      <div style={{ position: 'absolute', bottom: 80, left: 30, opacity: exit, pointerEvents: 'none' }}>
        <DrawingSVG pathData={BOTANICAL_PATHS.leaf} width={60} height={100}
          color={BRAND.sage} enterDelay={25} drawDuration={40} opacity={0.12} />
      </div>

      <AbsoluteFill style={{ opacity: exit }}>
        {/* Title */}
        <div style={{ position: 'absolute', top: 100, left: 0, right: 0, textAlign: 'center' }}>
          <div style={{
            fontSize: SIZE.LABEL, fontWeight: 700, fontFamily: FONTS.heading,
            color: BRAND.sage, letterSpacing: 4, textTransform: 'uppercase',
            opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>Your Daily Wellness Ritual</div>
          <div style={{
            fontSize: SIZE.SUBTITLE, fontWeight: 700, fontFamily: FONTS.heading,
            color: '#2C2C2C', marginTop: 8,
            opacity: interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>A Day With Altveda</div>
          <div style={{ marginTop: 12 }}>
            <OrnamentalDivider color={BRAND.gold} enterDelay={10} />
          </div>
        </div>

        {/* Clock circle */}
        <svg style={{ position: 'absolute', top: 0, left: 0 }} width={1080} height={1920} viewBox="0 0 1080 1920">
          <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke={`${BRAND.sage}22`} strokeWidth={3} />
          <circle cx={centerX} cy={centerY} r={radius} fill="none"
            stroke={BRAND.sage} strokeWidth={4} strokeLinecap="round"
            strokeDasharray={2 * Math.PI * radius}
            strokeDashoffset={2 * Math.PI * radius * (1 - interpolate(frame, [20, TOTAL - 30], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            }))}
            transform={`rotate(-90, ${centerX}, ${centerY})`} opacity={0.5} />
          {frame > 20 && (
            <line x1={centerX} y1={centerY}
              x2={centerX + Math.cos((clockAngle * Math.PI) / 180) * (radius - 60)}
              y2={centerY + Math.sin((clockAngle * Math.PI) / 180) * (radius - 60)}
              stroke={BRAND.gold} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
          )}
          <circle cx={centerX} cy={centerY} r={8} fill={BRAND.gold} />
        </svg>

        {/* Ritual points */}
        {rituals.map((ritual, i) => {
          const angle = ritualAngle(i, rituals.length);
          const angleRad = (angle * Math.PI) / 180;
          const x = centerX + Math.cos(angleRad) * radius;
          const y = centerY + Math.sin(angleRad) * radius;
          const activateFrame = interpolate(angle, [-90, 120], [20, TOTAL - 30]);
          const isActive = clockAngle >= angle - 10;
          const color = ritual.product ? (V2_PRODUCTS[ritual.product]?.accent || BRAND.sage) : BRAND.sage;
          const pointSpring = spring({
            frame: Math.max(0, frame - activateFrame + 10), fps, config: { damping: 12, stiffness: 80 },
          });
          const cardSide = i % 2 === 0 ? 1 : -1;

          return (
            <div key={ritual.time}>
              <div style={{
                position: 'absolute', left: x - 12, top: y - 12, width: 24, height: 24,
                borderRadius: '50%', backgroundColor: isActive ? color : `${color}44`,
                border: `3px solid ${color}`,
                transform: `scale(${isActive ? 1.2 : 0.8})`,
                boxShadow: isActive ? `0 0 16px ${color}66` : 'none', zIndex: 10,
              }} />
              <div style={{
                position: 'absolute',
                left: cardSide > 0 ? x + 30 : undefined,
                right: cardSide < 0 ? 1080 - x + 30 : undefined,
                top: y - 40, width: 280,
                background: `linear-gradient(160deg, rgba(255,255,255,0.55), rgba(255,255,255,0.30))`,
                backdropFilter: 'blur(20px)', borderRadius: 20,
                border: `1.5px solid rgba(255,255,255,0.45)`,
                padding: '16px 20px', opacity: pointSpring,
                transform: `translateX(${interpolate(pointSpring, [0, 1], [cardSide * 20, 0])}px)`,
                boxShadow: `0 8px 24px rgba(0,0,0,0.06)`,
              }}>
                <div style={{ fontSize: SIZE.LABEL, fontWeight: 700, color, fontFamily: FONTS.heading, letterSpacing: 2 }}>
                  {ritual.time}
                </div>
                <div style={{ fontSize: SIZE.BODY_SM, fontWeight: 700, color: '#2C2C2C', fontFamily: FONTS.heading, marginTop: 4, lineHeight: 1.2 }}>
                  {ritual.action}
                </div>
                <div style={{ fontSize: SIZE.BODY_SM, color: '#4A4A4A', fontFamily: FONTS.serif, fontStyle: 'italic', marginTop: 4 }}>
                  {ritual.detail}
                </div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
