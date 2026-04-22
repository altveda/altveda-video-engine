import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';

// ─── Types ──────────────────────────────────────────────────────

export type CaptionWord = {
  text: string;
  startMs: number;
  endMs: number;
};

export type CaptionOverlayProps = {
  captions: CaptionWord[];
  startFrame: number; // frame when voiceover audio starts playing
  accentColor?: string;
  textColor?: string;
};

// ─── Constants ──────────────────────────────────────────────────

const WINDOW_SIZE = 5; // max words visible at once
const BOTTOM_OFFSET = 140; // px from bottom (above progress bar)

// ─── Component ──────────────────────────────────────────────────

export const CaptionOverlay: React.FC<CaptionOverlayProps> = ({
  captions,
  startFrame,
  accentColor = '#C9A962',
  textColor = '#ffffff',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!captions || captions.length === 0) return null;

  // Current time relative to VO start
  const elapsedFrames = frame - startFrame;
  if (elapsedFrames < 0) return null;
  const currentMs = (elapsedFrames / fps) * 1000;

  // Find the active word index
  let activeIdx = -1;
  for (let i = 0; i < captions.length; i++) {
    if (currentMs >= captions[i].startMs && currentMs < captions[i].endMs) {
      activeIdx = i;
      break;
    }
    // If between words, keep showing the last spoken word
    if (i > 0 && currentMs >= captions[i - 1].endMs && currentMs < captions[i].startMs) {
      activeIdx = i - 1;
      break;
    }
  }

  // After all captions end, hide
  if (activeIdx === -1 && captions.length > 0 && currentMs > captions[captions.length - 1].endMs + 500) {
    return null;
  }

  // Before first word, show nothing
  if (activeIdx === -1 && currentMs < (captions[0]?.startMs || 0)) {
    return null;
  }

  // If still -1 but we're past captions, show last word
  if (activeIdx === -1) {
    activeIdx = captions.length - 1;
  }

  // Calculate visible window centered on active word
  const halfWindow = Math.floor(WINDOW_SIZE / 2);
  let windowStart = Math.max(0, activeIdx - halfWindow);
  let windowEnd = Math.min(captions.length, windowStart + WINDOW_SIZE);
  // Adjust start if we hit the end
  if (windowEnd - windowStart < WINDOW_SIZE) {
    windowStart = Math.max(0, windowEnd - WINDOW_SIZE);
  }

  const visibleWords = captions.slice(windowStart, windowEnd);

  // Fade in/out for the overlay
  const overlayOpacity = interpolate(
    currentMs,
    [captions[0].startMs - 200, captions[0].startMs],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const overlayFadeOut = captions.length > 0
    ? interpolate(
        currentMs,
        [captions[captions.length - 1].endMs, captions[captions.length - 1].endMs + 300],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
      )
    : 1;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: BOTTOM_OFFSET,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 50,
        opacity: Math.min(overlayOpacity, overlayFadeOut),
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 8,
          maxWidth: '85%',
          padding: '12px 28px',
          borderRadius: 16,
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {visibleWords.map((word, i) => {
          const globalIdx = windowStart + i;
          const isActive = globalIdx === activeIdx;
          const isPast = globalIdx < activeIdx;

          // Scale animation for active word
          const wordFrame = isActive
            ? elapsedFrames - Math.round((word.startMs / 1000) * fps)
            : 0;
          const wordScale = isActive
            ? spring({
                frame: wordFrame,
                fps,
                config: { stiffness: 300, damping: 20 },
                from: 1.15,
                to: 1.0,
              })
            : 1;

          const wordColor = isActive
            ? accentColor
            : isPast
              ? textColor
              : `${textColor}88`;

          const wordWeight = isActive ? 700 : isPast ? 600 : 400;

          return (
            <span
              key={`${globalIdx}-${word.text}`}
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 36,
                fontWeight: wordWeight,
                color: wordColor,
                transform: `scale(${wordScale})`,
                display: 'inline-block',
                lineHeight: 1.4,
                textShadow: isActive
                  ? `0 0 20px ${accentColor}66, 0 2px 4px rgba(0,0,0,0.4)`
                  : '0 1px 3px rgba(0,0,0,0.5)',
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
