# Pixel Art Standards Rule

Standards for all pixel art assets in COMPOUND. Applies to avatar sprites, particle textures, pixel icons, and any visual assets imported from external artists.

## Sprite Dimensions

| Asset Type | Size | Notes |
|------------|------|-------|
| Avatar sprites | 64x64 | Sweet spot for emotion + atlas efficiency |
| Display scale | 4x standard, 8x Retina | 256pt display, fills ~40% screen width |
| Pixel icons | 16x16 | Rendered at 2x for gamified elements (coins, hearts, fire) |
| Colour depth | 32-bit RGBA | Full alpha for anti-aliased pixel art edges |

## Colour & Palette

1. **24–32 colours** per character — enough for detail, few enough for cohesion
2. **4-tone minimum for skin and hair** — highlight, base, shadow, deep shadow
3. **3-tone minimum for other materials** — shadow, base, highlight (clothing, props, accessories)
4. **Hue-shifted shading** — shadows shift cooler (toward blue/purple), highlights shift warmer (toward yellow/orange). Never just darken/lighten.
5. **Consistent light source** — top-left at ~45deg. Highlight on top-left edges, shadow on bottom-right.

## Character Quality Standards

### Expression (must be readable at 4x display scale)
- **Eyes:** white + iris colour + pupil + 1px shine dot
- **Mouth:** 4+ variants (neutral, smile, open, sad)
- **Blush spots** on cheeks for happy states
- **Blinking:** 3-frame overlay (open, half, closed, open)

### Clothing Detail
- Shirts show collar, seam lines, pocket/logo
- Pants have leg separation and shoe transition
- Fabric wrinkles on bent limbs
- **Niche outfit variants** (same character base):
  - Study: casual hoodie + headphones
  - Fitness: tank top + shorts + sneakers
  - Work: button shirt + slacks

### Consistency
- ALL frames must maintain identical proportions, colour palette, and design language
- Head-to-body ratio, limb lengths, and facial feature positions MUST NOT drift between frames
- Outline colour: darkest tone of that material, NOT pure black

## Anti-Aliasing

- Use intermediate tones on curved edges (pixel art AA technique)
- Hair outline uses darkest hair tone, NOT black
- Skin-to-hair transitions use mid-tone
- No sub-pixel smoothing — every pixel is a deliberate colour choice

## Asset Pipeline

1. **Commissioned:** Sprites are created by a pixel artist using Aseprite
2. **Export:** Individual PNG frames named `[character]_[animation]_[frame].png`
3. **Import:** Frames placed into Xcode `.atlas` directories (one per animation)
4. **Compilation:** Xcode auto-compiles `.atlas` directories into optimised texture atlases
5. **Quality gate:** Every animation must pass review for consistent shading, palette adherence, smooth motion, correct proportions, clean edges

## Quality Checks

Before any sprite asset is used in the app:
1. Verify consistent proportions across all frames of the animation
2. Confirm palette stays within 24–32 colour limit
3. Check shading direction consistency (top-left light source)
4. Verify expression is readable at 4x display scale
5. Check animation smoothness — no frame jumps or proportion drift
6. Confirm `.nearest` filtering mode is set on all SKTexture usage

## Do Not

- Do not use anti-aliasing/smoothing filters on pixel art
- Do not scale sprites with bilinear filtering (always `.nearest`)
- Do not exceed 32 colours per character
- Do not use pure black (#000000) for outlines — use the darkest tone of each material
- Do not mix isometric and front-facing perspectives within the same character
