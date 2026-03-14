import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUserStore } from '@/store/useUserStore';
import { useGoalStore } from '@/store/useGoalStore';
import { useCoinStore } from '@/store/useCoinStore';
import {
  modern, fonts, fontSizes, spacing, modernRadius,
  modernCard, modernButton, modernInput, modernSectionLabel,
} from '@/constants/Theme';
import { ViewStyle, TextStyle } from 'react-native';

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useUserStore();
  const { goals, createGoal, updateGoal, deleteGoal, completeGoal } = useGoalStore();
  const coins = useCoinStore((s) => s.coins);

  const isNew = id === 'new';
  const existingGoal = !isNew ? goals.find((g) => g.id === id) : undefined;

  const [title, setTitle] = useState(existingGoal?.title ?? '');
  const [description, setDescription] = useState(existingGoal?.description ?? '');
  const [targetCoins, setTargetCoins] = useState(existingGoal?.target_coins?.toString() ?? '500');

  useEffect(() => {
    if (existingGoal) {
      setTitle(existingGoal.title);
      setDescription(existingGoal.description ?? '');
      setTargetCoins(existingGoal.target_coins.toString());
    }
  }, [existingGoal]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Give your goal a name.');
      return;
    }
    const target = parseInt(targetCoins, 10);
    if (!target || target <= 0) {
      Alert.alert('Invalid target', 'Set a coin target greater than 0.');
      return;
    }

    if (isNew && user) {
      await createGoal(user.id, {
        title: title.trim(),
        description: description.trim() || null,
        target_coins: target,
      });
    } else if (existingGoal) {
      await updateGoal(existingGoal.id, {
        title: title.trim(),
        description: description.trim() || null,
        target_coins: target,
      });
    }
    router.back();
  };

  const handleDelete = () => {
    if (!existingGoal) return;
    Alert.alert('Delete Goal', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteGoal(existingGoal.id);
          router.back();
        },
      },
    ]);
  };

  const handleComplete = async () => {
    if (!existingGoal) return;
    await completeGoal(existingGoal.id);
    Alert.alert('Goal Achieved!', 'Congratulations on reaching your goal!');
  };

  const progress = existingGoal ? Math.min(coins / existingGoal.target_coins, 1) : 0;
  const pct = Math.round(progress * 100);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Progress (existing goals only) */}
      {existingGoal && !existingGoal.completed && (
        <View style={styles.progressCard}>
          <Text style={styles.progressPct}>{pct}%</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${pct}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{coins}/{existingGoal.target_coins} coins earned</Text>
          {coins >= existingGoal.target_coins && (
            <TouchableOpacity style={styles.claimBtn} onPress={handleComplete} activeOpacity={0.7}>
              <Text style={styles.claimBtnText}>Claim Achievement</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {existingGoal?.completed && (
        <View style={[styles.progressCard, { borderColor: modern.green }]}>
          <Text style={styles.achievedText}>Goal Achieved!</Text>
          <Text style={styles.progressLabel}>
            Completed {existingGoal.completed_at
              ? new Date(existingGoal.completed_at).toLocaleDateString()
              : ''}
          </Text>
        </View>
      )}

      {/* Form */}
      <Text style={styles.label}>Goal Name</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. New running shoes"
        placeholderTextColor={modern.textDisabled}
        maxLength={80}
      />

      <Text style={styles.label}>Description (optional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Why is this goal important?"
        placeholderTextColor={modern.textDisabled}
        multiline
        numberOfLines={3}
        maxLength={300}
      />

      <Text style={styles.label}>Target Coins</Text>
      <TextInput
        style={styles.input}
        value={targetCoins}
        onChangeText={setTargetCoins}
        placeholder="500"
        placeholderTextColor={modern.textDisabled}
        keyboardType="number-pad"
      />
      <Text style={styles.hint}>
        Earn coins by completing habits (+10 each) and maintaining streaks.
      </Text>

      {/* Actions */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.7}>
        <Text style={styles.saveBtnText}>{isNew ? 'Create Goal' : 'Save Changes'}</Text>
      </TouchableOpacity>

      {!isNew && !existingGoal?.completed && (
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.7}>
          <Text style={styles.deleteBtnText}>Delete Goal</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: modern.background },
  content: { padding: spacing.lg, paddingBottom: 60 },

  // Progress
  progressCard: {
    ...modernCard,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
  } as ViewStyle,
  progressPct: {
    color: modern.accent,
    fontFamily: fonts.pixelHeading,
    fontSize: 14,
    marginBottom: spacing.md,
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: modern.surfaceElevated,
    borderRadius: modernRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: modern.accent,
    borderRadius: modernRadius.full,
  },
  progressLabel: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    marginTop: spacing.sm,
  },
  claimBtn: {
    backgroundColor: modern.green,
    borderRadius: modernRadius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
  },
  claimBtnText: {
    color: modern.background,
    fontFamily: fonts.body,
    fontSize: fontSizes.base,
    fontWeight: '700',
  },
  achievedText: {
    color: modern.green,
    fontFamily: fonts.pixelHeading,
    fontSize: 12,
    marginBottom: spacing.sm,
  },

  // Form
  label: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
    marginTop: spacing.lg,
  },
  input: {
    ...modernInput,
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.base,
  } as TextStyle,
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  hint: {
    color: modern.textDisabled,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    marginTop: spacing.xs,
  },

  // Actions
  saveBtn: {
    ...modernButton,
    marginTop: spacing.xl,
  } as ViewStyle,
  saveBtnText: {
    color: modern.background,
    fontFamily: fonts.body,
    fontSize: fontSizes.base,
    fontWeight: '700',
    textAlign: 'center',
  },
  deleteBtn: {
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  deleteBtnText: {
    color: modern.danger,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
  },
});
