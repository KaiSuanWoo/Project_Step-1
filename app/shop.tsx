import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useUserStore } from '@/store/useUserStore';
import { useShopStore } from '@/store/useShopStore';
import { useCoinStore } from '@/store/useCoinStore';
import ShopItemCard from '@/components/shop/ShopItemCard';
import Paywall from '@/components/ui/Paywall';
import { ShopItem } from '@/types';
import {
  modern, fonts, fontSizes, spacing,
  modernCard, modernButton, modernSectionLabel,
} from '@/constants/Theme';

type Category = 'outfit' | 'decor' | 'power_up';

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'outfit', label: '👕 Outfits' },
  { key: 'decor', label: '🏠 Decor' },
  { key: 'power_up', label: '⚡ Power-ups' },
];

export default function ShopScreen() {
  const { user, isPremium } = useUserStore();
  const { items, inventory, loading, fetchShopItems, fetchInventory, purchaseItem, ownsItem } = useShopStore();
  const { coins, fetchCoins } = useCoinStore();
  const [category, setCategory] = useState<Category>('outfit');
  const [paywallVisible, setPaywallVisible] = useState(false);

  useEffect(() => {
    fetchShopItems();
    if (user) {
      fetchInventory(user.id);
      fetchCoins(user.id);
    }
  }, [user]);

  const filteredItems = items.filter((i) => i.type === category);

  const handlePurchase = async (item: ShopItem) => {
    if (!user) return;

    if (item.premium_only && !isPremium()) {
      setPaywallVisible(true);
      return;
    }

    if (coins < item.price) {
      Alert.alert('Not enough coins', `You need ${item.price - coins} more coins.`);
      return;
    }

    Alert.alert(
      `Buy ${item.name}?`,
      `This will cost 🪙 ${item.price} coins.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy', onPress: async () => {
            const success = await purchaseItem(user.id, item);
            if (success) {
              Alert.alert('Purchased!', `${item.name} is now yours.`);
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Coin balance */}
      <View style={styles.balanceRow}>
        <Text style={styles.balanceLabel}>Your coins</Text>
        <Text style={styles.balanceValue}>🪙 {coins}</Text>
      </View>

      {/* Category tabs */}
      <View style={styles.categoryRow}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.categoryTab, category === cat.key && styles.categoryTabActive]}
            onPress={() => setCategory(cat.key)}
          >
            <Text style={[styles.categoryText, category === cat.key && styles.categoryTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Items grid */}
      {filteredItems.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No items in this category yet.</Text>
          <Text style={styles.emptyTextSub}>Check back soon!</Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {filteredItems.map((item) => (
            <ShopItemCard
              key={item.id}
              item={item}
              owned={ownsItem(item.id)}
              onPress={() => handlePurchase(item)}
            />
          ))}
        </View>
      )}

      <Paywall
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
        trigger="Unlock premium items in the shop"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: modern.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  balanceRow: {
    ...modernCard,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  balanceLabel: { color: modern.textSecondary, fontFamily: fonts.body, fontSize: fontSizes.base },
  balanceValue: { color: modern.accent, fontFamily: fonts.pixelHeading, fontSize: fontSizes.md },
  categoryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  categoryTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: modern.borderSubtle,
    alignItems: 'center',
  },
  categoryTabActive: {
    backgroundColor: modern.surfaceElevated,
    borderColor: modern.accent,
  },
  categoryText: { color: modern.textSecondary, fontFamily: fonts.body, fontSize: fontSizes.xs },
  categoryTextActive: { color: modern.accent },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyCard: {
    ...modernCard,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: { color: modern.textPrimary, fontFamily: fonts.body, fontSize: fontSizes.base },
  emptyTextSub: { color: modern.textSecondary, fontFamily: fonts.body, fontSize: fontSizes.sm, marginTop: spacing.xs },
});
