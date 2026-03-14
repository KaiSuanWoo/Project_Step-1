import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { modern, fonts, fontSizes, spacing } from '@/constants/Theme';

interface HeaderBarProps {
  title?: string;
}

export default function HeaderBar({ title = 'Step 1' }: HeaderBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <TouchableOpacity style={styles.iconBtn} hitSlop={8}>
        <Text style={styles.icon}>🔔</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      {/* Spacer to keep title centered */}
      <View style={styles.iconBtn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: modern.background,
  },
  iconBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
  title: {
    fontFamily: fonts.pixelHeading,
    fontSize: fontSizes.sm,
    color: modern.textPrimary,
  },
});
