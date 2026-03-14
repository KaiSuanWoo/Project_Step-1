# Premium Gates Rule

All premium features must be gated with `isPremium()` from `useUserStore`.

## Constants
```typescript
const FREE_HABIT_LIMIT = 3; // defined per-screen, not globally exported
```

## Paywall Trigger Points
| Feature | Trigger condition | `trigger` prop |
|---|---|---|
| 4th habit | `habits.length >= FREE_HABIT_LIMIT && !isPremium()` | `"Free accounts are limited to 3 habits"` |
| Theme unlock | On theme selection attempt | `"Unlock all themes with Premium"` |
| Avatar customisation | On outfit/accessory tap | `"Unlock avatar customisation with Premium"` |
| Unlimited log history | On log view > 7 days | `"See your full history with Premium"` |

## Rules
1. Always call `isPremium()` before rendering or executing any premium-only action.
2. Always pass a descriptive `trigger` string to `<Paywall trigger="..." />`.
3. Never hardcode `subscription_status === 'active'` inline — use `isPremium()`.
4. `FREE_HABIT_LIMIT = 3` — never change this without updating all references.
5. Paywall component must always be rendered (not just imperative `Alert`) so the user can see pricing.

## isPremium Implementation
Defined in `store/useUserStore.ts`:
```typescript
isPremium: () => {
  const u = get().user;
  return u?.subscription_status === 'active' &&
    (!u.subscription_expires_at || new Date(u.subscription_expires_at) > new Date());
}
```
