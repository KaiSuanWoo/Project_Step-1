import { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, ActivityIndicator, Image, ScrollView, ViewStyle, TextStyle,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useHabitStore } from '@/store/useHabitStore';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/useUserStore';
import {
  modern, fonts, fontSizes, spacing, modernRadius,
  modernCard, modernCardElevated, modernButton, modernButtonSecondary,
  modernInput, modernSectionLabel,
} from '@/constants/Theme';

type CheckInStep = 'confirm' | 'mood' | 'photo' | 'note';

async function uploadPhoto(uri: string, userId: string): Promise<string> {
  const ext = uri.split('.').pop() ?? 'jpg';
  const fileName = `${userId}/${Date.now()}.${ext}`;
  const response = await fetch(uri);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();

  const { error } = await supabase.storage
    .from('habit-logs')
    .upload(fileName, arrayBuffer, { contentType: `image/${ext}` });
  if (error) throw error;

  const { data } = supabase.storage.from('habit-logs').getPublicUrl(fileName);
  return data.publicUrl;
}

const MOODS = [
  { value: 1, emoji: '😞', label: 'Rough' },
  { value: 2, emoji: '😕', label: 'Meh' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' },
];

export default function CheckInScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { habits, checkIn } = useHabitStore();
  const { user } = useUserStore();
  const habit = habits.find((h) => h.id === id);

  const [step, setStep] = useState<CheckInStep>('confirm');
  const [note, setNote] = useState('');
  const [mood, setMood] = useState<number | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo access to attach a progress photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow camera access to take a progress photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const handleComplete = async () => {
    if (!id || !user) return;
    setSaving(true);
    try {
      let photoUrl: string | null = null;
      if (photoUri) {
        photoUrl = await uploadPhoto(photoUri, user.id);
      }

      const streak = await checkIn(id, {
        note: note.trim() || null,
        mood,
        photo_url: photoUrl,
      });

      Alert.alert(
        `${streak.current_streak} day streak! 🔥`,
        streak.current_streak > 1
          ? `You're on a ${streak.current_streak}-day streak. +10 coins earned!`
          : 'First step done. +10 coins earned! Come back tomorrow!',
        [{ text: 'Nice!', onPress: () => router.back() }]
      );
    } catch {
      Alert.alert('Error', 'Could not save check-in. Try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!habit) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Habit not found.</Text>
      </View>
    );
  }

  const stepIndex = ['confirm', 'mood', 'photo', 'note'].indexOf(step);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Progress dots */}
      <View style={styles.progressRow}>
        {['confirm', 'mood', 'photo', 'note'].map((s, i) => (
          <View
            key={s}
            style={[styles.progressDot, i <= stepIndex && styles.progressDotActive]}
          />
        ))}
      </View>

      <Text style={styles.habitTitle}>{habit.title}</Text>

      {/* Step 1: Confirm */}
      {step === 'confirm' && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepQuestion}>Did you do it? 💪</Text>
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={() => setStep('mood')}
            activeOpacity={0.7}
          >
            <Text style={styles.confirmBtnText}>Yes, I did it!</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.missedBtn}
            onPress={() => router.push(`/reflection/${id}`)}
          >
            <Text style={styles.missedBtnText}>I didn't do it today</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 2: Mood */}
      {step === 'mood' && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepQuestion}>How did it feel?</Text>
          <View style={styles.moodRow}>
            {MOODS.map((m) => (
              <TouchableOpacity
                key={m.value}
                style={[styles.moodBtn, mood === m.value && styles.moodBtnSelected]}
                onPress={() => setMood(mood === m.value ? null : m.value)}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text style={[styles.moodLabel, mood === m.value && styles.moodLabelSelected]}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.navRow}>
            <TouchableOpacity onPress={() => setStep('confirm')}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={() => setStep('photo')}
            >
              <Text style={styles.nextBtnText}>{mood ? 'Continue →' : 'Skip →'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Step 3: Photo */}
      {step === 'photo' && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepQuestion}>Add a progress photo?</Text>
          {photoUri ? (
            <View style={styles.photoPreviewWrap}>
              <Image source={{ uri: photoUri }} style={styles.photoPreview} />
              <TouchableOpacity style={styles.removePhoto} onPress={() => setPhotoUri(null)}>
                <Text style={styles.removePhotoText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoRow}>
              <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
                <Text style={styles.photoBtnIcon}>📷</Text>
                <Text style={styles.photoBtnText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoBtn} onPress={pickPhoto}>
                <Text style={styles.photoBtnIcon}>🖼️</Text>
                <Text style={styles.photoBtnText}>Library</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.navRow}>
            <TouchableOpacity onPress={() => setStep('mood')}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextBtn} onPress={() => setStep('note')}>
              <Text style={styles.nextBtnText}>{photoUri ? 'Continue →' : 'Skip →'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Step 4: Note + Submit */}
      {step === 'note' && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepQuestion}>Any thoughts?</Text>
          <TextInput
            style={styles.textarea}
            value={note}
            onChangeText={setNote}
            placeholder="Add a note (optional)..."
            placeholderTextColor={modern.textDisabled}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[styles.submitBtn, saving && styles.btnDisabled]}
            onPress={handleComplete}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={modern.background} />
            ) : (
              <Text style={styles.submitBtnText}>Complete Check-in ✓</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStep('photo')}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: modern.background },
  content: { padding: spacing.xl, paddingBottom: 40 },
  error: { color: modern.danger, textAlign: 'center', marginTop: 40, fontFamily: fonts.body },

  // Progress
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: modern.surfaceElevated,
  },
  progressDotActive: {
    backgroundColor: modern.accent,
  },

  habitTitle: {
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.xl,
    fontWeight: '700',
    marginBottom: spacing.xl,
  },

  // Steps
  stepContainer: {
    gap: spacing.lg,
  },
  stepQuestion: {
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.lg,
    fontWeight: '600',
  },

  // Confirm
  confirmBtn: {
    ...modernButton,
    backgroundColor: modern.green,
    shadowColor: modern.green,
  } as ViewStyle,
  confirmBtnText: {
    color: modern.background,
    fontFamily: fonts.body,
    fontSize: fontSizes.base,
    fontWeight: '700',
  },
  missedBtn: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  missedBtnText: {
    color: modern.danger,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
  },

  // Mood
  moodRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  moodBtn: {
    ...modernCard,
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  moodBtnSelected: {
    borderColor: modern.accent,
    backgroundColor: modern.surfaceElevated,
  },
  moodEmoji: { fontSize: 28 },
  moodLabel: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.micro,
  },
  moodLabelSelected: {
    color: modern.accent,
  },

  // Photo
  photoRow: { flexDirection: 'row', gap: spacing.md },
  photoBtn: {
    ...modernCard,
    flex: 1,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
  },
  photoBtnIcon: { fontSize: 28 },
  photoBtnText: { color: modern.textSecondary, fontFamily: fonts.body, fontSize: fontSizes.sm },
  photoPreviewWrap: { position: 'relative' },
  photoPreview: { width: '100%', height: 200, borderRadius: modernRadius.md },
  removePhoto: {
    position: 'absolute', top: spacing.sm, right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: modernRadius.sm, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
  },
  removePhotoText: { color: modern.textPrimary, fontFamily: fonts.body, fontSize: fontSizes.xs },

  // Note
  textarea: {
    ...modernInput,
    padding: spacing.lg,
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.base,
    minHeight: 100,
    textAlignVertical: 'top',
  } as TextStyle,

  // Navigation
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  backText: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    padding: spacing.sm,
  },
  nextBtn: {
    backgroundColor: modern.accent,
    borderRadius: modernRadius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  nextBtnText: {
    color: modern.background,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    fontWeight: '700',
  },

  // Submit
  submitBtn: {
    ...modernButton,
  } as ViewStyle,
  btnDisabled: { opacity: 0.5 },
  submitBtnText: {
    color: modern.background,
    fontFamily: fonts.body,
    fontSize: fontSizes.base,
    fontWeight: '700',
  },
});
