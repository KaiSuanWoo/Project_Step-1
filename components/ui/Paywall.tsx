import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/useUserStore';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import {
  ActivityIndicator, Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {
  modern, fonts, fontSizes, spacing, modernRadius,
  modernCard, modernButton,
} from '@/constants/Theme';

interface Plan {
  key: 'monthly' | 'annual' | 'lifetime';
  label: string;
  price: string;
  sub: string;
  badge?: string;
}

const PLANS: Plan[] = [
  { key: 'annual', label: 'Annual', price: '$29.99', sub: '$2.50 / month', badge: 'Best Value' },
  { key: 'monthly', label: 'Monthly', price: '$4.99', sub: 'per month' },
  { key: 'lifetime', label: 'Lifetime', price: '$59.99', sub: 'one-time' },
];

const STRIPE_PRICE_IDS: Record<string, string> = {
  monthly: 'prod_U6qudAeaVeCUlw',
  annual: 'prod_U7X6qd6i0AcC2t',
  lifetime: 'prod_U6qw7yZg52cvzy',
};

interface PaywallProps {
  visible: boolean;
  onClose: () => void;
  trigger?: string;
}

export default function Paywall({ visible, onClose, trigger }: PaywallProps) {
  const { user } = useUserStore();
  const [selected, setSelected] = useState<Plan['key']>('annual');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          price_id: STRIPE_PRICE_IDS[selected],
          user_id: user.id,
          email: user.email,
          tier: selected,
          success_url: 'step1://premium-success',
          cancel_url: 'step1://premium-cancel',
        },
      });
      if (error) throw error;

      const result = await WebBrowser.openAuthSessionAsync(data.url, 'step1://');
      if (result.type === 'success') {
        Alert.alert('Welcome to Premium!', 'Your account has been upgraded.');
        onClose();
      }
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Could not start checkout. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>

        <Text style={styles.headline}>Unlock Step 1 Premium</Text>
        {trigger && <Text style={styles.trigger}>{trigger}</Text>}

        <View style={styles.perks}>
          {[
            'Unlimited habits',
            'All themes & avatar outfits',
            'Unlimited log history',
            'Home screen widget',
            'AI reflection (coming soon)',
          ].map((perk) => (
            <View key={perk} style={styles.perkRow}>
              <Text style={styles.perkCheck}>✓</Text>
              <Text style={styles.perkText}>{perk}</Text>
            </View>
          ))}
        </View>

        <View style={styles.plans}>
          {PLANS.map((plan) => (
            <TouchableOpacity
              key={plan.key}
              style={[styles.planCard, selected === plan.key && styles.planCardSelected]}
              onPress={() => setSelected(plan.key)}
            >
              <View style={styles.planLeft}>
                <Text style={[styles.planLabel, selected === plan.key && styles.planLabelSelected]}>
                  {plan.label}
                </Text>
                <Text style={styles.planSub}>{plan.sub}</Text>
              </View>
              <View style={styles.planRight}>
                {plan.badge ? (
                  <View style={styles.planBadge}>
                    <Text style={styles.planBadgeText}>{plan.badge}</Text>
                  </View>
                ) : null}
                <Text style={styles.planPrice}>{plan.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.ctaBtn, loading && styles.ctaBtnDisabled]}
          onPress={handleSubscribe}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={modern.background} />
            : <Text style={styles.ctaBtnText}>
                {selected === 'lifetime' ? 'Buy Lifetime Access' : 'Start Subscription'}
              </Text>
          }
        </TouchableOpacity>

        <Text style={styles.legal}>
          Payment processed securely via Stripe. Cancel anytime in your account settings.
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: modern.background, padding: spacing.xl },
  closeBtn: { alignSelf: 'flex-end', padding: spacing.sm },
  closeBtnText: { color: modern.textSecondary, fontSize: fontSizes.lg },
  headline: {
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.xl,
    fontWeight: '700',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  trigger: { color: modern.accent, fontFamily: fonts.body, fontSize: fontSizes.sm, marginBottom: spacing.xl },
  perks: { marginBottom: spacing.xxl },
  perkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  perkCheck: { color: modern.green, fontSize: fontSizes.base, fontWeight: '700' },
  perkText: { color: modern.textSecondary, fontFamily: fonts.body, fontSize: fontSizes.base },
  plans: { gap: spacing.sm, marginBottom: spacing.xxl },
  planCard: {
    ...modernCard,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  planCardSelected: {
    borderColor: modern.accent,
    backgroundColor: modern.surfaceElevated,
  },
  planLeft: {},
  planLabel: { color: modern.textPrimary, fontFamily: fonts.body, fontSize: fontSizes.base, fontWeight: '700' },
  planLabelSelected: { color: modern.accent },
  planSub: { color: modern.textSecondary, fontFamily: fonts.body, fontSize: fontSizes.xs, marginTop: 2 },
  planRight: { alignItems: 'flex-end', gap: spacing.xs },
  planBadge: {
    backgroundColor: modern.accent,
    borderRadius: modernRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  planBadgeText: { color: modern.background, fontFamily: fonts.body, fontSize: fontSizes.xs, fontWeight: '700' },
  planPrice: { color: modern.textPrimary, fontFamily: fonts.pixelHeading, fontSize: 10 },
  ctaBtn: { ...modernButton, padding: spacing.lg } as ViewStyle,
  ctaBtnDisabled: { opacity: 0.5 },
  ctaBtnText: { color: modern.background, fontFamily: fonts.body, fontSize: fontSizes.base, fontWeight: '700' },
  legal: {
    color: modern.textDisabled,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 16,
  },
});
