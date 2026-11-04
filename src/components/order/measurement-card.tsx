import { StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Colors } from '@/constants/theme';
import type { Measurement } from '@/types/order';

type Props = { measurements: Measurement[] };

export function MeasurementCard({ measurements }: Props) {
  if (measurements.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Detailed measurements</Text>
        <View style={styles.unitBadge}>
          <Icon name="ruler" size={12} color={Colors.orange} strokeWidth={2.4} />
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
    marginHorizontal: 18,
    marginTop: 22,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.ink,
    letterSpacing: -0.3,
    flex: 1,
  },
  unitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.orangeTint,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  unitText: {
    color: Colors.orange,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  card: {
    width: '48.5%',
    backgroundColor: Colors.card,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.line,
  },
  label: {
    color: Colors.muted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  value: {
    color: Colors.ink,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 6,
    textAlign: 'center',
  },
});
