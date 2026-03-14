import { View, Text, StyleSheet } from 'react-native';
import { modern, fonts, fontSizes, spacing, modernCard } from '@/constants/Theme';

interface StreakCalendarProps {
  /** Map of ISO date string (YYYY-MM-DD) to completion count (0+) */
  completionData: Record<string, number>;
  /** Max habits per day (for intensity scaling) */
  maxPerDay: number;
}

const DAYS_TO_SHOW = 91; // ~13 weeks
const COLS = 13;
const CELL_SIZE = 14;
const CELL_GAP = 3;
const DAY_LABELS = ['M', '', 'W', '', 'F', '', 'S'];

function getIntensityColor(count: number, max: number): string {
  if (count === 0) return modern.surfaceElevated;
  const ratio = count / max;
  if (ratio >= 0.75) return '#06D6A0';
  if (ratio >= 0.5) return '#0AA87D';
  if (ratio >= 0.25) return '#0E8A64';
  return '#12704E';
}

export default function StreakCalendar({ completionData, maxPerDay }: StreakCalendarProps) {
  const today = new Date();
  const cells: { date: string; count: number; row: number; col: number }[] = [];

  // Build grid: columns are weeks, rows are days (Mon=0 .. Sun=6)
  for (let i = DAYS_TO_SHOW - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = (d.getDay() + 6) % 7; // Mon=0
    const colFromEnd = Math.floor(i / 7);
    const col = COLS - 1 - colFromEnd;
    cells.push({
      date: dateStr,
      count: completionData[dateStr] ?? 0,
      row: dayOfWeek,
      col,
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity</Text>
      <View style={styles.calendarRow}>
        {/* Day labels */}
        <View style={styles.dayLabels}>
          {DAY_LABELS.map((label, i) => (
            <Text key={i} style={styles.dayLabel}>{label}</Text>
          ))}
        </View>

        {/* Grid */}
        <View style={styles.grid}>
          {cells.map((cell) => (
            <View
              key={cell.date}
              style={[
                styles.cell,
                {
                  backgroundColor: getIntensityColor(cell.count, maxPerDay || 1),
                  top: cell.row * (CELL_SIZE + CELL_GAP),
                  left: cell.col * (CELL_SIZE + CELL_GAP),
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...modernCard,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  title: {
    color: modern.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSizes.base,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  calendarRow: {
    flexDirection: 'row',
  },
  dayLabels: {
    marginRight: spacing.xs,
    justifyContent: 'space-between',
    height: 7 * (CELL_SIZE + CELL_GAP) - CELL_GAP,
  },
  dayLabel: {
    color: modern.textDisabled,
    fontFamily: fonts.body,
    fontSize: 9,
    lineHeight: CELL_SIZE,
    width: 12,
    textAlign: 'center',
  },
  grid: {
    position: 'relative',
    width: COLS * (CELL_SIZE + CELL_GAP),
    height: 7 * (CELL_SIZE + CELL_GAP) - CELL_GAP,
  },
  cell: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 3,
  },
});
