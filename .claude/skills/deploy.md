# /deploy

Deploy Supabase Edge Functions to the Step 1 project (`mbuzsleiifqxpmiergev`).

## Commands

```bash
supabase functions deploy create-checkout-session --project-ref mbuzsleiifqxpmiergev
supabase functions deploy stripe-webhook --project-ref mbuzsleiifqxpmiergev
```

## Pre-flight checks
1. Confirm `supabase/functions/create-checkout-session/index.ts` and `stripe-webhook/index.ts` exist and compile (no obvious syntax errors).
2. Warn if `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` are not set as Supabase secrets.
3. Never log secret values — only confirm presence.

## Post-deploy
- Confirm both functions show `ACTIVE` status.
- Remind user to test the webhook with `stripe trigger checkout.session.completed`.
