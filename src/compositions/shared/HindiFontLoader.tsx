import React from 'react';
import { staticFile } from 'remotion';

/**
 * Shared @font-face loader for Noto Sans Devanagari (4 weights) + English fallbacks.
 * Include once per Hindi composition — Remotion deduplicates <style> tags.
 */
export const HindiFontLoader: React.FC = () => (
  <style>
    {`
      @font-face {
        font-family: 'Noto Sans Devanagari';
        src: url('${staticFile('fonts/NotoSansDevanagari-Regular.ttf')}') format('truetype');
        font-weight: 400;
        font-style: normal;
      }
      @font-face {
        font-family: 'Noto Sans Devanagari';
        src: url('${staticFile('fonts/NotoSansDevanagari-Medium.ttf')}') format('truetype');
        font-weight: 500;
        font-style: normal;
      }
      @font-face {
        font-family: 'Noto Sans Devanagari';
        src: url('${staticFile('fonts/NotoSansDevanagari-SemiBold.ttf')}') format('truetype');
        font-weight: 600;
        font-style: normal;
      }
      @font-face {
        font-family: 'Noto Sans Devanagari';
        src: url('${staticFile('fonts/NotoSansDevanagari-Bold.ttf')}') format('truetype');
        font-weight: 700;
        font-style: normal;
      }
      @font-face {
        font-family: 'Poppins';
        src: url('${staticFile('fonts/Poppins-Regular.ttf')}') format('truetype');
        font-weight: 400;
        font-style: normal;
      }
      @font-face {
        font-family: 'Poppins';
        src: url('${staticFile('fonts/Poppins-Medium.ttf')}') format('truetype');
        font-weight: 500;
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
      @font-face {
        font-family: 'Lora';
        src: url('${staticFile('fonts/Lora-VariableFont_wght.ttf')}') format('truetype');
        font-weight: 400 700;
        font-style: normal;
      }
      @font-face {
        font-family: 'Lora';
        src: url('${staticFile('fonts/Lora-Italic-VariableFont_wght.ttf')}') format('truetype');
        font-weight: 400 700;
        font-style: italic;
      }
    `}
  </style>
);
