import { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/useUserStore';
import { useHabitStore } from '@/store/useHabitStore';
import { useGoalStore } from '@/store/useGoalStore';
import { useCoinStore } from '@/store/useCoinStore';
import StreakCalendar from '@/components/progress/StreakCalendar';
import GoalCard from '@/components/progress/GoalCard';
import {
  modern, fonts, fontSizes, spacing, modernRadius,
  modernCard, modernCardElevated, modernSectionLabel,
} from '@/constants/Theme';

const MILESTONES = [
  { days: 7, label: '7-Day Streak', emoji: '🔥' },
  { days: 21, label: '21-Day Habit', emoji: '💪' },
  { days: 66, label: '66-Day Master', emoji: '🏆' },
  { days: 100, label: '100-Day Legend', emoji: '👑' },
];

export default function ProgressScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const { habits, fetchHabits, streaks, fetchStreaks, logs, fetchLogsForHabit, todayLog } = useHabitStore();
  const { goals, fetchGoals } = useGoalStore();
  const coins = useCoinStore((s) => s.coins);

  useEffect(() => {
    if (user) {
      fetchHabits(user.id);
      fetchGoals(user.id);
      useCoinStore.getState().fetchCoins(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (user && habits.length > 0) {
      fetchStreaks(user.id);
      habits.forEach((h) => fetchLogsForHabit(h.id));
    }
  }, [user, habits.length]);

  // Weekly summary
  const weeklySummary = useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
    weekStart.setHours(0, 0, 0, 0);

    let total = 0;
    let completed = 0;
    const dailyCounts: number[] = [0, 0, 0, 0, 0, 0, 0];

    for (let d = 0; d < 7; d++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + d);
      if (date > now) break;
      const dateStr = date.toISOString().split('T')[0];

      habits.forEach((h) => {
        total++;
        const log = logs[h.id]?.find((l) => l.date === dateStr && l.completed);
        if (log) {
          completed++;
          dailyCounts[d]++;
        }
      });
    }

    const bestDay = dailyCounts.indexOf(Math.max(...dailyCounts));
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return { total, completed, pct: total > 0 ? Math.round((completed / total) * 100) : 0, bestDay: dayNames[bestDay] };
  }, [habits, logs]);

  // Heatmap data
  const heatmapData = useMemo(() => {
    const data: Record<string, number> = {};
    habits.forEach((h) => {
      (logs[h.id] ?? []).forEach((l) => {
        if (l.completed) {
          data[l.date] = (data[l.date] ?? 0) + 1;
        }
      });
    });
    return data;
  }, [habits, logs]);

  // Streak list sorted by current streak descending
  const sortedStreaks = useMemo(() => {
    return habits
      .map((h) => ({ habit: h, streak: streaks[h.id] }))
      .filter((s) => s.streak)
      .sort((a, b) => (b.streak?.current_streak ?? 0) - (a.streak?.current_streak ?? 0));
  }, [habits, streaks]);

  // Best streak for milestones
  const bestStreak = useMemo(() => {
    return Math.max(0, ...Object.values(streaks).map((s) => s.longest_streak));
  }, [streaks]);

  const completedToday = habits.filter((h) => todayLog(h.id)?.completed).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Weekly Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>This Week</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{weeklySummary.pct}%</Text>
            <Text style={styles.summaryLabel}>completion</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{weeklySummary.completed}/{weeklySummary.total}</Text>
            <Text style={styles.summaryLabel}>check-ins</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{weeklySummary.bestDay}</Text>
            <Text style={styles.summaryLabel}>best day</Text>
          </View>
        </View>
      </View>

      {/* Today's Progress */}
      <View style={styles.todayCard}>
        <Text style={styles.todayText}>
          Today: {completedToday}/{habits.length} habits done
        </Text>
        <View style={styles.todayBarBg}>
          <View
            style={[
              styles.todayBarFill,
              { width: `${habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0}%` },
            ]}
          />
        </View>
      </View>

      {/* Heatmap Calendar */}
      <StreakCalendar completionData={heatmapData} maxPerDay={habits.length} />

      {/* Streak Overview */}
      <Text style={styles.sectionLabel}>Streaks</Text>
      {sortedStreaks.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Complete habits to build streaks</Text>
        </View>
      ) : (
        sortedStreaks.map(({ habit, streak }) => (
          <View key={habit.id} style={styles.streakRow}>
            <Text style={styles.streakTitle} numberOfLines={1}>{habit.title}</Text>
            <View style={styles.streakBadge}>
              <Text style={styles.streakFire}>🔥</Text>
              <Text style={styles.streakCount}>{streak?.current_streak ?? 0}</Text>
            </View>
            <Text style={styles.streakBest}>best: {streak?.longest_streak ?? 0}</Text>
          </View>
        ))
      )}

      {/* Milestones */}
      <Text style={styles.sectionLabel}>Milestones</Text>
      <View style={styles.milestonesGrid}>
        {MILESTONES.map((m) => {
          const achieved = bestStreak >= m.days;
          return (
            <View key={m.days} style={[styles.milestoneCard, achieved && styles.milestoneAchieved]}>
              <Text style={styles.milestoneEmoji}>{m.emoji}</Text>
              <Text style={[styles.milestoneLabel, achieved && styles.milestoneLabelAchieved]}>
                {m.label}
              </Text>
              {achieved ? (
                <Text style={styles.milestoneCheck}>✓</Text>
              ) : (
                <Text style={styles.milestoneProgress}>{bestStreak}/{m.days}</Text>
              )}
            </View>
          );
        })}
      </View>

      {/* Goals */}
      <Text style={styles.sectionLabel}>Goals</Text>
      {goals.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Set a goal to work toward</Text>
        </View>
      ) : (
        goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onPress={() => router.push(`/goal/${goal.id}`)} />
        ))
      )}

      <TouchableOpacity
        style={styles.addGoalBtn}
        onPress={() => router.push('/goal/new')}
        activeOpacity={0.7}
      >
        <Text style={styles.addGoalText}>+ Add Goal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: modern.background },
  content: { padding: spacing.lg, paddingBottom: 60 },

  // Weekly Summary
  summaryCard: {
    ...modernCardElevated,
    padding: spacing.xl,
    marginBottom: spacing.md,
  },
  summaryTitle: {
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    color: modern.accent,
    fontFamily: fonts.pixelHeading,
    fontSize: 10,
  },
  summaryLabel: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    marginTop: spacing.xs,
  },
  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: modern.borderSubtle,
  },

  // Today
  todayCard: {
    ...modernCard,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  todayText: {
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    marginBottom: spacing.sm,
  },
  todayBarBg: {
    height: 6,
    backgroundColor: modern.surfaceElevated,
    borderRadius: modernRadius.full,
    overflow: 'hidden',
  },
  todayBarFill: {
    height: '100%',
    backgroundColor: modern.green,
    borderRadius: modernRadius.full,
  },

  // Section
  sectionLabel: {
    ...modernSectionLabel,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },

  // Streaks
  streakRow: {
    ...modernCard,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.xs,
  },
  streakTitle: {
    flex: 1,
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.sm,
  },
  streakFire: {
    fontSize: 14,
  },
  streakCount: {
    color: modern.accent,
    fontFamily: fonts.pixelHeading,
    fontSize: 9,
    marginLeft: 2,
  },
  streakBest: {
    color: modern.textDisabled,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    minWidth: 55,
    textAlign: 'right',
  },

  // Milestones
  milestonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  milestoneCard: {
    ...modernCard,
    width: '48%',
    padding: spacing.md,
    alignItems: 'center',
    opacity: 0.5,
  },
  milestoneAchieved: {
    borderColor: modern.accent,
    opacity: 1,
  },
  milestoneEmoji: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  milestoneLabel: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    textAlign: 'center',
  },
  milestoneLabelAchieved: {
    color: modern.textPrimary,
  },
  milestoneCheck: {
    color: modern.green,
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  milestoneProgress: {
    color: modern.textDisabled,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    marginTop: spacing.xs,
  },

  // Goals
  addGoalBtn: {
    borderWidth: 1,
    borderColor: modern.borderSubtle,
    borderStyle: 'dashed',
    borderRadius: modernRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  addGoalText: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
  },

  // Empty
  emptyCard: {
    ...modernCard,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
  },
});
