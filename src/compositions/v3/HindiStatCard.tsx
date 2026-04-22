import React from 'react';
import {
  AbsoluteFill, Audio, Img, Sequence,
  Easing, interpolate, staticFile,
  useCurrentFrame, useVideoConfig,
} from 'remotion';
import { resolveV2Product } from '../../brand';
import { FONTS, LAYOUT, HINDI_SIZE, HINDI_LINE_HEIGHT } from '../shared/fonts';
import { GrainOverlay } from '../shared/GlassCard';
import { HindiFontLoader } from '../shared/HindiFontLoader';
import { CaptionOverlay, type CaptionWord } from '../CaptionOverlay';

export type HindiStatCardProps = {
  stat: string;
  statLabel: string;
  body: string;
  backgroundImage?: string;
  musicTrack?: string;
  voiceoverSrc?: string;
  musicVolume?: number;
  durationInFrames?: number;
  captions?: CaptionWord[];
  captionStartFrame?: number;
};

const EASE = Easing.bezier(0.25, 0.1, 0.25, 1);
const EASE_OUT = Easing.bezier(0.0, 0.0, 0.2, 1);

function parseStat(stat: string): { numericPart: number; prefix: string; suffix: string } {
  const match = stat.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)/);
  if (!match) return { numericPart: 0, prefix: '', suffix: stat };
  return { prefix: match[1], numericPart: parseFloat(match[2]), suffix: match[3] };
}

/*
 * LAYOUT: Hindi stat reveal — dark bg with warm saffron/gold glow
 * ┌──────────────────┐
 * │    ALTVEDA        │  watermark (dim)
 * │                   │
 * │  🪷               │  lotus ornament (left)
 * │     20x     🪷    │  MASSIVE stat (220px)
 * │                   │  lotus ornament (right)
 * │  ───              │  accent line
 * │                   │
 * │  हिंदी लेबल         │  Hindi label (52px)
 * │                   │
 * │  बॉडी टेक्स्ट        │  Hindi body (44px)
 * │                   │
 * │    altveda.in     │
 * └──────────────────┘
 */
