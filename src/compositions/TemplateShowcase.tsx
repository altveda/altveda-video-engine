import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Easing,
} from 'remotion';
import { QUICKSELL_BRAND as QS } from '../brand';

export type TemplateShowcaseProps = {
  customerMessage: string;
  sellerReply: string;
  scenario: string;
  language?: string;
  musicTrack?: string;
  voiceoverSrc?: string;
  musicVolume?: number;
  durationInFrames?: number;
};

// ─── Font Loader ───────────────────────────────────────────────

const FontLoader: React.FC = () => (
  <style>
    {`
      @font-face {
        font-family: 'Poppins';
        src: url('${staticFile('fonts/Poppins-Regular.ttf')}') format('truetype');
        font-weight: 400;
        font-style: normal;
      }
      @font-face {
        font-family: 'Poppins';
        src: url('${staticFile('fonts/Poppins-SemiBold.ttf')}') format('truetype');
        font-weight: 600;
        font-style: normal;
      }
      @font-face {
        font-family: 'Poppins';
        src: url('${staticFile('fonts/Poppins-Bold.ttf')}') format('truetype');
        font-weight: 700;
        font-style: normal;
      }
    `}
  </style>
);

// ─── Progress Bar ──────────────────────────────────────────────

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = frame / durationInFrames;
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: 4, backgroundColor: 'rgba(0,0,0,0.1)', zIndex: 100,
    }}>
      <div style={{
        width: `${progress * 100}%`, height: '100%',
        backgroundColor: QS.orange, borderRadius: '0 2px 2px 0',
      }} />
    </div>
  );
};

// ─── Typing Indicator ──────────────────────────────────────────

const TypingDots: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  if (localFrame < 0) return null;

  return (
    <div style={{
      display: 'flex', gap: 6, padding: '16px 20px',
      backgroundColor: QS.gray200, borderRadius: '18px 18px 18px 4px',
      width: 'fit-content', marginLeft: 20,
    }}>
      {[0, 1, 2].map((i) => {
        const bounce = Math.sin((localFrame * 0.15) + (i * 1.2)) * 0.5 + 0.5;
        return (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: '50%',
            backgroundColor: QS.gray400,
            opacity: 0.4 + bounce * 0.6,
            transform: `translateY(${-bounce * 4}px)`,
          }} />
        );
      })}
    </div>
  );
};

// ─── Chat Bubble ───────────────────────────────────────────────

const ChatBubble: React.FC<{
  text: string;
  isCustomer: boolean;
  opacity: number;
  translateY: number;
}> = ({ text, isCustomer, opacity, translateY }) => (
  <div style={{
    opacity,
    transform: `translateY(${translateY}px)`,
    display: 'flex',
    justifyContent: isCustomer ? 'flex-start' : 'flex-end',
    padding: '0 20px',
  }}>
    <div style={{
      maxWidth: '80%',
      padding: '18px 24px',
      borderRadius: isCustomer ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
      backgroundColor: isCustomer ? QS.gray200 : QS.waGreen,
      fontFamily: QS.fontBody,
      fontSize: 26,
      fontWeight: 400,
      lineHeight: 1.45,
      color: isCustomer ? QS.dark : QS.white,
      whiteSpace: 'pre-wrap',
    }}>
      {text}
      <div style={{
        fontSize: 16, color: isCustomer ? QS.gray400 : 'rgba(255,255,255,0.7)',
        textAlign: 'right', marginTop: 6,
      }}>
        {isCustomer ? '10:32 AM' : '10:33 AM ✓✓'}
      </div>
    </div>
  </div>
);

// ─── Main Composition ──────────────────────────────────────────

