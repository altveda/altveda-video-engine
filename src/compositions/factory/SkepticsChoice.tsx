import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';
import React from 'react';

const { fontFamily } = loadFont();

export const SkepticsChoice: React.FC<{
  leftTitle: string;
  leftValue: string;
  rightTitle: string;
  rightValue: string;
  hook: string;
}> = ({ leftTitle, leftValue, rightTitle, rightValue, hook }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // Split screen animation
  const splitProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 100 },
  });

  const dividerX = interpolate(splitProgress, [0, 1], [0, width / 2]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#FAF7F2', fontFamily }}>
      {/* Left Side: The "Generic" Skepticism */}
      <div style={{
        position: 'absolute',
        left: 0,
        width: dividerX,
        height: '100%',
        backgroundColor: '#2C2C2C',
        color: 'white',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 40,
        zIndex: 1
      }}>
        <h2 style={{ fontSize: 40, opacity: 0.6, margin: 0 }}>{leftTitle}</h2>
        <p style={{ fontSize: 80, fontWeight: 900, margin: '20px 0' }}>{leftValue}</p>
      </div>

      {/* Right Side: The "AltVeda" Truth */}
      <div style={{
        position: 'absolute',
        right: 0,
        width: width - dividerX,
        height: '100%',
        backgroundColor: '#7C9A7E',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 40,
        textAlign: 'right'
      }}>
        <h2 style={{ fontSize: 40, opacity: 0.8, margin: 0 }}>{rightTitle}</h2>
        <p style={{ fontSize: 100, fontWeight: 900, margin: '20px 0' }}>{rightValue}</p>
        
        {/* Verification Badge */}
        <div style={{ alignSelf: 'flex-end', background: 'white', color: '#7C9A7E', padding: '10px 20px', borderRadius: 100, fontWeight: 'bold', fontSize: 24 }}>
          ALTVEDA VERIFIED
        </div>
      </div>

      {/* Center Hook (Appears late) */}
      <div style={{
        position: 'absolute',
        top: 60,
        width: '100%',
        textAlign: 'center',
        opacity: interpolate(frame, [45, 60], [0, 1]),
        zIndex: 2
      }}>
        <span style={{ background: 'white', color: '#2C2C2C', padding: '15px 40px', borderRadius: 20, fontSize: 32, fontWeight: 900, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          {hook}
        </span>
      </div>
    </AbsoluteFill>
  );
};
