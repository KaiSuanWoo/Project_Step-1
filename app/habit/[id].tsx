import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, ActivityIndicator, ScrollView, ViewStyle, TextStyle,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useHabitStore } from '@/store/useHabitStore';
import { HabitFrequency } from '@/types';
import {
  modern, fonts, fontSizes, spacing, modernRadius,
  modernCard, modernCardElevated, modernButton, modernButtonSecondary,
  modernInput, modernSectionLabel,
} from '@/constants/Theme';

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { habits, streaks, updateHabit, archiveHabit } = useHabitStore();
  const habit = habits.find((h) => h.id === id);
  const streak = habit ? streaks[habit.id] : undefined;

  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [reward, setReward] = useState('');
  const [penalty, setPenalty] = useState('');
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (habit) {
      setTitle(habit.title);
      setFrequency(habit.frequency);
      setReward(habit.reward ?? '');
      setPenalty(habit.penalty ?? '');
    }
  }, [habit]);

  const handleSave = async () => {
    if (!id || !title.trim()) return;
    setSaving(true);
    try {
      await updateHabit(id, {
        title: title.trim(),
        frequency,
        reward: reward.trim() || null,
        penalty: penalty.trim() || null,
      });
      setEditing(false);
    } catch {
      Alert.alert('Error', 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = () => {
    Alert.alert('Archive habit', `Archive "${habit?.title}"? Your streak history will be kept.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Archive', style: 'destructive', onPress: async () => {
          await archiveHabit(id!);
          router.back();
        }
      },
    ]);
  };

  if (!habit) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Habit not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{streak?.current_streak ?? 0}</Text>
          <Text style={styles.statLabel}>Current streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{streak?.longest_streak ?? 0}</Text>
          <Text style={styles.statLabel}>Longest streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{habit.frequency === 'daily' ? '7' : '4'}</Text>
          <Text style={styles.statLabel}>Target / week</Text>
        </View>
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={[styles.input, !editing && styles.inputDisabled]}
        value={title}
        onChangeText={setTitle}
        editable={editing}
        placeholderTextColor={modern.textDisabled}
      />

      <Text style={styles.label}>Frequency</Text>
      <View style={styles.segmented}>
        {(['daily', 'weekly'] as HabitFrequency[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.segment, frequency === f && styles.segmentActive, !editing && styles.segmentDisabled]}
            onPress={() => editing && setFrequency(f)}
          >
            <Text style={[styles.segmentText, frequency === f && styles.segmentTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Reward</Text>
      <TextInput
        style={[styles.input, !editing && styles.inputDisabled]}
        value={reward}
        onChangeText={setReward}
        editable={editing}
        placeholder="e.g. Watch a show"
        placeholderTextColor={modern.textDisabled}
      />

      <Text style={styles.label}>Penalty</Text>
      <TextInput
        style={[styles.input, !editing && styles.inputDisabled]}
        value={penalty}
        onChangeText={setPenalty}
        editable={editing}
        placeholder="e.g. 20 push-ups"
        placeholderTextColor={modern.textDisabled}
      />

      {editing ? (
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditing(false)}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveBtn, (!title.trim() || saving) && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={!title.trim() || saving}
          >
            {saving
              ? <ActivityIndicator color={modern.background} size="small" />
              : <Text style={styles.saveBtnText}>Save</Text>
            }
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
          <Text style={styles.editBtnText}>Edit Habit</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.timelineBtn} onPress={() => router.push(`/timeline/${id}`)}>
        <Text style={styles.timelineBtnText}>View Timeline</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.archiveBtn} onPress={handleArchive}>
        <Text style={styles.archiveBtnText}>Archive Habit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: modern.background },
  content: { padding: spacing.xl, paddingBottom: 40 },
  error: { color: modern.danger, textAlign: 'center', marginTop: 40, fontFamily: fonts.body },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  statCard: {
    ...modernCardElevated,
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
  } as ViewStyle,
  statNum: { fontFamily: fonts.pixelHeading, color: modern.accent, fontSize: 14 },
  statLabel: { fontSize: fontSizes.xs, fontFamily: fonts.body, color: modern.textSecondary, marginTop: 4, textAlign: 'center' },
  label: { ...modernSectionLabel, marginBottom: spacing.xs, marginTop: spacing.lg },
  input: {
    ...modernInput,
    padding: spacing.md,
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.base,
  } as TextStyle,
  inputDisabled: { opacity: 0.6 },
  segmented: { flexDirection: 'row', gap: spacing.sm },
  segment: {
    ...modernCard,
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  segmentActive: {
    borderColor: modern.accent,
    backgroundColor: modern.surfaceElevated,
  },
  segmentDisabled: { opacity: 0.6 },
  segmentText: { color: modern.textDisabled, fontFamily: fonts.body, fontSize: fontSizes.sm, textTransform: 'capitalize' },
  segmentTextActive: { color: modern.accent },
  actionsRow: { flexDirection: 'row', gap: spacing.md, marginTop: 28 },
  cancelBtn: { ...modernButtonSecondary, flex: 1, padding: spacing.lg } as ViewStyle,
  cancelBtnText: { color: modern.textSecondary, fontFamily: fonts.body, fontSize: fontSizes.base },
  saveBtn: { ...modernButton, flex: 2, padding: spacing.lg } as ViewStyle,
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: modern.background, fontFamily: fonts.body, fontSize: fontSizes.base, fontWeight: '700' },
  editBtn: { ...modernButtonSecondary, padding: spacing.lg, marginTop: 28 } as ViewStyle,
  editBtnText: { color: modern.textPrimary, fontFamily: fonts.body, fontSize: fontSizes.base },
  timelineBtn: { ...modernButtonSecondary, padding: spacing.lg, marginTop: spacing.sm } as ViewStyle,
  timelineBtnText: { color: modern.textSecondary, fontFamily: fonts.body, fontSize: fontSizes.base },
  archiveBtn: { padding: spacing.lg, alignItems: 'center', marginTop: 4 },
  archiveBtnText: { color: modern.danger, fontFamily: fonts.body, fontSize: fontSizes.sm },
});
