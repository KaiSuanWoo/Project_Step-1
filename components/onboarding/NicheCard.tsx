import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Niche } from '@/types';
import { modern, fonts, fontSizes, spacing, modernCard, modernRadius } from '@/constants/Theme';

interface NicheCardProps {
  niche: Niche;
  label: string;
  emoji: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

export default function NicheCard({ label, emoji, description, selected, onPress }: NicheCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <View style={styles.textWrap}>
        <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
        <Text style={styles.desc}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    ...modernCard,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.lg,
  },
  cardSelected: {
    borderColor: modern.accent,
    backgroundColor: modern.surfaceElevated,
  },
  emoji: {
    fontSize: 36,
  },
  textWrap: {
    flex: 1,
  },
  label: {
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.base,
    fontWeight: '700',
  },
  labelSelected: {
    color: modern.accent,
  },
  desc: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    marginTop: 2,
  },
});
