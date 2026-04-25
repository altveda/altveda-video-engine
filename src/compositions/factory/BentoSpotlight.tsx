import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';
import React from 'react';

const { fontFamily } = loadFont();

export const BentoSpotlight: React.FC<{
  productName: string;
  finding: string;
  badge: string;
}> = ({ productName, finding, badge }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Grid entry animations
  const gridSpring = (delay: number) => spring({
    frame: frame - delay,
    fps,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill style={{ 
      backgroundColor: '#FAF7F2', 
      fontFamily,
      padding: 40
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: 20,
        height: '100%',
        width: '100%'
      }}>
        {/* Box 1: Product Label (Popping in) */}
        <div style={{
          background: 'white',
          borderRadius: 40,
          border: '2px solid #E8E2D9',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transform: `scale(${interpolate(gridSpring(10), [0, 1], [0, 1])})`
        }}>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: '#7C9A7E', margin: 0, textAlign: 'center' }}>
            {productName}
          </h1>
        </div>

        {/* Box 2: The Science Brief */}
        <div style={{
          background: '#7C9A7E',
          borderRadius: 40,
          color: 'white',
          padding: 40,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          transform: `scale(${interpolate(gridSpring(20), [0, 1], [0, 1])})`
        }}>
          <div style={{ fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.8, marginBottom: 10 }}>Clinical Find</div>
          <p style={{ fontSize: 32, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>{finding}</p>
        </div>

        {/* Box 3: The Trust Badge */}
        <div style={{
          background: 'white',
          borderRadius: 40,
          border: '2px solid #7C9A7E',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transform: `scale(${interpolate(gridSpring(30), [0, 1], [0, 1])})`
        }}>
          <div style={{ textAlign: 'center' }}>
             <div style={{ fontSize: 40 }}>🏆</div>
             <p style={{ fontSize: 24, fontWeight: 900, color: '#2C2C2C', margin: 0 }}>{badge}</p>
          </div>
        </div>

        {/* Box 4: The CTA */}
        <div style={{
          background: '#2C2C2C',
          borderRadius: 40,
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transform: `scale(${interpolate(gridSpring(40), [0, 1], [0, 1])})`
        }}>
          <p style={{ fontSize: 40, fontWeight: 900, margin: 0 }}>Shop Now ↗</p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
