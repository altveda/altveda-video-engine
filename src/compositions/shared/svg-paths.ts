// Botanical SVG path data for DrawingSVG animations
// Each set has a viewBox and array of paths with draw order

export interface SVGPathData {
  viewBox: string;
  paths: Array<{
    d: string;
    stroke?: boolean;
    fill?: boolean;
    strokeWidth?: number;
    fillDelay?: number; // frames after stroke completes before fill appears
  }>;
}

export const BOTANICAL_PATHS = {
  leaf: {
    viewBox: '0 0 100 160',
    paths: [
      { d: 'M50 155 C50 110 15 70 50 5 C85 70 50 110 50 155Z', stroke: true, fill: true, fillDelay: 10 },
      { d: 'M50 145 L50 15', stroke: true, strokeWidth: 1.5 },
      { d: 'M50 120 C38 108 30 95 35 82', stroke: true, strokeWidth: 1 },
      { d: 'M50 95 C62 83 70 70 65 57', stroke: true, strokeWidth: 1 },
      { d: 'M50 70 C38 58 32 48 37 38', stroke: true, strokeWidth: 1 },
    ],
  } satisfies SVGPathData,

  sprig: {
    viewBox: '0 0 120 200',
    paths: [
      { d: 'M60 195 C58 150 55 100 60 20', stroke: true, strokeWidth: 2 },
      { d: 'M60 160 C45 150 30 155 25 145 C35 140 50 145 60 155', stroke: true, fill: true, fillDelay: 8 },
      { d: 'M60 130 C75 120 90 125 95 115 C85 110 70 115 60 125', stroke: true, fill: true, fillDelay: 8 },
      { d: 'M60 100 C45 90 30 95 25 85 C35 80 50 85 60 95', stroke: true, fill: true, fillDelay: 8 },
      { d: 'M60 70 C75 60 90 65 95 55 C85 50 70 55 60 65', stroke: true, fill: true, fillDelay: 8 },
      { d: 'M60 45 C48 35 38 38 35 28 C42 25 52 30 60 40', stroke: true, fill: true, fillDelay: 8 },
      { d: 'M60 45 C72 35 82 38 85 28 C78 25 68 30 60 40', stroke: true, fill: true, fillDelay: 8 },
    ],
  } satisfies SVGPathData,

  mandala: {
    viewBox: '0 0 300 300',
    paths: [
      { d: 'M150 30 A120 120 0 1 1 149.99 30', stroke: true, strokeWidth: 1.5 },
      { d: 'M150 60 A90 90 0 1 1 149.99 60', stroke: true, strokeWidth: 1 },
      { d: 'M150 90 A60 60 0 1 1 149.99 90', stroke: true, strokeWidth: 1 },
      ...[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 150, cy = 150, r = 85;
        const x = cx + Math.cos(rad) * r;
        const y = cy + Math.sin(rad) * r;
        const cpx1 = cx + Math.cos(rad - 0.3) * 50;
        const cpy1 = cy + Math.sin(rad - 0.3) * 50;
        const cpx2 = cx + Math.cos(rad + 0.3) * 50;
        const cpy2 = cy + Math.sin(rad + 0.3) * 50;
        return {
          d: `M${cx} ${cy} C${cpx1} ${cpy1} ${cpx1 + (x - cx) * 0.5} ${cpy1 + (y - cy) * 0.5} ${x} ${y} C${cpx2 + (x - cx) * 0.5} ${cpy2 + (y - cy) * 0.5} ${cpx2} ${cpy2} ${cx} ${cy}`,
          stroke: true, fill: true, fillDelay: 15, strokeWidth: 0.8,
        };
      }),
      { d: 'M150 135 A15 15 0 1 1 149.99 135', stroke: true, fill: true, fillDelay: 5, strokeWidth: 1.5 },
    ],
  } satisfies SVGPathData,

  mortarPestle: {
    viewBox: '0 0 200 200',
    paths: [
      { d: 'M30 100 C30 160 70 185 100 185 C130 185 170 160 170 100', stroke: true, strokeWidth: 2.5 },
      { d: 'M20 100 L180 100', stroke: true, strokeWidth: 2 },
      { d: 'M125 95 C130 70 140 40 145 20', stroke: true, strokeWidth: 3 },
      { d: 'M115 100 C118 95 132 95 135 100', stroke: true, fill: true, fillDelay: 5, strokeWidth: 2 },
      { d: 'M140 25 C145 15 155 15 150 25 C148 30 142 30 140 25', stroke: true, fill: true, fillDelay: 5 },
      { d: 'M65 130 C70 125 80 128 75 135', stroke: true, strokeWidth: 1 },
      { d: 'M100 140 C105 132 115 136 110 142', stroke: true, strokeWidth: 1 },
      { d: 'M85 120 C88 115 95 118 92 123', stroke: true, strokeWidth: 1 },
    ],
  } satisfies SVGPathData,
} as const;
