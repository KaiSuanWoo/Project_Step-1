# /build

Full Xcode build for the COMPOUND iOS app targeting Simulator.

## Command

```bash
xcodebuild -scheme Compound -destination 'platform=iOS Simulator,name=iPhone 17 Pro' build 2>&1
```

## Pre-flight checks
1. Verify `Compound.xcodeproj` (or `.xcworkspace`) exists in the project root.
2. Verify the `Compound` scheme exists: `xcodebuild -list`
3. Verify a compatible Simulator is available: `xcrun simctl list devices available`

## Post-build
- Report build result (SUCCEEDED / FAILED)
- If failed, extract and display all error lines (`error:` prefix)
- Count warnings and report summary

## Common Issues
- Missing protocol conformance: `Type does not conform to protocol 'X'`
- `@Observable` macro: ensure using `@Observable` not `ObservableObject`
- SwiftData `@Model` relationships: check inverse relationships
- Missing `.nearest` filtering on SKTexture: pixel art will appear blurry
- NavigationStack path type mismatches
- Missing font registration in Info.plist for Press Start 2P
