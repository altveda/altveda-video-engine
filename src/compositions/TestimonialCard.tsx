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

export type TestimonialCardProps = {
  quote: string;
  attribution?: string;   // e.g. "— Priya, Mumbai"
  headline?: string;       // optional top text e.g. "Real Stories"
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
        font-family: 'Lora';
        src: url('${staticFile('fonts/Lora-VariableFont_wght.ttf')}') format('truetype');
        font-weight: 400 700; font-style: normal;
      }
      @font-face {
        font-family: 'Lora';
        src: url('${staticFile('fonts/Lora-Italic-VariableFont_wght.ttf')}') format('truetype');
        font-weight: 400 700; font-style: italic;
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

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote, attribution, headline, cta, musicTrack, voiceoverSrc, musicVolume, backgroundImage, captions, captionStartFrame,
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

  // Phase 1: Large quotation mark scales in (0-25)
  const quoteMarkScale = spring({ frame, fps, config: { stiffness: 40, damping: 14 }, from: 0, to: 1 });
  const quoteMarkOpacity = interpolate(frame, [0, 20], [0, 0.25], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Phase 2: Headline badge (5-25)
  const headlineOpacity = interpolate(frame, [5, 25], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Phase 3: Quote text reveals (15-55)
  const quoteOpacity = interpolate(frame, [15, 45], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const quoteY = interpolate(frame, [15, 50], [40, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Phase 4: Divider + attribution (50-75)
  const dividerScale = spring({ frame: frame - 50, fps, config: { stiffness: 60, damping: 16 }, from: 0, to: 1 });
  const attrOpacity = interpolate(frame, [55, 75], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Phase 5: CTA (70% through)
  const ctaStart = Math.round(TOTAL * 0.7);
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
        artPan={interpolate(frame, [0, TOTAL], [15, 75], {
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
          width: '84%', position: 'relative',
          padding: '64px 52px 48px',
          borderRadius: 40,
          textAlign: 'center',
          backdropFilter: 'blur(32px) saturate(2.0)',
          WebkitBackdropFilter: 'blur(32px) saturate(2.0)',
          background: cardBg,
          border: cardBorder,
          boxShadow: theme
            ? 'inset 0 1px 2px rgba(255,255,255,0.5), 0 4px 20px rgba(0,0,0,0.18), 0 20px 80px rgba(0,0,0,0.22)'
            : '0 8px 48px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          {/* Large decorative quotation mark */}
          <div style={{
            position: 'absolute', top: -30, left: 52,
            fontFamily: 'Lora, Georgia, serif', fontSize: 200, fontWeight: 700,
            color: accent, opacity: quoteMarkOpacity,
            transform: `scale(${quoteMarkScale})`,
            lineHeight: 1, pointerEvents: 'none',
          }}>
            &ldquo;
          </div>

          {/* Headline badge */}
          {headline && (
            <div style={{ marginBottom: 28, opacity: headlineOpacity }}>
              <span style={{
                fontFamily: 'Poppins, sans-serif', fontSize: 28, fontWeight: 600,
                color: accent, letterSpacing: 5, textTransform: 'uppercase',
                padding: '10px 28px', borderRadius: 8,
                background: theme ? `rgba(${theme.overlayColor}, 0.15)` : 'rgba(255,255,255,0.1)',
              }}>
                {headline}
              </span>
            </div>
          )}

          {/* Quote text — italic Lora for testimonial feel */}
          <p style={{
            fontFamily: 'Lora, Georgia, serif', fontSize: 40, fontWeight: 500,
            fontStyle: 'italic', color: textPrimary,
            textAlign: 'center', lineHeight: 1.4,
            margin: 0, maxWidth: 780,
            opacity: quoteOpacity,
            transform: `translateY(${quoteY}px)`,
          }}>
            {quote}
          </p>

          {/* Divider */}
          <div style={{
            width: 80, height: 3, backgroundColor: accent,
            borderRadius: 2, marginTop: 32, marginBottom: 24,
            transform: `scaleX(${dividerScale})`,
          }} />

          {/* Attribution */}
          {attribution && (
            <p style={{
              fontFamily: 'Poppins, sans-serif', fontSize: 28, fontWeight: 500,
              color: textSecondary, margin: 0, opacity: attrOpacity,
            }}>
              {attribution}
            </p>
          )}

          {/* CTA */}
          {cta && (
            <div style={{
              marginTop: 28, padding: '12px 32px',
              borderRadius: 12, background: accent,
              opacity: ctaOpacity,
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

      {/* Brand watermark — top center (consistent with ProductTip) */}
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
