import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import { BRAND } from '../../brand';
import { GrainOverlay, Watermark } from '../shared/GlassCard';
import { DrawingSVG } from '../shared/DrawingSVG';
import { BOTANICAL_PATHS } from '../shared/svg-paths';
import { FONTS, SIZE } from '../shared/fonts';
import type { CaptionWord } from '../CaptionOverlay';

export type JustBeingProps = {
  theme?: string;
  lines: string[];
  closingThought?: string;
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
    @font-face { font-family: 'Lora'; src: url('${staticFile('fonts/Lora-VariableFont_wght.ttf')}') format('truetype'); font-weight: 400 700; }
    @font-face { font-family: 'Lora'; src: url('${staticFile('fonts/Lora-Italic-VariableFont_wght.ttf')}') format('truetype'); font-weight: 400 700; font-style: italic; }
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-Regular.ttf')}') format('truetype'); font-weight: 400; }
  `}</style>
);

export const JustBeing: React.FC<JustBeingProps> = ({
  lines, closingThought,
  musicTrack, voiceoverSrc, musicVolume,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: TOTAL } = useVideoConfig();

  const exit = interpolate(frame, [TOTAL - 25, TOTAL - 10], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Breathing circle: slow sinusoidal scale
  const breathScale = 1 + Math.sin(frame / 45) * 0.15;

  // Each line appears for ~150 frames (5s), starting at frame 60
  const LINE_START = 60;
  const LINE_DURATION = 150;

  // Closing section starts after all lines
  const closingStart = LINE_START + lines.length * LINE_DURATION;

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.cream }}>
      <FontLoader />

      {/* Grain at higher opacity for film-like texture */}
      <GrainOverlay opacity={0.06} />

      {/* No BotanicalOverlay — deliberate negative space */}

      {musicTrack && (
        <Audio src={staticFile(`music/${musicTrack}`)} volume={voiceoverSrc ? (musicVolume ?? 0.22) : 0.25} />
      )}
      {voiceoverSrc && (
        <Sequence from={10}><Audio src={staticFile(voiceoverSrc)} volume={1} /></Sequence>
      )}

      {/* Breathing circle — center, more visible */}
      <div style={{
        position: 'absolute', top: '35%', left: '50%',
        transform: `translate(-50%, -50%) scale(${breathScale})`,
        width: 300, height: 300, borderRadius: '50%',
        background: `radial-gradient(circle, ${BRAND.sage}25, ${BRAND.sage}12, transparent)`,
        border: `2px solid ${BRAND.sage}30`,
        opacity: 0.5 * exit,
      }} />

      {/* Second breathing ring — inverse, slightly stronger */}
      <div style={{
        position: 'absolute', top: '35%', left: '50%',
        transform: `translate(-50%, -50%) scale(${1 / breathScale * 1.35})`,
        width: 220, height: 220, borderRadius: '50%',
        border: `1.5px solid ${BRAND.sage}20`,
        opacity: 0.35 * exit,
      }} />

      {/* Lines — ONE at a time, large serif, centered */}
      <AbsoluteFill style={{
        justifyContent: 'center', alignItems: 'center',
        padding: '0 80px', opacity: exit,
      }}>
        {lines.map((line, i) => {
          const lineStart = LINE_START + i * LINE_DURATION;
          const lineEnd = lineStart + LINE_DURATION;

          // Meditative slow springs
          const enter = spring({
            frame: frame - lineStart,
            fps,
            config: { damping: 20, stiffness: 30 },
          });
          const fadeOut = interpolate(frame, [lineEnd - 30, lineEnd], [1, 0], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });

          // Only visible during its window
          const visible = frame >= lineStart - 5 && frame <= lineEnd + 5;
          if (!visible) return null;

          return (
            <div key={i} style={{
              position: 'absolute',
              fontSize: SIZE.BODY_LG, fontFamily: FONTS.serif, fontWeight: 400,
              color: BRAND.charcoal,
              textAlign: 'center', lineHeight: 1.6,
              maxWidth: '85%',
              opacity: enter * fadeOut,
              transform: `translateY(${interpolate(enter, [0, 1], [20, 0])}px)`,
            }}>
              {line}
            </div>
          );
        })}

        {/* Closing thought — shifted slightly below center, stays visible */}
        {closingThought && (
          <div style={{
            position: 'absolute',
            top: '55%',
            opacity: spring({
              frame: frame - closingStart,
              fps,
              config: { damping: 20, stiffness: 30 },
            }) * exit,
            transform: `translateY(${interpolate(
              spring({ frame: frame - closingStart, fps, config: { damping: 20, stiffness: 30 } }),
              [0, 1], [15, 0],
            )}px)`,
          }}>
            <div style={{
              fontSize: SIZE.BODY, fontFamily: FONTS.serif, fontStyle: 'italic',
              color: `${BRAND.charcoal}bb`, textAlign: 'center', lineHeight: 1.6,
              maxWidth: 700, padding: '0 60px',
            }}>
              {closingThought}
            </div>
          </div>
        )}
      </AbsoluteFill>

      {/* Single DrawingSVG sprig — very subtle, bottom-right */}
      <div style={{ position: 'absolute', bottom: 100, right: 50, opacity: exit, pointerEvents: 'none' }}>
        <DrawingSVG pathData={BOTANICAL_PATHS.sprig} width={80} height={130}
          color={BRAND.sage} enterDelay={30} drawDuration={60} opacity={0.08} />
      </div>

      {/* Small Altveda wordmark — no CTA button */}
      <div style={{
        position: 'absolute', bottom: 50, left: '50%',
        transform: 'translateX(-50%)',
        opacity: spring({
          frame: frame - closingStart - 60,
          fps,
          config: { damping: 20, stiffness: 30 },
        }) * exit,
      }}>
        <span style={{
          fontSize: SIZE.LABEL, fontWeight: 400, fontFamily: FONTS.body,
          color: `${BRAND.charcoal}66`, letterSpacing: 4, textTransform: 'uppercase',
        }}>altveda</span>
      </div>
    </AbsoluteFill>
  );
};
