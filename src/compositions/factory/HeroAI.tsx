import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';
import { PurityParticles } from './PurityParticles';
import React from 'react';

const { fontFamily } = loadFont();

export const HeroAI: React.FC<{
  imageUrl: string;
  title: string;
  subtitle: string;
}> = ({ imageUrl, title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', fontFamily }}>
      {/* The AI-Generated Image (Background) */}
      <AbsoluteFill style={{ opacity: 0.6 }}>
        <img 
          src={imageUrl} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            transform: `scale(${interpolate(frame, [0, 300], [1, 1.2])})` 
          }} 
        />
      </AbsoluteFill>

      {/* Floating Particles for Premium Feel */}
      <PurityParticles count={30} color="#fff" />

      {/* Vignette for Text Contrast */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.8) 100%)'
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute',
        bottom: 150,
        left: 80,
        right: 80
      }}>
        <h1 style={{ 
          fontSize: 100, 
          color: 'white', 
          fontWeight: 900, 
          lineHeight: 1,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [50, 0])}px)`,
          opacity: titleSpring
        }}>
          {title}
        </h1>
        <p style={{ 
          fontSize: 40, 
          color: '#7C9A7E', 
          fontWeight: 'bold', 
          marginTop: 20,
          opacity: interpolate(frame, [40, 70], [0, 1])
        }}>
          {subtitle}
        </p>
      </div>

      {/* Branded ID */}
      <div style={{ position: 'absolute', top: 60, left: 60, color: 'white', fontSize: 24, fontWeight: 900, letterSpacing: '0.2em', opacity: 0.5 }}>
        ALTVEDA STUDIO // AI-X1
      </div>
    </AbsoluteFill>
  );
};
