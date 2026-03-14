import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShopItem } from '@/types';
import { modern, fonts, fontSizes, spacing, modernCard, modernRadius } from '@/constants/Theme';

interface ShopItemCardProps {
  item: ShopItem;
  owned: boolean;
  onPress: () => void;
}

const RARITY_COLORS: Record<string, string> = {
  common:    modern.borderSubtle,
  rare:      modern.info,
  epic:      modern.xp,
  legendary: modern.accent,
};

export default function ShopItemCard({ item, owned, onPress }: ShopItemCardProps) {
  return (
    <TouchableOpacity
      style={[styles.container, { borderColor: RARITY_COLORS[item.rarity] ?? modern.borderSubtle }]}
      onPress={onPress}
      disabled={owned}
      activeOpacity={0.7}
    >
      <View style={styles.preview}>
        <Text style={styles.previewEmoji}>
          {item.type === 'outfit' ? '👕' : item.type === 'decor' ? '🪴' : '⚡'}
        </Text>
      </View>

      <Text style={styles.name} numberOfLines={1}>{item.name}</Text>

      {owned ? (
        <Text style={styles.ownedBadge}>Owned</Text>
      ) : (
        <Text style={styles.price}>🪙 {item.price}</Text>
      )}

      {item.premium_only && !owned && (
        <View style={styles.proBadge}>
          <Text style={styles.proBadgeText}>PRO</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    ...modernCard,
    width: '48%',
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  preview: {
    width: 60,
    height: 60,
    backgroundColor: modern.surfaceElevated,
    borderRadius: modernRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  previewEmoji: {
    fontSize: 28,
  },
  name: {
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  price: {
    fontFamily: fonts.pixelHeading,
    fontSize: 9,
    color: modern.accent,
  },
  ownedBadge: {
    color: modern.green,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    fontWeight: '700',
  },
  proBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: modern.xp,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  proBadgeText: {
    color: '#FFFFFF',
    fontFamily: fonts.body,
    fontSize: 8,
    fontWeight: '700',
  },
});
