import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { ART_THEMES, type ArtThemePalette } from '../artThemes';

/**
 * Backwards-compatible type alias.
 * Compositions reference ProductTheme for color lookups.
 */
export type ProductTheme = ArtThemePalette;

/**
 * Derived lookup: filename → palette.
 * Compositions pass `backgroundImage: 'ashwagandha.png'` and look up colors here.
 */
export const PRODUCT_THEMES: Record<string, ProductTheme> = Object.fromEntries(
  Object.entries(ART_THEMES).map(([id, theme]) => [theme.artFile, theme.palette])
);

/**
 * Named positions across the panoramic art (2610×900, ~3:1).
 * Values are horizontal % for object-position.
 */
export const ART_POSITIONS = {
  farLeft: '10%',
  left: '25%',
  center: '50%',
  right: '75%',
  farRight: '90%',
} as const;

export type ArtPositionName = keyof typeof ART_POSITIONS;

type BackgroundLayerProps = {
  imageSrc?: string;
  fallbackGradient: string;
  /** Static horizontal position (e.g. '25%', '50%', or an ART_POSITIONS key).
   *  Used by HTML screenshot templates. */
  artPosition?: string;
  /**
   * Continuous pan position: 0 = far left, 100 = far right.
   * Maps to object-position percentage for a smooth dolly pan.
   * The parent composition should compute this from its global frame.
   */
  artPan?: number;
};

/**
 * Renders a full-frame art background with optional panning.
 *
 * Both static and pan modes use full-frame `object-fit: cover` so the art
 * dominates the entire frame. For video panning, `object-position` animates
 * smoothly from left to right, creating a dolly shot effect.
 */
export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  imageSrc,
  fallbackGradient,
  artPosition,
  artPan,
}) => {
  const theme = imageSrc ? PRODUCT_THEMES[imageSrc] : null;
  const gradient = theme ? theme.gradient : fallbackGradient;

  // Resolve horizontal position
  let posX: string;
  if (artPan !== undefined) {
    // Continuous pan: 0→100 maps to object-position 0%→100%
    posX = `${artPan}%`;
  } else {
    posX = artPosition || 'center';
    if (posX in ART_POSITIONS) {
      posX = ART_POSITIONS[posX as ArtPositionName];
    }
  }

  return (
    <>
      {/* Base gradient — visible as fallback or behind transparent areas */}
      <AbsoluteFill style={{ background: gradient }} />

      {imageSrc && (
        <AbsoluteFill>
          <Img
            src={staticFile(`backgrounds/${imageSrc}`)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: `${posX} bottom`,
            }}
          />
        </AbsoluteFill>
      )}
    </>
  );
};
