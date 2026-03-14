# Theme Rule — Dual Design System

The Step 1 app uses a **dual design system** defined in `constants/Theme.ts`:
- **Modern chrome** — all app screens, cards, buttons, inputs, navigation
- **Pixel/Terraria** — ONLY inside `components/environment/` and `components/avatar/`

## Modern Chrome Rules (default — applies everywhere)

1. **No hardcoded hex** outside `constants/Theme.ts`. Import from `modern.*` or `colors.*`.
2. **`borderRadius` 12–14** for cards/buttons. Use `modernRadius.md` (12) or `modernRadius.lg` (14). Never use 2 or 4 outside pixel components.
3. **Subtle shadows allowed** on elevated cards and primary buttons — use `modernCardElevated` or `modernButton` fragments.
4. **Colors from `modern.*`** namespace: `modern.background`, `modern.surface`, `modern.accent`, `modern.green`, `modern.danger`, `modern.textPrimary`, etc.
5. **Fonts from tokens only:**
   - `fonts.pixelHeading` (Press Start 2P) — gamified headings: streak counts, coin balance, tab titles, celebration text
   - `fonts.body` (SpaceMono) — body text, labels, buttons, descriptions
6. **No bevel borders** outside pixel components — use flat `borderColor: modern.borderSubtle` with 1px width.

### Modern Style Spreading
```typescript
import { modernCard, modern } from '@/constants/Theme';
const styles = StyleSheet.create({
  card: { ...modernCard, padding: 16 },
});
```

## Pixel/Terraria Rules (environment + avatar ONLY)

These rules apply **exclusively** to files in `components/environment/` and `components/avatar/`:

1. **`borderRadius` ≤ 4** — use `radius.pixel` (2) or `radius.small` (4)
2. **Bevel borders required** on panels: `borderTopColor/borderLeftColor = colors.borderLight`, `borderBottomColor/borderRightColor = colors.borderDark`
3. **No shadows** — no `shadowColor`, `shadowOpacity`, `shadowRadius`, or `elevation`
4. **Colors from `colors.*`** namespace (the pixel palette)
5. **Fonts:** `fonts.display` (VT323) for in-environment text

### Pixel Style Spreading
```typescript
import { terrariaPanel } from '@/constants/Theme';
import { ViewStyle } from 'react-native';
const styles = StyleSheet.create({
  panel: { ...terrariaPanel, padding: 8 } as ViewStyle,
});
```

## Active State Pattern
```typescript
// Modern active state
style={[styles.card, isSelected && { borderColor: modern.accent }]}

// Pixel active state (environment only)
style={[styles.slot, isSelected && terrariaActive]}
```
