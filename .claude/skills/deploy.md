# /deploy

Deploy Supabase Edge Functions to the COMPOUND project (`mbuzsleiifqxpmiergev`).

## Commands

```bash
supabase functions deploy create-checkout-session --project-ref mbuzsleiifqxpmiergev
supabase functions deploy stripe-webhook --project-ref mbuzsleiifqxpmiergev
supabase functions deploy calculate-streak-bonus --project-ref mbuzsleiifqxpmiergev
supabase functions deploy validate-purchase --project-ref mbuzsleiifqxpmiergev
```

## Pre-flight checks
1. Confirm Edge Function directories exist under `supabase/functions/` and compile (no obvious syntax errors).
2. Warn if `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, or `SUPABASE_SERVICE_ROLE_KEY` are not set as Supabase secrets.
3. Never log secret values — only confirm presence.

## Post-deploy
- Confirm all deployed functions show `ACTIVE` status.
- Remind user to test the webhook with `stripe trigger checkout.session.completed`.
