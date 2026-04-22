import React from 'react';
import {
  AbsoluteFill, Audio, Sequence,
  Easing, interpolate, staticFile,
  useCurrentFrame, useVideoConfig,
} from 'remotion';
import { FONTS, LAYOUT, HINDI_SIZE, HINDI_LINE_HEIGHT } from '../shared/fonts';
import { GrainOverlay } from '../shared/GlassCard';
import { HindiFontLoader } from '../shared/HindiFontLoader';
import { CaptionOverlay, type CaptionWord } from '../CaptionOverlay';

export type HindiWisdomCardProps = {
  quote: string;
  attribution?: string;
  backgroundImage?: string;
  musicTrack?: string;
  voiceoverSrc?: string;
  musicVolume?: number;
  durationInFrames?: number;
  captions?: CaptionWord[];
  captionStartFrame?: number;
};

const EASE = Easing.bezier(0.25, 0.1, 0.25, 1);

// Warm parchment/manuscript colors
const PARCHMENT_BG = '#F5EDDA';
const INK_PRIMARY = '#3B2F1E';
const INK_SECONDARY = '#6B5D4E';
const ACCENT_SAFFRON = '#C4873A';

/*
 * LAYOUT: Ayurvedic wisdom — manuscript/parchment aesthetic
 * ┌──────────────────┐
 * │ ╔══╗        ╔══╗ │  rangoli corner ornaments
 * │ ║  ║ ALTVEDA ║  ║ │  (4 corners)
 * │ ╚══╝        ╚══╝ │
 * │                   │
 * │  🍃               │  leaf motif (subtle)
 * │                   │
 * │  "आयुर्वेद में       │  Devanagari quote (48px)
 * │   कहा गया है..."   │  centered, ink-brown
 * │                   │
 * │  ═══╤══╤═══       │  saffron divider
 * │                   │
 * │  — चरक संहिता      │  attribution (smaller)
 * │                   │
 * │ ╔══╗        ╔══╗ │
 * │ ║  ║altveda.in║  ║│
 * │ ╚══╝        ╚══╝ │
 * └──────────────────┘
 *
 * Pure Hindi/Sanskrit — NO English text
 */
