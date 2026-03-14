/**
 * Pixel art sprite data for the Step 1 avatar.
 *
 * Each sprite is a 12x20 grid. Every character maps to a palette index:
 *   '.' = transparent
 *   'H' = hair       (#c47c20  warm brown)
 *   'h' = hair dark  (#7a4a10)
 *   'F' = face/skin  (#e8c9a0)
 *   'E' = eye        (#2a1a0a)
 *   'S' = shirt      (#ff6b1a  lava orange — primary colour)
 *   's' = shirt dark (#b34700)
 *   'A' = arm/skin   (#e8c9a0)
 *   'P' = pants      (#3a3a5a  dark blue-grey)
 *   'p' = pants dark (#252535)
 *   'B' = boot       (#2a1a0a)
 *   'Z' = zzz text   (#a89880)
 *   'W' = sweat drop (#4da6ff)
 *   'R' = red cheek  (#e03c31)
 *   'G' = gold glow  (#FFD166)
 *   'D' = dust       (#4a3f3a)
 */

export type SpriteChar =
  | '.' | 'H' | 'h' | 'F' | 'E' | 'S' | 's'
  | 'A' | 'P' | 'p' | 'B' | 'Z' | 'W' | 'R' | 'M' | 'G' | 'D';

export const PALETTE: Record<SpriteChar, string | null> = {
  '.': null,
  H: '#c47c20',
  h: '#7a4a10',
  F: '#e8c9a0',
  E: '#2a1a0a',
  M: '#b8996a',  // mouth — slightly darker skin
  S: '#ff6b1a',
  s: '#b34700',
  A: '#e8c9a0',
  P: '#3a3a5a',
  p: '#252535',
  B: '#2a1a0a',
  Z: '#a89880',
  W: '#4da6ff',
  R: '#e03c31',
  G: '#FFD166',
  D: '#4a3f3a',
};

/** Grid is 12 columns x 20 rows. Each string is one row. */
export type Sprite = string[];

/** Active — standing upright, alert pose */
export const SPRITE_ACTIVE: Sprite = [
  '....HHHH....',
  '...HHHHHHH..',
  '...HFFFHFH..',
  '...FEFEFF..',
  '...FFFFFF..',
  '...FFMFF...',
  '..SSSSSSSS..',
  '.ASSSSSSSSA.',
  '.ASSSSSSSSA.',
  '..ssSSSSss..',
  '..PPPPPPPP..',
  '..PPPPPPPP..',
  '..PP....PP..',
  '..PP....PP..',
  '..BB....BB..',
  '..BB....BB..',
  '............',
  '............',
  '............',
  '............',
];

/** Idle — standing relaxed, subtle sway */
export const SPRITE_IDLE: Sprite = [
  '....HHHH....',
  '...HHHHHHH..',
  '...HFFFHFH..',
  '...FEFEFF..',
  '...FFFFFF..',
  '...FFMFF...',
  '..SSSSSSSS..',
  '.ASSSSSSSSA.',
  '.ASSSSSSSSA.',
  '..ssSSSSss..',
  '..PPPPPPPP..',
  '..PPPPPPPP..',
  '..PP....PP..',
  '..PP....PP..',
  '..BB....BB..',
  '..BB....BB..',
  '............',
  '............',
  '............',
  '............',
];

/** Sleeping — lying on side, ZZZ rising */
export const SPRITE_SLEEPING: Sprite = [
  '............',
  '............',
  '..ZZZZ......',
  '...ZZ.......',
  '....Z.......',
  '............',
  '.HHHHHHHHHH.',
  '.HFFFFFFFF..',
  '.HFEF..EF..',
  '.HFFFFF.....',
  '....SSSSSSSS',
  '....SSSSSSSS',
  '....ssSSSSss',
  '....PPPPPPPP',
  '....PPPPBBBB',
  '............',
  '............',
  '............',
  '............',
  '............',
];

/** Slacking — slouched, sweat drop, sad face */
export const SPRITE_SLACKING: Sprite = [
  '....HHHH....',
  '...HHHHHH...',
  '...HFFFHF...',
  '...FEEEFF...',
  '...FFFFFF...',
  '...FFWFF....',
  '...ssSSss...',
  '..AssSSssA..',
  '..AssSSssA..',
  '...ssSSSs...',
  '...PPPPPP...',
  '...PPPPPP...',
  '...PP..PP...',
  '..PPP..PPP..',
  '..BB....BB..',
  '............',
  '............',
  '............',
  '............',
  '............',
];

/** Celebrating — arms raised, jumping */
export const SPRITE_CELEBRATING: Sprite = [
  '....HHHH....',
  '...HHHHHHH..',
  '...HFFFHFH..',
  '...FEFEFF..',
  '...FFFFFF..',
  '...FRMRF...',
  'A.SSSSSSSS.A',
  'AASSSSSSSSAA',
  '..SSSSSSSS..',
  '..ssSSSSss..',
  '..PPPPPPPP..',
  '..PPPPPPPP..',
  '..PP....PP..',
  '............',
  '..BB....BB..',
  '............',
  '............',
  '............',
  '............',
  '............',
];

/** Degraded — slouched, messy, dust particles */
export const SPRITE_DEGRADED: Sprite = [
  '...D....D...',
  '....HHHH....',
  '...HHHHHH...',
  '...HFFFHF...',
  '...FEEEFF...',
  '...FFFFFF...',
  '...FFWFF....',
  '...ssSSss...',
  '..AssSSssA..',
  '..AssSSssA..',
  '...ssSSSs...',
  '...PPPPPP...',
  '...PPPPPP...',
  '..PPP..PPP..',
  '..BB....BB..',
  '.D........D.',
  '............',
  '............',
  '............',
  '............',
];

/** Peak Form — standing tall, golden glow accents */
export const SPRITE_PEAK_FORM: Sprite = [
  '...G....G...',
  '....HHHH....',
  '...HHHHHHH..',
  '...HFFFHFH..',
  '...FEFEFF..',
  '...FFFFFF..',
  '...FRMRF...',
  '..SSSSSSSS..',
  '.ASSSSSSSSA.',
  '.ASSSSSSSSA.',
  '..ssSSSSss..',
  '..PPPPPPPP..',
  '..PPPPPPPP..',
  '..PP....PP..',
  '..BB....BB..',
  '..BB....BB..',
  '.G........G.',
  '............',
  '............',
  '............',
];

export const SPRITES = {
  active:      SPRITE_ACTIVE,
  idle:        SPRITE_IDLE,
  sleeping:    SPRITE_SLEEPING,
  slacking:    SPRITE_SLACKING,
  celebrating: SPRITE_CELEBRATING,
  degraded:    SPRITE_DEGRADED,
  peak_form:   SPRITE_PEAK_FORM,
} as const;

export type SpriteAvatarState = keyof typeof SPRITES;
