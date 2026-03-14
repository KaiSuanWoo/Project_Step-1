import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Switch, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/useUserStore';
import { scheduleMorningIntent, scheduleEveningCheckIn, cancelAllNotifications, requestNotificationPermissions } from '@/lib/notifications';
import Paywall from '@/components/ui/Paywall';
import {
  modern, fonts, fontSizes, spacing, modernRadius,
  modernCard, modernButton, modernButtonSecondary, modernButtonDanger,
  modernSectionLabel,
} from '@/constants/Theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, isPremium, signOut } = useUserStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [paywallVisible, setPaywallVisible] = useState(false);

  const toggleNotifications = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert('Permission denied', 'Enable notifications in your iPhone Settings.');
        return;
      }
      await scheduleMorningIntent();
      await scheduleEveningCheckIn();
    } else {
      await cancelAllNotifications();
    }
    setNotificationsEnabled(value);
  };

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out', style: 'destructive', onPress: async () => {
          setSigningOut(true);
          await signOut();
          router.replace('/(onboarding)');
        }
      },
    ]);
  };

  const premium = isPremium();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionLabel}>Account</Text>
      <View style={styles.card}>
        <Row label="Email" value={user?.email ?? '—'} />
        <Divider />
        <Row label="Plan" value={premium ? 'Premium' : 'Free'} valueColor={premium ? modern.accent : modern.textSecondary} />
        {user?.subscription_expires_at && (
          <>
            <Divider />
            <Row label="Renews" value={new Date(user.subscription_expires_at).toLocaleDateString()} />
          </>
        )}
      </View>

      {!premium && (
        <TouchableOpacity style={styles.upgradeBtn} onPress={() => setPaywallVisible(true)}>
          <Text style={styles.upgradeBtnText}>Upgrade to Premium</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.sectionLabel}>Notifications</Text>
      <View style={styles.card}>
        <View style={styles.switchRow}>
          <View>
            <Text style={styles.switchLabel}>Daily reminders</Text>
            <Text style={styles.switchSub}>Morning intent + evening check-in</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: modern.surfaceElevated, true: modern.accent }}
            thumbColor={modern.textPrimary}
          />
        </View>
      </View>

      <Text style={styles.sectionLabel}>App</Text>
      <View style={styles.card}>
        <Row label="Version" value="1.0.0" />
      </View>

      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} disabled={signingOut}>
        {signingOut
          ? <ActivityIndicator color={modern.danger} />
          : <Text style={styles.signOutBtnText}>Sign Out</Text>
        }
      </TouchableOpacity>

      <Paywall
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
        trigger="Upgrade to unlock all features"
      />
    </ScrollView>
  );
}

function Row({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, valueColor ? { color: valueColor } : null]}>{value}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: modern.background },
  content: { padding: spacing.xl, paddingBottom: 60 },
  sectionLabel: { ...modernSectionLabel, marginBottom: spacing.sm, marginTop: spacing.xxl },
  card: { ...modernCard, overflow: 'hidden' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg },
  rowLabel: { color: modern.textSecondary, fontFamily: fonts.body, fontSize: fontSizes.base },
  rowValue: { color: modern.textDisabled, fontFamily: fonts.body, fontSize: fontSizes.base },
  divider: { height: 1, backgroundColor: modern.borderSubtle, marginHorizontal: spacing.lg },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg },
  switchLabel: { color: modern.textPrimary, fontFamily: fonts.body, fontSize: fontSizes.base },
  switchSub: { color: modern.textSecondary, fontFamily: fonts.body, fontSize: fontSizes.xs, marginTop: 2 },
  upgradeBtn: { ...modernButton, marginTop: spacing.md },
  upgradeBtnText: { color: modern.background, fontFamily: fonts.body, fontSize: fontSizes.base, fontWeight: '700' },
  signOutBtn: { ...modernButtonSecondary, marginTop: spacing.xxxl },
  signOutBtnText: { color: modern.danger, fontFamily: fonts.body, fontSize: fontSizes.base },
});
