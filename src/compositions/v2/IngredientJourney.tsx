import React from 'react';
import {
  Audio, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import { BRAND, resolveV2Product } from '../../brand';
import { Watermark, ProductBackground } from '../shared/GlassCard';
import { LottieLayer } from '../shared/LottieLayer';
import { FONTS, SIZE } from '../shared/fonts';
import type { CaptionWord } from '../CaptionOverlay';

export type IngredientJourneyProps = {
  product?: string;         // product key for background
  stages?: { title: string; subtitle: string; detail: string; icon?: string }[];
  musicTrack?: string;
  voiceoverSrc?: string;
  musicVolume?: number;
  durationInFrames?: number;
  backgroundImage?: string;
  captions?: CaptionWord[];
  captionStartFrame?: number;
};

const DEFAULT_STAGES = [
  { title: 'The Root', subtitle: 'Grown in the fields of Southern India', detail: 'Harvested at peak potency after 9 months of growth', icon: '🌱' },
  { title: 'The Harvest', subtitle: 'Hand-picked by farming families', detail: 'Each rhizome selected for its deep golden color — a sign of high potency', icon: '🌾' },
  { title: 'The Process', subtitle: 'Cold-extracted to preserve bioactives', detail: '95% standardized extract, enhanced with black pepper for better absorption', icon: '⚗️' },
  { title: 'Your Wellness', subtitle: 'One capsule, centuries of wisdom', detail: 'Anti-inflammatory support, joint comfort, cognitive clarity — in a single daily dose', icon: '✨' },
];

const FontLoader: React.FC = () => (
  <style>{`
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-Bold.ttf')}') format('truetype'); font-weight: 700; }
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-Regular.ttf')}') format('truetype'); font-weight: 400; }
    @font-face { font-family: 'Lora'; src: url('${staticFile('fonts/Lora-Italic-VariableFont_wght.ttf')}') format('truetype'); font-weight: 400 700; font-style: italic; }
  `}</style>
);

export const IngredientJourney: React.FC<IngredientJourneyProps> = ({
  product: productKey = 'curcumin',
  stages = DEFAULT_STAGES,
  musicTrack, voiceoverSrc, musicVolume, backgroundImage,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: TOTAL } = useVideoConfig();

  const bgImage = backgroundImage || `${productKey}.png`;
  const theme = resolveV2Product(bgImage);
  const resolvedKey = bgImage.replace(/\.png$/, '');

  const exit = interpolate(frame, [TOTAL - 15, TOTAL], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const scrollY = interpolate(frame, [0, TOTAL - 10], [0, -1200], { extrapolateRight: 'clamp' });

  return (
    <ProductBackground product={theme} productKey={resolvedKey}>
      <FontLoader />
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <Watermark color={theme.accent} />

        {musicTrack && (
          <Audio src={staticFile(`music/${musicTrack}`)} volume={voiceoverSrc ? (musicVolume ?? 0.22) : 0.3} />
        )}
        {voiceoverSrc && (
          <Sequence from={10}><Audio src={staticFile(voiceoverSrc)} volume={1} /></Sequence>
        )}

        {/* Timeline line */}
        <div style={{
          position: 'absolute', left: 80, top: 0, bottom: 0, width: 3,
          background: `linear-gradient(180deg, ${theme.accent}00, ${theme.accent}44 20%, ${theme.accent}44 80%, ${theme.accent}00)`,
          opacity: exit,
        }} />

        {/* Scrolling stages */}
        <div style={{
          position: 'absolute', top: 350, left: 0, right: 0,
          transform: `translateY(${scrollY}px)`, opacity: exit,
        }}>
          {stages.map((stage, i) => {
            const stageY = i * 400;
            const distFromView = Math.abs((-scrollY) - stageY + 200);
            const visibility = interpolate(distFromView, [0, 400], [1, 0], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            const stageSpring = spring({
              frame: Math.max(0, frame - i * 25 - 10), fps, config: { damping: 14 },
            });

            return (
              <div key={stage.title} style={{
                position: 'absolute', top: stageY, left: 60, right: 60,
                display: 'flex', gap: 30, alignItems: 'flex-start',
                opacity: stageSpring * Math.max(0.2, visibility),
                transform: `translateX(${interpolate(stageSpring, [0, 1], [40, 0])}px)`,
              }}>
                {/* Timeline dot */}
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  backgroundColor: `${theme.accent}${visibility > 0.5 ? 'ff' : '44'}`,
                  border: `3px solid ${theme.accent}`,
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  fontSize: 20, flexShrink: 0,
                  boxShadow: visibility > 0.5 ? `0 0 20px ${theme.accent}44` : 'none',
                }}>{stage.icon || '●'}</div>

                {/* Content card */}
                <div style={{
                  flex: 1,
                  background: `linear-gradient(160deg, rgba(255,255,255,0.50), rgba(255,255,255,0.25))`,
                  backdropFilter: 'blur(24px) saturate(1.5)',
                  borderRadius: 28, border: `1.5px solid rgba(255,255,255,0.45)`,
                  padding: 32, boxShadow: `0 12px 40px rgba(0,0,0,0.08)`,
                }}>
                  <div style={{
                    fontSize: SIZE.LABEL, fontWeight: 700, fontFamily: FONTS.heading,
                    color: theme.accent, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8,
                  }}>Stage {i + 1}</div>
                  <div style={{
                    fontSize: SIZE.BODY_LG, fontWeight: 700, fontFamily: FONTS.heading,
                    color: theme.textPrimary, lineHeight: 1.2, marginBottom: 6,
                  }}>{stage.title}</div>
                  <div style={{
                    fontSize: SIZE.BODY_SM, fontFamily: FONTS.serif, fontStyle: 'italic',
                    color: theme.accent, marginBottom: 12,
                  }}>{stage.subtitle}</div>
                  <div style={{
                    fontSize: SIZE.BODY_SM, fontFamily: FONTS.body, color: theme.textSecondary, lineHeight: 1.6,
                  }}>{stage.detail}</div>
                </div>
              </div>
            );
          })}
        </div>

        <LottieLayer src="lottie/mortar-pestle.json" width={140} height={140}
          enterDelay={60} exitFrame={TOTAL - 20} opacity={0.2} playbackRate={0.8}
          style={{ position: 'absolute', top: 200, right: 40, pointerEvents: 'none' }} />
      </div>
    </ProductBackground>
  );
};
