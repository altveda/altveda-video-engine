import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, loadFont } from 'remotion';
import React from 'react';

loadFont('Inter', {
  weights: ['400', '700', '900'],
});

export const DataScroll: React.FC<{
  label: string;
  value: string;
  metricName: string;
  studySource: string;
}> = ({ label, value, metricName, studySource }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  // Chart growth animation
  const barProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 100 },
  });

  const contentOpacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <AbsoluteFill style={{ 
      backgroundColor: '#0A0F0B', // Professional Deep Dark Green
      fontFamily: 'Inter, sans-serif',
      color: 'white',
      padding: 60
    }}>
      {/* Background Blueprint Grid */}
      <div style={{
        position: 'absolute',
        width: '200%',
        height: '200%',
        backgroundImage: 'linear-gradient(rgba(124,154,126,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(124,154,126,0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        transform: `translateY(${frame * -0.5}px) rotate(-5deg)`,
        opacity: 0.5
      }} />

      {/* Technical Header */}
      <div style={{ opacity: contentOpacity, zIndex: 1 }}>
        <div style={{ display: 'inline-block', border: '1px solid #7C9A7E', padding: '5px 15px', borderRadius: 5, color: '#7C9A7E', fontSize: 16, fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: 20 }}>
          CLINICAL DATA LOG // 2026
        </div>
        <h1 style={{ fontSize: 72, fontWeight: 900, margin: 0, lineHeight: 1 }}>{label}</h1>
      </div>

      {/* The Visual Data Chart */}
      <div style={{ marginTop: 80, position: 'relative', height: 400, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
        {/* The Bar */}
        <div style={{
          width: 300,
          height: interpolate(barProgress, [0, 1], [0, 350]),
          background: 'linear-gradient(to top, #7C9A7E, #A7C4A9)',
          borderRadius: '20px 20px 0 0',
          position: 'relative',
          boxShadow: '0 0 40px rgba(124,154,126,0.3)'
        }}>
          {/* Percentage Label */}
          <div style={{ position: 'absolute', top: -100, left: 0, width: '100%', textAlign: 'center', opacity: barProgress }}>
            <span style={{ fontSize: 100, fontWeight: 900, color: 'white' }}>{value}</span>
            <div style={{ fontSize: 24, color: '#7C9A7E', fontWeight: 'bold', marginTop: -10 }}>{metricName}</div>
          </div>
        </div>
        
        {/* Baseline Divider */}
        <div style={{ position: 'absolute', bottom: 0, width: '100%', height: 2, background: 'rgba(255,255,255,0.2)' }} />
      </div>

      {/* The Citation (The "Proof" layer) */}
      <div style={{ marginTop: 100, maxWidth: 600, opacity: interpolate(frame, [60, 90], [0, 1]) }}>
        <p style={{ fontSize: 24, color: '#888', lineHeight: 1.5 }}>
          "This result was observed over a 60-day period using standardized botanical extracts, verifying the synergy between tradition and modern biology."
        </p>
        <div style={{ marginTop: 20, color: '#7C9A7E', fontWeight: 'bold', fontSize: 18 }}>
          SOURCE: {studySource}
        </div>
      </div>

      {/* Tech Footer */}
      <div style={{ position: 'absolute', bottom: 60, right: 60, textAlign: 'right' }}>
        <div style={{ fontSize: 14, color: '#444', letterSpacing: '0.2em' }}>ENCRYPTED ASSET ID: AV-004-DATA</div>
        <div style={{ fontSize: 32, fontWeight: 900, color: '#7C9A7E', marginTop: 5 }}>ALTVEDA SCIENCE</div>
      </div>
    </AbsoluteFill>
  );
};
