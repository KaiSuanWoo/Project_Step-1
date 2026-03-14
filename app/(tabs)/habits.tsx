import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Modal, Alert, ViewStyle, TextStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/useUserStore';
import { useHabitStore } from '@/store/useHabitStore';
import { HabitFrequency, Niche } from '@/types';
import Paywall from '@/components/ui/Paywall';
import {
  modern, fonts, fontSizes, spacing, modernRadius,
  modernCard, modernButton, modernButtonSecondary, modernInput, modernSectionLabel,
} from '@/constants/Theme';

const FREE_HABIT_LIMIT = 3;

export default function HabitsScreen() {
  const router = useRouter();
  const { user, isPremium } = useUserStore();
  const { habits, fetchHabits, createHabit, archiveHabit } = useHabitStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [niche, setNiche] = useState<Niche>('custom');
  const [reward, setReward] = useState('');
  const [penalty, setPenalty] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) fetchHabits(user.id);
  }, [user]);

  const handleCreate = async () => {
    if (!title.trim() || !user) return;

    if (!isPremium() && habits.length >= FREE_HABIT_LIMIT) {
      setPaywallVisible(true);
      return;
    }

    setSaving(true);
    try {
      await createHabit(user.id, {
        title: title.trim(),
        frequency,
        niche,
        reward: reward.trim() || null,
        penalty: penalty.trim() || null,
      });
      setModalVisible(false);
      setTitle(''); setReward(''); setPenalty('');
    } catch {
      Alert.alert('Error', 'Could not create habit. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {habits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No habits yet</Text>
            <Text style={styles.emptySub}>Add your first habit to start building your streak.</Text>
          </View>
        ) : (
          habits.map((habit) => (
            <TouchableOpacity key={habit.id} style={styles.card} onPress={() => router.push(`/habit/${habit.id}`)}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{habit.title}</Text>
                <View style={[styles.badge, habit.frequency === 'daily' ? styles.badgeDaily : styles.badgeWeekly]}>
                  <Text style={styles.badgeText}>{habit.frequency}</Text>
                </View>
              </View>
              {habit.reward ? (
                <Text style={styles.rewardText}>Reward: {habit.reward}</Text>
              ) : null}
              {habit.penalty ? (
                <Text style={styles.penaltyText}>Penalty: {habit.penalty}</Text>
              ) : null}
              <TouchableOpacity
                style={styles.archiveBtn}
                onPress={() => Alert.alert('Archive', `Archive "${habit.title}"?`, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Archive', style: 'destructive', onPress: () => archiveHabit(habit.id) },
                ])}
              >
                <Text style={styles.archiveBtnText}>Archive</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+ Add Habit</Text>
      </TouchableOpacity>

      <Paywall
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
        trigger={`Free accounts are limited to ${FREE_HABIT_LIMIT} habits`}
      />

      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>New Habit</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Read 30 min"
            placeholderTextColor={modern.textDisabled}
          />

          <Text style={styles.label}>Frequency</Text>
          <View style={styles.segmented}>
            {(['daily', 'weekly'] as HabitFrequency[]).map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.segment, frequency === f && styles.segmentActive]}
                onPress={() => setFrequency(f)}
              >
                <Text style={[styles.segmentText, frequency === f && styles.segmentTextActive]}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Niche</Text>
          <View style={styles.segmented}>
            {(['education', 'work', 'fitness', 'custom'] as Niche[]).map((n) => (
              <TouchableOpacity
                key={n}
                style={[styles.segment, niche === n && styles.segmentActive]}
                onPress={() => setNiche(n)}
              >
                <Text style={[styles.segmentText, niche === n && styles.segmentTextActive]}>
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Reward (optional)</Text>
          <TextInput
            style={styles.input}
            value={reward}
            onChangeText={setReward}
            placeholder="e.g. Watch a show"
            placeholderTextColor={modern.textDisabled}
          />

          <Text style={styles.label}>Penalty (optional)</Text>
          <TextInput
            style={styles.input}
            value={penalty}
            onChangeText={setPenalty}
            placeholder="e.g. 20 push-ups"
            placeholderTextColor={modern.textDisabled}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, (!title.trim() || saving) && styles.saveBtnDisabled]}
              onPress={handleCreate}
              disabled={!title.trim() || saving}
            >
              <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: modern.background },
  content: { padding: spacing.lg, paddingBottom: 80 },
  emptyState: { alignItems: 'center', marginTop: 80 },
  emptyTitle: { color: modern.textPrimary, fontFamily: fonts.body, fontSize: fontSizes.lg, fontWeight: '700' },
  emptySub: { color: modern.textSecondary, fontFamily: fonts.body, fontSize: fontSizes.sm, marginTop: spacing.sm, textAlign: 'center' },
  card: {
    ...modernCard,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: modern.textPrimary, fontFamily: fonts.body, fontSize: fontSizes.base, flex: 1 },
  badge: { borderRadius: modernRadius.full, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  badgeDaily: { backgroundColor: 'rgba(255,209,102,0.15)' },
  badgeWeekly: { backgroundColor: 'rgba(6,214,160,0.15)' },
  badgeText: { color: modern.textSecondary, fontFamily: fonts.body, fontSize: fontSizes.xs, textTransform: 'capitalize' },
  rewardText: { color: modern.green, fontFamily: fonts.body, fontSize: fontSizes.xs, marginTop: spacing.sm },
  penaltyText: { color: modern.danger, fontFamily: fonts.body, fontSize: fontSizes.xs, marginTop: 4 },
  archiveBtn: { alignSelf: 'flex-end', marginTop: spacing.md },
  archiveBtnText: { color: modern.textDisabled, fontFamily: fonts.body, fontSize: fontSizes.xs },
  fab: {
    ...modernButton,
    position: 'absolute',
    bottom: 24,
    right: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  } as ViewStyle,
  fabText: { color: modern.background, fontFamily: fonts.body, fontSize: fontSizes.sm, fontWeight: '700' },
  modal: { flex: 1, backgroundColor: modern.background, padding: spacing.xl },
  modalTitle: { color: modern.textPrimary, fontFamily: fonts.body, fontSize: fontSizes.xl, fontWeight: '700', marginBottom: spacing.xxl },
  label: { ...modernSectionLabel, marginBottom: spacing.xs, marginTop: spacing.lg },
  input: {
    ...modernInput,
    padding: spacing.md,
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.base,
  } as TextStyle,
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
  segmentText: { color: modern.textDisabled, fontFamily: fonts.body, fontSize: fontSizes.sm, textTransform: 'capitalize' },
  segmentTextActive: { color: modern.accent },
  modalActions: { flexDirection: 'row', gap: spacing.md, marginTop: 32 },
  cancelBtn: {
    ...modernButtonSecondary,
    flex: 1,
    padding: spacing.lg,
  } as ViewStyle,
  cancelBtnText: { color: modern.textSecondary, fontFamily: fonts.body, fontSize: fontSizes.base },
  saveBtn: { ...modernButton, flex: 2, padding: spacing.lg } as ViewStyle,
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: modern.background, fontFamily: fonts.body, fontSize: fontSizes.base, fontWeight: '700' },
});