export const HindiWisdomCard: React.FC<HindiWisdomCardProps> = ({
  quote, attribution, backgroundImage, musicTrack,
  voiceoverSrc, musicVolume = 0.22, captions, captionStartFrame = 20,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames: TOTAL } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp', easing: EASE });
  const exit = interpolate(frame, [TOTAL - 25, TOTAL - 5], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const cornersIn = interpolate(frame, [5, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const quoteIn = interpolate(frame, [30, 65], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const dividerIn = interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const attrIn = interpolate(frame, [85, 115], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });

  // Subtle leaf float
  const leafFloat = Math.sin(frame / 50) * 4;

  // Rangoli corner ornament component
  const RangoliCorner: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div style={{ position: 'absolute', width: 120, height: 120, color: ACCENT_SAFFRON, ...style }}>
      <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
        <path d="M 0 40 Q 0 0 40 0" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
        <path d="M 0 65 Q 0 0 65 0" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.22"/>
        <path d="M 0 90 Q 0 0 90 0" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.15"/>
        <circle cx="22" cy="22" r="3.5" fill="currentColor" opacity="0.3"/>
        <circle cx="40" cy="10" r="2" fill="currentColor" opacity="0.22"/>
        <circle cx="10" cy="40" r="2" fill="currentColor" opacity="0.22"/>
        <circle cx="55" cy="5" r="1.5" fill="currentColor" opacity="0.15"/>
        <circle cx="5" cy="55" r="1.5" fill="currentColor" opacity="0.15"/>
        <polygon points="32,32 40,24 48,32 40,40" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.22"/>
      </svg>
    </div>
  );

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <HindiFontLoader />

      {/* Parchment background — warm ivory with aged-paper feel */}
      <AbsoluteFill style={{
        background: `
          radial-gradient(ellipse at 30% 20%, rgba(210, 180, 140, 0.12) 0%, transparent 60%),
          radial-gradient(ellipse at 70% 80%, rgba(180, 150, 110, 0.08) 0%, transparent 50%),
          linear-gradient(180deg, ${PARCHMENT_BG} 0%, #EDE2CC 50%, #F0E6D2 100%)
        `,
      }} />

      {/* Paper texture grain — slightly more than other compositions */}
      <GrainOverlay opacity={0.04} />

      {/* Rangoli corner ornaments — 4 corners */}
      <RangoliCorner style={{
        top: 30, left: 30,
        opacity: cornersIn * 0.7,
        transform: `scale(${interpolate(cornersIn, [0, 1], [0.8, 1])})`,
        transformOrigin: 'top left',
      }} />
      <RangoliCorner style={{
        top: 30, right: 30,
        opacity: cornersIn * 0.7,
        transform: `scale(${interpolate(cornersIn, [0, 1], [0.8, 1])}) scaleX(-1)`,
        transformOrigin: 'top right',
      }} />
      <RangoliCorner style={{
        bottom: 30, left: 30,
        opacity: cornersIn * 0.7,
        transform: `scale(${interpolate(cornersIn, [0, 1], [0.8, 1])}) scaleY(-1)`,
        transformOrigin: 'bottom left',
      }} />
      <RangoliCorner style={{
        bottom: 30, right: 30,
        opacity: cornersIn * 0.7,
        transform: `scale(${interpolate(cornersIn, [0, 1], [0.8, 1])}) scale(-1)`,
        transformOrigin: 'bottom right',
      }} />

      {/* Subtle leaf motifs — floating */}
      <div style={{
        position: 'absolute', top: 250, left: 50,
        opacity: fadeIn * 0.08,
        transform: `translateY(${leafFloat}px) rotate(-15deg)`,
        color: ACCENT_SAFFRON,
      }}>
        <svg viewBox="0 0 60 80" style={{ width: 50, height: 65 }}>
          <path d="M 30 5 Q 50 25 45 55 Q 30 70 30 75 Q 30 70 15 55 Q 10 25 30 5 Z" fill="currentColor" opacity="0.5"/>
          <line x1="30" y1="10" x2="30" y2="70" stroke="currentColor" strokeWidth="0.8" opacity="0.6"/>
        </svg>
      </div>
      <div style={{
        position: 'absolute', bottom: 350, right: 60,
        opacity: fadeIn * 0.06,
        transform: `translateY(${-leafFloat}px) rotate(20deg)`,
        color: ACCENT_SAFFRON,
      }}>
        <svg viewBox="0 0 60 80" style={{ width: 40, height: 55 }}>
          <path d="M 30 5 Q 50 25 45 55 Q 30 70 30 75 Q 30 70 15 55 Q 10 25 30 5 Z" fill="currentColor" opacity="0.5"/>
          <line x1="30" y1="10" x2="30" y2="70" stroke="currentColor" strokeWidth="0.8" opacity="0.6"/>
        </svg>
      </div>

      {/* Watermark */}
      <div style={{
        position: 'absolute', top: 48, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        opacity: fadeIn * 0.25,
      }}>
        <span style={{
          fontFamily: FONTS.hindi, fontSize: 22, fontWeight: 600,
          color: INK_SECONDARY, letterSpacing: 6, textTransform: 'uppercase',
        }}>
          AltVeda
        </span>
      </div>

      {/* Quote content — vertically centered */}
      <div style={{
        position: 'absolute',
        top: LAYOUT.TOP_SAFE + 80,
        bottom: 240,
        left: 80,
        right: 80,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 32,
      }}>
        {/* Opening quote mark */}
        <div style={{
          fontFamily: FONTS.serif, fontSize: 120, fontWeight: 400,
          color: ACCENT_SAFFRON, lineHeight: 0.5,
          opacity: quoteIn * 0.25,
          transform: `translateY(${interpolate(quoteIn, [0, 1], [15, 0])}px)`,
        }}>
          &#x201C;
        </div>

        {/* Hindi/Sanskrit quote */}
        <div style={{
          fontFamily: FONTS.hindi, fontSize: HINDI_SIZE.BODY_LG, fontWeight: 500,
          color: INK_PRIMARY, lineHeight: HINDI_LINE_HEIGHT + 0.1,
          textAlign: 'center',
          opacity: quoteIn,
          transform: `translateY(${interpolate(quoteIn, [0, 1], [25, 0])}px)`,
          maxWidth: 880,
        }}>
          {quote}
        </div>

        {/* Saffron divider */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 12,
          opacity: dividerIn * 0.5,
          transform: `scaleX(${interpolate(dividerIn, [0, 1], [0, 1])})`,
        }}>
          <div style={{ width: 60, height: 1.5, backgroundColor: ACCENT_SAFFRON, opacity: 0.5 }} />
          <div style={{
            width: 8, height: 8,
            backgroundColor: ACCENT_SAFFRON, opacity: 0.4,
            borderRadius: '50%',
          }} />
          <div style={{ width: 60, height: 1.5, backgroundColor: ACCENT_SAFFRON, opacity: 0.5 }} />
        </div>

        {/* Attribution */}
        {attribution && (
          <div style={{
            fontFamily: FONTS.hindi, fontSize: HINDI_SIZE.BODY_SM, fontWeight: 400,
            color: INK_SECONDARY, textAlign: 'center',
            opacity: attrIn * 0.7,
            transform: `translateY(${interpolate(attrIn, [0, 1], [12, 0])}px)`,
          }}>
            — {attribution}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: 42, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        opacity: attrIn * 0.2,
      }}>
        <span style={{
          fontFamily: FONTS.body, fontSize: 22, fontWeight: 400,
          color: INK_SECONDARY, letterSpacing: 3,
        }}>
          altveda.in
        </span>
      </div>

      {captions && captions.length > 0 && (
        <CaptionOverlay captions={captions} startFrame={captionStartFrame} accentColor={ACCENT_SAFFRON} />
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
