import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/useUserStore';
import { useCoinStore } from '@/store/useCoinStore';
import { useEffect } from 'react';
import {
  modern, fonts, fontSizes, spacing,
  modernCard, modernRadius,
} from '@/constants/Theme';

interface MenuRow {
  icon: string;
  label: string;
  sub?: string;
  route: string;
  accent?: boolean;
}

const MENU_ITEMS: MenuRow[] = [
  { icon: '👤', label: 'Profile', sub: 'Your account & stats', route: '/profile' },
  { icon: '🛍️', label: 'Shop', sub: 'Outfits, decor & power-ups', route: '/shop' },
  { icon: '🎒', label: 'Inventory', sub: 'Your purchased items', route: '/inventory' },
  { icon: 'ℹ️', label: 'About', sub: 'App info & credits', route: '/about' },
  { icon: '⚙️', label: 'Settings', sub: 'Notifications & account', route: '/settings' },
];

export default function MenuScreen() {
  const router = useRouter();
  const { user, isPremium } = useUserStore();
  const { coins, fetchCoins } = useCoinStore();

  useEffect(() => {
    if (user) fetchCoins(user.id);
  }, [user]);

  const premium = isPremium();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User card */}
      <View style={styles.userCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>🧑‍💻</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.email?.split('@')[0] ?? 'Player'}</Text>
          <View style={styles.badgeRow}>
            <View style={[styles.planBadge, premium && styles.planBadgePremium]}>
              <Text style={[styles.planBadgeText, premium && styles.planBadgeTextPremium]}>
                {premium ? 'Premium' : 'Free'}
              </Text>
            </View>
            <Text style={styles.coinText}>🪙 {coins}</Text>
          </View>
        </View>
      </View>

      {/* Menu items */}
      <View style={styles.menuList}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.menuRow}
            onPress={() => router.push(item.route as any)}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.sub && <Text style={styles.menuSub}>{item.sub}</Text>}
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: modern.background },
  content: { padding: spacing.lg, paddingBottom: 40 },

  // User card
  userCard: {
    ...modernCard,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: modernRadius.full,
    backgroundColor: modern.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarEmoji: { fontSize: 24 },
  userInfo: { flex: 1 },
  userName: {
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4 },
  planBadge: {
    backgroundColor: modern.surfaceElevated,
    borderRadius: modernRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  planBadgePremium: { backgroundColor: 'rgba(255,209,102,0.15)' },
  planBadgeText: { color: modern.textSecondary, fontFamily: fonts.body, fontSize: fontSizes.xs },
  planBadgeTextPremium: { color: modern.accent },
  coinText: { color: modern.accent, fontFamily: fonts.pixelHeading, fontSize: 10 },

  // Menu list
  menuList: {
    ...modernCard,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: modern.borderSubtle,
  },
  menuIcon: { fontSize: 20, width: 32 },
  menuTextCol: { flex: 1 },
  menuLabel: {
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.base,
  },
  menuSub: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    marginTop: 2,
  },
  menuChevron: {
    color: modern.textDisabled,
    fontSize: 20,
    fontWeight: '300',
  },
});