export const TemplateShowcase: React.FC<TemplateShowcaseProps> = ({
  customerMessage,
  sellerReply,
  scenario,
  language,
  musicTrack,
  voiceoverSrc,
  musicVolume,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: TOTAL } = useVideoConfig();

  // Timeline (frames at 30fps)
  const PHONE_IN = 0;
  const SCENARIO_IN = 15;
  const CUSTOMER_IN = 45;
  const TYPING_IN = 90;
  const TYPING_OUT = 135;
  const REPLY_IN = 135;
  const CTA_IN = Math.round(TOTAL * 0.7);

  // Phone frame slide-up
  const phoneY = interpolate(frame, [PHONE_IN, PHONE_IN + 25], [300, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const phoneOpacity = interpolate(frame, [PHONE_IN, PHONE_IN + 15], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Scenario label
  const scenarioOpacity = interpolate(frame, [SCENARIO_IN, SCENARIO_IN + 20], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Customer message
  const customerOpacity = interpolate(frame, [CUSTOMER_IN, CUSTOMER_IN + 20], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const customerY = interpolate(frame, [CUSTOMER_IN, CUSTOMER_IN + 20], [30, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Typing indicator visible
  const typingOpacity = interpolate(frame, [TYPING_IN, TYPING_IN + 10, TYPING_OUT - 5, TYPING_OUT], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Seller reply
  const replySpring = spring({
    frame: frame - REPLY_IN, fps,
    config: { stiffness: 80, damping: 14 },
    from: 0, to: 1,
  });
  const replyOpacity = interpolate(replySpring, [0, 0.5], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const replyY = interpolate(replySpring, [0, 1], [40, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // CTA overlay
  const ctaOpacity = interpolate(frame, [CTA_IN, CTA_IN + 25], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const ctaScale = spring({
    frame: frame - CTA_IN, fps,
    config: { stiffness: 100, damping: 12 },
    from: 0.8, to: 1,
  });

  // Fade out last 15 frames
  const fadeOut = interpolate(frame, [TOTAL - 15, TOTAL], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{
      backgroundColor: '#ECE5DD', // WhatsApp chat background color
      opacity: fadeOut,
    }}>
      <FontLoader />
      <ProgressBar />

      {/* Background music */}
      {musicTrack && (
        <Audio src={staticFile(`music/${musicTrack}`)} volume={voiceoverSrc ? (musicVolume ?? 0.22) : 0.25} />
      )}
      {voiceoverSrc && (
        <Sequence from={10}>
          <Audio src={staticFile(voiceoverSrc)} volume={1} />
        </Sequence>
      )}

      {/* WhatsApp-style wallpaper pattern (subtle) */}
      <AbsoluteFill style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(0,0,0,0.02) 1px, transparent 1px)`,
        backgroundSize: '30px 30px',
      }} />

      {/* Phone frame area */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        opacity: phoneOpacity,
        transform: `translateY(${phoneY}px)`,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* WhatsApp top bar */}
        <div style={{
          backgroundColor: QS.waGreenDark,
          padding: '60px 24px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            backgroundColor: QS.gray200,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, color: QS.gray600,
          }}>
            👤
          </div>
          <div>
            <div style={{
              fontFamily: QS.fontHeading, fontSize: 24, fontWeight: 600,
              color: QS.white,
            }}>
              Customer
            </div>
            <div style={{
              fontFamily: QS.fontBody, fontSize: 16,
              color: 'rgba(255,255,255,0.7)',
            }}>
              online
            </div>
          </div>
        </div>

        {/* Scenario label */}
        <div style={{
          textAlign: 'center', padding: '20px 24px',
          opacity: scenarioOpacity,
        }}>
          <span style={{
            fontFamily: QS.fontBody, fontSize: 24, fontWeight: 600,
            color: QS.gray600, letterSpacing: 2, textTransform: 'uppercase',
            backgroundColor: 'rgba(255,255,255,0.8)',
            padding: '8px 20px', borderRadius: 8,
          }}>
            {scenario}{language ? ` • ${language}` : ''}
          </span>
        </div>

        {/* Chat area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          padding: '20px 0',
        }}>
          {/* Customer message */}
          <ChatBubble
            text={customerMessage}
            isCustomer={true}
            opacity={customerOpacity}
            translateY={customerY}
          />

          {/* Typing indicator */}
          <div style={{ opacity: typingOpacity }}>
            <TypingDots startFrame={TYPING_IN} />
          </div>

          {/* Seller reply */}
          <ChatBubble
            text={sellerReply}
            isCustomer={false}
            opacity={replyOpacity}
            translateY={replyY}
          />
        </div>

        {/* CTA overlay at bottom */}
        <div style={{
          position: 'absolute',
          bottom: 60, left: '50%',
          transform: `translateX(-50%) scale(${ctaScale})`,
          opacity: ctaOpacity,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{
            backgroundColor: QS.orange,
            padding: '20px 48px',
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(249, 115, 22, 0.3)',
          }}>
            <span style={{
              fontFamily: QS.fontHeading, fontSize: 28, fontWeight: 700,
              color: QS.white,
            }}>
              50+ Templates • 9 Languages
            </span>
          </div>
          <span style={{
            fontFamily: QS.fontBody, fontSize: 20, fontWeight: 500,
            color: QS.gray600,
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: '6px 16px', borderRadius: 6,
          }}>
            Starting ₹99
          </span>
        </div>
      </div>

      {/* Brand watermark */}
      <div style={{
        position: 'absolute', bottom: 16, left: '50%',
        transform: 'translateX(-50%)',
        padding: '4px 16px', borderRadius: 6,
        background: 'rgba(0,0,0,0.3)',
        zIndex: 20,
      }}>
        <span style={{
          fontFamily: QS.fontHeading, fontSize: 22, fontWeight: 500,
          color: QS.white, letterSpacing: 4, textTransform: 'uppercase',
        }}>
          QUICKSELL
        </span>
      </div>
    </AbsoluteFill>
  );
};
