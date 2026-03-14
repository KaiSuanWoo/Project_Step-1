import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Niche } from '@/types';
import { modern, fonts, fontSizes, spacing, modernCard } from '@/constants/Theme';

interface HabitTemplate {
  id: string;
  title: string;
  emoji: string;
}

const TEMPLATES: Record<Niche, HabitTemplate[]> = {
  education: [
    { id: 'study-1h', title: 'Study for 1 hour', emoji: '📖' },
    { id: 'read-30', title: 'Read 30 pages', emoji: '📚' },
    { id: 'review-notes', title: 'Review notes', emoji: '📝' },
    { id: 'practice-problems', title: 'Practice problems', emoji: '🧮' },
    { id: 'learn-new', title: 'Learn something new', emoji: '💡' },
  ],
  work: [
    { id: 'deep-work', title: 'Deep work session', emoji: '💻' },
    { id: 'inbox-zero', title: 'Clear inbox', emoji: '📧' },
    { id: 'plan-day', title: 'Plan tomorrow', emoji: '📋' },
    { id: 'skill-build', title: 'Build a skill', emoji: '🛠️' },
    { id: 'network', title: 'Reach out to someone', emoji: '🤝' },
  ],
  fitness: [
    { id: 'workout', title: 'Workout', emoji: '🏋️' },
    { id: 'run', title: 'Go for a run', emoji: '🏃' },
    { id: 'stretch', title: 'Stretch / Yoga', emoji: '🧘' },
    { id: 'hydrate', title: 'Drink 8 glasses of water', emoji: '💧' },
    { id: 'sleep-8h', title: 'Sleep 8 hours', emoji: '😴' },
  ],
  custom: [
    { id: 'custom-1', title: 'Morning routine', emoji: '🌅' },
    { id: 'custom-2', title: 'Journal', emoji: '📓' },
    { id: 'custom-3', title: 'Meditate', emoji: '🧘' },
    { id: 'custom-4', title: 'No phone before bed', emoji: '📵' },
    { id: 'custom-5', title: 'Cook a healthy meal', emoji: '🥗' },
  ],
};

interface HabitTemplatePickerProps {
  niche: Niche;
  selected: string[];
  onToggle: (id: string) => void;
  maxSelection?: number;
}

export default function HabitTemplatePicker({
  niche,
  selected,
  onToggle,
  maxSelection = 3,
}: HabitTemplatePickerProps) {
  const templates = TEMPLATES[niche] ?? TEMPLATES.custom;

  return (
    <View style={styles.container}>
      <Text style={styles.hint}>Pick up to {maxSelection} to start with</Text>
      {templates.map((t) => {
        const isSelected = selected.includes(t.id);
        const isDisabled = !isSelected && selected.length >= maxSelection;
        return (
          <TouchableOpacity
            key={t.id}
            style={[styles.card, isSelected && styles.cardSelected, isDisabled && styles.cardDisabled]}
            onPress={() => !isDisabled && onToggle(t.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{t.emoji}</Text>
            <Text style={[styles.title, isSelected && styles.titleSelected]}>{t.title}</Text>
            {isSelected && <Text style={styles.check}>✓</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  hint: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    marginBottom: spacing.xs,
  },
  card: {
    ...modernCard,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  cardSelected: {
    borderColor: modern.green,
    backgroundColor: modern.surfaceElevated,
  },
  cardDisabled: {
    opacity: 0.4,
  },
  emoji: {
    fontSize: 22,
  },
  title: {
    flex: 1,
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
  },
  titleSelected: {
    color: modern.green,
    fontWeight: '700',
  },
  check: {
    color: modern.green,
    fontSize: 16,
    fontWeight: '700',
  },
});
