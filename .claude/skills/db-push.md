# /db-push

Safely push database migrations to the Step 1 Supabase project.

## Process

### Step 1 — Diff first (always)
```bash
supabase db diff --project-ref mbuzsleiifqxpmiergev
```
Show the diff to the user and **wait for explicit confirmation** before proceeding.

### Step 2 — Push (only after confirmation)
```bash
supabase db push --project-ref mbuzsleiifqxpmiergev
```

## Safety Rules
- Never run `db push` without showing the diff first.
- Never push destructive migrations (DROP TABLE, DROP COLUMN) without a double-confirmation warning.
- Remind user to back up production data before destructive changes.
- If the diff is empty, inform the user — do not push.

## Migration file location
`supabase/migrations/` — numbered sequentially (`001_initial_schema.sql`, `002_...`, etc.)
