import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import { BRAND, resolveV2Product } from '../../brand';
import { GlassCard, GrainOverlay, BotanicalOverlay, Watermark, OrnamentalDivider } from '../shared/GlassCard';
import { LottieLayer } from '../shared/LottieLayer';
import { FONTS, SIZE, LAYOUT } from '../shared/fonts';
import type { CaptionWord } from '../CaptionOverlay';

export type WellnessTipV2Props = {
  tipHeadline: string;
  tipBody: string;
  whyItWorks?: string;
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
    @font-face { font-family: 'Lora'; src: url('${staticFile('fonts/Lora-Italic-VariableFont_wght.ttf')}') format('truetype'); font-weight: 400 700; font-style: italic; }
  `}</style>
);

export const WellnessTipV2: React.FC<WellnessTipV2Props> = ({
  tipHeadline, tipBody, whyItWorks,
  cta = 'Try This Tomorrow Morning',
  musicTrack, voiceoverSrc, musicVolume, backgroundImage,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: TOTAL } = useVideoConfig();

  const theme = resolveV2Product(backgroundImage || 'moringa.png');
  const exit = interpolate(frame, [TOTAL - 20, TOTAL - 10], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const badgeReveal = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const headlineReveal = interpolate(frame, [15, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bodyReveal = interpolate(frame, [50, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const whyReveal = spring({ frame: frame - 85, fps, config: { damping: 14 } });
  const breathe = 1 + Math.sin(frame / 20) * 0.08;

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, ${theme.gradient[0]}, ${theme.gradient[1]}, ${theme.gradient[2]})`,
    }}>
      <FontLoader />
      <BotanicalOverlay opacity={0.05} />
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

      <LottieLayer src="lottie/floating-leaves.json" width={1080} height={1920}
        enterDelay={0} exitFrame={TOTAL - 25} opacity={0.06} playbackRate={0.5}
        style={{ position: 'absolute', inset: 0 }} />

      <LottieLayer src="lottie/meditation.json" width={200} height={200}
        enterDelay={10} exitFrame={TOTAL - 25} opacity={0.15} playbackRate={0.8}
        style={{ position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)' }} />

      {/* Breathing circles */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%',
        transform: `translate(-50%, -50%) scale(${breathe})`,
        width: 300, height: 300, borderRadius: '50%',
        border: `2px solid ${theme.accent}20`, opacity: 0.4 * exit,
      }} />
      <div style={{
        position: 'absolute', top: '20%', left: '50%',
        transform: `translate(-50%, -50%) scale(${1 / breathe})`,
        width: 200, height: 200, borderRadius: '50%',
        border: `1px solid ${theme.accent}15`, opacity: 0.3 * exit,
      }} />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingTop: LAYOUT.TOP_SAFE, paddingBottom: LAYOUT.BOTTOM_SAFE, opacity: exit }}>
        <GlassCard width="92%" padding={48}>
          {/* Badge */}
          <div style={{
            backgroundColor: `${theme.accent}22`, border: `1px solid ${theme.accent}44`,
            borderRadius: 24, padding: '10px 28px',
            transform: `translateX(${interpolate(badgeReveal, [0, 1], [-40, 0])}px)`, opacity: badgeReveal,
          }}>
            <span style={{
              fontSize: SIZE.LABEL, fontWeight: 700, fontFamily: FONTS.heading,
              color: theme.accent, letterSpacing: 3, textTransform: 'uppercase',
            }}>Wellness Tip</span>
          </div>

          {/* Headline */}
          <div style={{
            fontSize: SIZE.SUBTITLE, fontWeight: 700, fontFamily: FONTS.heading,
            color: theme.textPrimary, textAlign: 'center', lineHeight: 1.3,
            opacity: headlineReveal,
            transform: `translateY(${interpolate(headlineReveal, [0, 1], [15, 0])}px)`,
            maxWidth: '90%',
          }}>{tipHeadline}</div>

          <OrnamentalDivider color={theme.accent} enterDelay={35} />

          {/* Body */}
          <div style={{
            fontSize: SIZE.BODY, fontWeight: 400, fontFamily: FONTS.body,
            color: theme.textSecondary, textAlign: 'center', lineHeight: 1.7,
            opacity: bodyReveal,
            transform: `translateY(${interpolate(bodyReveal, [0, 1], [12, 0])}px)`,
            maxWidth: '85%',
          }}>{tipBody}</div>

          {/* Why it works */}
          {whyItWorks && (
            <div style={{
              width: '85%', borderLeft: `4px solid ${theme.accent}`,
              paddingLeft: 20, marginTop: 8,
              opacity: whyReveal, transform: `translateX(${interpolate(whyReveal, [0, 1], [-20, 0])}px)`,
            }}>
              <div style={{
                fontSize: SIZE.LABEL, fontWeight: 700, fontFamily: FONTS.heading,
                color: theme.accent, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6,
              }}>Why It Works</div>
              <div style={{
                fontSize: SIZE.BODY_SM, fontFamily: FONTS.serif, fontStyle: 'italic',
                color: theme.textSecondary, lineHeight: 1.6,
              }}>{whyItWorks}</div>
            </div>
          )}

          {/* CTA */}
          <div style={{
            backgroundColor: theme.accent, borderRadius: 28, padding: '16px 36px',
            marginTop: 8, opacity: whyReveal, boxShadow: `0 6px 20px ${theme.accent}44`,
          }}>
            <span style={{ color: '#fff', fontSize: SIZE.CTA_BUTTON, fontWeight: 700, fontFamily: FONTS.heading, letterSpacing: 1 }}>
              {cta}
            </span>
          </div>
        </GlassCard>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
