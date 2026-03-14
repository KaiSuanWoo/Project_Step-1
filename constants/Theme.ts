import { TextStyle, ViewStyle } from 'react-native';

// ═══════════════════════════════════════════════════════════════════════════════
// DUAL DESIGN SYSTEM
// - "modern" tokens: used for all app chrome (screens, cards, buttons, inputs)
// - "pixel" tokens: used ONLY inside environment container & avatar components
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Modern Palette (App Chrome) ────────────────────────────────────────────
export const modern = {
  // Backgrounds
  background:       '#0D0D12',   // near-black with blue undertone
  surface:          '#1A1A24',   // dark panels
  surfaceElevated:  '#24243A',   // cards, modals
  // Borders
  borderSubtle:     '#2E2E45',   // dividers
  borderActive:     '#4A4A6A',   // focused elements
  // Accents
  accent:           '#FFD166',   // warm gold — coins, streaks, celebrations
  green:            '#06D6A0',   // emerald — completions, health
  danger:           '#EF476F',   // coral red — missed, penalties
  info:             '#118AB2',   // teal blue — informational
  xp:               '#9B5DE5',   // purple — XP bar, levelling
  // Text
  textPrimary:      '#F0F0F5',   // near-white
  textSecondary:    '#8888A0',   // muted grey-lavender
  textDisabled:     '#4A4A5A',   // dim
  // Environment tints
  studyTintStart:   '#1a1a2e',
  studyTintEnd:     '#16213e',
  officeTintStart:  '#1a1a1a',
  officeTintEnd:    '#2d2d3f',
  gymTintStart:     '#1a1a20',
  gymTintEnd:       '#1f2a1f',
} as const;

// ─── Modern Radius ──────────────────────────────────────────────────────────
export const modernRadius = {
  sm:   8,
  md:   12,
  lg:   14,
  xl:   16,
  xxl:  24,
  full: 9999,
} as const;

// ─── Pixel Palette (Environment Container & Avatar ONLY) ────────────────────
export const colors = {
  background:     '#1a1216',
  surface:        '#2a2a2a',
  surfaceAlt:     '#3a3a3a',
  surfaceDeep:    '#1e1a1c',
  primary:        '#ff6b1a',
  primaryMuted:   '#ff6b1a33',
  success:        '#6ba537',
  successMuted:   '#6ba53733',
  warning:        '#e03c31',
  warningMuted:   '#e03c3133',
  gold:           '#d4af37',
  text:           '#e8d8c0',
  textSecondary:  '#a89880',
  textMuted:      '#6a6060',
  textDisabled:   '#4a3f3a',
  borderLight:    '#6a6a6a',
  borderDark:     '#111111',
  tabBarBg:       '#1a1a2e',
  dotDone:        '#6ba537',
  dotMissed:      '#4a3f3a',
} as const;

// ─── Pixel Radius (Environment & Avatar only) ──────────────────────────────
export const radius = {
  none:   0,
  pixel:  2,
  small:  4,
} as const;

// ─── Fonts ─────────────────────────────────────────────────────────────────
export const fonts = {
  pixelHeading: 'PressStart2P_400Regular',  // pixel font for gamified headings
  display:      'VT323_400Regular',          // pixel font for in-environment text
  body:         'SpaceMono',                 // monospace for body/labels
} as const;

// ─── Font Sizes ────────────────────────────────────────────────────────────
export const fontSizes = {
  micro: 10,
  xs:    11,
  sm:    13,
  base:  15,
  md:    17,
  lg:    20,
  xl:    24,
  xxl:   28,
  stat:  32,
  hero:  40,
} as const;

// ─── Spacing ───────────────────────────────────────────────────────────────
export const spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 28,
  xxxl: 32,
  section: 48,
} as const;

