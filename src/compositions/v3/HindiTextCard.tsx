import React from 'react';
import {
  AbsoluteFill, Audio, Img, Sequence,
  Easing, interpolate, staticFile,
  useCurrentFrame, useVideoConfig,
} from 'remotion';
import { Lottie, LottieAnimationData } from '@remotion/lottie';
import { resolveV2Product } from '../../brand';
import { FONTS, LAYOUT, HINDI_SIZE, HINDI_LINE_HEIGHT } from '../shared/fonts';
import { GrainOverlay } from '../shared/GlassCard';
import { HindiFontLoader } from '../shared/HindiFontLoader';
import { CaptionOverlay, type CaptionWord } from '../CaptionOverlay';

export type HindiTextCardProps = {
  headline: string;
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

// Saffron-cream warm palette — distinct from English pastel
const SAFFRON_GRADIENT = 'linear-gradient(175deg, #FFF5E6 0%, #FDE8C8 25%, #FAEBD7 50%, #FFF8F0 100%)';

/*
 * LAYOUT: Hindi content card — warm saffron aesthetic
 * ┌──────────────────┐
 * │    ॐ ALTVEDA      │  watermark
 * │                   │
 * │  ┌─────────────┐ │  Top 45%: botanical image
 * │  │  botanical   │ │  warm-tinted, 30% opacity
 * │  │  Ken Burns   │ │
 * │  └─────────────┘ │
 * │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  gradient fade
 * │                   │
 * │  हिंदी हेडलाइन     │  Devanagari headline (56px bold)
 * │  ═══╤══╤═══       │  mandala divider
 * │  बॉडी टेक्स्ट        │  body (44px regular)
 * │  readable Hindi   │
 * │                   │
 * │   altveda.in      │  footer
 * └──────────────────┘
 */
export const HindiTextCard: React.FC<HindiTextCardProps> = ({
  headline, body, backgroundImage, musicTrack,
  voiceoverSrc, musicVolume = 0.22, captions, captionStartFrame = 20,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames: TOTAL } = useVideoConfig();
  const theme = resolveV2Product(backgroundImage);
  const productKey = backgroundImage?.replace(/\.png$/, '') || 'ashwagandha';

  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp', easing: EASE });
  const exit = interpolate(frame, [TOTAL - 25, TOTAL - 5], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const headlineIn = interpolate(frame, [25, 55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const dividerIn = interpolate(frame, [50, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const bodyIn = interpolate(frame, [70, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });

  // Ken Burns pan
  const panX = interpolate(frame, [0, TOTAL], [0, -15], { extrapolateRight: 'clamp' });

  // Lottie leaf
  const [leafData, setLeafData] = React.useState<LottieAnimationData | null>(null);
  React.useEffect(() => {
    fetch(staticFile('lottie/leaf-growth.json'))
      .then(r => r.json())
      .then(setLeafData)
      .catch(() => {});
  }, []);

  // Warm tint overlay for the botanical (saffron shift)
  const warmOverlay = `linear-gradient(to bottom, rgba(253, 200, 120, 0.15), transparent 60%)`;

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <HindiFontLoader />

      {/* Warm saffron-cream base */}
      <AbsoluteFill style={{ background: SAFFRON_GRADIENT }} />

      {/* TOP: Botanical with warm tint */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '45%',
        overflow: 'hidden',
      }}>
        <Img
          src={staticFile(`backgrounds/${productKey}.png`)}
          style={{
            width: '180%', height: '140%',
            objectFit: 'cover',
            opacity: fadeIn * 0.30,
            transform: `translateX(${panX}%) translateY(-10%)`,
          }}
        />
        {/* Warm tint */}
        <div style={{ position: 'absolute', inset: 0, background: warmOverlay }} />
        {/* Gradient fade to saffron base */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%',
          background: 'linear-gradient(to bottom, transparent, #FFF5E6)',
        }} />
      </div>

      {/* Lottie leaf */}
      {leafData && (
        <div style={{
          position: 'absolute', top: 160, right: -20,
          width: 240, height: 240, opacity: 0.08,
          transform: 'rotate(25deg)',
        }}>
          <Lottie animationData={leafData} playbackRate={0.4} />
        </div>
      )}

      <GrainOverlay opacity={0.02} />

      {/* Watermark */}
      <div style={{
        position: 'absolute', top: 40, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        opacity: fadeIn * 0.35,
      }}>
        <span style={{
          fontFamily: FONTS.hindi, fontSize: 22, fontWeight: 600,
          color: theme.textPrimary, letterSpacing: 6, textTransform: 'uppercase',
        }}>
          AltVeda
        </span>
      </div>

      {/* BOTTOM: Hindi text content */}
      <div style={{
        position: 'absolute',
        top: '44%',
        bottom: 200,
        left: 70,
        right: 70,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
        gap: 24,
      }}>
        {/* Hindi Headline */}
        <div style={{
          fontFamily: FONTS.hindi, fontSize: HINDI_SIZE.TITLE, fontWeight: 700,
          color: theme.textPrimary, lineHeight: HINDI_LINE_HEIGHT,
          opacity: headlineIn,
          transform: `translateY(${interpolate(headlineIn, [0, 1], [30, 0])}px)`,
        }}>
          {headline}
        </div>

        {/* Mandala-inspired divider — SVG inline */}
        <div style={{
          opacity: dividerIn * 0.6,
          transform: `scaleX(${interpolate(dividerIn, [0, 1], [0, 1])})`,
          transformOrigin: 'left center',
          height: 40,
          display: 'flex', alignItems: 'center',
          color: theme.accent,
        }}>
          <svg viewBox="0 0 800 40" style={{ width: '100%', height: 40 }}>
            {/* Center mandala dot */}
            <circle cx="400" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.6"/>
            <circle cx="400" cy="20" r="5" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
            <circle cx="400" cy="20" r="2" fill="currentColor" opacity="0.5"/>
            {/* Petal dots */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <circle
                  key={angle}
                  cx={400 + Math.cos(rad) * 18}
                  cy={20 + Math.sin(rad) * 18}
                  r="1.8"
                  fill="currentColor"
                  opacity="0.35"
                />
              );
            })}
            {/* Lines */}
            <line x1="80" y1="20" x2="375" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.25"/>
            <line x1="425" y1="20" x2="720" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.25"/>
            <circle cx="80" cy="20" r="2.5" fill="currentColor" opacity="0.2"/>
            <circle cx="720" cy="20" r="2.5" fill="currentColor" opacity="0.2"/>
          </svg>
        </div>

        {/* Hindi Body */}
        <div style={{
          fontFamily: FONTS.hindi, fontSize: HINDI_SIZE.BODY_LG, fontWeight: 400,
          color: theme.textSecondary, lineHeight: HINDI_LINE_HEIGHT,
          opacity: bodyIn,
          transform: `translateY(${interpolate(bodyIn, [0, 1], [20, 0])}px)`,
        }}>
          {body}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: 36, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        opacity: bodyIn * 0.3,
      }}>
        <span style={{
          fontFamily: FONTS.body, fontSize: 22, fontWeight: 400,
          color: theme.textSecondary, letterSpacing: 3,
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
