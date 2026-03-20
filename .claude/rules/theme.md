# Theme Rule — Single Design System

The COMPOUND app uses a **single cohesive design system** defined in `Design/Theme.swift`:
Dark UI chrome for all screens + pixel avatar stage rendered via SpriteKit.

## Colour Tokens

All colours must come from `Theme.swift`. No hardcoded hex anywhere else.

| Token | Value | Use |
|---|---|---|
| `background` | `#0D0D12` | Screen backgrounds |
| `surface` | `#1A1A24` | Cards, panels, drawers |
| `surfaceElevated` | `#24243A` | Modals, sheets |
| `borderSubtle` | `#2E2E45` | Dividers |
| `borderActive` | `#4A4A6A` | Focused elements |
| `accent` | `#FFD166` | Gold — coins, streaks, primary buttons |
| `green` | `#06D6A0` | Completions, success |
| `danger` | `#EF476F` | Missed habits, penalties |
| `info` | `#118AB2` | Informational, links |
| `xpPurple` | `#9B5DE5` | XP bar, levelling |
| `textPrimary` | `#F0F0F5` | Primary text |
| `textSecondary` | `#8888A0` | Muted text |
| `textDisabled` | `#4A4A5A` | Dim text |

## Typography

| Usage | Font | Details |
|---|---|---|
| Gamified headings | Press Start 2P | Tab titles, streak counts, coin balance, level, celebrations. Sizes: 20/16/12 |
| Body / UI | SF Pro (system) | Habit names, descriptions, buttons, labels. Sizes: 16/14/12. Weights: .regular/.medium/.semibold |
| Numerical data | SF Mono | Streak numbers, coin counts, timers, percentages. Use `.monospacedDigit()` |

## Component Tokens

```swift
// Buttons
// Primary: bg accent, text #0D0D12, cornerRadius 12, padding 14×24
// Secondary: bg transparent, border 1.5px borderActive, text textPrimary
// Danger: bg danger, text white
// Icon (circular): 44×44, bg surface, border 1px borderSubtle, cornerRadius 22

// Cards
// bg surface, border 1px borderSubtle, cornerRadius 14, padding 16
// Completed state: green left-border 3px, green tint bg, strikethrough

// Bottom Sheet
// bg surface, topCornerRadius 24, handle 40×4px borderActive
// backdrop #000000 at 60%, spring-damped animation

// Toast / Snackbar
// position top, bg surfaceElevated, border 1px borderSubtle, cornerRadius 12
// types: reward (gold accent), streak (fire), warning (coral), info (teal)
```

## Iconography

- **Pixel icons** (16×16 rendered at 2×): coins, hearts, streaks, fire — gamified elements
- **SF Symbols**: gear, chevron, bell, checkmark, plus — standard UI navigation

## Animation Tokens

```swift
// Durations
micro:   0.1s  // button press, checkbox toggle
fast:    0.2s  // card state change, icon swap
normal:  0.3s  // sheet open, page transition
slow:    0.5s  // celebration, environment state change
ambient: 2.0s  // idle animations, particle loops (infinite)

// Curves
snappy:  .easeOut with spring(response: 0.3, dampingFraction: 0.7)
bounce:  spring(response: 0.4, dampingFraction: 0.5)
spring:  spring(response: 0.5, dampingFraction: 0.7, blendDuration: 0.3)
```

## Transition Patterns

```
Tab Switch:        Cross-fade (200ms) — no slide
Push Screen:       Slide from right (300ms, snappy easing)
Bottom Sheet:      Spring-damped slide from bottom
Full-Screen Modal: Slide from bottom (300ms) with backdrop fade
Celebration:       Overlay on current screen (no navigation change)
```

## Spacing Scale

```
4px   — micro (icon padding, badge internal)
8px   — tight (between related elements)
12px  — compact (card internal, small gaps)
16px  — base (standard spacing, card padding)
24px  — comfortable (between sections)
32px  — spacious (major section breaks)
48px  — generous (page section gaps)
```

## Rules

1. **No hardcoded hex** outside `Design/Theme.swift`.
2. **cornerRadius:** 12 buttons, 14 cards, 24 bottom sheets, 22 circular icon buttons.
3. **Shadows** allowed on elevated cards and primary buttons only.
4. **No bevel borders** — flat borders with `borderSubtle` only.
5. **Pixel art rendering:** `.nearest` filtering mode on ALL `SKTexture` in SpriteKit. Never smooth/interpolate pixel art.
6. **Tab bar:** bg `background` with subtle top border `borderSubtle`. Active tab `accent` gold, inactive `textSecondary`.
