import { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Animated, PanResponder, Dimensions, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserStore } from '@/store/useUserStore';
import { useHabitStore } from '@/store/useHabitStore';
import { useAvatarStore } from '@/store/useAvatarStore';
import { useCoinStore } from '@/store/useCoinStore';
import { deriveAvatarState, applySleepOverride } from '@/lib/avatarState';
import EnvironmentContainer from '@/components/environment/EnvironmentContainer';
import HabitChecklistItem from '@/components/habits/HabitChecklistItem';
import { AvatarState, Niche } from '@/types';
import {
  modern, fonts, fontSizes, spacing, modernRadius, modernCard,
} from '@/constants/Theme';

const { height: SCREEN_H } = Dimensions.get('window');
const DRAWER_PEEK = 72;
const DRAWER_MAX = SCREEN_H * 0.55;

export default function RealmScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, loading: userLoading } = useUserStore();
  const { habits, streaks, fetchHabits, fetchStreaks, todayLog, checkIn } = useHabitStore();
  const { avatar, fetchAvatar, updateState } = useAvatarStore();
  const { coins, fetchCoins } = useCoinStore();

  // Drawer animation
  const drawerY = useRef(new Animated.Value(0)).current;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerOffset = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 10,
      onPanResponderGrant: () => {
        drawerY.setOffset(drawerOffset.current);
        drawerY.setValue(0);
      },
      onPanResponderMove: (_, g) => {
        drawerY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        drawerY.flattenOffset();
        const openTarget = -(DRAWER_MAX - DRAWER_PEEK);
        if (g.dy < -40) {
          Animated.spring(drawerY, { toValue: openTarget, useNativeDriver: true, bounciness: 4 }).start();
          drawerOffset.current = openTarget;
          setDrawerOpen(true);
        } else if (g.dy > 40) {
          Animated.spring(drawerY, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start();
          drawerOffset.current = 0;
          setDrawerOpen(false);
        } else {
          const snapTo = drawerOpen ? openTarget : 0;
          Animated.spring(drawerY, { toValue: snapTo, useNativeDriver: true, bounciness: 4 }).start();
          drawerOffset.current = snapTo;
        }
      },
    })
  ).current;

  const toggleDrawer = () => {
    const openTarget = -(DRAWER_MAX - DRAWER_PEEK);
    const target = drawerOpen ? 0 : openTarget;
    Animated.spring(drawerY, { toValue: target, useNativeDriver: true, bounciness: 4 }).start();
    drawerOffset.current = target;
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace('/(onboarding)');
      return;
    }
    if (user) {
      fetchHabits(user.id);
      fetchAvatar(user.id);
      fetchCoins(user.id);
    }
  }, [user, userLoading]);

  useEffect(() => {
    if (habits.length && user) fetchStreaks(user.id);
  }, [habits]);

  // Derive and sync avatar state
  useEffect(() => {
    if (Object.keys(streaks).length > 0) {
      const derived = applySleepOverride(deriveAvatarState(streaks));
      if (avatar && avatar.animation_state !== derived) {
        updateState(derived);
      }
    }
  }, [streaks, avatar?.animation_state]);

  if (userLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={modern.accent} />
      </View>
    );
  }

  const avatarState: AvatarState = (avatar?.animation_state as AvatarState) ?? 'idle';
  const niche: Niche = user?.niche ?? 'education';

  const maxStreak = Object.values(streaks).reduce((max, s) => Math.max(max, s.current_streak), 0);
  const completedToday = habits.filter((h) => todayLog(h.id)?.completed).length;
  const totalToday = habits.length;
  const pct = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const handleCheckIn = async (habitId: string) => {
    await checkIn(habitId, {});
    if (user) {
      fetchStreaks(user.id);
      fetchCoins(user.id);
    }
  };

  return (
    <View style={styles.screen}>
      {/* Full-screen environment */}
      <EnvironmentContainer
        avatarState={avatarState}
        niche={niche}
        pixelSize={6}
        fullScreen
      />

      {/* Overlay: top stats bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.xs }]}>
        <TouchableOpacity style={styles.statPill}>
          <Text style={styles.statPillIcon}>🔔</Text>
        </TouchableOpacity>

        <View style={styles.coinPill}>
          <Text style={styles.coinIcon}>🪙</Text>
          <View>
            <Text style={styles.coinValue}>{coins}</Text>
            <Text style={styles.coinLabel}>coins</Text>
          </View>
        </View>

        <View style={styles.streakPill}>
          <Text style={styles.streakIcon}>🔥</Text>
          <Text style={styles.streakValue}>{maxStreak}</Text>
        </View>
      </View>

      {/* Overlay: completion progress */}
      {totalToday > 0 && (
        <View style={[styles.progressOverlay, { bottom: DRAWER_PEEK + 8 }]}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${pct}%` }]} />
          </View>
          <Text style={styles.progressText}>{completedToday}/{totalToday} today</Text>
        </View>
      )}

      {/* Bottom drawer: habits */}
      <Animated.View
        style={[
          styles.drawer,
          { height: DRAWER_MAX, bottom: -(DRAWER_MAX - DRAWER_PEEK) - insets.bottom },
          { paddingBottom: insets.bottom },
          { transform: [{ translateY: drawerY }] },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Handle */}
        <TouchableOpacity style={styles.drawerHandle} onPress={toggleDrawer} activeOpacity={0.8}>
          <View style={styles.handleBar} />
          <View style={styles.drawerHeaderRow}>
            <Text style={styles.drawerTitle}>Today's Habits</Text>
            {habits.length > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{completedToday}/{totalToday}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Habits list */}
        <ScrollView style={styles.drawerScroll} contentContainerStyle={styles.drawerContent}>
          {habits.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No habits yet</Text>
              <Text style={styles.emptySub}>Head to Habits tab to create your first one.</Text>
            </View>
          ) : (
            habits.map((habit) => {
              const streak = streaks[habit.id];
              const log = todayLog(habit.id);
              const done = log?.completed ?? false;
              return (
                <HabitChecklistItem
                  key={habit.id}
                  title={habit.title}
                  streakDays={streak?.current_streak ?? 0}
                  coinReward={10}
                  completed={done}
                  onToggle={() => { if (!done) handleCheckIn(habit.id); }}
                />
              );
            })
          )}

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push('/(tabs)/habits')}
          >
            <Text style={styles.addBtnText}>+ Add habit</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0D0D12',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: modern.background,
  },

  // === Top overlay ===
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  statPill: {
    width: 40,
    height: 40,
    borderRadius: modernRadius.full,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statPillIcon: { fontSize: 18 },

  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: modernRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  coinIcon: { fontSize: 18 },
  coinValue: {
    color: modern.accent,
    fontFamily: fonts.pixelHeading,
    fontSize: 10,
    textAlign: 'center',
  },
  coinLabel: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: 8,
    textAlign: 'center',
  },

  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: modernRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  streakIcon: { fontSize: 14 },
  streakValue: {
    color: modern.accent,
    fontFamily: fonts.pixelHeading,
    fontSize: 10,
  },

  // === Progress overlay ===
  progressOverlay: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    alignItems: 'center',
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.4)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: modern.green,
    borderRadius: 3,
  },
  progressText: {
    color: 'rgba(255,255,255,0.7)',
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    marginTop: 4,
  },

  // === Drawer ===
  drawer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: modern.background,
    borderTopLeftRadius: modernRadius.xl,
    borderTopRightRadius: modernRadius.xl,
    overflow: 'hidden',
  },
  drawerHandle: {
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: modern.borderSubtle,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  drawerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drawerTitle: {
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.base,
    fontWeight: '700',
  },
  countBadge: {
    backgroundColor: modern.surfaceElevated,
    borderRadius: modernRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  countBadgeText: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
  },

  drawerScroll: { flex: 1 },
  drawerContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: 20,
  },
  emptyCard: {
    ...modernCard,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyTitle: {
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  emptySub: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  addBtn: {
    borderWidth: 1,
    borderColor: modern.borderSubtle,
    borderRadius: modernRadius.md,
    borderStyle: 'dashed',
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  addBtnText: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
  },
});
