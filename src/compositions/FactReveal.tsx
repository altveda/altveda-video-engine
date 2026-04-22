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

export type FactRevealProps = {
  fact: string;       // The main stat/fact (e.g. "28% cortisol reduction")
  context: string;    // Supporting explanation
  source?: string;    // Citation (e.g. "Indian J Psychol Med, 2012")
  cta?: string;       // Call to action
  musicTrack?: string;
  voiceoverSrc?: string;   // filename in public dir
  musicVolume?: number;     // lowered when VO active
  durationInFrames?: number; // dynamic — extended when VO is longer than 10s
  backgroundImage?: string; // filename in public/backgrounds/
  captions?: CaptionWord[];
  captionStartFrame?: number;
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

// ─── Animated Number (extracts number from fact and animates it) ─

const AnimatedStat: React.FC<{ text: string; statColor: string; numberColor: string }> = ({ text, statColor, numberColor }) => {
  const frame = useCurrentFrame();

  // Try to extract a number from the fact text (e.g. "28%" → 28)
  const numberMatch = text.match(/(\d+(?:\.\d+)?)/);
  if (!numberMatch) {
    // No number found — just animate the text normally
    const opacity = interpolate(frame, [20, 50], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
    return (
      <p style={{
        fontFamily: 'Poppins, sans-serif', fontSize: 80, fontWeight: 700,
        color: statColor, textAlign: 'center', margin: 0,
        maxWidth: 850, lineHeight: 1.2, opacity,
      }}>
        {text}
      </p>
    );
  }

  const targetNumber = parseFloat(numberMatch[1]);
  const beforeNum = text.substring(0, numberMatch.index);
  const afterNum = text.substring((numberMatch.index || 0) + numberMatch[1].length);
  const isDecimal = numberMatch[1].includes('.');

  // Count up from 0 to target over frames 20-80
  const countProgress = interpolate(frame, [20, 80], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const currentNumber = countProgress * targetNumber;
  const displayNumber = isDecimal ? currentNumber.toFixed(1) : Math.round(currentNumber).toString();

  const scaleSpring = spring({
    frame: frame - 20, fps: 30,
    config: { stiffness: 80, damping: 12 },
    from: 0.7, to: 1,
  });
  const opacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <p style={{
      fontFamily: 'Poppins, sans-serif', fontSize: 80, fontWeight: 700,
      color: statColor, textAlign: 'center', margin: 0,
      maxWidth: 850, lineHeight: 1.2,
      transform: `scale(${scaleSpring})`, opacity,
    }}>
      {beforeNum}
      <span style={{ fontSize: 100, color: numberColor }}>
        {displayNumber}
      </span>
      {afterNum}
    </p>
  );
};

// ─── Main Composition ──────────────────────────────────────────

export const FactReveal: React.FC<FactRevealProps> = ({ fact, context, source, cta, musicTrack, voiceoverSrc, musicVolume, backgroundImage, captions, captionStartFrame }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: TOTAL_FRAMES } = useVideoConfig();

  // Resolve product theme colors
  const theme = backgroundImage ? PRODUCT_THEMES[backgroundImage] : null;
  const accentColor = theme ? theme.accent : BRAND.gold;
  const headlineColor = theme ? theme.textPrimary : BRAND.gold;
  const numberColor = theme ? theme.textPrimary : BRAND.cream;
  const bodyColor = theme ? theme.textSecondary : BRAND.cream;
  const sourceColor = theme ? theme.textSecondary : BRAND.sage;
  const labelColor = theme ? theme.accent : BRAND.gold;
  const ctaBg = theme ? theme.accent : BRAND.terracotta;
  const ctaTextColor = '#fff';
  const logoFile = theme ? 'logo-black.png' : 'logo-white.png';
  const logoTextColor = theme ? `${theme.textSecondary}99` : 'rgba(255,255,255,0.6)';

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

  // Phase 1: "Did you know?" label (0-25)
  const labelOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const labelScale = spring({
    frame, fps, config: { stiffness: 80, damping: 14 },
    from: 0.8, to: 1,
  });

  // Phase 3: Context fades in (~30% through)
  const contextStart = Math.round(TOTAL_FRAMES * 0.3);
  const contextEnd = contextStart + 25;
  const contextOpacity = interpolate(frame, [contextStart, contextEnd], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const contextY = interpolate(frame, [contextStart, contextEnd], [25, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Phase 4: Source (~50% through)
  const sourceStart = Math.round(TOTAL_FRAMES * 0.5);
  const sourceEnd = sourceStart + 20;
  const sourceOpacity = interpolate(frame, [sourceStart, sourceEnd], [0, 0.7], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Phase 5: CTA (~67% through)
  const ctaStart = Math.round(TOTAL_FRAMES * 0.67);
  const ctaEnd = ctaStart + 20;
  const ctaOpacity = interpolate(frame, [ctaStart, ctaEnd], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const ctaY = interpolate(frame, [ctaStart, ctaEnd], [20, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Fade out
  const fadeOut = interpolate(frame, [TOTAL_FRAMES - 15, TOTAL_FRAMES], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <BackgroundLayer
        imageSrc={backgroundImage}
        fallbackGradient={`linear-gradient(160deg, ${BRAND.charcoal} 0%, #1a1a1a 50%, #222 100%)`}
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

      {/* Voiceover — starts at frame 20 after "Did you know?" label */}
      {voiceoverSrc && (
        <Sequence from={20}>
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
        padding: '60px 56px 48px',
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
        {/* "Did you know?" label pill */}
        <div style={{
          opacity: labelOpacity,
          transform: `scale(${labelScale})`,
          marginBottom: 36,
        }}>
          <span style={{
            fontFamily: 'Poppins, sans-serif', fontSize: 28, fontWeight: 600,
            color: labelColor, letterSpacing: 6, textTransform: 'uppercase',
            padding: '8px 24px', borderRadius: 8,
            background: labelBg,
          }}>
            Did you know?
          </span>
        </div>

        {/* Animated stat/fact */}
        <AnimatedStat text={fact} statColor={headlineColor} numberColor={numberColor} />

        {/* Divider */}
        <div style={{
          width: 100, height: 2, backgroundColor: accentColor,
          borderRadius: 1, marginTop: 28, marginBottom: 28,
          transform: `scaleX(${spring({ frame: frame - 85, fps, config: { stiffness: 60, damping: 16 }, from: 0, to: 1 })})`,
        }} />

        {/* Context */}
        <p style={{
          fontFamily: 'Poppins, sans-serif', fontSize: 32, fontWeight: 400,
          color: bodyColor, textAlign: 'center', lineHeight: 1.5,
          margin: 0, maxWidth: 750,
          opacity: contextOpacity,
          transform: `translateY(${contextY}px)`,
        }}>
          {context}
        </p>

        {/* Source citation */}
        {source && (
          <p style={{
            fontFamily: 'Poppins, sans-serif', fontSize: 24, fontWeight: 400,
            color: sourceColor, textAlign: 'center', marginTop: 20,
            opacity: sourceOpacity,
          }}>
            Source: {source}
          </p>
        )}

        {/* CTA */}
        {cta && (
          <div style={{
            marginTop: 30, padding: '14px 42px',
            backgroundColor: ctaBg,
            borderRadius: 12, opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
          }}>
            <span style={{
              fontFamily: 'Poppins, sans-serif', fontSize: 28, fontWeight: 600,
              color: ctaTextColor,
            }}>
              {cta}
            </span>
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
