import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import { resolveV2Product, V2_PRODUCTS } from '../../brand';
import { GrainOverlay, BotanicalOverlay, Watermark, ProductBackground, GlassCard } from '../shared/GlassCard';
import { DrawingSVG } from '../shared/DrawingSVG';
import { BOTANICAL_PATHS } from '../shared/svg-paths';
import { LottieLayer } from '../shared/LottieLayer';
import { FONTS, SIZE, LAYOUT } from '../shared/fonts';
import { resolvePlantCharacter } from '../shared/plant-characters';
import type { CaptionWord } from '../CaptionOverlay';

export type StorySegment = {
  text: string;
  mood?: 'happy' | 'wise' | 'curious' | 'proud';
};

export type PlantNarratorProps = {
  plant: string;
  plantName?: string;
  story: StorySegment[];
  closingLine?: string;
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

const SEGMENT_DURATION = 150; // ~5s per story segment
const INTRO_FRAMES = 60;

/** Get eye transform based on mood — exaggerated for phone-distance readability */
function eyeStyle(mood?: string): React.CSSProperties {
  switch (mood) {
    case 'happy': return { transform: 'scaleY(0.25) scaleX(1.2)', transformOrigin: 'center' }; // big squint-smile
    case 'curious': return { transform: 'translateX(5px) scaleX(0.9)', transformOrigin: 'center' }; // looking aside
    case 'proud': return { transform: 'scale(1.5)', transformOrigin: 'center' }; // big wide eyes
    default: return {}; // wise = default calm eyes
  }
}

export const PlantNarrator: React.FC<PlantNarratorProps> = ({
  plant, plantName, story, closingLine,
  musicTrack, voiceoverSrc, musicVolume, backgroundImage,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: TOTAL } = useVideoConfig();

  const theme = V2_PRODUCTS[plant] || resolveV2Product(backgroundImage);
  const productKey = plant || (backgroundImage || 'moringa.png').replace(/\.png$/, '');
  const character = resolvePlantCharacter(plant);
  const displayName = plantName || character.name;

  const exit = interpolate(frame, [TOTAL - 20, TOTAL - 10], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Character breathing animation
  const breathScale = 1 + Math.sin(frame / 40) * 0.03;
  const breathY = Math.sin(frame / 40) * 4;

  // Current story segment
  const getCurrentSegment = (): number => {
    const storyFrame = frame - INTRO_FRAMES;
    if (storyFrame < 0) return -1;
    const idx = Math.floor(storyFrame / SEGMENT_DURATION);
    return Math.min(idx, story.length); // story.length = closing
  };
  const currentSeg = getCurrentSegment();

  // Speech pulse — bumps to 1.05 when new segment appears
  const segmentStart = currentSeg >= 0 ? INTRO_FRAMES + currentSeg * SEGMENT_DURATION : 0;
  const speechPulse = currentSeg >= 0
    ? spring({ frame: frame - segmentStart, fps, config: { damping: 10, stiffness: 80 } })
    : 0;
  const speechScale = 1 + (1 - speechPulse) * 0.05; // bumps to ~1.05 then settles to 1

  // Current mood for eyes
  const currentMood = currentSeg >= 0 && currentSeg < story.length
    ? story[currentSeg].mood
    : undefined;

  // Closing section
  const closingStart = INTRO_FRAMES + story.length * SEGMENT_DURATION;

  return (
    <ProductBackground product={theme} productKey={productKey}>
      <FontLoader />
      <Watermark color={theme.accent} />

      {musicTrack && (
        <Audio src={staticFile(`music/${musicTrack}`)} volume={voiceoverSrc ? (musicVolume ?? 0.22) : 0.3} />
      )}
      {voiceoverSrc && (
        <Sequence from={10}><Audio src={staticFile(voiceoverSrc)} volume={1} /></Sequence>
      )}

      {/* Floating leaves atmosphere */}
      <LottieLayer src="lottie/floating-leaves.json" width={1080} height={1920}
        enterDelay={0} exitFrame={TOTAL - 25} opacity={0.05} playbackRate={0.4}
        style={{ position: 'absolute', inset: 0 }} />

      {/* Decorative DrawingSVG leaf in corner */}
      <div style={{ position: 'absolute', top: 100, left: 30, opacity: exit, pointerEvents: 'none' }}>
        <DrawingSVG pathData={BOTANICAL_PATHS.leaf} width={60} height={96}
          color={theme.accent} enterDelay={15} drawDuration={45} opacity={0.1} />
      </div>

      {/* ─── Plant Character (upper portion) ─── */}
      <div style={{
        position: 'absolute', top: '5%', left: '50%',
        transform: `translateX(-50%) translateY(${breathY}px) scale(${breathScale * speechScale})`,
        opacity: spring({ frame, fps, config: { damping: 14, stiffness: 50 } }) * exit,
      }}>
        <svg viewBox="0 0 200 300" width={360} height={540}>
          {/* Detail paths (roots, crown, etc.) */}
          {character.detail.map((d, i) => (
            <path key={`detail-${i}`} d={d}
              stroke={theme.accent} strokeWidth={2} strokeLinecap="round"
              fill="none" opacity={0.6}
            />
          ))}

          {/* Main body — filled */}
          <path d={character.body}
            fill={`${theme.accent}30`}
            stroke={theme.accent} strokeWidth={2.5}
          />

          {/* Eyes — mood-reactive */}
          <g style={eyeStyle(currentMood)}>
            {character.eyes.map((d, i) => (
              <path key={`eye-${i}`} d={d}
                fill={theme.textPrimary} stroke="none"
              />
            ))}
          </g>

          {/* Tiny smile */}
          <path d="M90 170 Q100 180 110 170"
            stroke={theme.textPrimary} strokeWidth={2} strokeLinecap="round"
            fill="none" opacity={currentMood === 'happy' ? 1 : 0.6}
          />
        </svg>

        {/* Character name badge */}
        <div style={{
          textAlign: 'center', marginTop: -20,
          opacity: spring({ frame: frame - 20, fps, config: { damping: 14 } }),
        }}>
          <span style={{
            fontSize: SIZE.BODY_SM, fontWeight: 700, fontFamily: FONTS.heading,
            color: theme.accent, letterSpacing: 2,
          }}>
            {displayName}
          </span>
        </div>
      </div>

      {/* ─── Speech Bubble (lower 50%) ─── */}
      <AbsoluteFill style={{
        justifyContent: 'flex-end', alignItems: 'center',
        paddingTop: LAYOUT.TOP_SAFE, paddingBottom: LAYOUT.BOTTOM_SAFE, opacity: exit,
      }}>
        {/* Story segments */}
        {story.map((seg, i) => {
          const segStart = INTRO_FRAMES + i * SEGMENT_DURATION;
          const segEnd = segStart + SEGMENT_DURATION;
          const visible = frame >= segStart - 5 && frame <= segEnd + 5;
          if (!visible) return null;

          const enter = spring({
            frame: frame - segStart,
            fps,
            config: { damping: 14, stiffness: 50 },
          });
          const fadeOut = interpolate(frame, [segEnd - 20, segEnd], [1, 0], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });

          return (
            <GlassCard key={i} width="86%" padding={36} enterDelay={segStart}>
              {/* Small speech triangle pointing up */}
              <div style={{
                position: 'absolute', top: -14, left: '50%',
                transform: 'translateX(-50%)',
                width: 0, height: 0,
                borderLeft: '14px solid transparent',
                borderRight: '14px solid transparent',
                borderBottom: `14px solid rgba(255,255,255,0.35)`,
              }} />
              <div style={{
                fontSize: SIZE.BODY, fontFamily: FONTS.serif, fontStyle: 'italic',
                color: theme.textPrimary, textAlign: 'center', lineHeight: 1.7,
                maxWidth: '90%',
                opacity: enter * fadeOut,
                transform: `translateY(${interpolate(enter, [0, 1], [12, 0])}px)`,
              }}>
                &ldquo;{seg.text}&rdquo;
              </div>
            </GlassCard>
          );
        })}

        {/* Closing line */}
        {closingLine && frame >= closingStart - 5 && (
          <GlassCard width="86%" padding={36} enterDelay={closingStart}>
            <div style={{
              fontSize: SIZE.BODY_SM, fontFamily: FONTS.serif, fontStyle: 'italic',
              color: theme.textSecondary, textAlign: 'center', lineHeight: 1.7,
              opacity: spring({
                frame: frame - closingStart,
                fps,
                config: { damping: 14, stiffness: 50 },
              }),
            }}>
              {closingLine}
            </div>
            {/* Small CTA */}
            <div style={{
              marginTop: 8,
              opacity: spring({ frame: frame - closingStart - 20, fps, config: { damping: 14 } }),
            }}>
              <span style={{
                fontSize: SIZE.LABEL, fontWeight: 600, fontFamily: FONTS.heading,
                color: theme.accent, letterSpacing: 2,
              }}>
                altveda.in
              </span>
            </div>
          </GlassCard>
        )}
      </AbsoluteFill>
    </ProductBackground>
  );
};
