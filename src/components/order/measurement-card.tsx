import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';

import { Brand, Spacing } from '@/constants/theme';
import type { Measurement } from '@/types/order';

type Props = { measurements: Measurement[] };

export function MeasurementCard({ measurements }: Props) {
  if (measurements.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Detailed Measurements</Text>
        <View style={styles.unitBadge}>
          <SymbolView
            name={{ ios: 'ruler', android: 'straighten', web: 'straighten' }}
            size={12}
            tintColor={Brand.blueAccent}
          />
          <Text style={styles.unitText}>UNIT: INCHES</Text>
        </View>
      </View>
      <View style={styles.grid}>
        {measurements.map((item) => (
          <View key={item.label} style={styles.card}>
            <Text style={styles.label}>{item.label.toUpperCase()}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.three,
    marginTop: Spacing.four,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
    gap: Spacing.two,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.textDark,
    flex: 1,
  },
  unitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Brand.blueLight,
    borderRadius: 12,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
  },
  unitText: {
    color: Brand.blueAccent,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  card: {
    width: '48%',
    backgroundColor: Brand.white,
    borderRadius: 12,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Brand.borderLight,
  },
  label: {
    color: Brand.textMuted,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  value: {
    color: Brand.textDark,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
  },
});
