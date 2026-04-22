import { AbsoluteFill, loadFont } from 'remotion';
import React from 'react';

loadFont('Inter', {
  weights: ['400', '700', '900'],
});

export const AmlaVsOrange: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#FAF7F2', padding: 60, fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 80, fontWeight: 900, color: '#2C2C2C', margin: 0, letterSpacing: '-0.02em' }}>
          Science of <span style={{ color: '#7C9A7E' }}>Potency</span>
        </h1>
        <p style={{ fontSize: 32, color: '#4A4A4A', marginTop: 10 }}>The Vitamin C Comparison: Amla vs. Orange</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, height: '60%' }}>
        {/* Orange Card */}
        <div style={{ 
          background: 'white', 
          borderRadius: 40, 
          padding: 40, 
          border: '2px solid #E8E2D9',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 120, marginBottom: 20 }}>🍊</div>
          <h2 style={{ fontSize: 48, margin: 0, color: '#2C2C2C' }}>1 Orange</h2>
          <div style={{ height: 10, width: 200, background: '#FF9900', borderRadius: 5, margin: '20px 0' }} />
          <p style={{ fontSize: 64, fontWeight: 900, margin: 0 }}>~50mg</p>
          <p style={{ fontSize: 24, color: '#666' }}>Vitamin C</p>
        </div>

        {/* Amla Card */}
        <div style={{ 
          background: '#7C9A7E', 
          borderRadius: 40, 
          padding: 40, 
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(124, 154, 126, 0.3)'
        }}>
          <div style={{ fontSize: 120, marginBottom: 20 }}>🌿</div>
          <h2 style={{ fontSize: 48, margin: 0 }}>1 Amla</h2>
          <div style={{ height: 10, width: 200, background: 'white', borderRadius: 5, margin: '20px 0' }} />
          <p style={{ fontSize: 64, fontWeight: 900, margin: 0 }}>600-800mg</p>
          <p style={{ fontSize: 24, opacity: 0.8 }}>Vitamin C</p>
          <div style={{ 
            marginTop: 30, 
            background: 'rgba(255,255,255,0.2)', 
            padding: '10px 20px', 
            borderRadius: 100,
            fontSize: 20,
            fontWeight: 'bold'
          }}>
            20x MORE POTENT
          </div>
        </div>
      </div>

      {/* Footer / Citation */}
      <div style={{ marginTop: 'auto', borderTop: '2px solid #E8E2D9', paddingTop: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: 18, color: '#999', margin: 0 }}>
          Source: Comparative Nutritional Analysis (USDA & Ayurvedic Data)
        </p>
        <div style={{ fontWeight: 'bold', fontSize: 24, color: '#7C9A7E' }}>ALTVEDA</div>
      </div>
    </AbsoluteFill>
  );
};
