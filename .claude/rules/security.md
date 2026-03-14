# Security Rule

## Secrets Management

### Server-only secrets (Edge Functions ONLY)
These must **never** appear in client-side React Native code:
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

They are only accessible inside `supabase/functions/` (Deno runtime).

### Client environment variables
All client-accessible env vars must use the `EXPO_PUBLIC_` prefix:
```
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY
EXPO_PUBLIC_POSTHOG_KEY
```

Never use `process.env.STRIPE_SECRET_KEY` or similar in `app/`, `components/`, `store/`, or `lib/` files.

## Logging
Never `console.log` sensitive data:
```typescript
// FORBIDDEN
console.log('session:', session);
console.log('user:', user);
console.log('token:', token);
```

Use generic non-sensitive log messages or remove logs entirely before commit.

## Supabase Client
Always use the singleton from `lib/supabase.ts`. Never create a new `createClient()` with the service role key in client code.

## Input Validation
- Validate user input at screen boundaries before sending to Supabase.
- Use Supabase RLS as the authoritative access control layer — client-side checks are UX only.
