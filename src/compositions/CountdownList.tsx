import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Easing,
} from 'remotion';
import { BRAND } from '../brand';
import { BackgroundLayer, PRODUCT_THEMES } from './BackgroundLayer';
import { CaptionOverlay, type CaptionWord } from './CaptionOverlay';

export type CountdownItem = {
  text: string;
  subtext?: string;
};

export type CountdownListProps = {
  headline: string;        // e.g. "3 Reasons to Try Ashwagandha"
  items: CountdownItem[];  // 2-5 items, revealed one by one
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
  <style>
    {`
      @font-face {
        font-family: 'Poppins';
        src: url('${staticFile('fonts/Poppins-Regular.ttf')}') format('truetype');
        font-weight: 400; font-style: normal;
      }
      @font-face {
        font-family: 'Poppins';
        src: url('${staticFile('fonts/Poppins-Medium.ttf')}') format('truetype');
        font-weight: 500; font-style: normal;
      }
      @font-face {
        font-family: 'Poppins';
        src: url('${staticFile('fonts/Poppins-SemiBold.ttf')}') format('truetype');
        font-weight: 600; font-style: normal;
      }
      @font-face {
        font-family: 'Poppins';
        src: url('${staticFile('fonts/Poppins-Bold.ttf')}') format('truetype');
        font-weight: 700; font-style: normal;
      }
    `}
  </style>
);

const ProgressBar: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = frame / durationInFrames;
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: 4, backgroundColor: 'rgba(0,0,0,0.15)', zIndex: 100,
    }}>
      <div style={{
        width: `${progress * 100}%`, height: '100%',
        backgroundColor: accentColor, borderRadius: '0 2px 2px 0',
      }} />
    </div>
  );
};

