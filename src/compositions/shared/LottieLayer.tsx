import React, { useEffect, useState } from 'react';
import { Lottie, type LottieAnimationData } from '@remotion/lottie';
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

export const LottieLayer: React.FC<{
  src: string; // path relative to public/, e.g. 'lottie/leaf-growth.json'
  width?: number;
  height?: number;
  enterDelay?: number;
  exitFrame?: number;
  opacity?: number;
  playbackRate?: number;
  loop?: boolean;
  style?: React.CSSProperties;
}> = ({
  src, width = 200, height = 200, enterDelay = 0, exitFrame,
  opacity = 0.3, playbackRate = 1, loop = true, style,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const [animationData, setAnimationData] = useState<LottieAnimationData | null>(null);

  useEffect(() => {
    fetch(staticFile(src))
      .then((r) => r.json())
      .then(setAnimationData)
      .catch(() => { /* Silently fail — scene renders without the Lottie */ });
  }, [src]);

  if (!animationData) return null;

  const enter = spring({ frame: frame - enterDelay, fps, config: { damping: 14 } });
  const exitAt = exitFrame ?? durationInFrames - 15;
  const exit = interpolate(frame, [exitAt, exitAt + 10], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <div style={{ width, height, opacity: enter * exit * opacity, pointerEvents: 'none', ...style }}>
      <Lottie animationData={animationData} playbackRate={playbackRate} loop={loop}
        style={{ width: '100%', height: '100%' }} />
    </div>
  );
};