export const HindiStatCard: React.FC<HindiStatCardProps> = ({
  stat, statLabel, body, backgroundImage, musicTrack,
  voiceoverSrc, musicVolume = 0.22, captions, captionStartFrame = 20,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames: TOTAL } = useVideoConfig();
  const theme = resolveV2Product(backgroundImage);
  const productKey = backgroundImage?.replace(/\.png$/, '') || 'ashwagandha';

  const exit = interpolate(frame, [TOTAL - 25, TOTAL - 5], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Counter animation
  const { prefix, numericPart, suffix } = parseStat(stat);
  const counterProgress = interpolate(frame, [15, 70], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT,
  });
  const currentNum = Math.round(numericPart * counterProgress);
  const displayStat = `${prefix}${currentNum}${suffix}`;

  const statIn = interpolate(frame, [8, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const lotusIn = interpolate(frame, [30, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const lineIn = interpolate(frame, [65, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const labelIn = interpolate(frame, [75, 105], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const bodyIn = interpolate(frame, [100, 130], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });

  // Botanical pan
  const panX = interpolate(frame, [0, TOTAL], [0, -12], { extrapolateRight: 'clamp' });

  // Warm glow pulse
  const glowPulse = 1 + Math.sin(frame / 35) * 0.08;

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <HindiFontLoader />

      {/* Dark background */}
      <AbsoluteFill style={{ background: '#0c0c0c' }} />

      {/* Warm accent glow — saffron/gold radial behind stat */}
      <div style={{
        position: 'absolute',
        top: '15%', left: '10%', right: '10%', height: '40%',
        background: `radial-gradient(ellipse at center, ${theme.accent}18 0%, transparent 70%)`,
        opacity: statIn * 0.8,
        transform: `scale(${glowPulse})`,
      }} />

      {/* Botanical — ghostly on dark */}
      {backgroundImage && (
        <Img
          src={staticFile(`backgrounds/${productKey}.png`)}
          style={{
            position: 'absolute',
            width: '160%', height: '100%',
            top: 0, left: '-30%',
            objectFit: 'cover',
            opacity: statIn * 0.06,
            filter: 'blur(3px) brightness(0.6)',
            transform: `translateX(${panX}%)`,
          }}
        />
      )}

      <GrainOverlay opacity={0.03} />

      {/* Watermark */}
      <div style={{
        position: 'absolute', top: 40, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        opacity: statIn * 0.2,
      }}>
        <span style={{
          fontFamily: FONTS.hindi, fontSize: 22, fontWeight: 600,
          color: 'rgba(255,255,255,0.5)', letterSpacing: 6, textTransform: 'uppercase',
        }}>
          AltVeda
        </span>
      </div>

      {/* Content zone */}
      <div style={{
        position: 'absolute',
        top: LAYOUT.TOP_SAFE,
        bottom: 200,
        left: 60,
        right: 60,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 20,
      }}>
        {/* Stat with flanking lotus ornaments */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 24,
        }}>
          {/* Left lotus */}
          <div style={{
            opacity: lotusIn * 0.4, color: theme.accent,
            transform: `translateX(${interpolate(lotusIn, [0, 1], [-15, 0])}px)`,
            width: 80, height: 60,
          }}>
            <svg viewBox="0 0 120 80" style={{ width: '100%', height: '100%' }}>
              <ellipse cx="60" cy="45" rx="8" ry="16" fill="currentColor" opacity="0.4"/>
              <ellipse cx="42" cy="40" rx="6" ry="14" fill="currentColor" opacity="0.25" transform="rotate(-25, 42, 40)"/>
              <ellipse cx="30" cy="44" rx="5" ry="12" fill="currentColor" opacity="0.18" transform="rotate(-45, 30, 44)"/>
              <ellipse cx="78" cy="40" rx="6" ry="14" fill="currentColor" opacity="0.25" transform="rotate(25, 78, 40)"/>
              <ellipse cx="90" cy="44" rx="5" ry="12" fill="currentColor" opacity="0.18" transform="rotate(45, 90, 44)"/>
              <path d="M 20 58 Q 60 68 100 58" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
            </svg>
          </div>

          {/* THE NUMBER */}
          <div style={{
            fontFamily: FONTS.heading, fontSize: 220, fontWeight: 700,
            color: theme.accent, lineHeight: 0.9,
            opacity: statIn,
            transform: `scale(${interpolate(statIn, [0, 1], [0.9, 1])})`,
            letterSpacing: -6,
            textAlign: 'center',
          }}>
            {displayStat}
          </div>

          {/* Right lotus (mirrored) */}
          <div style={{
            opacity: lotusIn * 0.4, color: theme.accent,
            transform: `translateX(${interpolate(lotusIn, [0, 1], [15, 0])}px) scaleX(-1)`,
            width: 80, height: 60,
          }}>
            <svg viewBox="0 0 120 80" style={{ width: '100%', height: '100%' }}>
              <ellipse cx="60" cy="45" rx="8" ry="16" fill="currentColor" opacity="0.4"/>
              <ellipse cx="42" cy="40" rx="6" ry="14" fill="currentColor" opacity="0.25" transform="rotate(-25, 42, 40)"/>
              <ellipse cx="30" cy="44" rx="5" ry="12" fill="currentColor" opacity="0.18" transform="rotate(-45, 30, 44)"/>
              <ellipse cx="78" cy="40" rx="6" ry="14" fill="currentColor" opacity="0.25" transform="rotate(25, 78, 40)"/>
              <ellipse cx="90" cy="44" rx="5" ry="12" fill="currentColor" opacity="0.18" transform="rotate(45, 90, 44)"/>
              <path d="M 20 58 Q 60 68 100 58" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
            </svg>
          </div>
        </div>

        {/* Accent line */}
        <div style={{
          width: interpolate(lineIn, [0, 1], [0, 80]),
          height: 2, backgroundColor: theme.accent,
          opacity: lineIn * 0.4,
          marginTop: 12, marginBottom: 12,
        }} />

        {/* Hindi label */}
        <div style={{
          fontFamily: FONTS.hindi, fontSize: HINDI_SIZE.SUBTITLE, fontWeight: 600,
          color: '#ffffff', textAlign: 'center', lineHeight: HINDI_LINE_HEIGHT,
          opacity: labelIn,
          transform: `translateY(${interpolate(labelIn, [0, 1], [20, 0])}px)`,
        }}>
          {statLabel}
        </div>

        {/* Hindi body */}
        <div style={{
          fontFamily: FONTS.hindi, fontSize: HINDI_SIZE.BODY, fontWeight: 400,
          color: 'rgba(255,255,255,0.5)', textAlign: 'center',
          lineHeight: HINDI_LINE_HEIGHT,
          maxWidth: 850,
          opacity: bodyIn,
          transform: `translateY(${interpolate(bodyIn, [0, 1], [15, 0])}px)`,
        }}>
          {body}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: 36, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        opacity: bodyIn * 0.2,
      }}>
        <span style={{
          fontFamily: FONTS.body, fontSize: 22, fontWeight: 400,
          color: 'rgba(255,255,255,0.35)', letterSpacing: 3,
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
