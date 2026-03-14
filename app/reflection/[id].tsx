import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useHabitStore } from '@/store/useHabitStore';
import { supabase } from '@/lib/supabase';
import {
  modern, fonts, fontSizes, spacing, modernRadius,
  modernCard, modernButton, modernButtonSecondary, modernInput, modernSectionLabel,
} from '@/constants/Theme';

const PROMPTS = [
  "What got in the way today?",
  "What would have made it easier?",
  "What's one thing you'll do differently tomorrow?",
  "Be honest — what's the real reason you skipped?",
  "What's still within your control right now?",
];

export default function ReflectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { habits } = useHabitStore();
  const habit = habits.find((h) => h.id === id);

  const [response, setResponse] = useState('');
  const [saving, setSaving] = useState(false);
  const prompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];

  const handleSave = async () => {
    if (!id || !response.trim()) return;
    setSaving(true);
    try {
      await supabase.from('reflections').insert({
        habit_id: id,
        date: new Date().toISOString().split('T')[0],
        prompt,
        response: response.trim(),
      });
      router.back();
    } catch {
      Alert.alert('Error', 'Could not save reflection.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.promptLabel}>Reflect</Text>
      {habit && <Text style={styles.habitName}>{habit.title}</Text>}

      <View style={styles.promptBox}>
        <Text style={styles.prompt}>"{prompt}"</Text>
      </View>

      <TextInput
        style={styles.textarea}
        value={response}
        onChangeText={setResponse}
        placeholder="Be honest with yourself..."
        placeholderTextColor={modern.textDisabled}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        autoFocus
      />

      <TouchableOpacity
        style={[styles.saveBtn, (!response.trim() || saving) && styles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={!response.trim() || saving}
      >
        {saving
          ? <ActivityIndicator color={modern.background} />
          : <Text style={styles.saveBtnText}>Save Reflection</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipBtn} onPress={() => router.back()}>
        <Text style={styles.skipBtnText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: modern.background, padding: spacing.xl },
  promptLabel: { ...modernSectionLabel, color: modern.accent },
  habitName: {
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: spacing.xl,
  },
  promptBox: {
    ...modernCard,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderLeftWidth: 3,
    borderLeftColor: modern.accent,
  } as ViewStyle,
  prompt: { color: modern.textSecondary, fontFamily: fonts.body, fontSize: fontSizes.base, lineHeight: 24, fontStyle: 'italic' },
  textarea: {
    ...modernInput,
    padding: spacing.lg,
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.base,
    minHeight: 140,
    flex: 1,
  } as TextStyle,
  saveBtn: { ...modernButton, padding: spacing.lg, marginTop: spacing.lg } as ViewStyle,
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: modern.background, fontFamily: fonts.body, fontSize: fontSizes.base, fontWeight: '700' },
  skipBtn: { ...modernButtonSecondary, padding: spacing.lg, marginTop: spacing.sm } as ViewStyle,
  skipBtnText: { color: modern.textSecondary, fontFamily: fonts.body, fontSize: fontSizes.sm },
});
