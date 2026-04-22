import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import { BRAND } from '../../brand';
import { GrainOverlay, Watermark } from '../shared/GlassCard';
import { LottieLayer } from '../shared/LottieLayer';
import { FONTS, SIZE } from '../shared/fonts';
import type { CaptionWord } from '../CaptionOverlay';

export type BeforeAfterProps = {
  headline?: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeItems?: { icon: string; text: string }[];
  afterItems?: { icon: string; text: string }[];
  tagline?: string;
  cta?: string;
  musicTrack?: string;
  voiceoverSrc?: string;
  musicVolume?: number;
  durationInFrames?: number;
  backgroundImage?: string;
  captions?: CaptionWord[];
  captionStartFrame?: number;
};

const DEFAULT_BEFORE = [
  { icon: '😴', text: 'Afternoon energy crashes' },
  { icon: '😰', text: 'Elevated stress & poor sleep' },
  { icon: '🤧', text: 'Frequent seasonal illness' },
  { icon: '💭', text: 'Brain fog & low motivation' },
];

const DEFAULT_AFTER = [
  { icon: '⚡', text: 'Sustained energy all day' },
  { icon: '😌', text: 'Calm mind & deep sleep' },
  { icon: '💪', text: 'Stronger immune resilience' },
  { icon: '✨', text: 'Sharp focus & clarity' },
];

const FontLoader: React.FC = () => (
  <style>{`
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-Bold.ttf')}') format('truetype'); font-weight: 700; }
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-SemiBold.ttf')}') format('truetype'); font-weight: 600; }
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-Regular.ttf')}') format('truetype'); font-weight: 400; }
    @font-face { font-family: 'Lora'; src: url('${staticFile('fonts/Lora-Italic-VariableFont_wght.ttf')}') format('truetype'); font-weight: 400 700; font-style: italic; }
  `}</style>
);

