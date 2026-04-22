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

export type QuickTipProps = {
  tipHeadline: string;
  tipBody: string;
  whyItWorks?: string;
  musicTrack?: string;
  voiceoverSrc?: string;   // filename in public dir
  musicVolume?: number;     // lowered when VO active
  durationInFrames?: number; // dynamic — extended when VO is longer than 10s
  backgroundImage?: string; // filename in public/backgrounds/ (e.g. 'ashwagandha.png')
  captions?: CaptionWord[];      // word-level captions from whisper
  captionStartFrame?: number;    // frame when VO starts (default 10)
};

// ─── Font Loader ───────────────────────────────────────────────

const FontLoader: React.FC = () => (
  <style>
    {`
      @font-face {
        font-family: 'Poppins';
        src: url('${staticFile('fonts/Poppins-Regular.ttf')}') format('truetype');
        font-weight: 400;
        font-style: normal;
      }
      @font-face {
        font-family: 'Poppins';
        src: url('${staticFile('fonts/Poppins-SemiBold.ttf')}') format('truetype');
        font-weight: 600;
        font-style: normal;
      }
      @font-face {
        font-family: 'Poppins';
        src: url('${staticFile('fonts/Poppins-Bold.ttf')}') format('truetype');
        font-weight: 700;
        font-style: normal;
      }
    `}
  </style>
);

// ─── Progress Bar ──────────────────────────────────────────────

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

// ─── Main Composition ──────────────────────────────────────────

export const QuickTip: React.FC<QuickTipProps> = ({ tipHeadline, tipBody, whyItWorks, musicTrack, voiceoverSrc, musicVolume, backgroundImage, captions, captionStartFrame }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: TOTAL_FRAMES } = useVideoConfig();

  // Resolve product theme colors (falls back to original BRAND colors)
  const theme = backgroundImage ? PRODUCT_THEMES[backgroundImage] : null;
  const accentColor = theme ? theme.accent : BRAND.gold;
  const headlineColor = theme ? theme.textPrimary : BRAND.cream;
  const bodyColor = theme ? theme.textSecondary : BRAND.cream;
  const badgeTextColor = theme ? theme.accent : BRAND.gold;
  const whyTextColor = theme ? theme.textPrimary : BRAND.gold;

  // Frosted card colors
  const overlayRGB = theme?.overlayColor || '44,44,44';
  const cardBg = theme
    ? `linear-gradient(135deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.30) 100%)`
    : 'rgba(30, 30, 30, 0.55)';
  const cardBorder = theme
    ? '2px solid rgba(255,255,255,0.50)'
    : '1px solid rgba(255,255,255,0.1)';
  const labelBg = theme
    ? `rgba(${theme.overlayColor}, 0.15)`
    : 'rgba(255,255,255,0.1)';

  // Phase 1: Label badge slides in (0-20)
  const badgeY = interpolate(frame, [0, 20], [-60, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const badgeOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Phase 2: Headline fades up (10-40)
  const headlineY = interpolate(frame, [10, 40], [60, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const headlineOpacity = interpolate(frame, [10, 35], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Phase 3: Divider scales in (35-55)
  const dividerScale = spring({
    frame: frame - 35, fps,
    config: { stiffness: 60, damping: 16 },
    from: 0, to: 1,
  });

  // Phase 4: Body text (50-80)
  const bodyOpacity = interpolate(frame, [50, 75], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const bodyY = interpolate(frame, [50, 75], [30, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Phase 5: Why it works (~43% through the video)
  const whyStart = Math.round(TOTAL_FRAMES * 0.43);
  const whyEnd = whyStart + 25;
  const whyOpacity = interpolate(frame, [whyStart, whyEnd], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const whyY = interpolate(frame, [whyStart, whyEnd], [20, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Fade out (last 15 frames)
  const fadeOut = interpolate(frame, [TOTAL_FRAMES - 15, TOTAL_FRAMES], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <BackgroundLayer
        imageSrc={backgroundImage}
        fallbackGradient={`linear-gradient(160deg, ${BRAND.sage} 0%, #6b8a6e 60%, #5a7a5d 100%)`}
        artPan={interpolate(frame, [0, TOTAL_FRAMES], [20, 80], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        })}
      />
      <FontLoader />
      <ProgressBar accentColor={accentColor} />

      {/* Background music (ducked when voiceover active) */}
      {musicTrack && (
        <Audio src={staticFile(`music/${musicTrack}`)} volume={voiceoverSrc ? (musicVolume ?? 0.22) : 0.3} />
      )}

      {/* Voiceover — starts at frame 10 after badge animation */}
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

      {/* Centering wrapper — shifted up with paddingBottom */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '16%',
      }}>
      <div style={{
        width: '84%',
        padding: '56px 52px 44px',
        borderRadius: 40,
        textAlign: 'center',
        backdropFilter: 'blur(32px) saturate(2.0)',
        WebkitBackdropFilter: 'blur(32px) saturate(2.0)',
        background: cardBg,
        border: cardBorder,
        boxShadow: theme
          ? 'inset 0 1px 2px rgba(255,255,255,0.5), 0 4px 20px rgba(0,0,0,0.18), 0 20px 80px rgba(0,0,0,0.22)'
          : '0 8px 48px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Wellness Tip badge */}
        <div style={{
          marginBottom: 36,
          opacity: badgeOpacity,
          transform: `translateY(${badgeY}px)`,
        }}>
          <span style={{
            fontFamily: 'Poppins, sans-serif', fontSize: 28, fontWeight: 600,
            color: badgeTextColor, letterSpacing: 6, textTransform: 'uppercase',
            padding: '8px 24px', borderRadius: 8,
            background: labelBg,
          }}>
            Wellness Tip
          </span>
        </div>

        {/* Headline */}
        <p style={{
          fontFamily: 'Poppins, sans-serif', fontSize: 60, fontWeight: 700,
          color: headlineColor, textAlign: 'center', lineHeight: 1.25,
          margin: 0, maxWidth: 860,
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
        }}>
          {tipHeadline}
        </p>

        {/* Divider */}
        <div style={{
          width: 100, height: 3, backgroundColor: accentColor,
          borderRadius: 2, marginTop: 28, marginBottom: 28,
          transform: `scaleX(${dividerScale})`,
        }} />

        {/* Body text */}
        <p style={{
          fontFamily: 'Poppins, sans-serif', fontSize: 40, fontWeight: 400,
          color: bodyColor, textAlign: 'center', lineHeight: 1.5,
          margin: 0, maxWidth: 800, opacity: bodyOpacity,
          transform: `translateY(${bodyY}px)`,
        }}>
          {tipBody}
        </p>

        {/* Why it works (if provided) */}
        {whyItWorks && (
          <div style={{
            marginTop: 30, padding: '16px 32px',
            borderRadius: 12, borderLeft: `4px solid ${accentColor}`,
            maxWidth: 720, opacity: whyOpacity,
            transform: `translateY(${whyY}px)`,
            background: theme ? `rgba(${theme.overlayColor}, 0.2)` : 'rgba(255,255,255,0.08)',
          }}>
            <p style={{
              fontFamily: 'Poppins, sans-serif', fontSize: 34, fontWeight: 400,
              color: whyTextColor, margin: 0, lineHeight: 1.4,
            }}>
              {whyItWorks}
            </p>
          </div>
        )}
      </div>
      </div>{/* end centering wrapper */}

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
