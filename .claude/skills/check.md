# /check

Run TypeScript type checking across the app (excluding Supabase Edge Functions).

## Command

```bash
npx tsc --noEmit
```

## Output format
For each error, print:
```
FILE:LINE TS[code]: message
```

## Notes
- `supabase/**` is excluded via `tsconfig.json` — Deno Edge Functions are not checked here.
- Target: **0 errors** before any PR or deployment.
- Common issues to look for:
  - `ViewStyle` cast missing when spreading theme fragments into `StyleSheet.create`
  - Missing `as const` on style objects
  - Incorrect Expo Router param types (`useLocalSearchParams<{ id: string }>`)
  - Import path aliases (`@/`) not resolving
