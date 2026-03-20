# Premium Gates Rule

All premium features must be gated with `isPro()` from the User model or a shared helper.

## Constants
```swift
let FREE_HABIT_LIMIT = 3  // defined per-screen, not globally exported
```

## Subscription Status
```swift
enum SubscriptionStatus: String, Codable {
    case free, pro, proTrial
}
```

## Paywall Trigger Points
| Feature | Trigger condition | `trigger` parameter |
|---|---|---|
| 4th habit | `habits.count >= FREE_HABIT_LIMIT && !isPro()` | `"Free accounts are limited to 3 habits"` |
| Theme unlock | On background theme purchase attempt | `"Unlock all themes with Premium"` |
| Avatar customisation | On outfit/accessory tap | `"Unlock avatar customisation with Premium"` |
| Unlimited log history | On log view > 7 days | `"See your full history with Premium"` |

## Rules
1. Always call `isPro()` before rendering or executing any premium-only action.
2. Always pass a descriptive `trigger` string to the Paywall sheet.
3. Never hardcode `subscriptionStatus == .pro` inline — use `isPro()`.
4. `FREE_HABIT_LIMIT = 3` — never change this without updating all references.
5. Paywall must be presented as a SwiftUI sheet (not just an `Alert`) so the user can see pricing.

## isPro Implementation
```swift
// On User model or a shared helper
func isPro() -> Bool {
    guard let user = currentUser else { return false }
    switch user.subscriptionStatus {
    case .pro, .proTrial:
        return true
    case .free:
        return false
    }
}
```

## Paywall Flow
1. User triggers a premium feature
2. `PaywallSheet(trigger:)` is presented as a `.sheet` modifier
3. User taps a plan → `SFSafariViewController` opens Stripe Checkout
4. Stripe webhook → Supabase Edge Function → updates `users.subscription_status`
5. Supabase Realtime subscription picks up the change → UI unlocks
