// Cute SVG plant "creatures" for PlantNarrator composition
// Each plant gets a distinct body shape, eyes, and unique detail
// All use viewBox 0 0 200 300, portrait orientation

export interface PlantCharacter {
  body: string;       // Main body path (filled)
  eyes: string[];     // Two eye circle paths
  detail: string[];   // Unique per-plant detail paths (roots, crown, knobs, etc.)
  name: string;
}

export const PLANT_CHARACTERS: Record<string, PlantCharacter> = {
  // Elongated root body, warm feel, root-hair "hair" on top
  ashwagandha: {
    name: 'Ashwagandha',
    body: 'M100 80 C130 85 145 120 140 180 C138 220 125 250 100 260 C75 250 62 220 60 180 C55 120 70 85 100 80Z',
    eyes: [
      'M82 140 A9 9 0 1 1 82.01 140',   // left eye (9px radius)
      'M118 140 A9 9 0 1 1 118.01 140',  // right eye (9px radius)
    ],
    detail: [
      // Root "hair" tendrils on top
      'M100 80 C95 50 80 35 75 20',
      'M100 80 C105 45 115 30 125 18',
      'M100 80 C98 55 88 40 90 22',
      'M100 80 C102 52 112 38 110 20',
      // Small leaf "arms"
      'M60 160 C40 155 30 140 35 130 C40 135 50 145 60 155',
      'M140 160 C160 155 170 140 165 130 C160 135 150 145 140 155',
    ],
  },

  // Round berry body, golden-green, leaf crown
  amla: {
    name: 'Amla',
    body: 'M100 100 C140 100 160 130 160 170 C160 210 140 240 100 240 C60 240 40 210 40 170 C40 130 60 100 100 100Z',
    eyes: [
      'M82 160 A9 9 0 1 1 82.01 160',
      'M118 160 A9 9 0 1 1 118.01 160',
    ],
    detail: [
      // Leaf crown on top (3 leaves)
      'M100 100 C95 75 80 60 70 50 C80 55 90 70 100 90',
      'M100 100 C100 70 100 50 100 35 C100 50 100 70 100 90',
      'M100 100 C105 75 120 60 130 50 C120 55 110 70 100 90',
      // Small arms
      'M40 170 C25 165 15 150 20 140 C25 150 32 160 40 165',
      'M160 170 C175 165 185 150 180 140 C175 150 168 160 160 165',
      // Berry shine highlight
      'M75 135 C78 125 85 120 90 122',
    ],
  },

  // Knobby rhizome body, golden-orange, bumpy texture
  curcumin: {
    name: 'Curcumin',
    body: 'M100 90 C135 88 155 110 158 150 C160 180 150 215 130 240 C115 255 85 255 70 240 C50 215 40 180 42 150 C45 110 65 88 100 90Z',
    eyes: [
      'M82 150 A9 9 0 1 1 82.01 150',
      'M118 150 A9 9 0 1 1 118.01 150',
    ],
    detail: [
      // Knobby bumps along body
      'M155 130 C168 128 172 140 162 145',
      'M42 160 C30 158 28 170 38 172',
      'M150 200 C162 198 165 210 155 215',
      'M50 195 C38 193 35 205 45 208',
      // Small leaf shoots from top
      'M95 90 C88 65 75 50 70 40 C78 48 88 62 95 85',
      'M105 90 C112 65 125 50 130 40 C122 48 112 62 105 85',
      // Leaf arms
      'M42 155 C28 148 18 135 25 125 C28 135 35 148 42 152',
      'M158 155 C172 148 182 135 175 125 C172 135 165 148 158 152',
    ],
  },

  // Tall leaf-shaped body, bright green, compound leaf "wings"
  moringa: {
    name: 'Moringa',
    body: 'M100 70 C125 75 140 105 142 150 C143 190 130 230 100 250 C70 230 57 190 58 150 C60 105 75 75 100 70Z',
    eyes: [
      'M85 145 A9 9 0 1 1 85.01 145',
      'M115 145 A9 9 0 1 1 115.01 145',
    ],
    detail: [
      // Compound leaf "wings" — left side (3 leaflet pairs)
      'M58 130 C38 120 22 110 18 95 C28 102 42 112 55 125',
      'M58 160 C35 155 18 148 12 135 C22 140 38 150 55 158',
      'M58 190 C40 188 25 182 20 170 C28 178 42 185 55 188',
      // Right side
      'M142 130 C162 120 178 110 182 95 C172 102 158 112 145 125',
      'M142 160 C165 155 182 148 188 135 C178 140 162 150 145 158',
      'M142 190 C160 188 175 182 180 170 C172 178 158 185 145 188',
      // Small top sprout
      'M100 70 C98 48 95 32 92 18',
      'M100 70 C102 48 105 32 108 18',
    ],
  },

  // Bundled root body, pale pink, thin root "hair" tendrils
  shatavari: {
    name: 'Shatavari',
    body: 'M100 85 C128 88 148 115 150 155 C152 195 138 235 100 248 C62 235 48 195 50 155 C52 115 72 88 100 85Z',
    eyes: [
      'M84 148 A9 9 0 1 1 84.01 148',
      'M116 148 A9 9 0 1 1 116.01 148',
    ],
    detail: [
      // Root tendrils flowing down
      'M80 240 C75 260 70 275 62 290',
      'M90 245 C88 265 82 280 78 295',
      'M100 248 C100 270 98 285 95 298',
      'M110 245 C112 265 118 280 122 295',
      'M120 240 C125 260 130 275 138 290',
      // Delicate leaf arms
      'M50 150 C35 142 25 128 30 118 C34 128 42 140 50 148',
      'M150 150 C165 142 175 128 170 118 C166 128 158 140 150 148',
      // Tiny flower buds on top
      'M90 85 C85 68 80 55 78 45 A5 5 0 1 1 88 45 C86 55 88 68 90 82',
      'M110 85 C115 68 120 55 122 45 A5 5 0 1 1 112 45 C114 55 112 68 110 82',
    ],
  },
};

/** Resolve a plant character by product key. Falls back to moringa. */
export function resolvePlantCharacter(plant: string): PlantCharacter {
  return PLANT_CHARACTERS[plant] || PLANT_CHARACTERS.moringa;
}
