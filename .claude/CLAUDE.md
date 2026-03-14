# Step 1 — Project Instructions

## Stack
- React Native + Expo SDK 55, TypeScript
- Expo Router (file-based navigation)
- Zustand (state management)
- React Native Reanimated 3 + React Native Skia (pixel art avatar & environment)
- Supabase (auth, Postgres, Storage, Realtime)
- Stripe via web checkout + Supabase Edge Function webhook
- PostHog (analytics)
- EAS Build + EAS Submit (CI/CD)

## Key Conventions
- All screens live in `app/` using Expo Router file-based routing
- Components in `components/` — domain-grouped (`avatar/`, `environment/`, `habits/`, `progress/`, `shop/`, `ui/`, `onboarding/`)
- Zustand stores in `store/` — one file per domain (`useUserStore`, `useHabitStore`, `useAvatarStore`, `useCoinStore`, `useShopStore`, `useGoalStore`)
- Supabase client singleton in `lib/supabase.ts`
- Streak/reward/coin logic in `lib/` utilities
- Environment variables accessed via `process.env.EXPO_PUBLIC_*` (public) — never import `.env` directly
- `SUPABASE_SERVICE_ROLE_KEY` and `STRIPE_SECRET_KEY` are server-only (Supabase Edge Functions) — never expose in client code

## Navigation (4 tabs)
- **Realm** — full-screen immersive environment with avatar + overlaid stats (coins, streak) + swipe-up habits drawer
- **Habits** — habit CRUD, detail, weekly goals
- **Progress** — streak calendar, heatmap, daily log, milestones, goals
- **Menu** (hamburger icon) — hub screen with links to:
  - **Profile** — user stats, avatar state, account info (stack screen)
  - **Shop** — outfits, decor, power-ups / coin economy (stack screen)
  - **Inventory** — owned items, equip/unequip (stack screen)
  - **About** — app info, credits, legal (stack screen)
  - **Settings** — notifications, account, sign out (stack screen)

## Naming
- Screen files: kebab-case (`habit-detail.tsx`)
- Components: PascalCase (`HabitCard.tsx`)
- Stores: camelCase (`useHabitStore.ts`)
- Utility functions: camelCase

## Payments
- Stripe web checkout only (no StoreKit/RevenueCat)
- Flow: app → Expo WebBrowser → Stripe Checkout → webhook → Supabase Edge Function → DB update → Realtime unlock
- Never handle card data in the app

## Do Not
- Never hardcode API keys or secrets in source files
- Never use class components
- Never use Redux (Zustand only)

---

## Design System — Dual System (Modern Chrome + Pixel Art)

Source of truth: `constants/Theme.ts`. The app uses TWO design languages:

