import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, loadFont } from 'remotion';
import React from 'react';

loadFont('Playfair Display', {
  weights: ['400', '700', '900'],
});

export const FoundersHeart: React.FC<{
  quote: string;
  subtext: string;
  storyPoint: string;
}> = ({ quote, subtext, storyPoint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Gentle breath-like pulse
  const pulse = Math.sin(frame / 45) * 0.05 + 1;
  
  // Fade in animations
  const contentOpacity = interpolate(frame, [0, 45], [0, 1], { extrapolateRight: 'clamp' });
  const storyOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ 
      backgroundColor: '#FAF7F2', 
      fontFamily: '"Playfair Display", serif',
      padding: 80,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {/* Soft Watercolor Background Element */}
      <div style={{
        position: 'absolute',
        width: 800,
        height: 800,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,154,126,0.15) 0%, transparent 70%)',
        transform: `scale(${pulse})`,
        zIndex: 0
      }} />

      {/* The Story Point (Floating Label) */}
      <div style={{
        position: 'absolute',
        top: 100,
        opacity: storyOpacity,
        letterSpacing: '0.2em',
        fontSize: 20,
        fontWeight: 400,
        color: '#7C9A7E',
        textTransform: 'uppercase'
      }}>
        — {storyPoint} —
      </div>

      {/* The Heart Quote */}
      <div style={{ 
        maxWidth: 800, 
        textAlign: 'center', 
        zIndex: 1,
        opacity: contentOpacity 
      }}>
        <h1 style={{ 
          fontSize: 64, 
          lineHeight: 1.3, 
          color: '#2C2C2C', 
          fontStyle: 'italic',
          margin: 0
        }}>
          "{quote}"
        </h1>
        
        <p style={{ 
          fontSize: 28, 
          color: '#4A4A4A', 
          marginTop: 40,
          fontWeight: 400,
          fontFamily: 'Inter, sans-serif'
        }}>
          {subtext}
        </p>
      </div>

      {/* Signature */}
      <div style={{ 
        position: 'absolute', 
        bottom: 100, 
        opacity: storyOpacity,
        textAlign: 'center'
      }}>
        <div style={{ fontWeight: 900, fontSize: 32, color: '#7C9A7E' }}>Sangam Goyal</div>
        <div style={{ fontSize: 16, color: '#999', marginTop: 5, letterSpacing: '0.1em' }}>FOUNDER, ALTVEDA</div>
      </div>
    </AbsoluteFill>
  );
};
