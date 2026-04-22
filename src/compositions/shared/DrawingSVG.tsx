import React from 'react';
import { evolvePath } from '@remotion/paths';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { type SVGPathData } from './svg-paths';

export const DrawingSVG: React.FC<{
  pathData: SVGPathData;
  width?: number;
  height?: number;
  color?: string;
  fillColor?: string;
  enterDelay?: number;
  drawDuration?: number;
  staggerPerPath?: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({
  pathData, width = 200, height = 200, color = 'currentColor',
  fillColor, enterDelay = 0, drawDuration = 40, staggerPerPath = 5,
  opacity = 0.15, style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - enterDelay, fps, config: { damping: 20 } });

  return (
    <svg viewBox={pathData.viewBox} width={width} height={height}
      style={{ opacity: enter * opacity, overflow: 'visible', ...style }}>
      {pathData.paths.map((path, i) => {
        const pathStart = enterDelay + i * staggerPerPath;
        const progress = interpolate(frame, [pathStart, pathStart + drawDuration], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        });
        const evolved = evolvePath(progress, path.d);
        const fillOpacity = path.fill
          ? interpolate(frame,
              [pathStart + drawDuration + (path.fillDelay ?? 10), pathStart + drawDuration + (path.fillDelay ?? 10) + 15],
              [0, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          : 0;

        return (
          <path key={i} d={path.d}
            stroke={path.stroke ? color : 'none'}
            strokeWidth={path.strokeWidth ?? 2}
            strokeLinecap="round" strokeLinejoin="round"
            fill={path.fill ? (fillColor ?? color) : 'none'}
            fillOpacity={fillOpacity}
            strokeDasharray={evolved.strokeDasharray}
            strokeDashoffset={evolved.strokeDashoffset}
          />
        );
      })}
    </svg>
  );
};