export const CountdownList: React.FC<CountdownListProps> = ({
  headline, items, cta, musicTrack, voiceoverSrc, musicVolume, backgroundImage, captions, captionStartFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: TOTAL } = useVideoConfig();

  const theme = backgroundImage ? PRODUCT_THEMES[backgroundImage] : null;
  const accent = theme ? theme.accent : BRAND.gold;
  const textPrimary = theme ? theme.textPrimary : BRAND.cream;
  const textSecondary = theme ? theme.textSecondary : 'rgba(255,255,255,0.8)';

  const overlayRGB = theme?.overlayColor || '44,44,44';
  const cardBg = theme
    ? `linear-gradient(135deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.30) 100%)`
    : 'rgba(30, 30, 30, 0.55)';
  const cardBorder = theme
    ? '2px solid rgba(255,255,255,0.50)'
    : '1px solid rgba(255,255,255,0.1)';
  const numberBg = theme
    ? `rgba(${theme.overlayColor}, 0.35)`
    : 'rgba(255,255,255,0.15)';

  // Headline entrance (0-30)
  const headlineOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const headlineY = interpolate(frame, [0, 25], [-40, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Calculate item reveal timing — evenly spaced across middle 60% of video
  const itemsStartFrame = Math.round(TOTAL * 0.15);
  const itemsEndFrame = Math.round(TOTAL * 0.78);
  const itemSpacing = items.length > 1
    ? (itemsEndFrame - itemsStartFrame) / (items.length)
    : 0;

  // CTA (last 25%)
  const ctaStart = Math.round(TOTAL * 0.8);
  const ctaOpacity = interpolate(frame, [ctaStart, ctaStart + 20], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Fade out
  const fadeOut = interpolate(frame, [TOTAL - 15, TOTAL], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <BackgroundLayer
        imageSrc={backgroundImage}
        fallbackGradient={`linear-gradient(160deg, ${BRAND.sage} 0%, #6b8a6e 60%, #5a7a5d 100%)`}
        artPan={interpolate(frame, [0, TOTAL], [10, 70], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        })}
      />
      <FontLoader />
      <ProgressBar accentColor={accent} />

      {musicTrack && (
        <Audio src={staticFile(`music/${musicTrack}`)} volume={voiceoverSrc ? (musicVolume ?? 0.22) : 0.3} />
      )}
      {voiceoverSrc && (
        <Sequence from={10}>
          <Audio src={staticFile(voiceoverSrc)} volume={1} />
        </Sequence>
      )}

      {/* Reading-zone overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 70% 50% at 50% 40%, rgba(${overlayRGB},0.72) 0%, rgba(${overlayRGB},0.45) 50%, rgba(${overlayRGB},0.15) 100%)`,
        zIndex: 1,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 80% 75% at 50% 40%, transparent 45%, rgba(${overlayRGB},0.45) 100%)`,
        zIndex: 1,
      }} />

      {/* Center card — shifted up with paddingBottom */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '16%',
      }}>
        <div style={{
          width: '86%',
          padding: '48px 44px 40px',
          borderRadius: 40,
          backdropFilter: 'blur(32px) saturate(2.0)',
          WebkitBackdropFilter: 'blur(32px) saturate(2.0)',
          background: cardBg,
          border: cardBorder,
          boxShadow: theme
            ? 'inset 0 1px 2px rgba(255,255,255,0.5), 0 4px 20px rgba(0,0,0,0.18), 0 20px 80px rgba(0,0,0,0.22)'
            : '0 8px 48px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Headline */}
          <p style={{
            fontFamily: 'Poppins, sans-serif', fontSize: 44, fontWeight: 700,
            color: textPrimary, textAlign: 'center', lineHeight: 1.25,
            margin: 0, marginBottom: 36,
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
          }}>
            {headline}
          </p>

          {/* Numbered items */}
          {items.map((item, idx) => {
            const itemStart = itemsStartFrame + idx * itemSpacing;
            const itemOpacity = interpolate(frame, [itemStart, itemStart + 20], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            const itemX = interpolate(frame, [itemStart, itemStart + 20], [-60, 0], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              easing: Easing.out(Easing.cubic),
            });
            const numberScale = spring({
              frame: frame - itemStart, fps,
              config: { stiffness: 80, damping: 14 },
              from: 0, to: 1,
            });

            return (
              <div
                key={idx}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 20,
                  marginBottom: idx < items.length - 1 ? 24 : 0,
                  opacity: itemOpacity,
                  transform: `translateX(${itemX}px)`,
                }}
              >
                {/* Number circle */}
                <div style={{
                  width: 64, height: 64, minWidth: 64,
                  borderRadius: 32,
                  background: numberBg,
                  border: `2px solid ${accent}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transform: `scale(${numberScale})`,
                }}>
                  <span style={{
                    fontFamily: 'Poppins, sans-serif', fontSize: 32, fontWeight: 700,
                    color: accent,
                  }}>
                    {idx + 1}
                  </span>
                </div>
                {/* Text */}
                <div style={{ flex: 1, paddingTop: 4 }}>
                  <p style={{
                    fontFamily: 'Poppins, sans-serif', fontSize: 30, fontWeight: 600,
                    color: textPrimary, margin: 0, lineHeight: 1.3,
                  }}>
                    {item.text}
                  </p>
                  {item.subtext && (
                    <p style={{
                      fontFamily: 'Poppins, sans-serif', fontSize: 28, fontWeight: 400,
                      color: textSecondary, margin: 0, marginTop: 6, lineHeight: 1.4,
                    }}>
                      {item.subtext}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {/* CTA */}
          {cta && (
            <div style={{
              marginTop: 32, alignSelf: 'center',
              padding: '12px 36px', borderRadius: 12,
              background: accent, opacity: ctaOpacity,
            }}>
              <span style={{
                fontFamily: 'Poppins, sans-serif', fontSize: 28, fontWeight: 600,
                color: '#fff', letterSpacing: 1,
              }}>
                {cta}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* CaptionOverlay disabled — text already visible on screen */}

      {/* Brand watermark — top center */}
      <div style={{
        position: 'absolute', top: 36, left: '50%',
        transform: 'translateX(-50%)',
        padding: '8px 24px', borderRadius: 8,
        background: theme ? `rgba(${theme.overlayColor}, 0.6)` : 'rgba(0,0,0,0.4)',
        zIndex: 10,
      }}>
        <span style={{
          fontFamily: 'Poppins, sans-serif', fontSize: 28, fontWeight: 600,
          color: theme ? theme.textPrimary : BRAND.cream,
          letterSpacing: 5, textTransform: 'uppercase',
        }}>
          ALTVEDA
        </span>
      </div>
    </AbsoluteFill>
  );
};
