# /commit

Commit and push all staged changes to GitHub following best practices.

## Steps

1. **Check status** — Run `git status` to see all changes. Review what will be committed.
2. **Stage files** — Add relevant files by name (prefer specific files over `git add -A`). Never stage `.env`, credentials, or secrets files.
3. **Diff review** — Run `git diff --cached` to verify staged changes look correct.
4. **Commit message** — Write a concise, descriptive commit message:
   - Format: `type: short description` (e.g., `feat: add menu tab with profile/shop/inventory`, `fix: resolve TextInput style type errors`)
   - Types: `feat`, `fix`, `refactor`, `style`, `chore`, `docs`, `test`
   - Focus on the "why" not the "what"
   - Include `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>` on a new line
5. **Push** — Push to the current branch with `git push -u origin <branch>`.
6. **Verify** — Run `git status` to confirm clean working tree.

## Safety Rules
- Never force push (`--force`) without explicit user confirmation
- Never push directly to `main` or `master` — create a feature branch first if on main
- Never commit files containing secrets (`.env`, `*.key`, credentials)
- Never use `--no-verify` to skip hooks
- Always review the diff before committing
- If on `main`, ask the user if they want to create a feature branch first

## Branch Naming
If creating a new branch, use: `feat/<short-description>`, `fix/<short-description>`, or `chore/<short-description>`

## Example
```bash
git add app/(tabs)/menu.tsx app/shop.tsx app/profile.tsx
git commit -m "feat: replace shop tab with menu hub

Adds profile, inventory, and about screens accessible from menu tab.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
git push -u origin feat/menu-tab
```
