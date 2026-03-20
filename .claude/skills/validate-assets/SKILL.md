# /validate-assets

Audit all sprite atlas and particle file references in code against the actual filesystem. Reports missing and orphaned assets.

## When to Use

- After importing new sprite assets from the pixel artist
- After changing `AvatarAnimator.swift`, `AvatarState.swift`, or `ParticleManager.swift`
- Before shipping any avatar or SpriteKit changes

## Workflow

### 1. Find All Code References

Search for atlas and particle references:

```
Grep: pattern="SKTextureAtlas\\(named:" glob="Compound/**/*.swift"
Grep: pattern="\\.sks" glob="Compound/**/*.swift"
```

Also read these files specifically:
- `Compound/Avatar/AvatarAnimator.swift`
- `Compound/Core/Models/AvatarState.swift` (for `atlasName` mapping)
- `Compound/Avatar/ParticleManager.swift`

### 2. Verify Each Reference

For each `SKTextureAtlas(named: "xyz")` reference:
- Glob for `Compound/Avatar/Sprites/xyz.atlas/`
- Check the directory exists and contains PNG frames
- Record if missing

For each `.sks` particle reference:
- Glob for the `.sks` file in `Compound/Avatar/Particles/`
- Record if missing

### 3. Find Orphaned Assets

```
Glob: pattern="Compound/Avatar/Sprites/*.atlas"
Glob: pattern="Compound/Avatar/Particles/*.sks"
```

Compare against the set of referenced assets. Any asset not referenced = orphan.

### 4. Report

Output a structured report:

```
## Asset Validation Report

### Missing (referenced but not on disk)
| Asset | Type | Referenced In | Impact |
|-------|------|--------------|--------|

### Orphaned (on disk but not referenced)
| Asset | Type | Notes |
|-------|------|-------|

### Summary
- Referenced: X assets
- Missing: Y assets
- Orphaned: Z assets
```

## Success Criteria

- **0 missing assets** = PASS
- Any missing asset = FAIL (blocks shipping)
- Orphaned assets are warnings, not blockers

## Known Issues

_(This section grows as issues are discovered during use)_
