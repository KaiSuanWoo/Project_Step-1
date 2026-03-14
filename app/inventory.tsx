import { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useUserStore } from '@/store/useUserStore';
import { useShopStore } from '@/store/useShopStore';
import {
  modern, fonts, fontSizes, spacing, modernRadius,
  modernCard, modernButton, modernButtonSecondary,
} from '@/constants/Theme';

export default function InventoryScreen() {
  const { user } = useUserStore();
  const { items, inventory, fetchShopItems, fetchInventory, equipItem, unequipItem } = useShopStore();

  useEffect(() => {
    fetchShopItems();
    if (user) fetchInventory(user.id);
  }, [user]);

  // Merge inventory with shop item details
  const ownedItems = inventory.map((inv) => {
    const item = items.find((i) => i.id === inv.item_id);
    return { ...inv, item };
  }).filter((entry) => entry.item);

  const handleToggleEquip = (inventoryId: string, equipped: boolean, name: string) => {
    if (equipped) {
      unequipItem(inventoryId);
    } else {
      Alert.alert(`Equip ${name}?`, 'This item will be applied to your avatar.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Equip', onPress: () => equipItem(inventoryId) },
      ]);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {ownedItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🎒</Text>
          <Text style={styles.emptyTitle}>No items yet</Text>
          <Text style={styles.emptySub}>
            Visit the Shop to purchase outfits, decor, and power-ups.
          </Text>
        </View>
      ) : (
        ownedItems.map((entry) => {
          const item = entry.item!;
          const rarityColor = RARITY_COLORS[item.rarity] ?? modern.textSecondary;

          return (
            <View key={entry.id} style={styles.itemCard}>
              <View style={styles.itemLeft}>
                <View style={styles.itemThumb}>
                  <Text style={styles.itemThumbText}>
                    {item.type === 'outfit' ? '👕' : item.type === 'decor' ? '🏠' : '⚡'}
                  </Text>
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.metaRow}>
                    <Text style={[styles.rarityText, { color: rarityColor }]}>{item.rarity}</Text>
                    <Text style={styles.typeText}>{item.type.replace('_', ' ')}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.equipBtn, entry.equipped && styles.equipBtnActive]}
                onPress={() => handleToggleEquip(entry.id, entry.equipped, item.name)}
              >
                <Text style={[styles.equipBtnText, entry.equipped && styles.equipBtnTextActive]}>
                  {entry.equipped ? 'Equipped' : 'Equip'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const RARITY_COLORS: Record<string, string> = {
  common: modern.textSecondary,
  rare: modern.info,
  epic: '#9B5DE5',
  legendary: modern.accent,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: modern.background },
  content: { padding: spacing.lg, paddingBottom: 40 },

  // Empty
  emptyState: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: {
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  emptySub: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    marginTop: spacing.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },

  // Item card
  itemCard: {
    ...modernCard,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  itemThumb: {
    width: 44,
    height: 44,
    borderRadius: modernRadius.md,
    backgroundColor: modern.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  itemThumbText: { fontSize: 20 },
  itemInfo: { flex: 1 },
  itemName: {
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.base,
  },
  metaRow: { flexDirection: 'row', gap: spacing.sm, marginTop: 2 },
  rarityText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    textTransform: 'capitalize',
  },
  typeText: {
    color: modern.textDisabled,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    textTransform: 'capitalize',
  },

  // Equip button
  equipBtn: {
    borderWidth: 1,
    borderColor: modern.borderSubtle,
    borderRadius: modernRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  equipBtnActive: {
    borderColor: modern.accent,
    backgroundColor: 'rgba(255,209,102,0.1)',
  },
  equipBtnText: {
    color: modern.textSecondary,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
  },
  equipBtnTextActive: { color: modern.accent },
});
