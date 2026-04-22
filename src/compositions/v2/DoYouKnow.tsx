import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import { GrainOverlay } from '../shared/GlassCard';
import { FONTS, SIZE, LAYOUT } from '../shared/fonts';
import type { CaptionWord } from '../CaptionOverlay';

export type DoYouKnowProps = {
  question: string;
  answer: string;
  reassurance: string;
  beingLine: string;
  musicTrack?: string;
  voiceoverSrc?: string;
  musicVolume?: number;
  durationInFrames?: number;
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

// DJSamsi meditation palette — distinct from Altveda product compositions
const PALETTE = {
  bgDark: '#0a0a1a',
  bgDeep: '#1a0a2e',
  text: '#f0ebe3',
  textMuted: '#f0ebe3aa',
  circle: 'rgba(255, 255, 255, 0.04)',
  circleBorder: 'rgba(255, 255, 255, 0.06)',
  aurora1: '#1a3a5a',
  aurora2: '#2a1a4a',
  aurora3: '#0a2a3a',
};

export const DoYouKnow: React.FC<DoYouKnowProps> = ({
  question, answer, reassurance, beingLine,
  musicTrack, voiceoverSrc, musicVolume,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: TOTAL } = useVideoConfig();

  // Global fade out
  const exit = interpolate(frame, [TOTAL - 30, TOTAL - 10], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Breathing circle — glacial, cosmic
  const breathScale = 1 + Math.sin(frame / 90) * 0.03;

  // Aurora wash — 3 radial gradients drifting at different glacial speeds
  const a1x = 30 + Math.sin(frame / 300) * 15;
  const a1y = 25 + Math.cos(frame / 400) * 10;
  const a2x = 70 + Math.sin(frame / 350) * 12;
  const a2y = 60 + Math.cos(frame / 450) * 8;
  const a3x = 50 + Math.sin(frame / 500) * 10;
  const a3y = 80 + Math.cos(frame / 380) * 12;

  // Phase timing (frames)
  const Q_START = 30;       // Question appears
  const A_START = 150;      // Answer appears
  const R_START = 240;      // Reassurance appears
  const B_START = 360;      // Being line appears

  const textSpring = (from: number) => spring({
    frame: frame - from, fps,
    config: { damping: 22, stiffness: 25 },
  });

  const textFade = (from: number, duration: number) =>
    interpolate(frame, [from + duration - 30, from + duration], [1, 0], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });

  // Question and answer fade out together before being line
  const earlyFade = interpolate(frame, [B_START - 40, B_START - 10], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(170deg, ${PALETTE.bgDark} 0%, ${PALETTE.bgDeep} 100%)`,
    }}>
      <FontLoader />

      {/* Aurora wash — barely visible, creates depth */}
      <div style={{
        position: 'absolute', inset: 0,
        background: [
          `radial-gradient(ellipse 60% 40% at ${a1x}% ${a1y}%, ${PALETTE.aurora1}18, transparent)`,
          `radial-gradient(ellipse 50% 50% at ${a2x}% ${a2y}%, ${PALETTE.aurora2}14, transparent)`,
          `radial-gradient(ellipse 70% 30% at ${a3x}% ${a3y}%, ${PALETTE.aurora3}10, transparent)`,
        ].join(', '),
        mixBlendMode: 'screen',
      }} />

      {/* Grain — film texture */}
      <GrainOverlay opacity={0.05} />

      {/* Music */}
      {musicTrack && (
        <Audio src={staticFile(`music/${musicTrack}`)} volume={voiceoverSrc ? (musicVolume ?? 0.15) : 0.2} />
      )}
      {voiceoverSrc && (
        <Sequence from={10}><Audio src={staticFile(voiceoverSrc)} volume={1} /></Sequence>
      )}

      {/* Breathing circle — cosmic, barely there */}
      <div style={{
        position: 'absolute', top: '42%', left: '50%',
        transform: `translate(-50%, -50%) scale(${breathScale})`,
        width: 600, height: 600, borderRadius: '50%',
        background: `radial-gradient(circle, ${PALETTE.circle}, transparent 70%)`,
        border: `1px solid ${PALETTE.circleBorder}`,
        opacity: 0.6 * exit,
      }} />

      {/* ─── Text Phases ─── */}
      <AbsoluteFill style={{
        justifyContent: 'center', alignItems: 'center',
        paddingTop: LAYOUT.TOP_SAFE, paddingLeft: 80, paddingRight: 80, opacity: exit,
      }}>

        {/* Phase 1: The Question */}
        {frame >= Q_START && frame < B_START && (
          <div style={{
            position: 'absolute', top: '30%',
            opacity: textSpring(Q_START) * earlyFade,
            transform: `translateY(${interpolate(textSpring(Q_START), [0, 1], [15, 0])}px)`,
          }}>
            <div style={{
              fontSize: SIZE.TITLE, fontFamily: FONTS.serif, fontWeight: 400,
              color: PALETTE.text, textAlign: 'center', lineHeight: 1.5,
              fontStyle: 'italic',
            }}>
              {question}
            </div>
          </div>
        )}

        {/* Phase 2: The Punchline */}
        {frame >= A_START && frame < B_START && (
          <div style={{
            position: 'absolute', top: '44%',
            opacity: textSpring(A_START) * earlyFade,
            transform: `translateY(${interpolate(textSpring(A_START), [0, 1], [12, 0])}px)`,
          }}>
            <div style={{
              fontSize: SIZE.HERO, fontFamily: FONTS.serif, fontWeight: 700,
              color: PALETTE.text, textAlign: 'center', lineHeight: 1.4,
            }}>
              {answer}
            </div>
          </div>
        )}

        {/* Phase 3: The Reassurance */}
        {frame >= R_START && frame < B_START && (
          <div style={{
            position: 'absolute', top: '56%',
            opacity: textSpring(R_START) * earlyFade,
            transform: `translateY(${interpolate(textSpring(R_START), [0, 1], [10, 0])}px)`,
          }}>
            <div style={{
              fontSize: SIZE.BODY_LG, fontFamily: FONTS.serif, fontWeight: 400,
              color: PALETTE.textMuted, textAlign: 'center', lineHeight: 1.6,
              maxWidth: 800,
            }}>
              {reassurance}
            </div>
          </div>
        )}

        {/* Phase 4: The Landing — full center, larger, stays until end */}
        {frame >= B_START && (
          <div style={{
            position: 'absolute', top: '40%',
            opacity: textSpring(B_START),
            transform: `translateY(${interpolate(textSpring(B_START), [0, 1], [20, 0])}px)`,
          }}>
            <div style={{
              fontSize: SIZE.SUBTITLE, fontFamily: FONTS.serif, fontWeight: 400,
              color: PALETTE.text, textAlign: 'center', lineHeight: 1.7,
              maxWidth: 800, fontStyle: 'italic',
              padding: '0 40px',
            }}>
              {beingLine}
            </div>
          </div>
        )}
      </AbsoluteFill>

      {/* Tiny watermark — barely visible */}
      <div style={{
        position: 'absolute', bottom: 50, left: '50%',
        transform: 'translateX(-50%)',
        opacity: 0.2 * exit,
      }}>
        <span style={{
          fontSize: 16, fontWeight: 400, fontFamily: FONTS.body,
          color: PALETTE.textMuted, letterSpacing: 3, textTransform: 'uppercase',
        }}>altveda</span>
      </div>
    </AbsoluteFill>
  );
};
