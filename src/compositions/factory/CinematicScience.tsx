import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';
import React from 'react';

const { fontFamily } = loadFont();

export const CinematicScience: React.FC<{
  productName: string;
  tagline: string;
  finding: string;
}> = ({ productName, tagline, finding }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Opacity animations
  const productOpacity = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: 'clamp' });
  const textOpacity = interpolate(frame, [40, 90], [0, 1], { extrapolateRight: 'clamp' });

  // Spring motion for the tagline
  const taglineSlide = spring({
    frame: frame - 50,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill style={{ 
      backgroundColor: '#FAF7F2', 
      fontFamily,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      {/* Background Subtle Gradient Pulse */}
      <div style={{
        position: 'absolute',
        width: '150%',
        height: '150%',
        background: 'radial-gradient(circle, rgba(124,154,126,0.05) 0%, transparent 70%)',
        opacity: Math.sin(frame / 30) * 0.5 + 0.5
      }} />

      {/* Main Product Label (Minimalist) */}
      <div style={{
        opacity: productOpacity,
        textAlign: 'center',
        transform: `scale(${interpolate(frame, [0, 300], [1, 1.1])})`
      }}>
        <h1 style={{
          fontSize: 140,
          fontWeight: 900,
          color: '#2C2C2C',
          margin: 0,
          letterSpacing: '-0.05em',
          textTransform: 'uppercase'
        }}>
          {productName}
        </h1>
        
        {/* The Finding - Technical Precision */}
        <div style={{
          marginTop: 20,
          background: '#7C9A7E',
          color: 'white',
          padding: '10px 30px',
          fontSize: 24,
          fontWeight: 'bold',
          borderRadius: 10,
          display: 'inline-block',
          opacity: textOpacity
        }}>
          {finding}
        </div>
      </div>

      {/* The Hook / Tagline */}
      <div style={{
        position: 'absolute',
        bottom: 100,
        textAlign: 'center',
        opacity: textOpacity,
        transform: `translateY(${interpolate(taglineSlide, [0, 1], [40, 0])}px)`
      }}>
        <p style={{ fontSize: 40, color: '#4A4A4A', margin: 0, letterSpacing: '0.1em', fontWeight: 400 }}>
          {tagline}
        </p>
        <div style={{ 
          height: 1, 
          width: 300, 
          background: '#7C9A7E', 
          margin: '20px auto',
          transform: `scaleX(${textOpacity})`
        }} />
      </div>

      {/* Brand Corner */}
      <div style={{ position: 'absolute', top: 60, right: 60, fontWeight: 900, fontSize: 32, color: '#7C9A7E', opacity: 0.8 }}>
        ALTVEDA
      </div>
    </AbsoluteFill>
  );
};
