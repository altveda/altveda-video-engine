import React from 'react';
import {
  AbsoluteFill, Audio, Sequence,
  Easing, interpolate, staticFile,
  useCurrentFrame, useVideoConfig,
} from 'remotion';
import { BRAND } from '../../brand';
import { FONTS, LAYOUT } from '../shared/fonts';
import { GrainOverlay } from '../shared/GlassCard';
import { CaptionOverlay, type CaptionWord } from '../CaptionOverlay';

export type QuoteCardProps = {
  quote: string;
  attribution?: string;
  musicTrack?: string;
  voiceoverSrc?: string;
  musicVolume?: number;
  durationInFrames?: number;
  captions?: CaptionWord[];
  captionStartFrame?: number;
};

const FontLoader: React.FC = () => (
  <style>{`
    @font-face { font-family: 'Lora'; src: url('${staticFile('fonts/Lora-VariableFont_wght.ttf')}') format('truetype'); font-weight: 400 700; }
    @font-face { font-family: 'Lora'; src: url('${staticFile('fonts/Lora-Italic-VariableFont_wght.ttf')}') format('truetype'); font-style: italic; }
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-Regular.ttf')}') format('truetype'); font-weight: 400; }
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-SemiBold.ttf')}') format('truetype'); font-weight: 600; }
  `}</style>
);

const EASE = Easing.bezier(0.25, 0.1, 0.25, 1);

/*
 * LAYOUT: Giant quote marks as visual anchor
 * ┌──────────────────┐
 * │    ALTVEDA        │
 * │                   │
 * │                   │
 * │   ❝              │  Giant open quote mark (220px)
 * │                   │  very light sage, decorative
 * │   Quote text      │  Large serif italic (52px)
 * │   that fills      │  centered, readable
 * │   the space       │
 * │                   │
 * │          ❞        │  Giant close quote mark
 * │                   │
 * │   — Attribution   │  small caps
 * │                   │
 * │    altveda.in     │
 * └──────────────────┘
 */
export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote, attribution, musicTrack,
  voiceoverSrc, musicVolume = 0.22, captions, captionStartFrame = 20,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames: TOTAL } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp', easing: EASE });
  const exit = interpolate(frame, [TOTAL - 30, TOTAL - 5], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Giant quote marks fade in first
  const quoteMarkIn = interpolate(frame, [10, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  // Quote text after
  const quoteIn = interpolate(frame, [35, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const attrIn = interpolate(frame, [65, 95], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });

  return (
    <AbsoluteFill style={{ backgroundColor: '#FDFBF7', opacity: exit }}>
      <FontLoader />
      <GrainOverlay opacity={0.015} />

      {/* Watermark */}
      <div style={{
        position: 'absolute', top: 40, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        opacity: fadeIn * 0.3,
      }}>
        <span style={{
          fontFamily: FONTS.heading, fontSize: 22, fontWeight: 600,
          color: BRAND.sage, letterSpacing: 6, textTransform: 'uppercase',
        }}>
          AltVeda
        </span>
      </div>

      {/* Giant opening quote mark — decorative anchor */}
      <div style={{
        position: 'absolute',
        top: 280, left: 60,
        fontFamily: 'Georgia, serif',
        fontSize: 280,
        color: BRAND.sage,
        opacity: quoteMarkIn * 0.12,
        lineHeight: 1,
        userSelect: 'none',
      }}>
        {'\u201C'}
      </div>

      {/* Giant closing quote mark */}
      <div style={{
        position: 'absolute',
        bottom: 420, right: 60,
        fontFamily: 'Georgia, serif',
        fontSize: 280,
        color: BRAND.sage,
        opacity: quoteMarkIn * 0.12,
        lineHeight: 1,
        userSelect: 'none',
      }}>
        {'\u201D'}
      </div>

      {/* Content zone — quote centered between the marks */}
      <div style={{
        position: 'absolute',
        top: LAYOUT.TOP_SAFE + 200,
        bottom: 350,
        left: 90,
        right: 90,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 48,
      }}>
        {/* Quote — large, readable, centered */}
        <div style={{
          fontFamily: FONTS.serif, fontStyle: 'italic',
          fontSize: 52, fontWeight: 400,
          color: BRAND.charcoal, textAlign: 'center', lineHeight: 1.6,
          opacity: quoteIn,
          transform: `translateY(${interpolate(quoteIn, [0, 1], [25, 0])}px)`,
        }}>
          {quote}
        </div>

        {/* Attribution */}
        {attribution && (
          <div style={{
            fontFamily: FONTS.body, fontSize: 32, fontWeight: 400,
            color: BRAND.sage,
            letterSpacing: 2,
            textTransform: 'uppercase',
            opacity: attrIn,
          }}>
            {attribution}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: 36, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        opacity: attrIn * 0.2,
      }}>
        <span style={{
          fontFamily: FONTS.body, fontSize: 22, fontWeight: 400,
          color: BRAND.sage, letterSpacing: 3,
        }}>
          altveda.in
        </span>
      </div>

      {captions && captions.length > 0 && (
        <CaptionOverlay captions={captions} startFrame={captionStartFrame} accentColor={BRAND.sage} />
      )}
      {musicTrack && (
        <Audio src={staticFile(`music/${musicTrack}`)} volume={voiceoverSrc ? musicVolume : 0.25} startFrom={0} />
      )}
      {voiceoverSrc && (
        <Sequence from={10}><Audio src={staticFile(voiceoverSrc)} volume={1} /></Sequence>
      )}
    </AbsoluteFill>
  );
};
