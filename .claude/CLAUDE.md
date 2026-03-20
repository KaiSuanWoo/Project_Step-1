# COMPOUND — Project Instructions

> Single source of truth for Claude Code. Detailed architecture spec: `.claude/COMPOUND_SPEC.md`

## Stack

- Native Swift (iOS-first), SwiftUI + SpriteKit
- `NavigationStack` (type-safe navigation)
- `@Observable` (Observation framework for state management)
- SwiftData (offline-first local persistence)
- Supabase Swift SDK (auth, Postgres, Storage, Realtime)
- Stripe via SFSafariViewController + Supabase Edge Function webhook
- PostHog Swift SDK (analytics)
- APNs + `UserNotifications` (push notifications)
- WidgetKit (home screen widget)
- Xcode Cloud or Fastlane (CI/CD)

## Project Structure

```
Compound/
  App/
    CompoundApp.swift              — @main, scene config, SwiftData container
    ContentView.swift              — Root TabView
  Features/
    Realm/                         — Home: avatar stage + habits drawer
    Habits/                        — Habit CRUD, detail, reorder
    Progress/                      — Streaks, heatmap, milestones
    Menu/                          — Profile, shop, settings hub
    Onboarding/                    — 7-step FTUE
    Reflection/                    — Missed-habit check-in sheets
  Core/
    Models/                        — SwiftData @Model entities
    Services/                      — HabitEngine, CoinService, SyncService, etc.
    ViewModels/                    — @Observable view models
  Avatar/
    Sprites/                       — .atlas directories (idle.atlas/, coffee.atlas/, etc.)
    Particles/                     — .sks particle files (stars, confetti, dust, etc.)
    AvatarAnimator.swift           — Animation sequencing
    AvatarSpriteNode.swift         — Main character SKSpriteNode
    BackgroundNode.swift           — Gradient + parallax layers
    ParticleManager.swift          — State-based particle management
  Design/
    Theme.swift                    — All colour tokens, spacing, typography
    Components/                    — CompoundButton, HabitCardView, StatPill, etc.
  Widget/
    CompoundWidget.swift           — WidgetKit TimelineProvider
    WidgetViews.swift              — Small + Medium layouts
  Resources/
    Fonts/PressStart2P-Regular.ttf
```

## Key Conventions

- Views in `Features/` grouped by tab
- ViewModels use `@Observable` (not `ObservableObject`) in `Core/ViewModels/`
- SwiftData `@Model` entities in `Core/Models/`
- Services in `Core/Services/` — business logic, sync, notifications
- Design tokens in `Design/Theme.swift` — all colours, spacing, typography as Swift constants
- Supabase config via Xcode `.xcconfig` files — never hardcoded in Swift source
- `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` are server-only (Supabase Edge Functions) — never in client code

## Navigation (4 tabs)

- **Realm** — avatar stage (55% screen) + HUD (coins, streak, level) + habits drawer (30%)
- **Habits** — habit CRUD, reorder, filter (All/Active/Paused)
- **Progress** — streak cards, monthly heatmap, milestones, consistency/resilience scores
- **Menu** — hub linking to: Profile, Shop, Settings, Help

Tab bar: pixel icon for Realm, SF Symbols for others. Active = `#FFD166` gold, inactive = `#8888A0`.

## Naming

- Swift files: PascalCase (`HabitDetailView.swift`)
- ViewModels: PascalCase + `ViewModel` suffix (`RealmViewModel.swift`)
- Models: PascalCase (`Habit.swift`)
- Services: PascalCase + `Service` suffix (`CoinService.swift`)
- Enums/protocols: PascalCase

## Payments

- Stripe web checkout only (avoids Apple 30% cut)
- Flow: app → `SFSafariViewController` → Stripe Checkout → webhook → Supabase Edge Function → DB update → Realtime subscription unlocks premium
- Never handle card data in the app
- `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are Edge Function secrets only

## Do Not

- Never hardcode API keys or secrets in Swift source files
- Never use `ObservableObject` / `@Published` (use `@Observable` instead)
- Never use UIKit unless SwiftUI has no equivalent
- Never use `Timer` or `DispatchQueue` for sprite frame cycling (use SpriteKit `SKAction`)

---

## Design System — Single Cohesive System

Source of truth: `Design/Theme.swift`. One design language: **dark UI chrome + pixel avatar stage**.

### Colours

| Token | Value | Use |
|---|---|---|
| `background` | `#0D0D12` | Screen backgrounds |
| `surface` | `#1A1A24` | Cards, panels, drawers |
| `surfaceElevated` | `#24243A` | Modals, sheets |
| `borderSubtle` | `#2E2E45` | Dividers |
| `borderActive` | `#4A4A6A` | Focused elements |
| `accent` | `#FFD166` | Gold — coins, streaks, primary buttons |
| `green` | `#06D6A0` | Completions, success, health |
| `danger` | `#EF476F` | Missed habits, penalties |
| `info` | `#118AB2` | Informational, links |
| `xpPurple` | `#9B5DE5` | XP bar, levelling |
| `textPrimary` | `#F0F0F5` | Primary text |
| `textSecondary` | `#8888A0` | Muted text |
| `textDisabled` | `#4A4A5A` | Dim text |