// ─── Animation Tokens ──────────────────────────────────────────────────────
export const animation = {
  micro:   100,
  fast:    200,
  normal:  300,
  slow:    500,
  ambient: 2000,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// MODERN STYLE FRAGMENTS (App Chrome)
// ═══════════════════════════════════════════════════════════════════════════════

/** Modern dark card with subtle border */
export const modernCard: ViewStyle = {
  backgroundColor:  modern.surface,
  borderRadius:     modernRadius.lg,
  borderWidth:      1,
  borderColor:      modern.borderSubtle,
};

/** Modern elevated card (modals, sheets) */
export const modernCardElevated: ViewStyle = {
  backgroundColor:  modern.surfaceElevated,
  borderRadius:     modernRadius.lg,
  borderWidth:      1,
  borderColor:      modern.borderSubtle,
  shadowColor:      '#000000',
  shadowOffset:     { width: 0, height: 4 },
  shadowOpacity:    0.3,
  shadowRadius:     12,
  elevation:        8,
};

/** Modern primary button (gold) */
export const modernButton: ViewStyle = {
  backgroundColor:  modern.accent,
  borderRadius:     modernRadius.md,
  paddingVertical:  14,
  paddingHorizontal: 24,
  alignItems:       'center',
  justifyContent:   'center',
  shadowColor:      modern.accent,
  shadowOffset:     { width: 0, height: 4 },
  shadowOpacity:    0.3,
  shadowRadius:     12,
  elevation:        4,
};

/** Modern secondary button (outlined) */
export const modernButtonSecondary: ViewStyle = {
  backgroundColor:  'transparent',
  borderRadius:     modernRadius.md,
  borderWidth:      1.5,
  borderColor:      modern.borderActive,
  paddingVertical:  14,
  paddingHorizontal: 24,
  alignItems:       'center',
  justifyContent:   'center',
};

/** Modern danger button */
export const modernButtonDanger: ViewStyle = {
  backgroundColor:  modern.danger,
  borderRadius:     modernRadius.md,
  paddingVertical:  14,
  paddingHorizontal: 24,
  alignItems:       'center',
  justifyContent:   'center',
};

/** Modern icon button (circular) */
export const modernIconButton: ViewStyle = {
  width:            44,
  height:           44,
  backgroundColor:  modern.surface,
  borderRadius:     modernRadius.full,
  borderWidth:      1,
  borderColor:      modern.borderSubtle,
  alignItems:       'center',
  justifyContent:   'center',
};

/** Modern text input */
export const modernInput: ViewStyle = {
  backgroundColor:  modern.surface,
  borderRadius:     modernRadius.md,
  borderWidth:      1,
  borderColor:      modern.borderSubtle,
  paddingVertical:  12,
  paddingHorizontal: 16,
};

/** Modern bottom sheet */
export const modernSheet: ViewStyle = {
  backgroundColor:  modern.surface,
  borderTopLeftRadius:  modernRadius.xxl,
  borderTopRightRadius: modernRadius.xxl,
};

/** Modern tab bar */
export const modernTabBar: ViewStyle = {
  backgroundColor:  modern.background,
  borderTopWidth:   1,
  borderTopColor:   modern.surface,
};

// ─── Modern Text Styles ────────────────────────────────────────────────────

/** Pixel heading text (Press Start 2P — gamified headings) */
export const pixelHeadingText: TextStyle = {
  fontFamily: fonts.pixelHeading,
  color:      modern.textPrimary,
  fontSize:   fontSizes.md,
};

/** Modern heading text */
export const modernHeadingText: TextStyle = {
  fontFamily: fonts.body,
  color:      modern.textPrimary,
  fontSize:   fontSizes.xl,
  fontWeight: '700',
};

/** Modern body text */
export const modernBodyText: TextStyle = {
  fontFamily: fonts.body,
  color:      modern.textPrimary,
  fontSize:   fontSizes.base,
};

/** Modern secondary text */
export const modernSecondaryText: TextStyle = {
  fontFamily: fonts.body,
  color:      modern.textSecondary,
  fontSize:   fontSizes.sm,
};

/** Modern section label */
export const modernSectionLabel: TextStyle = {
  fontFamily:    fonts.body,
  color:         modern.textSecondary,
  fontSize:      fontSizes.xs,
  fontWeight:    '700',
  letterSpacing: 1.5,
  textTransform: 'uppercase',
};

// ═══════════════════════════════════════════════════════════════════════════════
// PIXEL STYLE FRAGMENTS (Environment Container & Avatar ONLY)
// ═══════════════════════════════════════════════════════════════════════════════

/** Stone-grey panel with 3D bevel (light top/left, dark bottom/right) */
export const terrariaPanel: ViewStyle = {
  backgroundColor:    colors.surface,
  borderRadius:       radius.pixel,
  borderTopWidth:     3,
  borderLeftWidth:    3,
  borderBottomWidth:  3,
  borderRightWidth:   3,
  borderTopColor:     colors.borderLight,
  borderLeftColor:    colors.borderLight,
  borderBottomColor:  colors.borderDark,
  borderRightColor:   colors.borderDark,
};

/** Lava-orange primary button with bevel */
export const terrariaButton: ViewStyle = {
  backgroundColor:    colors.primary,
  borderRadius:       radius.pixel,
  borderTopWidth:     3,
  borderLeftWidth:    3,
  borderBottomWidth:  3,
  borderRightWidth:   3,
  borderTopColor:     '#ff8c4a',
  borderLeftColor:    '#ff8c4a',
  borderBottomColor:  '#b34700',
  borderRightColor:   '#b34700',
  alignItems:         'center',
  justifyContent:     'center',
};

/** Dark ghost button with bevel */
export const terrariaGhostButton: ViewStyle = {
  backgroundColor:    colors.surfaceAlt,
  borderRadius:       radius.pixel,
  borderTopWidth:     3,
  borderLeftWidth:    3,
  borderBottomWidth:  3,
  borderRightWidth:   3,
  borderTopColor:     colors.borderLight,
  borderLeftColor:    colors.borderLight,
  borderBottomColor:  colors.borderDark,
  borderRightColor:   colors.borderDark,
  alignItems:         'center',
  justifyContent:     'center',
};

/** Inventory slot — 72x72, square, inset bevel */
export const terrariaSlot: ViewStyle = {
  width:             72,
  height:            72,
  backgroundColor:   colors.surfaceDeep,
  borderRadius:      radius.none,
  borderTopWidth:    2,
  borderLeftWidth:   2,
  borderBottomWidth: 2,
  borderRightWidth:  2,
  borderTopColor:    colors.borderDark,
  borderLeftColor:   colors.borderDark,
  borderBottomColor: colors.borderLight,
  borderRightColor:  colors.borderLight,
  alignItems:        'center',
  justifyContent:    'center',
};

/** Text input — deep inset look (inverted bevel) */
export const terrariaInput: ViewStyle = {
  backgroundColor:    colors.surfaceDeep,
  borderRadius:       radius.pixel,
  borderTopWidth:     2,
  borderLeftWidth:    2,
  borderBottomWidth:  2,
  borderRightWidth:   2,
  borderTopColor:     colors.borderDark,
  borderLeftColor:    colors.borderDark,
  borderBottomColor:  colors.borderLight,
  borderRightColor:   colors.borderLight,
};

/** Selected/active overlay — all four sides turn primary orange */
export const terrariaActive: ViewStyle = {
  borderTopColor:    colors.primary,
  borderLeftColor:   colors.primary,
  borderBottomColor: colors.primary,
  borderRightColor:  colors.primary,
};

/** Headline text style (VT323 display font) */
export const terrariaTitleText: TextStyle = {
  fontFamily: fonts.display,
  color:      colors.text,
  fontSize:   fontSizes.xl,
};

/** Section label (body font, uppercase, muted) */
export const terrariaSectionLabel: TextStyle = {
  fontFamily:    fonts.body,
  color:         colors.textMuted,
  fontSize:      fontSizes.xs,
  fontWeight:    '700',
  letterSpacing: 1.5,
  textTransform: 'uppercase',
};
