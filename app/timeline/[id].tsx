import { useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image, ViewStyle,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useHabitStore } from '@/store/useHabitStore';
import { HabitLog } from '@/types';
import {
  modern, fonts, fontSizes, spacing, modernRadius, modernCard,
} from '@/constants/Theme';

const MOOD_EMOJI = ['', '😞', '😕', '😐', '🙂', '😄'];

function LogCard({ log }: { log: HabitLog }) {
  const date = new Date(log.date);
  const formatted = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={[styles.dot, log.completed ? styles.dotDone : styles.dotMissed]} />
        <View style={styles.line} />
      </View>
      <View style={styles.cardRight}>
        <View style={styles.cardHeader}>
          <Text style={styles.dateText}>{formatted}</Text>
          {log.mood ? <Text style={styles.mood}>{MOOD_EMOJI[log.mood]}</Text> : null}
          <View style={[styles.statusBadge, log.completed ? styles.statusBadgeDone : styles.statusBadgeMissed]}>
            <Text style={styles.statusBadgeText}>{log.completed ? 'Done' : 'Missed'}</Text>
          </View>
        </View>
        {log.photo_url ? (
          <Image source={{ uri: log.photo_url }} style={styles.photo} resizeMode="cover" />
        ) : null}
        {log.note ? <Text style={styles.note}>{log.note}</Text> : null}
      </View>
    </View>
  );
}

export default function TimelineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { habits, logs, fetchLogsForHabit } = useHabitStore();
  const habit = habits.find((h) => h.id === id);
  const habitLogs = id ? (logs[id] ?? []) : [];

  useEffect(() => {
    if (id) fetchLogsForHabit(id);
  }, [id]);

  if (!habit) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Habit not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={habitLogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LogCard log={item} />}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{habit.title}</Text>
            <Text style={styles.sub}>{habitLogs.length} entries in the last 90 days</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No logs yet. Start checking in daily.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: modern.background },
  list: { padding: spacing.xl, paddingBottom: 40 },
  header: { marginBottom: spacing.xl },
  title: { color: modern.textPrimary, fontFamily: fonts.body, fontSize: fontSizes.xl, fontWeight: '700' },
  sub: { color: modern.textSecondary, fontFamily: fonts.body, fontSize: fontSizes.sm, marginTop: 4 },
  error: { color: modern.danger, textAlign: 'center', marginTop: 40, fontFamily: fonts.body },
  card: { flexDirection: 'row', marginBottom: spacing.lg },
  cardLeft: { alignItems: 'center', width: 24, marginRight: spacing.lg },
  dot: { width: 12, height: 12, borderRadius: modernRadius.full, marginTop: 4 },
  dotDone: { backgroundColor: modern.green },
  dotMissed: { backgroundColor: modern.textDisabled },
  line: { flex: 1, width: 2, backgroundColor: modern.surface, marginTop: 4 },
  cardRight: {
    ...modernCard,
    flex: 1,
    padding: spacing.md,
    marginBottom: 4,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  dateText: { color: modern.textSecondary, fontFamily: fonts.body, fontSize: fontSizes.sm, flex: 1 },
  mood: { fontSize: fontSizes.base },
  statusBadge: { borderRadius: modernRadius.full, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  statusBadgeDone: { backgroundColor: 'rgba(6,214,160,0.15)' },
  statusBadgeMissed: { backgroundColor: 'rgba(239,71,111,0.15)' },
  statusBadgeText: { color: modern.textPrimary, fontFamily: fonts.body, fontSize: fontSizes.xs, fontWeight: '600' },
  photo: { width: '100%', height: 160, borderRadius: modernRadius.md, marginBottom: spacing.sm },
  note: { color: modern.textSecondary, fontFamily: fonts.body, fontSize: fontSizes.sm, lineHeight: 20 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: modern.textSecondary, fontFamily: fonts.body, fontSize: fontSizes.sm },
});
