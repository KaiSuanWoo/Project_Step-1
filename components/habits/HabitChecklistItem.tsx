import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { modern, fonts, fontSizes, spacing, modernRadius, modernCard } from '@/constants/Theme';

interface HabitChecklistItemProps {
  title: string;
  streakDays: number;
  coinReward: number;
  completed: boolean;
  onToggle: () => void;
}

export default function HabitChecklistItem({
  title,
  streakDays,
  coinReward,
  completed,
  onToggle,
}: HabitChecklistItemProps) {
  const scale = useSharedValue(1);

  const checkboxStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: completed ? '#06D6A0' : 'transparent',
    borderColor: completed ? '#06D6A0' : modern.borderSubtle,
  }));

  const handlePress = () => {
    if (!completed) {
      scale.value = withSpring(1.2, { damping: 8, stiffness: 200 }, () => {
        scale.value = withSpring(1);
      });
    }
    onToggle();
  };

  return (
    <View style={[styles.container, completed && styles.containerDone]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <Animated.View style={[styles.checkbox, checkboxStyle]}>
          {completed && <Text style={styles.checkmark}>✓</Text>}
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={[styles.title, completed && styles.titleDone]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.meta}>
        {streakDays > 0 && (
          <Text style={styles.streak}>🔥{streakDays}</Text>
        )}
        {!completed && (
          <Text style={styles.reward}>+{coinReward}🪙</Text>
        )}
        {completed && (
          <Text style={styles.doneCheck}>✓</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...modernCard,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  containerDone: {
    borderColor: modern.green,
    opacity: 0.8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  title: {
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.base,
  },
  titleDone: {
    color: modern.textSecondary,
    textDecorationLine: 'line-through',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  streak: {
    fontFamily: fonts.pixelHeading,
    fontSize: 9,
    color: modern.accent,
  },
  reward: {
    fontFamily: fonts.pixelHeading,
    fontSize: 9,
    color: modern.accent,
  },
  doneCheck: {
    color: modern.green,
    fontSize: 16,
    fontWeight: '700',
  },
});
