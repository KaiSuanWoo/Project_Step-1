import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AvatarSprite from '@/components/avatar/AvatarSprite';
import { modern, fonts, fontSizes, spacing, modernCard, modernRadius } from '@/constants/Theme';

interface AvatarCreatorProps {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  onSkinToneChange: (tone: string) => void;
  onHairStyleChange: (style: string) => void;
  onHairColorChange: (color: string) => void;
}

const SKIN_TONES = [
  { key: 'light', color: '#FFDBB4' },
  { key: 'medium', color: '#E8C9A0' },
  { key: 'tan', color: '#C68642' },
  { key: 'brown', color: '#8D5524' },
  { key: 'dark', color: '#5C3310' },
];

const HAIR_STYLES = [
  { key: 'short', label: 'Short' },
  { key: 'medium', label: 'Medium' },
  { key: 'long', label: 'Long' },
  { key: 'buzz', label: 'Buzz' },
];

const HAIR_COLORS = [
  { key: 'brown', color: '#c47c20' },
  { key: 'black', color: '#2a1a0a' },
  { key: 'blonde', color: '#e8d080' },
  { key: 'red', color: '#c44020' },
  { key: 'blue', color: '#4488cc' },
  { key: 'pink', color: '#cc66aa' },
];

export default function AvatarCreator({
  skinTone,
  hairStyle,
  hairColor,
  onSkinToneChange,
  onHairStyleChange,
  onHairColorChange,
}: AvatarCreatorProps) {
  return (
    <View style={styles.container}>
      {/* Preview */}
      <View style={styles.preview}>
        <AvatarSprite state="idle" pixelSize={6} />
      </View>

      {/* Skin Tone */}
      <Text style={styles.sectionLabel}>Skin Tone</Text>
      <View style={styles.swatchRow}>
        {SKIN_TONES.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[
              styles.swatch,
              { backgroundColor: t.color },
              skinTone === t.key && styles.swatchSelected,
            ]}
            onPress={() => onSkinToneChange(t.key)}
          />
        ))}
      </View>

      {/* Hair Style */}
      <Text style={styles.sectionLabel}>Hair Style</Text>
      <View style={styles.chipRow}>
        {HAIR_STYLES.map((s) => (
          <TouchableOpacity
            key={s.key}
            style={[styles.chip, hairStyle === s.key && styles.chipSelected]}
            onPress={() => onHairStyleChange(s.key)}
          >
            <Text style={[styles.chipText, hairStyle === s.key && styles.chipTextSelected]}>
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Hair Color */}
      <Text style={styles.sectionLabel}>Hair Color</Text>
      <View style={styles.swatchRow}>
        {HAIR_COLORS.map((c) => (
          <TouchableOpacity
            key={c.key}
            style={[
              styles.swatch,
              { backgroundColor: c.color },
              hairColor === c.key && styles.swatchSelected,
            ]}
            onPress={() => onHairColorChange(c.key)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  preview: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: modern.surfaceElevated,
    borderRadius: modernRadius.lg,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  swatchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: modernRadius.full,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchSelected: {
    borderColor: modern.accent,
    borderWidth: 3,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: modernRadius.full,
    backgroundColor: modern.surface,
    borderWidth: 1,
    borderColor: modern.borderSubtle,
  },
  chipSelected: {
    backgroundColor: modern.accent,
    borderColor: modern.accent,
  },
  chipText: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
  },
  chipTextSelected: {
    color: modern.background,
    fontWeight: '700',
  },
});
