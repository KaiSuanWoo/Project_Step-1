import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  Alert, ActivityIndicator, ScrollView, Dimensions, ViewStyle, TextStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Niche } from '@/types';
import AvatarSprite from '@/components/avatar/AvatarSprite';
import NicheCard from '@/components/onboarding/NicheCard';
import AvatarCreator from '@/components/onboarding/AvatarCreator';
import HabitTemplatePicker from '@/components/onboarding/HabitTemplatePicker';
import {
  modern, fonts, fontSizes, spacing, modernRadius,
  modernButton, modernButtonSecondary, modernInput, modernCard,
} from '@/constants/Theme';

const { width: SCREEN_W } = Dimensions.get('window');

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;
const TOTAL_STEPS = 7;

const NICHES: { key: Niche; label: string; emoji: string; desc: string }[] = [
  { key: 'education', label: 'Education', emoji: '📚', desc: 'Study, read, learn new things' },
  { key: 'work', label: 'Work', emoji: '💼', desc: 'Productivity, career, side projects' },
  { key: 'fitness', label: 'Fitness', emoji: '🏋️', desc: 'Training, health, nutrition' },
  { key: 'custom', label: 'Custom', emoji: '🎯', desc: 'Build your own path' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  // Step 2: Name
  const [displayName, setDisplayName] = useState('');

  // Step 3: Niche
  const [selectedNiche, setSelectedNiche] = useState<Niche | null>(null);

  // Step 4: Avatar
  const [skinTone, setSkinTone] = useState('medium');
  const [hairStyle, setHairStyle] = useState('short');
  const [hairColor, setHairColor] = useState('brown');

  // Step 5: Habits
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);

  // Step 7: Auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);

  const canProceed = (): boolean => {
    switch (step) {
      case 1: return true;
      case 2: return displayName.trim().length >= 2;
      case 3: return selectedNiche !== null;
      case 4: return true; // avatar defaults are fine
      case 5: return selectedHabits.length > 0;
      case 6: return true; // goal is optional
      case 7: return email.trim().length > 0 && password.trim().length >= 6;
      default: return true;
    }
  };

  const goNext = () => {
    if (step < TOTAL_STEPS) setStep((step + 1) as Step);
  };

  const goBack = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const handleToggleHabit = (id: string) => {
    setSelectedHabits((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Create user record
        await supabase.from('users').upsert({
          id: user.id,
          email: user.email,
          niche: selectedNiche ?? 'custom',
          tokens: 0,
          subscription_status: 'free',
          subscription_tier: 'free',
        });

        // Create avatar
        await supabase.from('avatars').upsert({
          user_id: user.id,
          base_type: 'default',
          animation_state: 'idle',
          skin_tone: skinTone,
          hair_style: hairStyle,
          hair_color: hairColor,
        });

        // Create selected habits
        for (const habitId of selectedHabits) {
          // habitId is a template key — extract a title
          const title = habitId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
          await supabase.from('habits').insert({
            user_id: user.id,
            title,
            frequency: 'daily',
            niche: selectedNiche ?? 'custom',
            archived: false,
          });
        }
      }

      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const renderProgressDots = () => (
    <View style={styles.progressRow}>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <View
          key={i}
          style={[
            styles.progressDot,
            i + 1 <= step && styles.progressDotActive,
            i + 1 === step && styles.progressDotCurrent,
          ]}
        />
      ))}
    </View>
  );

  // ─── Step 1: Welcome ───────────────────────────────────────────────
  if (step === 1) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <AvatarSprite state="celebrating" pixelSize={7} />
          <Text style={styles.logo}>Step 1</Text>
          <Text style={styles.tagline}>Every habit starts with one step.</Text>
        </View>
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.primaryBtn} onPress={goNext}>
            <Text style={styles.primaryBtnText}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ghostBtn}
            onPress={() => { setIsSignUp(false); setStep(7); }}
          >
            <Text style={styles.ghostBtnText}>I already have an account</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ─── Step 7: Auth ──────────────────────────────────────────────────
  if (step === 7) {
    return (
      <View style={styles.container}>
        {renderProgressDots()}
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.stepTitle}>{isSignUp ? 'Create your account' : 'Welcome back'}</Text>
          <Text style={styles.stepSubtitle}>
            {isSignUp ? 'Sign up to save your progress' : 'Sign in to continue'}
          </Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={modern.textDisabled}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password (6+ characters)"
            placeholderTextColor={modern.textDisabled}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.primaryBtn, (!canProceed() || loading) && styles.btnDisabled]}
            onPress={handleFinish}
            disabled={!canProceed() || loading}
          >
            {loading ? (
              <ActivityIndicator color={modern.background} />
            ) : (
              <Text style={styles.primaryBtnText}>
                {isSignUp ? 'Create Account & Start' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.switchText}>
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {step > 1 && (
          <TouchableOpacity style={styles.backBtn} onPress={goBack}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // ─── Steps 2-6: Generic layout ────────────────────────────────────
  return (
    <View style={styles.container}>
      {renderProgressDots()}

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Step 2: Name */}
        {step === 2 && (
          <>
            <Text style={styles.stepTitle}>What should we call you?</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Your name"
              placeholderTextColor={modern.textDisabled}
              autoFocus
              maxLength={30}
            />
          </>
        )}

        {/* Step 3: Niche */}
        {step === 3 && (
          <>
            <Text style={styles.stepTitle}>What are you working on?</Text>
            <Text style={styles.stepSubtitle}>Choose your main focus</Text>
            <View style={styles.nicheList}>
              {NICHES.map((n) => (
                <NicheCard
                  key={n.key}
                  niche={n.key}
                  label={n.label}
                  emoji={n.emoji}
                  description={n.desc}
                  selected={selectedNiche === n.key}
                  onPress={() => setSelectedNiche(n.key)}
                />
              ))}
            </View>
          </>
        )}

        {/* Step 4: Avatar */}
        {step === 4 && (
          <>
            <Text style={styles.stepTitle}>Create your avatar</Text>
            <Text style={styles.stepSubtitle}>Customize how you look in the app</Text>
            <AvatarCreator
              skinTone={skinTone}
              hairStyle={hairStyle}
              hairColor={hairColor}
              onSkinToneChange={setSkinTone}
              onHairStyleChange={setHairStyle}
              onHairColorChange={setHairColor}
            />
          </>
        )}

        {/* Step 5: Habits */}
        {step === 5 && (
          <>
            <Text style={styles.stepTitle}>Pick your first habits</Text>
            <Text style={styles.stepSubtitle}>
              You can always add more later
            </Text>
            <HabitTemplatePicker
              niche={selectedNiche ?? 'custom'}
              selected={selectedHabits}
              onToggle={handleToggleHabit}
            />
          </>
        )}

        {/* Step 6: Meet your avatar */}
        {step === 6 && (
          <>
            <Text style={styles.stepTitle}>Meet your avatar!</Text>
            <Text style={styles.stepSubtitle}>
              Complete habits to keep them happy. Miss too many and they'll start slacking.
            </Text>
            <View style={styles.avatarShowcase}>
              <View style={styles.avatarDemo}>
                <AvatarSprite state="active" pixelSize={6} />
                <Text style={styles.avatarLabel}>Active</Text>
              </View>
              <View style={styles.avatarDemo}>
                <AvatarSprite state="celebrating" pixelSize={6} />
                <Text style={styles.avatarLabel}>Celebrating</Text>
              </View>
              <View style={styles.avatarDemo}>
                <AvatarSprite state="slacking" pixelSize={6} />
                <Text style={styles.avatarLabel}>Slacking</Text>
              </View>
            </View>
            <View style={styles.tipCard}>
              <Text style={styles.tipText}>
                Complete all habits daily to earn coins, build streaks, and unlock rewards in the shop!
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navRow}>
        {step > 1 ? (
          <TouchableOpacity style={styles.backBtn} onPress={goBack}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
        ) : <View />}

        <TouchableOpacity
          style={[styles.nextBtn, !canProceed() && styles.btnDisabled]}
          onPress={goNext}
          disabled={!canProceed()}
        >
          <Text style={styles.nextBtnText}>
            {step === 6 ? 'Almost done →' : 'Continue →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: modern.background,
    paddingTop: 60,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },

  // Progress
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
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
  progressDotCurrent: {
    width: 24,
    borderRadius: 4,
  },

  // Typography
  logo: {
    fontSize: 14,
    fontFamily: fonts.pixelHeading,
    color: modern.accent,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  tagline: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.base,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  stepTitle: {
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.xl,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  stepSubtitle: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },

  // Inputs
  input: {
    ...modernInput,
    padding: spacing.lg,
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.base,
    marginBottom: spacing.md,
  } as TextStyle,

  // Buttons
  primaryBtn: {
    ...modernButton,
    marginTop: spacing.sm,
  } as ViewStyle,
  primaryBtnText: {
    color: modern.background,
    fontFamily: fonts.body,
    fontSize: fontSizes.base,
    fontWeight: '700',
  },
  ghostBtn: {
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  ghostBtnText: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
  },
  btnDisabled: { opacity: 0.4 },
  switchText: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    textAlign: 'center',
    marginTop: spacing.lg,
    fontSize: fontSizes.sm,
  },

  // Bottom actions (welcome)
  bottomActions: {
    padding: spacing.xl,
    paddingBottom: 40,
  },

  // Navigation
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    paddingBottom: 40,
  },
  backBtn: {
    padding: spacing.md,
  },
  backBtnText: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
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

  // Niche
  nicheList: {
    gap: spacing.md,
  },

  // Avatar showcase (step 6)
  avatarShowcase: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.xl,
  },
  avatarDemo: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatarLabel: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
  },
  tipCard: {
    ...modernCard,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  tipText: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    lineHeight: 20,
    textAlign: 'center',
  },
});
