import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import { BRAND, resolveV2Product } from '../../brand';
import { GlassCard, GrainOverlay, BotanicalOverlay, Watermark, OrnamentalDivider, ProductBackground } from '../shared/GlassCard';
import { FONTS, SIZE, LAYOUT } from '../shared/fonts';
import type { CaptionWord } from '../CaptionOverlay';

export type BlogStoryPage = {
  text: string;
  emphasis?: string; // Word or phrase that gets accent underline
};

export type BlogStoryProps = {
  title: string;
  pages: BlogStoryPage[];
  author?: string;
  cta?: string;
  musicTrack?: string;
  voiceoverSrc?: string;
  musicVolume?: number;
  durationInFrames?: number;
  backgroundImage?: string;
  captions?: CaptionWord[];
  captionStartFrame?: number;
};

const FontLoader: React.FC = () => (
  <style>{`
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-Bold.ttf')}') format('truetype'); font-weight: 700; }
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-SemiBold.ttf')}') format('truetype'); font-weight: 600; }
    @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins-Regular.ttf')}') format('truetype'); font-weight: 400; }
    @font-face { font-family: 'Lora'; src: url('${staticFile('fonts/Lora-VariableFont_wght.ttf')}') format('truetype'); font-weight: 400 700; }
    @font-face { font-family: 'Lora'; src: url('${staticFile('fonts/Lora-Italic-VariableFont_wght.ttf')}') format('truetype'); font-weight: 400 700; font-style: italic; }
  `}</style>
);

const FRAMES_PER_PAGE = 100; // ~3.3s per page at 30fps
const INTRO_FRAMES = 90;     // Title card
const OUTRO_FRAMES = 90;     // CTA card

