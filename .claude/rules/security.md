# Security Rule

## Secrets Management

### Server-only secrets (Edge Functions ONLY)
These must **never** appear in client-side Swift code:
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

They are only accessible inside `supabase/functions/` (Deno runtime).

### Client configuration
Client-accessible values must be stored in Xcode `.xcconfig` files, never hardcoded in Swift source:
```
SUPABASE_URL
SUPABASE_ANON_KEY
STRIPE_PUBLISHABLE_KEY
POSTHOG_KEY
```

Access via `Info.plist` → `Bundle.main.infoDictionary` or a dedicated `Config.swift` that reads from the plist.

Never hardcode these values as string literals in Swift files. Never commit `.xcconfig` files containing real secrets to version control.

## Logging
Never `print()` or `os_log()` sensitive data:
```swift
// FORBIDDEN
print("session: \(session)")
print("user: \(user)")
print("token: \(token)")
```

Use generic non-sensitive log messages or remove logs entirely before commit.

## Supabase Client
Always use a singleton Supabase client. Never create a new `SupabaseClient` with the service role key in client code.

## Input Validation
- Validate user input in ViewModels before sending to Supabase.
- Use Supabase RLS as the authoritative access control layer — client-side checks are UX only.
