import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import { BRAND, resolveV2Product } from '../../brand';
import { GlassCard, GrainOverlay, BotanicalOverlay, Watermark, OrnamentalDivider } from '../shared/GlassCard';
import { LottieLayer } from '../shared/LottieLayer';
import { DrawingSVG } from '../shared/DrawingSVG';
import { BOTANICAL_PATHS } from '../shared/svg-paths';
import { FONTS, SIZE, LAYOUT } from '../shared/fonts';
import type { CaptionWord } from '../CaptionOverlay';

export type TestimonialV2Props = {
  quote: string;
  attribution?: string;
  headline?: string;
  cta?: string;
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

export const TestimonialV2: React.FC<TestimonialV2Props> = ({
  quote, attribution = '— A Satisfied Customer', headline = 'Real Stories',
  cta = 'Read More Reviews →',
  musicTrack, voiceoverSrc, musicVolume, backgroundImage,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: TOTAL } = useVideoConfig();

  const theme = resolveV2Product(backgroundImage || 'shatavari.png');
  const exit = interpolate(frame, [TOTAL - 20, TOTAL - 10], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const quoteMarkReveal = spring({ frame, fps, config: { damping: 10, stiffness: 40 } });
  const words = quote.split(' ');
  const wordsPerFrame = words.length / 70;

  const headlineReveal = spring({ frame: frame - 5, fps, config: { damping: 14 } });
  const attributionReveal = spring({ frame: frame - 75, fps, config: { damping: 14 } });
  const starsReveal = spring({ frame: frame - 85, fps, config: { damping: 12 } });
  const ctaReveal = spring({ frame: frame - 100, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, ${theme.gradient[0]}, ${theme.gradient[1]}, ${theme.gradient[2]})`,
    }}>
      <FontLoader />
      <BotanicalOverlay opacity={0.04} />
      <GrainOverlay opacity={0.03} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 80% 60% at 50% 45%, transparent 0%, ${theme.bg}cc 100%)`,
        opacity: 0.72,
      }} />
      <Watermark color={theme.accent} />

      {musicTrack && (
        <Audio src={staticFile(`music/${musicTrack}`)} volume={voiceoverSrc ? (musicVolume ?? 0.22) : 0.3} />
      )}
      {voiceoverSrc && (
        <Sequence from={10}><Audio src={staticFile(voiceoverSrc)} volume={1} /></Sequence>
      )}

      {/* Decorative sprig */}
      <div style={{ position: 'absolute', bottom: 120, right: 40, opacity: exit, pointerEvents: 'none' }}>
        <DrawingSVG pathData={BOTANICAL_PATHS.sprig} width={100} height={160}
          color={theme.accent} enterDelay={20} drawDuration={50} opacity={0.12} />
      </div>

      {/* Heart pulse */}
      <LottieLayer src="lottie/heart-pulse.json" width={80} height={80}
        enterDelay={80} exitFrame={TOTAL - 25} opacity={0.2}
        style={{ position: 'absolute', bottom: 340, left: 60, pointerEvents: 'none' }} />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingTop: LAYOUT.TOP_SAFE, paddingBottom: LAYOUT.BOTTOM_SAFE, opacity: exit }}>
        <GlassCard width="92%" padding={48}>
          {/* Badge */}
          <div style={{
            backgroundColor: `${theme.accent}22`, border: `1px solid ${theme.accent}44`,
            borderRadius: 24, padding: '10px 28px', opacity: headlineReveal,
          }}>
            <span style={{
              fontSize: SIZE.LABEL, fontWeight: 700, fontFamily: FONTS.heading,
              color: theme.accent, letterSpacing: 3, textTransform: 'uppercase',
            }}>{headline}</span>
          </div>

          {/* Giant quote mark */}
          <div style={{
            fontSize: 200, fontFamily: FONTS.serif, color: `${theme.accent}30`,
            lineHeight: 0.5, marginTop: 16,
            transform: `scale(${quoteMarkReveal})`, opacity: quoteMarkReveal,
          }}>&ldquo;</div>

          {/* Word-by-word quote */}
          <div style={{
            fontSize: SIZE.BODY_LG, fontFamily: FONTS.serif, fontStyle: 'italic',
            color: theme.textPrimary, textAlign: 'center', lineHeight: 1.7,
            maxWidth: '90%', minHeight: 160,
          }}>
            {words.map((word, i) => {
              const wordFrame = 15 + i / wordsPerFrame;
              const wordOpacity = interpolate(frame, [wordFrame, wordFrame + 3], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              });
              return <span key={i} style={{ opacity: wordOpacity }}>{word}{' '}</span>;
            })}
          </div>

          <OrnamentalDivider color={theme.accent} enterDelay={50} />

          {/* Stars */}
          <div style={{ display: 'flex', gap: 10, opacity: starsReveal, transform: `scale(${starsReveal})` }}>
            {[1, 2, 3, 4, 5].map((star, i) => {
              const starSpring = spring({ frame: frame - 85 - i * 3, fps, config: { damping: 8, stiffness: 100 } });
              return (
                <div key={star} style={{ fontSize: SIZE.BODY_LG, transform: `scale(${starSpring})`, color: BRAND.gold }}>★</div>
              );
            })}
          </div>

          {/* Attribution */}
          <div style={{
            opacity: attributionReveal,
            transform: `translateY(${interpolate(attributionReveal, [0, 1], [10, 0])}px)`,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: SIZE.BODY_SM, fontWeight: 600, fontFamily: FONTS.heading, color: theme.textPrimary }}>
              {attribution}
            </div>
          </div>

          {/* CTA */}
          <div style={{
            backgroundColor: theme.accent, borderRadius: 28, padding: '16px 36px',
            opacity: ctaReveal, boxShadow: `0 6px 20px ${theme.accent}44`,
          }}>
            <span style={{ color: '#fff', fontSize: SIZE.CTA_BUTTON, fontWeight: 700, fontFamily: FONTS.heading }}>
              {cta}
            </span>
          </div>
        </GlassCard>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
