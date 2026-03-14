import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { modern, fonts, fontSizes, spacing, modernCard, modernRadius } from '@/constants/Theme';
import { Goal } from '@/types';
import { useCoinStore } from '@/store/useCoinStore';

interface GoalCardProps {
  goal: Goal;
  onPress?: () => void;
}

export default function GoalCard({ goal, onPress }: GoalCardProps) {
  const coins = useCoinStore((s) => s.coins);
  const progress = Math.min(coins / goal.target_coins, 1);
  const pct = Math.round(progress * 100);

  return (
    <TouchableOpacity
      style={[styles.container, goal.completed && styles.containerDone]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{goal.title}</Text>
        {goal.completed && <Text style={styles.badge}>Achieved</Text>}
      </View>

      {goal.description ? (
        <Text style={styles.description} numberOfLines={2}>{goal.description}</Text>
      ) : null}

      <View style={styles.progressRow}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${pct}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {goal.completed ? goal.target_coins : coins}/{goal.target_coins} 🪙
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    ...modernCard,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  containerDone: {
    borderColor: modern.green,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.base,
    fontWeight: '700',
    flex: 1,
  },
  badge: {
    color: modern.green,
    fontFamily: fonts.pixelHeading,
    fontSize: 8,
    marginLeft: spacing.sm,
  },
  description: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    marginBottom: spacing.sm,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: modern.surfaceElevated,
    borderRadius: modernRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: modern.accent,
    borderRadius: modernRadius.full,
  },
  progressText: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    minWidth: 80,
    textAlign: 'right',
  },
});
