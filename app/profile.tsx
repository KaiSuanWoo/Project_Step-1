import { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useUserStore } from '@/store/useUserStore';
import { useHabitStore } from '@/store/useHabitStore';
import { useCoinStore } from '@/store/useCoinStore';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  modern, fonts, fontSizes, spacing, modernRadius,
  modernCard, modernCardElevated, modernSectionLabel,
} from '@/constants/Theme';

export default function ProfileScreen() {
  const { user, isPremium } = useUserStore();
  const { habits, streaks, fetchHabits, fetchStreaks } = useHabitStore();
  const { coins, fetchCoins } = useCoinStore();
  const { avatar, fetchAvatar } = useAvatarStore();

  useEffect(() => {
    if (user) {
      fetchHabits(user.id);
      fetchCoins(user.id);
      fetchAvatar(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (habits.length && user) fetchStreaks(user.id);
  }, [habits]);

  const premium = isPremium();
  const maxStreak = Object.values(streaks).reduce((max, s) => Math.max(max, s.current_streak), 0);
  const longestEver = Object.values(streaks).reduce((max, s) => Math.max(max, s.longest_streak), 0);
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar + name */}
      <View style={styles.heroCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>🧑‍💻</Text>
        </View>
        <Text style={styles.name}>{user?.email?.split('@')[0] ?? 'Player'}</Text>
        <Text style={styles.email}>{user?.email ?? ''}</Text>
        <View style={[styles.planBadge, premium && styles.planBadgePremium]}>
          <Text style={[styles.planBadgeText, premium && styles.planBadgeTextPremium]}>
            {premium ? 'Premium' : 'Free Plan'}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <Text style={styles.sectionLabel}>Stats</Text>
      <View style={styles.statsGrid}>
        <StatCard label="Active Habits" value={String(habits.length)} icon="📋" />
        <StatCard label="Current Streak" value={String(maxStreak)} icon="🔥" />
        <StatCard label="Best Streak" value={String(longestEver)} icon="🏆" />
        <StatCard label="Coins Earned" value={String(coins)} icon="🪙" />
      </View>

      {/* Details */}
      <Text style={styles.sectionLabel}>Details</Text>
      <View style={styles.detailCard}>
        <DetailRow label="Niche" value={user?.niche ?? 'Not set'} />
        <View style={styles.divider} />
        <DetailRow label="Member since" value={memberSince} />
        <View style={styles.divider} />
        <DetailRow label="Avatar state" value={avatar?.animation_state ?? '—'} />
      </View>
    </ScrollView>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: modern.background },
  content: { padding: spacing.lg, paddingBottom: 40 },

  // Hero
  heroCard: {
    ...modernCard,
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: modernRadius.full,
    backgroundColor: modern.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarEmoji: { fontSize: 32 },
  name: {
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.xl,
    fontWeight: '700',
  },
  email: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    marginTop: 2,
  },
  planBadge: {
    backgroundColor: modern.surfaceElevated,
    borderRadius: modernRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    marginTop: spacing.md,
  },
  planBadgePremium: { backgroundColor: 'rgba(255,209,102,0.15)' },
  planBadgeText: { color: modern.textSecondary, fontFamily: fonts.body, fontSize: fontSizes.xs },
  planBadgeTextPremium: { color: modern.accent },

  sectionLabel: { ...modernSectionLabel, marginBottom: spacing.sm, marginTop: spacing.lg },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statCard: {
    ...modernCardElevated,
    width: '48%' as any,
    flexGrow: 1,
    padding: spacing.md,
    alignItems: 'center',
  },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statValue: { color: modern.accent, fontFamily: fonts.pixelHeading, fontSize: 12 },
  statLabel: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    marginTop: 4,
    textAlign: 'center',
  },

  // Detail card
  detailCard: { ...modernCard, overflow: 'hidden' },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  detailLabel: { color: modern.textSecondary, fontFamily: fonts.body, fontSize: fontSizes.base },
  detailValue: {
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.base,
    textTransform: 'capitalize',
  },
  divider: { height: 1, backgroundColor: modern.borderSubtle, marginHorizontal: spacing.lg },
});