export const BeforeAfter: React.FC<BeforeAfterProps> = ({
  headline = '30 Days of Consistency',
  beforeLabel = 'Before',
  afterLabel = 'After 30 Days',
  beforeItems = DEFAULT_BEFORE,
  afterItems = DEFAULT_AFTER,
  tagline = 'Small habits. Big transformation.',
  cta = 'Start Your Journey →',
  musicTrack, voiceoverSrc, musicVolume,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: TOTAL } = useVideoConfig();

  const exit = interpolate(frame, [TOTAL - 15, TOTAL], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const titleReveal = spring({ frame, fps, config: { damping: 14 } });
  const vsReveal = spring({ frame: frame - 35, fps, config: { damping: 10, stiffness: 80 } });

  const terracotta = '#C07050';

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, #FAF7F2, #F5F1EA)`, overflow: 'hidden',
    }}>
      <FontLoader />
      <GrainOverlay opacity={0.03} />
      <Watermark color={BRAND.sage} />

      {musicTrack && (
        <Audio src={staticFile(`music/${musicTrack}`)} volume={voiceoverSrc ? (musicVolume ?? 0.22) : 0.3} />
      )}
      {voiceoverSrc && (
        <Sequence from={10}><Audio src={staticFile(voiceoverSrc)} volume={1} /></Sequence>
      )}

      <AbsoluteFill style={{ opacity: exit }}>
        {/* Title */}
        <div style={{
          position: 'absolute', top: 80, left: 0, right: 0, textAlign: 'center',
          opacity: titleReveal,
        }}>
          <div style={{ fontSize: SIZE.LABEL, fontWeight: 700, fontFamily: FONTS.heading, color: BRAND.sage, letterSpacing: 4, textTransform: 'uppercase' }}>
            The Altveda Difference
          </div>
          <div style={{ fontSize: SIZE.SUBTITLE, fontWeight: 700, fontFamily: FONTS.heading, color: '#2C2C2C', marginTop: 8 }}>
            {headline}
          </div>
        </div>

        {/* Split screen */}
        <div style={{
          position: 'absolute', top: 220, left: 40, right: 40, bottom: 180,
          display: 'flex', gap: 16,
        }}>
          {/* BEFORE side */}
          <div style={{
            flex: 1, background: `linear-gradient(180deg, #D5CFC888, #D5CFC844)`,
            borderRadius: 28, padding: 28, border: `1.5px solid #D5CFC8`,
          }}>
            <div style={{ fontSize: SIZE.LABEL, fontWeight: 700, fontFamily: FONTS.heading, color: terracotta, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16, textAlign: 'center' }}>
              {beforeLabel}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {beforeItems.map((item, i) => {
                const itemSpring = spring({ frame: frame - 10 - i * 10, fps, config: { damping: 12 } });
                return (
                  <div key={item.text} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    opacity: itemSpring,
                    transform: `translateX(${interpolate(itemSpring, [0, 1], [-20, 0])}px)`,
                  }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 14,
                      backgroundColor: `${terracotta}15`, border: `1px solid ${terracotta}25`,
                      display: 'flex', justifyContent: 'center', alignItems: 'center',
                      fontSize: 24, flexShrink: 0,
                    }}>{item.icon}</div>
                    <div style={{ fontSize: SIZE.BODY_SM, fontFamily: FONTS.body, color: '#2C2C2C', lineHeight: 1.3 }}>
                      {item.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AFTER side */}
          <div style={{
            flex: 1, background: `linear-gradient(180deg, #eaf5e8, #c4dcc088)`,
            borderRadius: 28, padding: 28, border: `1.5px solid ${BRAND.sage}33`,
          }}>
            <div style={{ fontSize: SIZE.LABEL, fontWeight: 700, fontFamily: FONTS.heading, color: BRAND.sage, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16, textAlign: 'center' }}>
              {afterLabel}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {afterItems.map((item, i) => {
                const itemSpring = spring({ frame: frame - 50 - i * 10, fps, config: { damping: 12 } });
                return (
                  <div key={item.text} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    opacity: itemSpring,
                    transform: `translateX(${interpolate(itemSpring, [0, 1], [20, 0])}px)`,
                  }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 14,
                      backgroundColor: `${BRAND.sage}20`, border: `1px solid ${BRAND.sage}35`,
                      display: 'flex', justifyContent: 'center', alignItems: 'center',
                      fontSize: 24, flexShrink: 0,
                    }}>{item.icon}</div>
                    <div style={{ fontSize: SIZE.BODY_SM, fontFamily: FONTS.body, color: '#1a3a16', fontWeight: 600, lineHeight: 1.3 }}>
                      {item.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sparkle burst on After side */}
        <LottieLayer src="lottie/sparkle-burst.json" width={200} height={200}
          enterDelay={55} exitFrame={TOTAL - 20} opacity={0.2} loop={false} playbackRate={0.7}
          style={{ position: 'absolute', top: 300, right: 20, pointerEvents: 'none' }} />

        {/* VS badge */}
        <div style={{
          position: 'absolute', top: 520, left: '50%',
          transform: `translate(-50%, -50%) scale(${vsReveal})`,
          width: 56, height: 56, borderRadius: '50%',
          backgroundColor: BRAND.gold,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          boxShadow: `0 4px 16px ${BRAND.gold}44`, zIndex: 10, opacity: vsReveal,
        }}>
          <span style={{ color: '#fff', fontSize: 16, fontWeight: 900, fontFamily: FONTS.heading }}>→</span>
        </div>

        {/* Bottom tagline + CTA */}
        <div style={{
          position: 'absolute', bottom: 80, left: 0, right: 0, textAlign: 'center',
          opacity: spring({ frame: frame - 100, fps, config: { damping: 14 } }),
        }}>
          <div style={{ fontSize: SIZE.BODY_SM, fontFamily: FONTS.serif, fontStyle: 'italic', color: '#4A4A4A' }}>
            {tagline}
          </div>
          <div style={{
            display: 'inline-block', backgroundColor: BRAND.sage, borderRadius: 28,
            padding: '16px 36px', marginTop: 16,
            boxShadow: `0 6px 20px ${BRAND.sage}44`,
          }}>
            <span style={{ color: '#fff', fontSize: SIZE.CTA_BUTTON, fontWeight: 700, fontFamily: FONTS.heading }}>
              {cta}
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
