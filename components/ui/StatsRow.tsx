import { View, Text, StyleSheet } from 'react-native';
import { modern, fonts, fontSizes, spacing, modernCard } from '@/constants/Theme';

interface StatsRowProps {
  streakDays: number;
  coins: number;
  completionPct: number;
}

export default function StatsRow({ streakDays, coins, completionPct }: StatsRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <Text style={styles.statIcon}>🔥</Text>
        <Text style={styles.statValue}>{streakDays}</Text>
        <Text style={styles.statLabel}>streak</Text>
      </View>
      <View style={styles.stat}>
        <Text style={styles.statIcon}>🪙</Text>
        <Text style={styles.statValue}>{coins}</Text>
        <Text style={styles.statLabel}>coins</Text>
      </View>
      <View style={styles.stat}>
        <View style={styles.progressRing}>
          <Text style={styles.progressText}>{completionPct}%</Text>
        </View>
        <Text style={styles.statLabel}>today</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  stat: {
    ...modernCard,
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    gap: 2,
  },
  statIcon: {
    fontSize: 16,
  },
  statValue: {
    color: modern.accent,
    fontFamily: fonts.pixelHeading,
    fontSize: fontSizes.sm,
  },
  statLabel: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.micro,
  },
  progressRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: modern.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    color: modern.green,
    fontFamily: fonts.pixelHeading,
    fontSize: 9,
  },
});
