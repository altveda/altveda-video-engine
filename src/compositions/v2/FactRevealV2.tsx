import React from 'react';
import {
  AbsoluteFill, Audio, Easing, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import { BRAND, resolveV2Product } from '../../brand';
import { GlassCard, GrainOverlay, BotanicalOverlay, Watermark, OrnamentalDivider } from '../shared/GlassCard';
import { LottieLayer } from '../shared/LottieLayer';
import { FONTS, SIZE, LAYOUT } from '../shared/fonts';
import type { CaptionWord } from '../CaptionOverlay';

export type FactRevealV2Props = {
  fact: string;
  context: string;
  source?: string;
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
  `}</style>
);

export const FactRevealV2: React.FC<FactRevealV2Props> = ({
  fact, context, source, cta = 'Explore Now →',
  musicTrack, voiceoverSrc, musicVolume, backgroundImage,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: TOTAL } = useVideoConfig();

  const theme = resolveV2Product(backgroundImage || 'curcumin.png');
  const exit = interpolate(frame, [TOTAL - 20, TOTAL - 10], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const labelReveal = spring({ frame, fps, config: { damping: 15 } });

  // Extract number from fact for counter animation
  const numberMatch = fact.match(/(\d+(?:\.\d+)?)/);
  const targetNumber = numberMatch ? parseFloat(numberMatch[1]) : 0;
  const counterProgress = interpolate(frame, [20, 80], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
  });
  const displayNumber = numberMatch
    ? (numberMatch[1].includes('.') ? (targetNumber * counterProgress).toFixed(1) : Math.round(targetNumber * counterProgress).toString())
    : '';

  const numberDone = counterProgress >= 0.99;
  const numberPulse = numberDone
    ? 1 + Math.sin((frame - 80) / 8) * 0.03
    : interpolate(counterProgress, [0, 0.5, 1], [0.7, 0.9, 1]);

  const contextReveal = spring({ frame: frame - 60, fps, config: { damping: 14 } });
  const sourceReveal = spring({ frame: frame - 85, fps, config: { damping: 14 } });
  const ctaReveal = spring({ frame: frame - 105, fps, config: { damping: 12 } });

  // Radiating rings
  const rings = Array.from({ length: 3 }, (_, i) => {
    const ringScale = interpolate((frame - 40 + i * 15) % 60, [0, 60], [0.5, 2.5], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
    const ringOpacity = interpolate((frame - 40 + i * 15) % 60, [0, 60], [0.3, 0], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
    return { scale: ringScale, opacity: frame > 40 ? ringOpacity : 0 };
  });

  // Split fact text around the number
  const beforeNum = numberMatch ? fact.substring(0, numberMatch.index) : '';
  const afterNum = numberMatch ? fact.substring((numberMatch.index || 0) + numberMatch[1].length) : fact;

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, ${theme.gradient[0]}, ${theme.gradient[1]}, ${theme.gradient[2]})`,
    }}>
      <FontLoader />
      <BotanicalOverlay opacity={0.04} />
      <GrainOverlay opacity={0.03} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, ${theme.bg}cc 100%)`,
        opacity: 0.72,
      }} />
      <Watermark color={theme.accent} />

      {musicTrack && (
        <Audio src={staticFile(`music/${musicTrack}`)} volume={voiceoverSrc ? (musicVolume ?? 0.22) : 0.3} />
      )}
      {voiceoverSrc && (
        <Sequence from={10}><Audio src={staticFile(voiceoverSrc)} volume={1} /></Sequence>
      )}

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingTop: LAYOUT.TOP_SAFE, paddingBottom: LAYOUT.BOTTOM_SAFE, opacity: exit }}>
        <GlassCard width="92%" padding={48}>
          {/* "Did you know?" */}
          <div style={{
            fontSize: SIZE.LABEL, fontWeight: 600, fontFamily: FONTS.heading,
            color: theme.accent, letterSpacing: 4, textTransform: 'uppercase',
            opacity: labelReveal, transform: `scale(${labelReveal})`,
          }}>Did You Know?</div>

          {/* Big number with rings */}
          <div style={{ position: 'relative', margin: '16px 0' }}>
            {rings.map((ring, i) => (
              <div key={i} style={{
                position: 'absolute', top: '50%', left: '50%', width: 160, height: 160,
                borderRadius: '50%', border: `2px solid ${theme.accent}`,
                transform: `translate(-50%, -50%) scale(${ring.scale})`, opacity: ring.opacity,
              }} />
            ))}
            {numberMatch ? (
              <div style={{
                fontSize: 120, fontWeight: 900, fontFamily: FONTS.heading,
                color: theme.accent, lineHeight: 1, textAlign: 'center',
                transform: `scale(${numberPulse})`,
                textShadow: `0 4px 20px ${theme.accent}33`, position: 'relative',
              }}>{displayNumber}{afterNum.startsWith('%') ? '%' : ''}</div>
            ) : null}
          </div>

          {numberDone && (
            <LottieLayer src="lottie/sparkle-burst.json" width={200} height={200}
              enterDelay={75} exitFrame={TOTAL - 25} opacity={0.3} loop={false} playbackRate={0.8}
              style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)' }} />
          )}

          {/* Fact text */}
          <div style={{
            fontSize: SIZE.BODY_LG, fontWeight: 600, fontFamily: FONTS.heading,
            color: theme.textPrimary, textAlign: 'center', lineHeight: 1.4,
            maxWidth: '90%', opacity: labelReveal,
          }}>{numberMatch ? `${beforeNum}${fact.match(/\d+(?:\.\d+)?%?/)?.[0] || ''}${afterNum.replace(/^%/, '')}` : fact}</div>

          <OrnamentalDivider color={theme.accent} enterDelay={50} />

          {/* Context */}
          <div style={{
            fontSize: SIZE.BODY_SM, fontFamily: FONTS.body, color: theme.textSecondary,
            textAlign: 'center', lineHeight: 1.6, maxWidth: '85%',
            opacity: contextReveal, transform: `translateY(${interpolate(contextReveal, [0, 1], [10, 0])}px)`,
          }}>{context}</div>

          {/* Source */}
          {source && (
            <div style={{
              fontSize: SIZE.CAPTION, fontFamily: FONTS.body, color: `${theme.textSecondary}88`,
              fontStyle: 'italic', opacity: sourceReveal,
            }}>Source: {source}</div>
          )}

          {/* CTA */}
          <div style={{
            backgroundColor: theme.accent, borderRadius: 28, padding: '16px 36px',
            marginTop: 8, opacity: ctaReveal, transform: `scale(${ctaReveal})`,
            boxShadow: `0 6px 20px ${theme.accent}44`,
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
