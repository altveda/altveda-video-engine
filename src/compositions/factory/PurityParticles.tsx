import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import React, { useMemo } from 'react';

export const PurityParticles: React.FC<{ count?: number; color?: string }> = ({ count = 50, color = '#7C9A7E' }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Generate random particles once
  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }, [count, width, height]);

  return (
    <AbsoluteFill>
      {particles.map((p, i) => {
        const drift = (frame * p.speed) % height;
        const currentY = (p.y - drift + height) % height;
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x,
              top: currentY,
              width: p.size,
              height: p.size,
              backgroundColor: color,
              borderRadius: '50%',
              opacity: p.opacity,
              boxShadow: `0 0 10px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
