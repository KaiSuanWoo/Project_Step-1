# Sprite Animation Rule

All sprite animations in the COMPOUND app use SpriteKit with Xcode-managed texture atlases.

## Atlas Format

1. **Xcode `.atlas` directories** — one directory per animation containing individual PNG frames
2. **Frame naming:** `[character]_[animation]_[frame].png` (e.g., `default_coffee_04.png`)
3. **Xcode auto-compiles** atlas directories into optimised texture atlases at build time
4. **One atlas per animation:** `idle.atlas/`, `coffee.atlas/`, `studying.atlas/`, `lifting.atlas/`, `phone.atlas/`, `celebrating.atlas/`, `sleeping.atlas/`, `degraded.atlas/`, `walking.atlas/`

## Frame Rate

- **Standard:** 12fps (83ms per frame) — pixel art standard
- **Variable timing** allowed for emphasis (e.g., celebration jump peak = longer hold)
- **Config lives in** `Avatar/AvatarAnimator.swift` — never hardcode frame counts or durations in views

## Animation Specs

| Animation | Frames | Duration | Loop | Key Requirements |
|-----------|--------|----------|------|-----------------|
| Idle / Breathing | 8 | 0.67s | Loop | 1–2px vertical bob, periodic blink every 3–4s, subtle arm sway |
| Drinking Coffee | 16 | 1.33s | Loop | Raise cup, tilt head, sip, lower cup, satisfied smile. Steam particles. |
| Studying / Typing | 12 | 1.0s | Loop | Hands on keyboard, slight lean, periodic head nod, screen glow on face |
| Lifting Weights | 14 | 1.17s | Loop | Bicep curl with proper form, weight rises/lowers, muscle shift |
| Scrolling Phone | 10 | 0.83s | Loop | Slouched, phone at chest, thumb scrolls, half-lidded eyes, blue glow |
| Celebrating | 12 | 1.0s | Once then idle | Crouch, jump 4–6px, arms raised, land with squash, bounce settle |
| Sleeping | 8 | 1.33s (slow) | Loop | Eyes closed, gentle 0.5–1px breathing bob, head tilted, Zzz particles |
| Degraded / Sad | 6 | 1.0s | Loop | Slouched 2–3px lower, desaturated palette, sad mouth, minimal breathing |
| Walking | 8/dir | 0.67s | Loop | 4 directions. Transitional only, not primary state. |
| Blinking | 3 | 0.25s | Trigger every 3–4s | Eyes: open, half-closed, closed, open. Overlay on looping animations. |

## Rendering

```swift
// Loading atlas textures
func loadAnimation(_ name: String) -> [SKTexture] {
    let atlas = SKTextureAtlas(named: name)
    let frames = atlas.textureNames.sorted().map { atlas.textureNamed($0) }
    frames.forEach { $0.filteringMode = .nearest }  // CRITICAL: pixelated rendering
    return frames
}

// Playing animation at 12fps
func playAnimation(_ frames: [SKTexture], loop: Bool = true) {
    let action = SKAction.animate(with: frames, timePerFrame: 1.0 / 12.0)
    avatarNode.run(loop ? .repeatForever(action) : action, withKey: "anim")
}
```

- Embedded in SwiftUI via `SpriteView(scene:options:[.allowsTransparency])`
- Avatar scene aspect ratio: 4:5 (`aspectRatio(4/5, contentMode: .fit)`)

## Particle Files

`.sks` particle files in `Avatar/Particles/`:
- `stars.sks` — Active/idle sparkles
- `confetti.sks` — Celebration burst (one-shot)
- `steam.sks` — Coffee steam
- `dust.sks` — Degraded state dust motes
- `zzz.sks` — Sleep state floating Zzz
- `golden_halo.sks` — Peak form golden particles

## File Structure

```
Compound/Avatar/
  Sprites/
    idle.atlas/
    coffee.atlas/
    studying.atlas/
    lifting.atlas/
    phone.atlas/
    celebrating.atlas/
    sleeping.atlas/
    degraded.atlas/
    walking.atlas/
  Particles/
    stars.sks
    confetti.sks
    steam.sks
    dust.sks
    zzz.sks
    golden_halo.sks
  AvatarAnimator.swift
  AvatarSpriteNode.swift
  BackgroundNode.swift
  ParticleManager.swift
```

## Do Not

- Do not use `Timer` or `DispatchQueue` for frame cycling — use `SKAction`
- Do not use UIKit `UIImageView` for animation — use SpriteKit `SKSpriteNode`
- Do not hardcode frame counts or durations in views — use `AvatarAnimator` config
- Do not load individual frames at runtime — use `.atlas` directories
- Do not use `.linear` filtering mode on pixel art textures — always `.nearest`