export const BlogStory: React.FC<BlogStoryProps> = ({
  title, pages, author, cta = 'Read More → altveda.in',
  musicTrack, voiceoverSrc, musicVolume, backgroundImage,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: TOTAL } = useVideoConfig();

  const theme = resolveV2Product(backgroundImage || 'ashwagandha.png');
  const productKey = (backgroundImage || 'ashwagandha.png').replace(/\.png$/, '');

  const exit = interpolate(frame, [TOTAL - 20, TOTAL - 10], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Total "slides": title + content pages + CTA
  const totalSlides = pages.length + 2; // +1 title, +1 CTA

  // Which slide is currently active?
  const getSlideIndex = () => {
    if (frame < INTRO_FRAMES) return 0; // title
    const pageFrame = frame - INTRO_FRAMES;
    const pageIdx = Math.floor(pageFrame / FRAMES_PER_PAGE);
    if (pageIdx >= pages.length) return pages.length + 1; // CTA
    return pageIdx + 1;
  };
  const currentSlide = getSlideIndex();

  // Slide entrance spring (resets per slide)
  const getSlideEnterFrame = (idx: number) => {
    if (idx === 0) return 0;
    if (idx <= pages.length) return INTRO_FRAMES + (idx - 1) * FRAMES_PER_PAGE;
    return INTRO_FRAMES + pages.length * FRAMES_PER_PAGE;
  };

  return (
    <ProductBackground product={theme} productKey={productKey}>
      <FontLoader />
      <Watermark color={theme.accent} />

      {musicTrack && (
        <Audio src={staticFile(`music/${musicTrack}`)} volume={voiceoverSrc ? (musicVolume ?? 0.22) : 0.3} />
      )}
      {voiceoverSrc && (
        <Sequence from={10}><Audio src={staticFile(voiceoverSrc)} volume={1} /></Sequence>
      )}

      {/* ─── Title Card ─── */}
      {currentSlide === 0 && (
        <AbsoluteFill style={{
          justifyContent: 'center', alignItems: 'center', padding: '0 60px',
          opacity: exit * interpolate(frame, [INTRO_FRAMES - 15, INTRO_FRAMES], [1, 0], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          }),
        }}>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
          }}>
            <OrnamentalDivider color={theme.accent} enterDelay={10} />
            <div style={{
              fontSize: SIZE.TITLE, fontWeight: 700, fontFamily: FONTS.serif,
              color: theme.textPrimary, textAlign: 'center', lineHeight: 1.3,
              maxWidth: '90%',
              opacity: spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 60 } }),
              transform: `translateY(${interpolate(
                spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 60 } }),
                [0, 1], [20, 0],
              )}px)`,
            }}>
              {title}
            </div>
            <OrnamentalDivider color={theme.accent} enterDelay={30} />
            {author && (
              <div style={{
                fontSize: SIZE.BODY_SM, fontFamily: FONTS.body, fontWeight: 400,
                color: theme.textSecondary,
                opacity: spring({ frame: frame - 40, fps, config: { damping: 14 } }),
              }}>
                by {author}
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}

      {/* ─── Content Pages ─── */}
      {pages.map((page, i) => {
        const slideIdx = i + 1;
        if (currentSlide !== slideIdx) return null;

        const enterFrame = getSlideEnterFrame(slideIdx);
        const localFrame = frame - enterFrame;

        const slideEnter = spring({
          frame: localFrame,
          fps,
          config: { damping: 14, stiffness: 60 },
        });
        const slideExit = interpolate(frame,
          [enterFrame + FRAMES_PER_PAGE - 15, enterFrame + FRAMES_PER_PAGE],
          [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );

        // Render text with emphasis underline
        const renderText = () => {
          if (!page.emphasis) {
            return <span>{page.text}</span>;
          }
          const idx = page.text.toLowerCase().indexOf(page.emphasis.toLowerCase());
          if (idx === -1) return <span>{page.text}</span>;

          const before = page.text.slice(0, idx);
          const match = page.text.slice(idx, idx + page.emphasis.length);
          const after = page.text.slice(idx + page.emphasis.length);

          // Underline animation
          const underlineWidth = interpolate(localFrame, [20, 45], [0, 100], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });

          return (
            <>
              {before}
              <span style={{ position: 'relative', display: 'inline-block', paddingBottom: 6 }}>
                {match}
                <span style={{
                  position: 'absolute', bottom: 0, left: 0,
                  width: `${underlineWidth}%`, height: 4,
                  backgroundColor: theme.accent, borderRadius: 2,
                }} />
              </span>
              {after}
            </>
          );
        };

        return (
          <AbsoluteFill key={i} style={{
            justifyContent: 'center', alignItems: 'center', paddingTop: LAYOUT.TOP_SAFE, paddingBottom: LAYOUT.BOTTOM_SAFE,
            opacity: exit * slideExit,
            transform: `translateX(${interpolate(slideEnter, [0, 1], [80, 0])}px)`,
          }}>
            <GlassCard width="86%" padding={44}>
              {/* Page counter badge */}
              <div style={{
                backgroundColor: `${theme.accent}22`, border: `1px solid ${theme.accent}44`,
                borderRadius: 16, padding: '4px 14px',
              }}>
                <span style={{
                  fontSize: SIZE.CAPTION, fontWeight: 600, fontFamily: FONTS.heading,
                  color: theme.accent, letterSpacing: 2,
                }}>{i + 1} / {pages.length}</span>
              </div>

              <div style={{
                fontSize: SIZE.BODY_LG, fontWeight: 400, fontFamily: FONTS.serif,
                color: theme.textPrimary, textAlign: 'center', lineHeight: 1.7,
                maxWidth: '92%', marginTop: 8,
              }}>
                {renderText()}
              </div>
            </GlassCard>
          </AbsoluteFill>
        );
      })}

      {/* ─── CTA Card ─── */}
      {currentSlide === totalSlides - 1 && (() => {
        const enterFrame = getSlideEnterFrame(totalSlides - 1);
        const localFrame = frame - enterFrame;
        const ctaEnter = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 60 } });

        return (
          <AbsoluteFill style={{
            justifyContent: 'center', alignItems: 'center', padding: '0 60px',
            opacity: exit,
            transform: `translateX(${interpolate(ctaEnter, [0, 1], [80, 0])}px)`,
          }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28,
            }}>
              <div style={{
                fontSize: SIZE.BODY_LG, fontWeight: 700, fontFamily: FONTS.serif,
                color: theme.textPrimary, textAlign: 'center',
              }}>
                Want to learn more?
              </div>
              <div style={{
                backgroundColor: theme.accent, borderRadius: 28, padding: '16px 36px',
                boxShadow: `0 6px 20px ${theme.accent}44`,
              }}>
                <span style={{
                  color: '#fff', fontSize: SIZE.CTA_BUTTON, fontWeight: 700,
                  fontFamily: FONTS.heading, letterSpacing: 1,
                }}>
                  {cta}
                </span>
              </div>
            </div>
          </AbsoluteFill>
        );
      })()}

      {/* ─── Progress Dots ─── */}
      <div style={{
        position: 'absolute', bottom: 60, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', gap: 10, opacity: exit * 0.7,
      }}>
        {Array.from({ length: totalSlides }, (_, i) => (
          <div key={i} style={{
            width: i === currentSlide ? 24 : 8,
            height: 8, borderRadius: 4,
            backgroundColor: i === currentSlide ? theme.accent : `${theme.accent}40`,
            transition: 'width 0.3s',
          }} />
        ))}
      </div>
    </ProductBackground>
  );
};
