import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import {
  modern, fonts, fontSizes, spacing, modernRadius,
  modernCard, modernSectionLabel,
} from '@/constants/Theme';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* App identity */}
      <View style={styles.heroCard}>
        <Text style={styles.appName}>Step 1</Text>
        <Text style={styles.tagline}>Every habit starts with one step.</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>

      {/* What is Step 1 */}
      <Text style={styles.sectionLabel}>About</Text>
      <View style={styles.card}>
        <Text style={styles.body}>
          Step 1 is a gamified habit tracker that helps you build consistency through streaks,
          rewards, and a pixel-art avatar that reflects your progress. Complete habits, earn coins,
          and customize your environment.
        </Text>
      </View>

      {/* Credits */}
      <Text style={styles.sectionLabel}>Credits</Text>
      <View style={styles.card}>
        <CreditRow label="Framework" value="React Native + Expo" />
        <View style={styles.divider} />
        <CreditRow label="Backend" value="Supabase" />
        <View style={styles.divider} />
        <CreditRow label="Payments" value="Stripe" />
        <View style={styles.divider} />
        <CreditRow label="Fonts" value="Press Start 2P, SpaceMono, VT323" />
      </View>

      {/* Legal */}
      <Text style={styles.sectionLabel}>Legal</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.linkRow}>
          <Text style={styles.linkText}>Privacy Policy</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.linkRow}>
          <Text style={styles.linkText}>Terms of Service</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>Made with care. One step at a time.</Text>
    </ScrollView>
  );
}

function CreditRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.creditRow}>
      <Text style={styles.creditLabel}>{label}</Text>
      <Text style={styles.creditValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: modern.background },
  content: { padding: spacing.lg, paddingBottom: 60 },

  // Hero
  heroCard: {
    ...modernCard,
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  appName: {
    fontFamily: fonts.pixelHeading,
    fontSize: 14,
    color: modern.accent,
  },
  tagline: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    marginTop: spacing.sm,
  },
  version: {
    color: modern.textDisabled,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    marginTop: spacing.xs,
  },

  sectionLabel: { ...modernSectionLabel, marginBottom: spacing.sm, marginTop: spacing.lg },

  card: { ...modernCard, overflow: 'hidden' },
  body: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    lineHeight: 22,
    padding: spacing.lg,
  },

  // Credits
  creditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  creditLabel: { color: modern.textSecondary, fontFamily: fonts.body, fontSize: fontSizes.base },
  creditValue: { color: modern.textPrimary, fontFamily: fonts.body, fontSize: fontSizes.sm, flexShrink: 1, textAlign: 'right' },
  divider: { height: 1, backgroundColor: modern.borderSubtle, marginHorizontal: spacing.lg },

  // Links
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  linkText: { color: modern.textPrimary, fontFamily: fonts.body, fontSize: fontSizes.base },
  chevron: { color: modern.textDisabled, fontSize: 20, fontWeight: '300' },

  footer: {
    color: modern.textDisabled,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    textAlign: 'center',
    marginTop: spacing.xxxl,
  },
});