### Modern Chrome (all app screens, cards, buttons, inputs)
- **Colors:** `modern.*` namespace — `modern.background` (#0D0D12), `modern.surface` (#1A1A24), `modern.accent` (#FFD166 gold), `modern.green` (#06D6A0), `modern.danger` (#EF476F)
- **Text:** `modern.textPrimary` (#F0F0F5), `modern.textSecondary` (#8888A0)
- **Border radius:** 12–14px via `modernRadius.md` / `modernRadius.lg`
- **Shadows:** allowed via `modernCardElevated` and `modernButton` fragments
- **Borders:** flat 1px with `modern.borderSubtle` — NO bevel borders
- **Fonts:** `fonts.pixelHeading` (Press Start 2P) for gamified headings, `fonts.body` (SpaceMono) for body/labels

### Pixel/Terraria (environment container + avatar ONLY)
- **Colors:** `colors.*` namespace — only in `components/environment/` and `components/avatar/`
- **Border radius:** ≤ 4 via `radius.pixel` (2) or `radius.small` (4)
- **Bevel borders:** required — `borderTopColor/borderLeftColor = colors.borderLight`, `borderBottomColor/borderRightColor = colors.borderDark`
- **No shadows** inside pixel components
- **Font:** `fonts.display` (VT323) for in-environment text

### Key Tokens
| Token | Value | Use |
|---|---|---|
| `modern.background` | `#0D0D12` | Screen backgrounds |
| `modern.surface` | `#1A1A24` | Cards/panels |
| `modern.accent` | `#FFD166` | Gold — coins, streaks, primary buttons |
| `modern.green` | `#06D6A0` | Completions, success |
| `modern.danger` | `#EF476F` | Errors, missed habits |
| `modern.textPrimary` | `#F0F0F5` | Primary text |
| `modern.textSecondary` | `#8888A0` | Secondary text |

### Modern Style Spreading
```typescript
import { modernCard, modern } from '@/constants/Theme';
const styles = StyleSheet.create({
  card: { ...modernCard, padding: 16 },
});
```

---

## Subagents

Subagents are lightweight agents (Sonnet) with self-contained contexts, defined in `.claude/agents/`. They're cheaper, unbiased (no parent context leakage), and keep the parent context clean.

### Available Subagents

| Agent | File | Purpose |
|---|---|---|
| `research` | `.claude/agents/research.md` | Explore codebase, identify files, patterns, and gaps before making changes |
| `code-reviewer` | `.claude/agents/code-reviewer.md` | Unbiased review: dual theme compliance, premium gates, security, TypeScript. Returns PASS/FAIL. |
| `qa` | `.claude/agents/qa.md` | Generate manual QA checklist for all user flows on a screen or feature |

### Design & Build Workflow

When building or modifying any non-trivial screen or component, follow this loop:

1. **Research** — Spawn `research` subagent to map relevant files and patterns. Avoids making changes blind.
2. **Write/edit the code** — Make your changes.
3. **Code Review** — Spawn `code-reviewer` subagent with the changed file(s). It reports issues back — it does NOT fix anything itself.
4. **QA** — Spawn `qa` subagent with the screen. It generates a checklist — it does NOT test anything itself.
5. **Fix** — The parent agent (you) reads the review and QA reports and applies all fixes.
6. **Ship** — Only after review passes and QA checklist is complete.

**Important:** Subagents are read-only reporters. All code changes happen in the parent agent.

**Parallel execution:** When reviewing + QA'ing independent files, spawn both subagents in parallel using `run_in_background: true`.

---

## Skills Available

| Skill | File | Command |
|---|---|---|
| `/deploy` | `.claude/skills/deploy.md` | Deploy Edge Functions to Supabase |
| `/check` | `.claude/skills/check.md` | Run `npx tsc --noEmit` type check |
| `/db-push` | `.claude/skills/db-push.md` | Diff + push DB migrations (confirms before push) |
| `/commit` | `.claude/skills/commit.md` | Stage, commit, and push to GitHub with best practices |

---

## Rules Active

| Rule | File | Enforces |
|---|---|---|
| `theme` | `.claude/rules/theme.md` | Dual design system: modern chrome + pixel (environment/avatar only) |
| `premium-gates` | `.claude/rules/premium-gates.md` | isPremium() gates, FREE_HABIT_LIMIT=3, Paywall trigger prop |
| `security` | `.claude/rules/security.md` | Secrets in Edge Functions only, no console.log of sensitive data |

---

## Operating Principles

**1. Research before changing**
For any non-trivial change, spawn `research` first to understand what exists. Don't modify files you haven't read.

**2. Self-anneal when things break**
- Read the error message and stack trace
- Fix the code and test it
- If a pattern was wrong, update the relevant agent or rule file
- System is now stronger

**3. Dual theme compliance is non-negotiable**
Modern chrome on all screens. Pixel/Terraria ONLY inside environment container and avatar. Run `code-reviewer` on any UI file before shipping.

**4. Premium gates on every premium path**
Free users get 3 habits. Every premium feature must call `isPremium()`. Paywall always gets a `trigger` prop. No exceptions.

**5. Secrets never leave Edge Functions**
`SUPABASE_SERVICE_ROLE_KEY` and `STRIPE_SECRET_KEY` are server-only. If you see them in client code, that's a critical security issue — fix immediately.
