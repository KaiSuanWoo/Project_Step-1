# /check

Run Swift build check to verify the project compiles without errors.

## Command

```bash
xcodebuild -scheme Compound -destination 'platform=iOS Simulator,name=iPhone 17 Pro' build 2>&1 | tail -50
```

## Output format
For each error, identify:
```
FILE:LINE: error: message
```

## Notes
- `supabase/**` Edge Functions (Deno/TypeScript) are not checked here.
- Target: **0 errors** before any PR or deployment.
- Common issues to look for:
  - Missing protocol conformance (`Type does not conform to protocol`)
  - `@Observable` macro issues (using `@Published` instead)
  - SwiftData `@Model` relationship errors
  - NavigationStack type-safe path mismatches
  - Missing imports or unresolved identifiers
  - `Theme.swift` token references that don't exist
