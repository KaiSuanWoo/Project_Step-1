# COMPOUND — Complete App Architecture Reference

> **For Claude Code use.** This is the single source of truth for the entire COMPOUND app.
> Platform: Native Swift (iOS-first) · Engine: SwiftUI + SpriteKit · Backend: Supabase

**Tagline:** *Every day compounds. Every skip costs.*

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Design System](#2-design-system)
3. [App Architecture (Swift)](#3-app-architecture-swift)
4. [Character Portrait System](#4-character-portrait-system)
5. [Sprite & Animation Specification](#5-sprite--animation-specification)
6. [Background System](#6-background-system)
7. [Avatar State Machine](#7-avatar-state-machine)
8. [Navigation & Screen Architecture](#8-navigation--screen-architecture)
9. [Onboarding Flow](#9-onboarding-flow)
10. [Realm Tab (Home Screen)](#10-realm-tab-home-screen)
11. [Habits Tab](#11-habits-tab)
12. [Progress Tab](#12-progress-tab)
13. [Menu Tab (Profile, Shop, Settings)](#13-menu-tab)
14. [Token Economy & Gamification](#14-token-economy--gamification)
15. [Reflective Check-In System](#15-reflective-check-in-system)
16. [Notification System](#16-notification-system)
17. [Widget System](#17-widget-system)
18. [Data Models (SwiftData)](#18-data-models-swiftdata)
19. [Backend (Supabase)](#19-backend-supabase)
20. [Goal Journey Feature (P2 — Future)](#20-goal-journey-feature-p2)
21. [Psychology Principles (Design Reference)](#21-psychology-principles)
22. [Component Inventory](#22-component-inventory)
23. [Development Roadmap](#23-development-roadmap)

---

## 1. Product Overview

COMPOUND is a gamified habit-tracking iOS app built around a **Character Portrait** — a large, expressive pixel art avatar that dominates the home screen and reacts in real-time to the user's habit completion behaviour. The avatar's mood, animation, background, and particle effects all shift dynamically based on what the user does (or doesn't do).

### Core Concept

- The user creates habits tied to a **niche** (Study, Fitness, or Work)
- A pixel art avatar lives on the home screen and reflects the user's state
- Completing habits triggers immediate visual feedback (animations, particles, background shifts)
- Missing habits causes gradual environmental degradation (dust, dim lighting, sad avatar)
- A coin economy lets users buy cosmetic upgrades (outfits, accessories)
- Psychology-backed systems (growth mindset framing, self-compassion, loss aversion) drive retention

### What This App Is NOT

- Not a to-do list with gamification bolted on
- Not a social media app (social features are P3+)
- Not cross-platform at launch (iOS-first, Android in v2)

### Target Users

- Students (16–25): Study niche
- Working professionals (22–35): Work niche
- Fitness-focused individuals (18–35): Fitness niche

---

## 2. Design System

### 2.1 Visual Language

```
AESTHETIC: "Cosy Pixel Companion" — A warm, living pixel character framed by sleek dark UI
INSPIRATION: Tamagotchi (emotional attachment), Duolingo (gamification UX),
             Eastward/Coffee Talk (pixel art quality), Celeste (character portraits)
```

### 2.2 Colour Palette

```
-- DARK THEME (Primary — app is dark-mode only at launch) --
Background:         #0D0D12  (near-black with blue undertone)
Surface:            #1A1A24  (dark panels, habit cards, drawers)
Surface Elevated:   #24243A  (modals, sheets)
Border Subtle:      #2E2E45  (dividers)
Border Active:      #4A4A6A  (focused elements)

-- ACCENT COLOURS --
Primary Accent:     #FFD166  (warm gold — coins, streaks, celebrations)
Secondary Accent:   #06D6A0  (emerald green — completions, health, success)
Danger/Penalty:     #EF476F  (coral red — missed habits, degradation warnings)
Info/Neutral:       #118AB2  (teal blue — informational, links)
XP/Progress:        #9B5DE5  (purple — XP bar, levelling)

-- TEXT --
Text Primary:       #F0F0F5  (near-white)
Text Secondary:     #8888A0  (muted grey-lavender)
Text Disabled:      #4A4A5A  (dim)

-- AVATAR STAGE GRADIENTS (time-of-day, see §6.2) --
Study Tint:         #1a1a2e → #16213e  (deep navy)
Work Tint:          #1a1a1a → #2d2d3f  (charcoal)
Fitness Tint:       #1a1a20 → #1f2a1f  (dark green-black)
```

### 2.3 Typography

```
-- HEADINGS / GAMIFIED DISPLAY --
Font: "Press Start 2P" (Google Fonts pixel font)
Usage: Tab titles, streak counters, coin balance, level display, celebration text
Sizes: 20px (large display), 16px (section heads), 12px (labels)
SwiftUI: .custom("PressStart2P-Regular", size:)

-- BODY / UI --
Font: System font (SF Pro) — native iOS feel for non-gamified elements
Usage: Habit names, descriptions, button labels, body text
Sizes: 16px (body), 14px (secondary), 12px (caption)
Weights: .regular, .medium, .semibold

-- NUMERICAL / DATA --
Font: "JetBrains Mono" or SF Mono — monospace for data
Usage: Streak numbers, coin counts, timers, percentages
SwiftUI: .monospacedDigit()
```

### 2.4 Iconography

```
Dual icon system:
- Pixel icons (16×16, rendered at 2×) for gamified elements (coins, hearts, streaks)
- SF Symbols for standard UI navigation (gear, chevron, bell, checkmark)
```

### 2.5 Spacing Scale

```
4px   — micro (icon padding, badge internal)
8px   — tight (between related elements)
12px  — compact (card internal padding, small gaps)
16px  — base (standard spacing, card padding)
24px  — comfortable (between sections)
32px  — spacious (major section breaks)
48px  — generous (page section gaps)
```

### 2.6 Component Tokens

```swift
// Buttons
struct CompoundButton {
    // Primary: bg #FFD166, text #0D0D12, cornerRadius 12, padding 14×24
    // Secondary: bg transparent, border 1.5px #4A4A6A, text #F0F0F5
    // Danger: bg #EF476F, text #FFFFFF
    // Icon (circular): 44×44, bg #1A1A24, border 1px #2E2E45, cornerRadius 22
}

// Cards
struct HabitCard {
    // bg: #1A1A24, border: 1px #2E2E45, cornerRadius: 14, padding: 16
    // States: completed (green left-border 3px, green tint bg, strikethrough)
    //         overdue (red left-border, gentle pulse)
    //         upcoming (default)
}

// Bottom Sheet
// bg: #1A1A24, topCornerRadius: 24, handle: 40×4px #4A4A6A
// backdrop: #000000 at 60% opacity, spring-damped animation

// Toast / Snackbar
// position: top, bg: #24243A, border: 1px #2E2E45, cornerRadius: 12
// types: reward (gold accent), streak (fire icon), warning (coral), info (teal)
```

### 2.7 Animation Tokens

```swift
enum AnimationDuration {
    static let micro:   Double = 0.1    // button press, checkbox toggle
    static let fast:    Double = 0.2    // card state change, icon swap
    static let normal:  Double = 0.3    // sheet open, page transition
    static let slow:    Double = 0.5    // celebration, environment state change
    static let ambient: Double = 2.0    // idle animations, particle loops (infinite)
}

enum AnimationCurve {
    // snappy:  .easeOut with spring(response: 0.3, dampingFraction: 0.7)
    // bounce:  spring(response: 0.4, dampingFraction: 0.5)
    // spring:  spring(response: 0.5, dampingFraction: 0.7, blendDuration: 0.3)
}
```

### 2.8 Transition Patterns

```
Tab Switch:        Cross-fade (200ms) — no slide, feels instant
Push Screen:       Slide from right (300ms, snappy easing)
Bottom Sheet:      Spring-damped slide from bottom
Full-Screen Modal: Slide from bottom (300ms) with backdrop fade
Celebration:       Overlay on current screen (no navigation change)
```

---

## 3. App Architecture (Swift)

### 3.1 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| UI Framework | SwiftUI | Declarative UI, native navigation, SpriteKit embedding via `SpriteView` |
| Avatar Engine | SpriteKit | Metal-backed 60fps sprite rendering, texture atlases, particle systems, SKAction chains |
| Navigation | `NavigationStack` | Type-safe navigation with native transitions |
| State Management | `@Observable` (Observation framework) | Native Swift state, automatic SwiftUI view updates |
| Local Persistence | SwiftData | Offline-first storage with `@Model` entities |
| Backend | Supabase Swift SDK | Auth, Postgres, Storage, Realtime subscriptions |
| Payments | StoreKit 2 | Native IAP, Apple receipt validation |
| Notifications | APNs + `UserNotifications` | Rich push notifications |
| Widget | WidgetKit | Native `TimelineProvider`, SpriteKit rendering in widget |
| Analytics | PostHog Swift SDK | Event tracking, feature flags |
| CI/CD | Xcode Cloud or Fastlane | Native build pipeline |

### 3.2 Project Structure

```
Compound/
  App/
    CompoundApp.swift                — @main entry, scene configuration, SwiftData container setup
    ContentView.swift                — Root TabView container

  Features/
    Realm/
      RealmView.swift                — Home tab: avatar stage + habits drawer
      AvatarStageView.swift          — SpriteView wrapper embedding AvatarScene
      AvatarScene.swift              — SKScene subclass: all sprite rendering, particles, backgrounds
      HabitsDrawerView.swift         — Bottom-sheet habits panel with completion checkboxes
    Habits/
      HabitsListView.swift           — Full habit management list
      HabitDetailView.swift          — Individual habit CRUD (create/edit/delete)
      HabitFormView.swift            — Reusable habit creation/editing form
    Progress/
      ProgressView.swift             — Streaks, calendar heatmap, milestones
      StreakCardView.swift            — Individual streak display
      HeatmapView.swift              — Monthly habit completion heatmap
      MilestoneListView.swift        — Achievement/milestone badges
    Menu/
      MenuView.swift                 — Profile, shop, settings hub
      ShopView.swift                 — Cosmetics store grid
      ShopItemDetailView.swift       — Item preview + purchase flow
      ProfileView.swift              — User profile with large avatar + stats
      SettingsView.swift             — Notification settings, niche switch, privacy, sign out
    Onboarding/
      OnboardingFlow.swift           — 7-step FTUE coordinator
      WelcomeView.swift              — Step 1: splash with animated avatar
      NameInputView.swift            — Step 2: name entry
      NicheSelectionView.swift       — Step 3: Study/Fitness/Work picker
      AvatarCreatorView.swift        — Step 4: customise avatar appearance
      HabitSetupView.swift           — Step 5: pick starting habits from templates
      GoalPickerView.swift           — Step 6: set a motivational reward goal
      PermissionsView.swift          — Step 7: notifications + widget prompt
    Reflection/
      ReflectionSheetView.swift      — Multi-step reflective check-in bottom sheet
      ReasonSelectorView.swift       — "What got in the way?" emotion buttons
      MicroActionView.swift          — Scaled-down habit alternatives
      AdjustmentView.swift           — Reduce frequency, change time, pause options

  Core/
    Models/
      User.swift                     — @Model: id, name, niche, avatarConfig, coinBalance, etc.
      Habit.swift                    — @Model: id, userId, title, frequency, targetTime, niche, etc.
      HabitLog.swift                 — @Model: id, habitId, date, completed, completionTime, notes
      Streak.swift                   — @Model: id, habitId, currentStreak, longestStreak, lastCompleted
      AvatarState.swift              — Enum: active, idle, celebrating, coffee, slacking, sleeping, degraded, peakForm
      CoinTransaction.swift          — @Model: id, type (earn/spend), amount, balanceAfter, trigger
      ShopItem.swift                 — @Model: id, name, type (outfit/decor/booster), cost, rarity, isOwned
      Reflection.swift               — @Model: id, date, missedHabitIds, reason, microAction, mood
    Services/
      HabitEngine.swift              — Completion logic, streak calculation, daily reset
      AvatarStateResolver.swift      — Determines current state from habit data + time of day + streak
      CoinService.swift              — Earn/spend/balance logic, transaction history
      SyncService.swift              — Supabase ↔ SwiftData bidirectional sync
      NotificationService.swift      — Scheduling, copy generation, delivery rules
    ViewModels/
      RealmViewModel.swift           — Realm tab state: today's habits, avatar state, progress
      HabitsViewModel.swift          — Habits tab: full habit list, CRUD operations
      ProgressViewModel.swift        — Progress tab: streaks, heatmap data, milestones
      ShopViewModel.swift            — Shop: items, purchase flow, coin balance
      OnboardingViewModel.swift      — Onboarding state, step progression

  Avatar/
    Sprites/
      idle.atlas/                    — 8 frames @ 64×64
      coffee.atlas/                  — 16 frames @ 64×64
      studying.atlas/                — 12 frames @ 64×64
      lifting.atlas/                 — 14 frames @ 64×64
      phone.atlas/                   — 10 frames @ 64×64
      celebrating.atlas/             — 12 frames @ 64×64
      sleeping.atlas/                — 8 frames @ 64×64
      degraded.atlas/                — 6 frames @ 64×64
      walking.atlas/                 — 8 frames @ 64×64 (transitional only)
    Particles/
      stars.sks                      — Active/idle state sparkles
      confetti.sks                   — Celebration burst (one-shot)
      steam.sks                      — Coffee steam rising
      dust.sks                       — Degraded state dust motes
      zzz.sks                        — Sleep state floating Zzz
      golden_halo.sks                — Peak form golden particles
    AvatarAnimator.swift             — Animation sequencing, state transition choreography
    AvatarSpriteNode.swift           — Main character SKSpriteNode subclass
    BackgroundNode.swift             — Gradient + parallax layer management
    ParticleManager.swift            — State-based particle creation/removal

  Design/
    Theme.swift                      — All colour tokens, spacing, typography as Swift constants
    Components/
      CompoundButton.swift           — Primary/secondary/danger/icon button styles
      HabitCardView.swift            — Reusable habit card with completion states
      ProgressBarView.swift          — Animated horizontal progress bar
      StatPill.swift                 — HUD stat display (coins, streak, level)
      CoinAnimationView.swift        — "+10 coins" floating animation
      ToastView.swift                — Top snackbar notifications

  Widget/
    CompoundWidget.swift             — WidgetKit TimelineProvider
    WidgetViews.swift                — Small (2×2) + Medium (2×4) layouts
    WidgetEntryView.swift            — Shared entry rendering

  Resources/
    Fonts/
      PressStart2P-Regular.ttf       — Pixel display font
    Sounds/                          — Optional: completion chime, coin sound, celebration
```

### 3.3 Key SpriteKit Patterns

```swift
// AvatarScene.swift — Core rendering class
class AvatarScene: SKScene {
    private var avatarNode: AvatarSpriteNode!
    private var backgroundNode: BackgroundNode!
    private var particleManager: ParticleManager!
    private var currentState: AvatarState = .idle

    // Texture atlas loading
    func loadAnimation(_ name: String) -> [SKTexture] {
        let atlas = SKTextureAtlas(named: name)
        let frames = atlas.textureNames.sorted().map { atlas.textureNamed($0) }
        frames.forEach { $0.filteringMode = .nearest }  // CRITICAL: pixelated rendering
        return frames
    }

    // Play animation at 12fps (pixel art standard)
    func playAnimation(_ frames: [SKTexture], loop: Bool = true) {
        let action = SKAction.animate(with: frames, timePerFrame: 1.0 / 12.0)
        avatarNode.run(loop ? .repeatForever(action) : action, withKey: "anim")
    }

    // State transition sequence
    func transitionTo(_ newState: AvatarState) {
        guard newState != currentState else { return }
        currentState = newState

        // 1. Fade out current particles (0.3s)
        particleManager.fadeOut(duration: 0.3)
        // 2. Crossfade avatar animation (0.2s)
        avatarNode.run(.fadeAlpha(to: 0.7, duration: 0.1)) {
            self.playAnimation(self.loadAnimation(newState.atlasName))
            self.avatarNode.run(.fadeAlpha(to: 1.0, duration: 0.1))
        }
        // 3. Fade in new particles (0.3s)
        particleManager.setParticles(for: newState, fadeIn: 0.3)
        // 4. Animate background gradient (0.6s)
        backgroundNode.animateGradient(to: newState.gradientColors, duration: 0.6)
    }
}

// Embedding in SwiftUI
struct AvatarStageView: View {
    @State private var scene = AvatarScene(size: CGSize(width: 400, height: 500))

    var body: some View {
        SpriteView(scene: scene, options: [.allowsTransparency])
            .frame(maxWidth: .infinity)
            .aspectRatio(4/5, contentMode: .fit)
    }
}
```

---

## 4. Character Portrait System

### 4.1 Design Philosophy

> The avatar IS the app. It dominates the home screen, reacts in real-time to user behaviour, and creates an emotional investment that raw stats never could. Think Tamagotchi meets Duolingo — the character is your companion, not a decoration inside a dollhouse.

### 4.2 Screen Hierarchy (Realm Tab)

The Realm tab home screen is a vertical stack:

| Zone | Content | Screen % |
|------|---------|----------|
| HUD bar (top) | Level, coin balance, streak count. Semi-transparent pills over stage background. | ~10% |
| Avatar Stage (centre) | **Hero element.** Background gradient + particles + glow + avatar sprite + speech bubble + mood label. | ~55% |
| Progress bar | Today's habit completion %. Green (on track), gold (all done), red (behind). | ~5% |
| Habits drawer (bottom) | Today's habits with completion checkboxes. Expandable via swipe-up. | ~30% |

### 4.3 Avatar Stage Layers

Five layers composited back-to-front within the SpriteKit scene:

| # | Layer | Content | Update Frequency | Implementation |
|---|-------|---------|-----------------|----------------|
| 1 | Background | Gradient fill (state + time of day) | On state change | SKShapeNode with animated colour stops |
| 2 | Scene elements | Simple parallax silhouettes (window, bookshelf outline, plants) | Slow drift on gyro | SKSpriteNode with parallax factor |
| 3 | Ambient glow | Soft radial glow behind avatar, colour matches mood | On state change (0.6s) | Pre-baked glow texture with blend mode `.add` |
| 4 | Avatar sprite | Large character with active animation | 12fps frame cycling | SKSpriteNode with SKAction.animate |
| 5 | Particle overlay | Stars, confetti, steam, dust, Zzz | 60fps (native) | SKEmitterNode with .sks files |

### 4.4 Speech Bubble

Contextual text above the avatar. Updates on state change. Examples:

| State | Study | Fitness | Work |
|-------|-------|---------|------|
| Active | "Deep in the books!" | "Let's crush this set!" | "Shipping features!" |
| Celebrating | "Nailed every habit!" | "Personal best day!" | "All tasks cleared!" |
| Idle | "Got anything planned?" | "Gym's calling..." | "Tasks are piling up..." |
| Slacking | "*scrolling TikTok*" | "*watching TV*" | "*browsing Reddit*" |
| Degraded | "I miss the old us..." | "Everything hurts..." | "Can we start over?" |
| Sleeping | "*dreaming of A+*" | "*rest day gains*" | "*recharging*" |

### 4.5 Tap Interaction

Tapping the avatar triggers a contextual reaction:
- **Active:** Waves, winks, or gives thumbs up
- **Idle:** Perks up, looks at camera expectantly
- **Slacking:** Startled, hides phone behind back
- **Sleeping:** Rolls over, mumbles
- **Degraded:** Looks up hopefully
- **Celebrating:** Does a bonus jump or dance

---

## 5. Sprite & Animation Specification

### 5.1 Quality Bar

> Sprites must feel like high-end indie pixel art (reference: Eastward, Coffee Talk, Celeste character portraits). Smooth, detailed animation with many frames. Consistent character design, rich shading with 3–4 tones per material, and sub-pixel animation techniques for fluid motion. Every animation should feel hand-crafted and alive.

### 5.2 Sprite Dimensions

| Property | Value | Rationale |
|----------|-------|-----------|
| Base sprite size | 64×64 pixels | Sweet spot for emotion + mobile atlas efficiency |
| Display scale | 4× standard, 8× Retina (@2x) | 256pt display → fills ~40% screen width on iPhone |
| Texture atlas format | `.atlas` directory (Xcode managed) | Auto-optimised atlas from individual PNG frames |
| Colour depth | 32-bit RGBA | Full alpha for anti-aliased pixel art edges |
| Palette per character | 24–32 colours | 3–4 tones per material |
| Filtering mode | `.nearest` (pixelated) | CRITICAL: preserves crisp pixel edges |

### 5.3 Animation Spec (All Animations)

Each animation plays at **12fps** (83ms per frame). This is the pixel art standard frame rate.

| Animation | Frames | Duration | Loop | Key Requirements |
|-----------|--------|----------|------|-----------------|
| **Idle / Breathing** | 8 | 0.67s | Loop | Gentle 1–2px vertical bob, periodic blink (every 3–4s, 2 frames), subtle arm sway. Must feel alive even when doing nothing. |
| **Drinking Coffee** | 16 | 1.33s | Loop | Full cycle: arm rest → raise cup (4f ease-in) → tilt head → sip with mouth open (4f hold) → lower cup (4f ease-out) → satisfied smile (4f rest). Cup has steam particles. |
| **Studying / Typing** | 12 | 1.0s | Loop | Hands on keyboard, slight forward lean, periodic head nod. Screen glow on face (additive blend). Keys tapping visible. |
| **Lifting Weights** | 14 | 1.17s | Loop | Bicep curl or overhead press with proper form. Weight visually rises/lowers. Arm muscles shift. Slight red flush on exertion frames. |
| **Scrolling Phone** | 10 | 0.83s | Loop | Slouched posture, phone at chest height, thumb scrolls (content shifts 1px/3 frames), half-lidded eyes. Screen casts blue glow on face. |
| **Celebrating** | 12 | 1.0s | Once → idle | Crouch (2f) → jump 4–6px (3f) → peak with arms raised + big smile (3f) → land with squash (2f) → bounce settle (2f). Confetti burst at peak frame. |
| **Sleeping** | 8 | 1.33s (slow) | Loop | Eyes closed, gentle 0.5–1px breathing bob (slower than idle). Head tilted. Zzz particles float up and grow. Blanket visible. |
| **Degraded / Sad** | 6 | 1.0s | Loop | Slouched 2–3px lower, desaturated palette (−40% saturation), sad mouth, minimal breathing. Occasional shiver frame. Clothes show wear (darker patches). |
| **Walking** | 8/dir | 0.67s | Loop | Standard 2-frame walk cycle, 4 directions. Used ONLY for short transitions, not primary state. |
| **Blinking** | 3 | 0.25s | Trigger every 3–4s | Eyes: open → half-closed → closed → open. Sprite swap on eye region only. Overlay on any looping animation. |

### 5.4 Shading & Consistency Standards

- **Light source:** Consistent top-left at ~45°. All sprites shade from this direction. Highlight on top-left edges, shadow on bottom-right.
- **Tonal range:** Every material MUST have minimum 3 tones: highlight, base, shadow. Hair and skin MUST have 4 tones (add deep shadow). NO flat-filled areas.
- **Anti-aliasing:** Use intermediate tones on curved edges (pixel art AA technique). Hair outline uses darkest hair tone, NOT black. Skin-to-hair transitions use mid-tone.
- **Expression detail:** Eyes: white + iris colour + pupil + 1px shine dot. Mouth: 4+ variants (neutral, smile, open, sad). Blush spots on cheeks for happy states.
- **Clothing detail:** Shirts show collar, seam lines, pocket/logo. Pants have leg separation and shoe transition. Fabric wrinkles on bent limbs.
- **Character consistency:** ALL frames must maintain identical proportions, colour palette, and design language. Head-to-body ratio, limb lengths, and facial feature positions MUST NOT drift between frames.
- **Niche outfit variants:** Same character base with outfit swaps:
  - Study: casual hoodie + headphones
  - Fitness: tank top + shorts + sneakers
  - Work: button shirt + slacks

### 5.5 Asset Pipeline

1. **Tool:** Aseprite (industry standard for pixel art animation)
2. **Export:** Individual PNG frames: `[character]_[animation]_[frame].png` (e.g., `default_coffee_04.png`)
3. **Atlas:** Xcode `.atlas` directories auto-compile frames into optimised texture atlases. One folder per animation: `idle.atlas/`, `coffee.atlas/`, etc.
4. **Quality gate:** Every animation must pass review for: consistent shading direction, palette adherence, smooth motion (no frame jumps), correct proportions, clean pixel edges.
5. **Automation:** Body part composition via skeleton rig in Aseprite. Animate by transforming parts. Reduces per-animation hand-drawing time and ensures consistency.

---

## 6. Background System

Replaces the old isometric room art. Fully procedural — zero hand-drawn backgrounds required.

### 6.1 Layer Composition

| Layer | Description | Implementation |
|-------|-------------|---------------|
| Gradient base | 2–3 colour gradient. Shifts based on avatar state AND time of day. | SKShapeNode with animated colour stops |
| Ambient glow | Soft radial glow centred behind avatar. Colour matches mood. | Pre-baked radial gradient texture, blend mode `.add`, opacity animated |
| Parallax silhouettes (optional) | Simple flat-colour shapes: bookshelf outline, window frame, desk edge, plant pot. 2–3 layers at different parallax depths responding to device tilt. | SKSpriteNode with 1-bit alpha PNGs, tint colour per niche/state. Outlines only, no detail needed. |
| Particle overlay | State-specific floating effects (see §7 state table). | SKEmitterNode with `.sks` files |

### 6.2 Time-of-Day Colour Mapping

| Time Window | Gradient Top | Gradient Bottom | Ambient Tone |
|-------------|-------------|-----------------|--------------|
| 6am–10am (Morning) | `#2A1D3A` soft purple | `#1A1A30` dark indigo | Warm amber glow |
| 10am–2pm (Midday) | `#1A2848` cool blue | `#1A1A38` deep blue | Neutral white-blue |
| 2pm–6pm (Afternoon) | `#1A2040` muted blue | `#151520` dark grey | Soft warm glow |
| 6pm–10pm (Evening) | `#201838` deep purple | `#0D0D12` near black | Amber-orange glow |
| 10pm–6am (Night) | `#080810` near black | `#0D0D12` black | Very dim blue-purple |

**State overrides time-of-day:**
- Sleeping → always night palette
- Degraded → always desaturated near-black
- Celebrating → always warm purple-gold
- Active / Idle → respect time-of-day mapping

---

## 7. Avatar State Machine

### 7.1 State Definitions

| State | Trigger | Avatar Animation | Background | Particles |
|-------|---------|-----------------|------------|-----------|
| `ACTIVE` | Habit logged in last 2hrs | Niche-specific activity (studying, lifting, coding) | Warm gradient, subtle energy | Floating stars/sparkles |
| `IDLE` | No activity 2–4hrs, no habit due | Standing, gentle breathing, periodic blink | Neutral cool gradient | Slow ambient dots |
| `CELEBRATING` | All daily habits completed | Jump, arm raise, big smile, bounce | Warm purple/gold gradient | Confetti burst |
| `COFFEE` | Morning routine / first habit of day | Raises cup, sips, lowers, satisfied smile | Warm amber glow | Steam rising from cup |
| `SLACKING` | No activity 4+hrs, habit overdue | Slouched, holding phone, scrolling | Dim, desaturated gradient | Phone screen glow only |
| `SLEEPING` | Between 11pm–7am (user configurable) | Eyes closed, gentle breathing | Very dark, deep blue | Floating Zzz particles |
| `DEGRADED` | 3+ consecutive missed days | Slouched, sad, clothes dimmed | Grey, washed out, near-black | Dust motes, slow drift |
| `PEAK_FORM` | 7-day streak active | Glowing idle with golden border effect | Rich gradient with ambient sparkle | Golden particle halo |

### 7.2 State Resolution Logic

```swift
// AvatarStateResolver.swift
func resolveState(habits: [Habit], logs: [HabitLog], streak: Int, now: Date) -> AvatarState {
    let hour = Calendar.current.component(.hour, from: now)
    let todaysDue = habits.filter { $0.isDueToday }
    let todaysCompleted = logs.filter { $0.isToday && $0.completed }
    let consecutiveMissedDays = calculateConsecutiveMissedDays(logs: logs)
    let lastActivityTime = logs.filter { $0.completed }.max(by: { $0.completionTime < $1.completionTime })?.completionTime
    let hoursSinceActivity = lastActivityTime.map { now.timeIntervalSince($0) / 3600 } ?? 999

    // Priority order (highest first)
    if hour >= 23 || hour < 7 { return .sleeping }
    if consecutiveMissedDays >= 3 { return .degraded }
    if todaysCompleted.count == todaysDue.count && !todaysDue.isEmpty { return .celebrating }
    if streak >= 7 && hoursSinceActivity < 2 { return .peakForm }
    if hoursSinceActivity < 2 { return .active }
    if todaysCompleted.count == 1 && hour < 12 { return .coffee }
    if hoursSinceActivity >= 4 && todaysDue.count > todaysCompleted.count { return .slacking }
    return .idle
}
```

### 7.3 Degradation Rules

- **Day 1 missed:** No visual change (grace period). "Never miss twice" philosophy.
- **Day 2 missed:** Avatar yawns. One plant droops. Background slightly dimmer.
- **Day 3+ missed:** Full DEGRADED state. Dust particles. Desaturated palette. Sad expression.
- **Recovery:** Completing ANY habit immediately begins reversing degradation. "Bounce-back" celebrated with bonus XP.
- **NEVER catastrophic:** Degradation is always gradual and recoverable. Single missed day ≠ punishment.

---

## 8. Navigation & Screen Architecture

### 8.1 Tab Structure

```
TabView (4 tabs):
├── Tab 1: Realm        — Home screen (avatar stage + today's habits)
├── Tab 2: Habits       — Full habit management (CRUD, reorder)
├── Tab 3: Progress     — Streaks, heatmap, milestones, daily log
└── Tab 4: Menu         — Profile, shop, settings, help
```

- Tab bar uses pixel icons for Realm, standard SF Symbols for others
- Active tab: `#FFD166` gold tint. Inactive: `#8888A0` grey
- Tab bar background: `#0D0D12` with subtle top border `#2E2E45`

---

## 9. Onboarding Flow

**7 steps · Target: under 2 minutes · No account required until Step 6**

### Step 1: Welcome Splash
- COMPOUND logo in "Press Start 2P" pixel font
- Animated pixel avatar cycles between study/work/gym variants every 3s
- Tagline: "Every day compounds. Every skip costs."
- Primary gold button: "GET STARTED →"
- Text link: "Already have an account?"
- Background: slow-moving pixel stars/particles

### Step 2: Name Input
- Heading: "What should we call you?"
- Auto-focused text input
- Caption: "This is how your avatar knows you. You can change it later."
- Continue button enables when ≥2 characters entered

### Step 3: Niche Selection
- Heading: "What's your focus right now? Pick your world."
- 3 large cards with animated avatar preview in each niche's outfit:
  - 📚 Study — "Books, exams, late-night cramming"
  - 💪 Fitness — "Gym, runs, gains"
  - 💼 Work — "Deadlines, projects, hustle"
- Each card shows a mini avatar in the relevant outfit with idle animation
- Selecting a card triggers a brief celebration animation on that avatar

### Step 4: Avatar Creator
- Large avatar preview (8× scale, animated idle)
- Customisation options: Skin tone (6 options), Hair style (8), Hair colour (8), Outfit colour (6)
- Outfit type is locked to niche (hoodie for study, tank for fitness, shirt for work)
- Changes preview in real-time on the avatar

### Step 5: First Habits
- Heading: "Start small. Pick 1–3 habits."
- Niche-specific template suggestions:
  - Study: "Study for 1 hour", "Read 20 pages", "Review flashcards"
  - Fitness: "Go to the gym", "10,000 steps", "Meal prep"
  - Work: "2 hours deep work", "Ship one feature", "Journal for 10 minutes"
- Each is a toggleable card. Max 5 initially.
- "Add custom habit" option at bottom

### Step 6: Reward Goal
- Heading: "What are you working toward?"
- Horizontal carousel of aspirational goals:
  - "Feel more productive", "Build discipline", "Get healthier", "Ace my exams", "Launch my project"
- Selected goal influences avatar speech bubbles and milestone framing

### Step 7: Permissions & Widget
- Notification permission request with rationale
- Widget tutorial with preview: "Keep your avatar visible all day"
- Final CTA: "MEET YOUR AVATAR →"
- **Post-onboarding reveal:** Screen fades to black (300ms) → avatar stage fades in from centre (scale 0.5→1.0, 800ms) → avatar waves → coin counter: "+50 starter coins" → toast: "Welcome, [Name]!"

---

## 10. Realm Tab (Home Screen)

This is the single most important screen. Everything the user needs in under 90 seconds.

### 10.1 Layout

```
┌────────────────────────────────────────┐
│  HUD: [Lv 5]    [💰 240]    [🔥 12]  │  ← Semi-transparent pills
├────────────────────────────────────────┤
│                                        │
│        ┌──────────────────┐            │
│        │   Speech bubble  │            │
│        └──────────────────┘            │
│                                        │
│          ╔══════════════╗              │  ← AVATAR STAGE
│          ║              ║              │     55% of screen height
│          ║   64×64      ║              │     SpriteKit scene
│          ║   AVATAR     ║              │
│          ║   @ 4×       ║              │
│          ║              ║              │
│          ╚══════════════╝              │
│                                        │
│          [Mood: Energised]             │
│                                        │
├────────────────────────────────────────┤
│  2/3 today                       67%  │  ← Progress bar
│  ██████████████████░░░░░░░░░░░░░░░░░  │
├────────────────────────────────────────┤
│  Today's Habits                  2/3  │  ← Habits drawer
│  ✅ Morning run                       │     Expandable via swipe-up
│  ✅ Study 2hrs                        │
│  ☐  Read 20 pages                     │
├────────────────────────────────────────┤
│  [Realm]  [Habits]  [Progress]  [Menu]│  ← Tab bar
└────────────────────────────────────────┘
```

### 10.2 Habit Completion Flow (The "Money Moment")

When user taps a habit checkbox:

1. **Checkbox fills** green with checkmark (haptic: light impact)
2. **Avatar triggers** celebration animation (context-dependent: fist pump, thumbs up, or jump)
3. **Coin reward** floats up from avatar: "+10 coins" with gold particle trail
4. **Progress bar** animates forward
5. **If all habits complete:** Full CELEBRATING state triggers — confetti burst, background shifts to warm purple/gold, avatar does big jump, speech bubble: "Nailed every habit!"
6. **Streak counter** increments if this completes the day
7. **Duration:** Entire sequence ~1.5 seconds. Must feel instant and satisfying.

---

## 11. Habits Tab

Full habit management screen.

### 11.1 Layout

- **Header:** "Habits" title + "+" add button
- **Filter pills:** All | Active | Paused
- **Habit list:** Reorderable (drag handles), grouped by niche
- **Each habit card shows:** Icon + title, schedule (daily/weekdays/custom), current streak, next due time
- **Swipe actions:** Swipe right = quick complete, swipe left = skip/snooze

### 11.2 Habit Detail / Edit

- Habit name (text input)
- Schedule: Daily, Weekdays, Custom days picker
- Target time (time picker — triggers notification)
- Niche assignment (auto-detected from onboarding, changeable)
- If-then plan prompt: "When will you do this? What situation will trigger it?" (stored as habit cue, used for notification timing)
- Reminder toggle + time
- Coin reward display (auto-calculated)
- Streak history chart (mini sparkline)
- Delete habit (confirmation required)

---

## 12. Progress Tab

### 12.1 Layout

- **Streak overview:** Card per active habit with current streak flame icon + "X days"
- **Monthly heatmap:** Calendar grid, colour intensity = completion percentage per day. Green (100%), yellow (partial), grey (missed), today highlighted.
- **Milestones:** Badge collection (7-day, 21-day, 66-day streaks + special achievements)
- **Consistency score:** "You've completed 82% of habits this month. That's better than 73% of COMPOUND users."
- **Resilience score:** "Average recovery time after a miss: 1.2 days" (directly rewards "never miss twice")

### 12.2 Daily Log (Optional)

- Mood selector (5 options: 😊 😌 😐 😔 😫)
- Optional photo attachment
- Optional text note
- Saved with the day's habit log data

---

## 13. Menu Tab

Hub for Profile, Shop, Settings.

### 13.1 Profile Screen

- Large avatar display (8× scale, equipped items visible)
- Name + Level + stats bar (streak, coins, completion %)
- Menu items: Edit Avatar, My Wardrobe, Achievements, Change Niche, Notification Settings, Upgrade to Pro, Privacy & Data, Help & Feedback, Sign Out

### 13.2 Shop

- **Grid layout:** 2–3 column responsive grid
- **Item types:** Outfits, Accessories, Background Themes, Boosters
- **Each item:** Pixel art preview, name, coin price, rarity badge (Common/Rare/Epic/Legendary)
- **Purchase flow:** Tap item → preview sheet (avatar wearing item) → "BUY FOR 💰 200" → coin deduction animates → item "flies" to avatar → equipped → "EQUIPPED!" with sparkle → sheet auto-closes after 2s
- **Locked items:** Greyed out with "Reach Level X" or "Requires 7-day streak"
- **Rarity distribution:** Common 50%, Rare 30%, Epic 15%, Legendary 5%

### 13.3 Settings

- Notification preferences (global + per-habit toggles)
- Quiet hours (default 11pm–7am)
- Niche switcher
- Data export
- Account management (email, password, delete account)
- App version info

---

## 14. Token Economy & Gamification

### 14.1 Coin Earning

| Action | Coins | Notes |
|--------|-------|-------|
| Complete a habit | +10 | Base reward |
| Complete ALL daily habits | +25 bonus | On top of individual rewards |
| Maintain 7-day streak | +50 | Per habit |
| Maintain 21-day streak | +150 | Per habit |
| Maintain 66-day streak | +500 | Per habit (habit is "locked in") |
| Bounce-back after miss | +15 | More than routine completion — rewards resilience |
| Complete reflective check-in | +5 | Even if declining micro-action |
| Daily login (any activity) | +3 | Tiny, just for showing up |

### 14.2 Coin Spending

| Item Type | Price Range | Examples |
|-----------|------------|---------|
| Common outfit | 50–100 | T-shirt colours, basic shoes |
| Rare accessory | 150–300 | Headphones, watch, glasses |
| Epic outfit set | 400–800 | Full themed outfit |
| Legendary item | 1000+ | Glowing effects, animated accessories |
| Background theme | 200–500 | Seasonal backgrounds, special gradients |
| Booster | 100–200 | 2× XP for 24hrs, streak freeze (1 use) |

### 14.3 Levelling

- XP earned alongside coins (roughly 1:1 ratio)
- Level thresholds increase: L1→2 = 100XP, L2→3 = 250XP, L3→4 = 500XP, etc.
- Level unlocks: new shop items, avatar customisation options, additional habit slots
- Level displayed as pixel badge on HUD

### 14.4 Streak Freeze

- Purchasable consumable (100 coins)
- Preserves streak for 1 missed day
- Max 1 active at a time
- Visual: shield icon appears on streak counter when active

### 14.5 Dynamic Point Scaling (Optimised Gamification)

Based on research (Lieder et al., 2024): points should scale based on user history.
- **Struggling users** (returning after absence): generous "welcome back" reward (2× coins for first 3 days back)
- **Established users** (30+ day streaks): introduce challenges for bonus coins rather than bigger base numbers
- **Prevents:** under-motivation for struggling users AND ceiling effects for advanced users

---

## 15. Reflective Check-In System

Triggered when a habit is missed at end of day (midnight) OR when user manually skips. Based on **motivational interviewing** principles — never guilt, always curiosity and warmth.

### 15.1 Flow

**Screen 1: Observation (not accusation)**
- Avatar with concerned face (sitting on edge of chair/bed)
- Text: "[Name], you didn't get to [Habit name] today."
- "What got in the way?" with emotion-labelled buttons:
  - 😫 Too tired | 📅 Too busy | 🤕 Not well | 🤷 Forgot | 😤 No excuse | 📝 Other...
- "Skip reflection" link (−5 coins penalty — small, to encourage engagement)

**Screen 2: Micro-Action Offer**
- "That's okay. Everyone has off days."
- "Can you do a smaller version right now?" with scaled-down alternatives:
  - e.g., if habit was "Gym session": "💪 Do 10 push-ups (2 min)" / "🚶 Take a 5-min walk" / "🧘 3 minutes of stretching"
- "Not today — I'll try tomorrow" (secondary button)
- "Completing a micro-action saves your streak!"

**Screen 3: Adjustment Offer (if 2+ misses this week)**
- "Looks like this week has been tough. Want to adjust?"
- Options: "Reduce frequency" / "Change time" / "Take a 3-day break" / "Keep as is"
- Avatar shows hopeful/supportive expression

### 15.2 Copy Principles

- **Self-kindness:** "Tough day? That's okay. Everyone has them."
- **Common humanity:** "87% of users miss at least one day per week. You're in good company."
- **Mindfulness:** "Let's look at how the week went overall, not just today."

### 15.3 Failure Reframe Language

| Instead of... | Use... |
|--------------|--------|
| "You failed your habit" | "This habit needs attention" |
| "Streak broken" | "New streak starting — your best was X days" |
| "0/5 habits completed" | "5 opportunities tomorrow" |
| "Your room is degraded" | "Your space is waiting for you to come back" |
| "You've been inactive" | "Ready to pick up where you left off?" |

---

## 16. Notification System

### 16.1 Notification Types & Copy

```
SCHEDULED REMINDER (per habit):
  Title: "[Habit emoji] Time for [Habit name]"
  Body: "[Avatar name] is warming up... don't leave them hanging!"

NUDGE (2hr inactive, habit overdue):
  Title: "📱 [Avatar name] is scrolling TikTok..."
  Body: "They'd rather be [working out / studying / grinding]. Help them out?"

STREAK WARNING (9pm, incomplete habits):
  Title: "⚠️ Streak at risk!"
  Body: "You've got [X] habits left before midnight. [Avatar name] is counting on you."

STREAK CELEBRATION:
  Title: "🔥 [X]-DAY STREAK!"
  Body: "[Avatar name] just hit a new milestone! Come see their celebration."

WEEKLY REVIEW (Sunday 7pm):
  Title: "📊 Weekly wrap-up ready"
  Body: "You completed [X]% of your habits this week. [Avatar name] has thoughts."

DEGRADATION WARNING (3 consecutive misses):
  Title: "😔 [Avatar name] isn't doing well..."
  Body: "3 days missed. They're looking rough. A quick win could turn things around."
```

### 16.2 Delivery Rules

- Never more than 3 notifications per day
- Nudge only fires once per day
- No notifications during quiet hours (default 11pm–7am, user configurable)
- Streak warning only if ≥1 habit incomplete after 9pm
- Celebration notifications always fire (positive reinforcement)
- User can mute per-habit or globally

---

## 17. Widget System

### 17.1 Small Widget (2×2)

```
┌──────────────────┐
│ 🔥 12            │  Streak count (pixel font, large)
│  [Mini avatar]   │  Avatar at 2× scale (simplified 2–3 frame loop)
│  78% ████░░      │  Today's progress bar
└──────────────────┘
Background: Dark, matches niche tint
Updates: Every 15 minutes (iOS minimum)
Tap: Opens app to Realm tab
```

### 17.2 Medium Widget (2×4)

```
┌──────────────────────────────────────────┐
│  [Mini avatar]  🔥 12 streak  💰 1,240  │
│  ☐ 💪 Workout        ☐ 📖 Read          │
│  ✅ 💧 Water                             │
│  ██████████████░░░░░  78% today          │
└──────────────────────────────────────────┘
Interactive: Tap habit checkboxes to complete (iOS 17+)
Tap avatar area: Opens app
```

### 17.3 Implementation

```swift
// CompoundWidget.swift
struct CompoundWidgetProvider: TimelineProvider {
    // Fetch today's habits + completion status from SwiftData
    // Render avatar state as static pixel art frame
    // Update timeline every 15 minutes
    // Use WidgetKit's native rendering (no SpriteKit in widgets)
}
```

---

## 18. Data Models (SwiftData)

### 18.1 Entity Definitions

```swift
@Model class User {
    @Attribute(.unique) var id: UUID
    var name: String
    var niche: Niche  // enum: study, fitness, work
    var avatarConfig: AvatarConfig  // Codable struct: skinTone, hairStyle, hairColor, outfitColor
    var coinBalance: Int
    var xp: Int
    var level: Int
    var streakCurrent: Int  // longest active across all habits
    var subscriptionStatus: SubscriptionStatus  // free, pro, proTrial
    var onboardingCompleted: Bool
    var quietHoursStart: Int  // hour (0-23), default 23
    var quietHoursEnd: Int    // hour (0-23), default 7
    var createdAt: Date
}

@Model class Habit {
    @Attribute(.unique) var id: UUID
    var userId: UUID
    var title: String
    var emoji: String
    var frequency: HabitFrequency  // daily, weekdays, custom([Int] weekday indices)
    var targetTime: Date?  // optional time-of-day for reminders
    var niche: Niche
    var isActive: Bool
    var isPaused: Bool
    var sortOrder: Int
    var ifThenPlan: String?  // "If [situation], then I will [habit]"
    var coinReward: Int  // default 10
    var createdAt: Date
}

@Model class HabitLog {
    @Attribute(.unique) var id: UUID
    var habitId: UUID
    var date: Date  // calendar date (no time component)
    var completed: Bool
    var completionTime: Date?
    var skipped: Bool
    var notes: String?
    var mood: Mood?  // enum: great, good, neutral, low, terrible
}

@Model class Streak {
    @Attribute(.unique) var id: UUID
    var habitId: UUID
    var currentStreak: Int
    var longestStreak: Int
    var lastCompletedDate: Date?
}

@Model class CoinTransaction {
    @Attribute(.unique) var id: UUID
    var userId: UUID
    var type: TransactionType  // earn, spend
    var amount: Int
    var balanceAfter: Int
    var trigger: String  // "habit_complete", "streak_bonus", "shop_purchase", etc.
    var createdAt: Date
}

@Model class ShopItem {
    @Attribute(.unique) var id: UUID
    var name: String
    var description: String
    var type: ShopItemType  // outfit, accessory, background, booster
    var cost: Int
    var rarity: Rarity  // common, rare, epic, legendary
    var theme: Niche?  // nil = universal
    var isOwned: Bool
    var isEquipped: Bool
    var requiredLevel: Int?
    var requiredStreak: Int?
    var assetName: String  // reference to sprite asset
}

@Model class Reflection {
    @Attribute(.unique) var id: UUID
    var userId: UUID
    var date: Date
    var missedHabitIds: [UUID]
    var reason: MissReason?  // tired, busy, unwell, forgot, noExcuse, other
    var reasonDetail: String?
    var microActionCompleted: Bool
    var microActionDescription: String?
    var adjustmentMade: AdjustmentType?  // reduceFrequency, changeTime, pause, none
    var mood: Mood?
}
```

### 18.2 Enums

```swift
enum Niche: String, Codable, CaseIterable {
    case study, fitness, work
}

enum AvatarState: String, Codable {
    case active, idle, celebrating, coffee, slacking, sleeping, degraded, peakForm

    var atlasName: String {
        switch self {
        case .active: return "studying"  // overridden by niche
        case .idle: return "idle"
        case .celebrating: return "celebrating"
        case .coffee: return "coffee"
        case .slacking: return "phone"
        case .sleeping: return "sleeping"
        case .degraded: return "degraded"
        case .peakForm: return "idle"  // uses idle with golden overlay
        }
    }
}

enum HabitFrequency: Codable {
    case daily
    case weekdays
    case custom([Int])  // 1=Monday...7=Sunday
}

enum Mood: String, Codable { case great, good, neutral, low, terrible }
enum MissReason: String, Codable { case tired, busy, unwell, forgot, noExcuse, other }
enum AdjustmentType: String, Codable { case reduceFrequency, changeTime, pause, none }
enum TransactionType: String, Codable { case earn, spend }
enum ShopItemType: String, Codable { case outfit, accessory, background, booster }
enum Rarity: String, Codable { case common, rare, epic, legendary }
enum SubscriptionStatus: String, Codable { case free, pro, proTrial }
```

---

## 19. Backend (Supabase)

### 19.1 Tables (mirror SwiftData models)

All tables use `uuid` primary keys. Row-Level Security (RLS) enforced: users can only read/write their own rows.

| Table | Sync Strategy |
|-------|--------------|
| `users` | Bidirectional — Supabase Realtime subscription |
| `habits` | Push on change, pull on launch |
| `habit_logs` | Push on completion, batch pull on sync |
| `streaks` | Computed locally, synced as checkpoint |
| `coin_transactions` | Append-only push, reconcile on conflict |
| `shop_items` | Pull from Supabase on shop open (server-authoritative) |
| `reflections` | Push on completion |

### 19.2 Auth

- Supabase Auth with email/password
- Apple Sign In (required for App Store)
- Google Sign In (optional)
- Anonymous auth for onboarding (no account until user chooses to sign up)

### 19.3 Edge Functions

- `calculate-streak-bonus` — server-side validation of streak milestones before awarding coins
- `validate-purchase` — server-side check for shop purchases (prevent client-side manipulation)
- `generate-micro-actions` — optional AI-powered micro-action suggestions (P3)

---

## 20. Goal Journey Feature (P2 — Future)

### 20.1 Concept

Users describe a goal in natural language ("I want to run a half marathon by October"). An AI engine breaks it into milestones and daily habits, visualised as a scrollable trail map. The avatar's position on the trail advances as habits are completed.

### 20.2 Flow

1. **Goal Input:** User taps "New Journey", describes goal. Free text + optional target date.
2. **AI Decomposition:** Claude API breaks goal into 4–8 milestones with timeframes + specific daily habits per phase. User reviews and adjusts.
3. **Trail Generation:** Milestones become nodes on a vertical scrollable trail map. Organic curved path (bezier). Completed = solid green circle + checkmark. Current = large pulsing circle with avatar. Future = dashed outlines.
4. **Daily Progression:** Completing all daily habits for current phase advances avatar along trail. Progress proportional to days completed / days in phase.
5. **Milestone Rewards:** Reaching a milestone triggers celebration animation, coin bonus, optional badge. AI generates reflective prompt: "You've completed 4 weeks of training. How does your body feel compared to day 1?"

### 20.3 AI Integration

| Component | Implementation | Priority |
|-----------|---------------|----------|
| Goal decomposition | Claude API with structured JSON output. System prompt with domain knowledge for fitness, education, professional goals. | P2 |
| Milestone reflection prompts | Generated per-milestone using motivational interviewing principles. | P2 |
| Habit adjustment | AI suggests scaling down if user consistently misses habits in a phase. | P3 |
| Goal refinement chat | Conversational interface in bottom sheet for refining milestones. | P3 |

### 20.4 Data Models

```swift
@Model class Journey {
    @Attribute(.unique) var id: UUID
    var userId: UUID
    var goalDescription: String
    var targetDate: Date?
    var status: JourneyStatus  // active, completed, paused
    var createdAt: Date
}

@Model class Milestone {
    @Attribute(.unique) var id: UUID
    var journeyId: UUID
    var title: String
    var description: String
    var sortOrder: Int
    var estimatedDays: Int
    var startDate: Date?
    var completedDate: Date?
    var reflectionPrompt: String?
}

@Model class JourneyHabit {
    @Attribute(.unique) var id: UUID
    var milestoneId: UUID
    var title: String
    var frequency: HabitFrequency
    var linkedHabitId: UUID?  // connects to main Habit system
}
```

---

## 21. Psychology Principles

These are load-bearing design decisions, not decorative additions. Reference the full research compendium (`COMPOUND_Motivation_Research.md`) for citations.

### 21.1 Self-Determination Theory (SDT)

The app must satisfy three innate needs:
- **Autonomy:** User chooses habits, pace, niche. Never force check-ins or guilt-trip. Invitational language ("Would you like to..."), never directive ("You must...").
- **Competence:** Graduated challenge (start absurdly easy via Tiny Habits). Clear, growth-oriented feedback. "Not yet" framing for incomplete goals.
- **Relatedness:** Avatar as companion, not judge. Eventually, community features (P3+).

### 21.2 Temporal Motivation Theory (TMT)

Combat procrastination by manipulating: `Motivation = (Expectancy × Value) / (Impulsiveness × Delay)`
- **Increase Expectancy:** Break big goals into tiny steps. Show progress evidence.
- **Increase Value:** Make completion itself rewarding (immediate visual feedback, animations).
- **Decrease Impulsiveness:** Avatar's degraded state as salient reminder. Smart notification timing.
- **Decrease Delay:** Immediate tangible rewards. Daily micro-goals, not distant outcomes.

### 21.3 Loss Aversion & Endowment Effect

- Users who build up their avatar/environment feel 2–3× stronger motivation to maintain it (endowment effect)
- Threat of degradation more motivating than promise of upgrades (loss aversion)
- BUT: Loss aversion in streaks triggers anxiety in perfectionists → degradation must be gradual and recoverable, never catastrophic

### 21.4 Key Cognitive Biases

- **Zeigarnik Effect:** Partially complete progress bars (3/5 habits) create cognitive tension driving completion
- **Goal Gradient:** Users accelerate effort near goals. Accelerating milestone density near completion points (days 1, 3, 7, 14, 30)
- **Endowed Progress:** New users get starter pack (partial furniture/coins) — not starting from zero
- **Fresh Start Effect:** "Monday resets", monthly themes, option to "renovate" after difficult periods
- **Variable Ratio Reinforcement:** Random rare drops, surprise avatar animations, occasional bonus XP days

### 21.5 Master Principles Summary

1. Support autonomy, don't control
2. Build competence through graduated challenge
3. Create relatedness through the avatar relationship
4. Minimize delay between action and reward
5. Use loss aversion carefully, not cruelly
6. Design for productive failure (reflection loops)
7. Scaffold with gamification, plan the exit ramp (identity > points after 60 days)
8. Leverage if-then planning in habit setup

---

## 22. Component Inventory

### SwiftUI Views

```
REALM TAB:
  RealmView, AvatarStageView, HabitsDrawerView, StatPill, ProgressBarView, MoodLabel, SpeechBubbleOverlay

HABITS TAB:
  HabitsListView, HabitDetailView, HabitFormView, HabitCardView, HabitCheckbox, StreakBadge

PROGRESS TAB:
  ProgressView, StreakCardView, HeatmapView, MilestoneListView, MilestoneBadge, DailyLogView, MoodSelector, ConsistencyScoreCard, ResilienceScoreCard

MENU TAB:
  MenuView, ProfileView, ShopView, ShopItemDetailView, SettingsView, AvatarEditorView, WardrobeView, AchievementListView, NicheSwitcherView

ONBOARDING:
  OnboardingFlow, WelcomeView, NameInputView, NicheSelectionView, AvatarCreatorView, HabitSetupView, GoalPickerView, PermissionsView, RevealTransitionView

REFLECTION:
  ReflectionSheetView, ReasonSelectorView, MicroActionView, AdjustmentView

SHARED:
  CompoundButton, ToastView, CoinAnimationView, BottomSheetContainer, PixelText (Press Start 2P wrapper)
```

### SpriteKit Nodes

```
AvatarScene (SKScene), AvatarSpriteNode (SKSpriteNode), BackgroundNode, ParticleManager, AvatarAnimator
```

### Widget Views

```
CompoundWidget, WidgetEntryView, SmallWidgetView, MediumWidgetView
```

---

## 23. Development Roadmap

| Phase | Name | Duration | Key Deliverables |
|-------|------|----------|-----------------|
| 1 | Design + Sprite Production | 6 weeks | Hi-fi Figma designs. Commission pixel artist for full sprite set (10 animations, 3 niche variants). Colour palettes. `.sks` particle files. Widget layouts. |
| 2 | Core App Build | 14 weeks | Xcode project with SwiftUI navigation. SpriteKit AvatarScene with all states + animations. Habit engine (CRUD, streaks, completion). SwiftData models + Supabase sync. Token economy. Push notifications. |
| 3 | Polish + Beta | 6 weeks | Onboarding flow (7 steps). Widget (small + medium). Background system (time-of-day + state). StoreKit 2 integration. Performance audit (60fps, battery). Closed beta (100 users). |
| 4 | Launch | 4 weeks | App Store assets. Accessibility review. Privacy policy. TestFlight public beta. App Store submission. TikTok/IG launch content (avatar clips). |
| 5 | Post-Launch | Ongoing | Goal Journey (P2). Additional niches. Social features (P3). Android (P4). AI reflection engine. |

### Immediate Next Actions

1. Lock Swift project setup in Xcode with SpriteKit + SwiftUI template
2. Commission pixel artist with §5's animation requirements
3. Build AvatarScene prototype with idle + coffee + slacking states
4. Set up Supabase project with SwiftData sync scaffold
5. Implement Realm tab layout with placeholder sprites

---

*COMPOUND · Architecture Reference v2.0 · March 2026 · Confidential*
*This file is the single source of truth for Claude Code development.*