### Typography

| Usage | Font | Sizes |
|---|---|---|
| Gamified headings (tab titles, streak, coins, level, celebrations) | Press Start 2P | 20/16/12 |
| Body, labels, buttons, descriptions | SF Pro (system) | 16/14/12 with weights .regular/.medium/.semibold |
| Numerical data (streak numbers, coin counts, timers, %) | SF Mono / JetBrains Mono | `.monospacedDigit()` |

### Component Tokens

- **Buttons:** Primary (bg accent, text #0D0D12, cornerRadius 12, padding 14×24), Secondary (transparent, border 1.5px borderActive), Danger (bg danger), Icon (44×44, circular cornerRadius 22)
- **Cards:** bg surface, border 1px borderSubtle, cornerRadius 14, padding 16
- **Bottom sheets:** bg surface, topCornerRadius 24, handle 40×4px borderActive
- **Toasts:** top position, bg surfaceElevated, border 1px borderSubtle, cornerRadius 12

### Iconography

- **Pixel icons** (16×16 rendered at 2×): coins, hearts, streaks — gamified elements
- **SF Symbols**: gear, chevron, bell, checkmark — standard UI navigation

### Rules

1. No hardcoded hex outside `Theme.swift`
2. `cornerRadius`: 12 buttons, 14 cards, 24 bottom sheets, 22 circular icons
3. Shadows allowed on elevated cards and primary buttons
4. No bevel borders anywhere
5. `.nearest` filtering mode on ALL `SKTexture` (critical for pixel art rendering)

---

## Character Portrait System

The avatar IS the app. It dominates the Realm tab home screen and reacts in real-time to habit behaviour.

### Avatar Stage Layers (SpriteKit)

5 layers composited back-to-front in `AvatarScene` (SKScene):

| # | Layer | Content |
|---|---|---|
| 1 | Background | Gradient fill (state + time of day), animated colour stops |
| 2 | Scene elements | Simple parallax silhouettes (bookshelf, window, plants) |
| 3 | Ambient glow | Soft radial glow behind avatar, colour matches mood |
| 4 | Avatar sprite | 64×64 character at 4×/8× scale with active animation |
| 5 | Particle overlay | Stars, confetti, steam, dust, Zzz (60fps SKEmitterNode) |

### Sprite Convention

- **Base size:** 64×64 pixels, displayed at 4× (256pt) standard, 8× Retina
- **Palette:** 24–32 colours per character, 4-tone shading for skin/hair
- **Frame rate:** 12fps (83ms per frame) — pixel art standard
- **Atlas format:** Xcode `.atlas` directories, one per animation
- **Filtering:** `.nearest` on all textures (pixelated rendering)
- **Sprites are commissioned** from a pixel artist, then imported as .atlas directories
- See `.claude/rules/sprite-animation.md` and `.claude/rules/pixel-art-standards.md` for full specs

### 8 Avatar States

| State | Trigger | Animation |
|---|---|---|
| `ACTIVE` | Habit logged in last 2hrs | Niche-specific (studying/lifting/coding) |
| `IDLE` | No activity 2–4hrs | Gentle breathing, periodic blink |
| `CELEBRATING` | All daily habits complete | Jump, arms raised, confetti |
| `COFFEE` | Morning / first habit of day | Sip cycle with steam |
| `SLACKING` | 4+hrs inactive, habit overdue | Slouched, scrolling phone |
| `SLEEPING` | 11pm–7am | Eyes closed, slow breathing, Zzz |
| `DEGRADED` | 3+ consecutive missed days | Sad, slouched, dust particles |
| `PEAK_FORM` | 7-day streak active | Golden glow, sparkle halo |

State resolution logic: see COMPOUND_SPEC.md §7.2.

### Background System

Procedural gradients — zero hand-drawn backgrounds. Gradients shift based on avatar state AND time of day (5 time windows). State overrides time-of-day when applicable.

### Key Files

- `Avatar/AvatarScene.swift` — SKScene: rendering, state transitions
- `Avatar/AvatarSpriteNode.swift` — Character sprite node
- `Avatar/AvatarAnimator.swift` — Animation sequencing, state choreography
- `Avatar/BackgroundNode.swift` — Gradient + parallax management
- `Avatar/ParticleManager.swift` — State-based particle creation/removal
- `Core/Services/AvatarStateResolver.swift` — Determines state from habit data + time

---

## Subagents

Subagents are lightweight agents (Sonnet) with self-contained contexts, defined in `.claude/agents/`. They're cheaper, unbiased (no parent context leakage), and keep the parent context clean.

### Available Subagents

| Agent | File | Purpose |
|---|---|---|
| `research` | `.claude/agents/research.md` | Explore codebase, identify files, patterns, and gaps before making changes |
| `code-reviewer` | `.claude/agents/code-reviewer.md` | Unbiased review: design system compliance, premium gates, security, Swift quality. Returns PASS/FAIL |
| `qa` | `.claude/agents/qa.md` | Generate manual QA checklist for all user flows on a screen or feature |
| `asset-validator` | `.claude/agents/asset-validator.md` | Cross-ref sprite atlas/particle references in code vs filesystem. Report missing/orphaned assets |

### Design & Build Workflow

When building or modifying any non-trivial screen or component, follow this loop:

1. **Research** — Spawn `research` subagent to map relevant files and patterns.
2. **Write/edit the code** — Make your changes.
3. **Code Review** — Spawn `code-reviewer` subagent with the changed file(s). It reports issues — does NOT fix.
4. **QA** — Spawn `qa` subagent with the screen. It generates a checklist — does NOT test.
5. **Fix** — The parent agent reads review + QA reports and applies all fixes.
6. **Ship** — Only after review passes and QA checklist is complete.

**Important:** Subagents are read-only reporters. All code changes happen in the parent agent.

**Parallel execution:** When reviewing + QA'ing independent files, spawn both subagents in parallel using `run_in_background: true`.

---

## Skills Available

| Skill | File | Command |
|---|---|---|
| `/deploy` | `.claude/skills/deploy.md` | Deploy Edge Functions to Supabase |
| `/check` | `.claude/skills/check.md` | Run Swift build check via xcodebuild |
| `/build` | `.claude/skills/build.md` | Full Xcode build for Simulator |
| `/db-push` | `.claude/skills/db-push.md` | Diff + push DB migrations (confirms before push) |
| `/commit` | `.claude/skills/commit.md` | Stage, commit, and push to GitHub with best practices |
| `/validate-assets` | `.claude/skills/validate-assets/SKILL.md` | Audit atlas/particle references vs filesystem |

---

## Rules Active

| Rule | File | Enforces |
|---|---|---|
| `theme` | `.claude/rules/theme.md` | Single design system: dark UI + pixel avatar stage |
| `premium-gates` | `.claude/rules/premium-gates.md` | isPro() gates, FREE_HABIT_LIMIT=3, Paywall trigger prop |
| `security` | `.claude/rules/security.md` | Secrets in Edge Functions only, xcconfig for client config |
| `sprite-animation` | `.claude/rules/sprite-animation.md` | SpriteKit .atlas, SKAction, 12fps, no Timer |
| `pixel-art-standards` | `.claude/rules/pixel-art-standards.md` | 64×64 portrait sprites, 24-32 colour palette, quality standards |

---

## Screenshot QA Loop (Simulator)

When building or modifying any UI screen/component, use this visual QA loop to verify output matches the design reference.

### Prerequisites

- Xcode project builds successfully
- Simulator booted or available
- Screenshots folder: `temporary-screenshots/` (gitignored)

### Naming Convention

```
temporary-screenshots/{screen}-{component}-{variant}-{timestamp}.png
```

### Workflow Steps

**1. Capture** — Take a screenshot via Simulator:
```bash
xcrun simctl io booted screenshot temporary-screenshots/SCREEN-COMPONENT-VARIANT-$(date +%s).png
```

**2. Read** — Use the `Read` tool to view the saved screenshot.

**3. Compare** — Analyze against the design reference:

| Property | What to check |
|---|---|
| **Colours** | Extract and compare every visible colour to Theme.swift tokens. Exact match required. |
| **Typography** | Press Start 2P on gamified headings, SF Pro on body. Correct sizes and weights. |
| **Corner radius** | 12 buttons, 14 cards, 24 sheets. No mismatches. |
| **Spacing** | Measure gaps. Flag ±2px drift from spec. |
| **Shadows** | Present only on elevated cards/buttons. None elsewhere. |
| **Alignment** | Verify center/left/right, flex distribution, vertical centering. |
| **Avatar stage** | Pixel art crisp (no blurring), particles visible, gradient correct. |

**4. Fix** — If ANY property is off, fix the code and re-capture. Do NOT ship until match.

**5. Cleanup** — Delete old screenshots. Keep only the final passing one.

### Rules

- Always capture at Retina resolution
- Use iPhone 15 Pro Simulator (393×852 logical)
- Wait for UI to settle before capturing
- Report discrepancies as: `| Element | Expected | Actual | Fix |`

---

## Operating Principles

**1. Research before changing**
For any non-trivial change, spawn `research` first to understand what exists. Don't modify files you haven't read.

**2. Self-anneal when things break**
- Read the error message and stack trace
- Fix the code and test it
- If a pattern was wrong, update the relevant agent or rule file

**3. Design system compliance is non-negotiable**
Single dark UI system everywhere. Pixel art rendering uses `.nearest` filtering in SpriteKit only. Run `code-reviewer` on any UI file before shipping.

**4. Premium gates on every premium path**
Free users get 3 habits. Every premium feature must call `isPro()`. Paywall always gets a `trigger` parameter. No exceptions.

**5. Secrets never leave Edge Functions**
`SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET` are server-only. If you see them in client code, that's a critical security issue — fix immediately.

**6. Refer to COMPOUND_SPEC.md for detailed specs**
This file covers conventions and rules. For detailed screen layouts, animation specs, data models, psychology principles, onboarding flow, token economy — see `.claude/COMPOUND_SPEC.md`.
