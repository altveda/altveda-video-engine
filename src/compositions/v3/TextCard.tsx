import React from 'react';
import {
  AbsoluteFill, Audio, Img, Sequence,
  Easing, interpolate, staticFile,
  useCurrentFrame, useVideoConfig,
} from 'remotion';
import { Lottie, LottieAnimationData } from '@remotion/lottie';
import { resolveV2Product } from '../../brand';
import { FONTS, LAYOUT } from '../shared/fonts';
import { GrainOverlay } from '../shared/GlassCard';
import { CaptionOverlay, type CaptionWord } from '../CaptionOverlay';

export type TextCardProps = {
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
 * LAYOUT: Split-screen
 * ┌──────────────────┐
 * │   ALTVEDA         │  watermark
 * │                   │
 * │  ┌─────────────┐ │  Top 50%: botanical image
 * │  │  botanical   │ │  visible at 35% opacity
 * │  │  with slow   │ │  slow Ken Burns pan
 * │  │  pan         │ │
 * │  └─────────────┘ │
 * │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  gradient fade zone
 * │                   │
 * │  HEADLINE         │  Bottom 50%: solid bg
 * │  ───              │  large headline (64px)
 * │  Body text here   │  body text (48px)
 * │  that is actually │
 * │  readable         │
 * │                   │
 * │   altveda.in      │  footer
 * └──────────────────┘
 */
export const TextCard: React.FC<TextCardProps> = ({
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
  const lineIn = interpolate(frame, [50, 75], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const bodyIn = interpolate(frame, [65, 95], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });

  // Ken Burns on botanical
  const panX = interpolate(frame, [0, TOTAL], [0, -18], { extrapolateRight: 'clamp' });

  // Lottie leaf
  const [leafData, setLeafData] = React.useState<LottieAnimationData | null>(null);
  React.useEffect(() => {
    fetch(staticFile('lottie/leaf-growth.json'))
      .then(r => r.json())
      .then(setLeafData)
      .catch(() => {});
  }, []);

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <FontLoader />

      {/* Solid base — product bg color */}
      <AbsoluteFill style={{ backgroundColor: theme.bg }} />

      {/* TOP HALF: Botanical image — visible, not hidden */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
        overflow: 'hidden',
      }}>
        <Img
          src={staticFile(`backgrounds/${productKey}.png`)}
          style={{
            width: '180%', height: '140%',
            objectFit: 'cover',
            opacity: fadeIn * 0.35,
            transform: `translateX(${panX}%) translateY(-10%)`,
          }}
        />
        {/* Gradient fade from image to solid bg */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
          background: `linear-gradient(to bottom, transparent, ${theme.bg})`,
        }} />
      </div>

      {/* Lottie leaf — visible organic element in image area */}
      {leafData && (
        <div style={{
          position: 'absolute',
          top: 180, right: -20,
          width: 250, height: 250,
          opacity: 0.1,
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
          fontFamily: FONTS.heading, fontSize: 22, fontWeight: 600,
          color: theme.textPrimary, letterSpacing: 6, textTransform: 'uppercase',
        }}>
          AltVeda
        </span>
      </div>

      {/* BOTTOM HALF: Text content — left-aligned for editorial feel */}
      <div style={{
        position: 'absolute',
        top: '48%',
        bottom: 200,
        left: 80,
        right: 80,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
        gap: 28,
      }}>
        {/* Headline — large, bold, left-aligned */}
        <div style={{
          fontFamily: FONTS.heading, fontSize: 64, fontWeight: 700,
          color: theme.textPrimary, lineHeight: 1.2,
          opacity: headlineIn,
          transform: `translateY(${interpolate(headlineIn, [0, 1], [30, 0])}px)`,
        }}>
          {headline}
        </div>

        {/* Accent line */}
        <div style={{
          width: interpolate(lineIn, [0, 1], [0, 70]),
          height: 3, backgroundColor: theme.accent,
          opacity: lineIn * 0.6, borderRadius: 2,
        }} />

        {/* Body — readable size, left-aligned */}
        <div style={{
          fontFamily: FONTS.serif, fontStyle: 'italic',
          fontSize: 48, fontWeight: 400,
          color: theme.textSecondary, lineHeight: 1.55,
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
