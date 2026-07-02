import { StyleSheet, Text, View } from 'react-native';

import { Brand, Spacing } from '@/constants/theme';
import type { Measurement } from '@/types/order';

type Props = { measurements: Measurement[] };

export function MeasurementCard({ measurements }: Props) {
  const pairs: Measurement[][] = [];
  for (let i = 0; i < measurements.length; i += 2) {
    pairs.push(measurements.slice(i, i + 2));
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>
        Customer Measurement by <Text style={styles.inches}>INCHES</Text>
      </Text>
      <View style={styles.cardOuter}>
        <View style={styles.notchLeft} />
        <View style={styles.notchRight} />
        <View style={styles.card}>
          {pairs.map((pair, rowIndex) => (
            <View key={rowIndex} style={[styles.row, rowIndex < pairs.length - 1 && styles.rowBorder]}>
              {pair.map((item) => (
                <View key={item.label} style={styles.cell}>
                  <Text style={styles.label}>{item.label}</Text>
                  <Text style={styles.value}>{item.value}</Text>
                </View>
              ))}
              {pair.length === 1 ? <View style={styles.cell} /> : null}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: Spacing.three, marginTop: Spacing.four },
  title: { textAlign: 'center', fontSize: 16, fontWeight: '600', color: Brand.textDark, marginBottom: Spacing.two },
  inches: { color: Brand.red, fontWeight: '700' },
  cardOuter: { position: 'relative' },
  card: { backgroundColor: Brand.white, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', borderColor: Brand.borderLight, paddingVertical: Spacing.two, paddingHorizontal: Spacing.two },
  notchLeft: { position: 'absolute', left: -10, top: '50%', marginTop: -12, width: 20, height: 24, borderRadius: 12, backgroundColor: Brand.surfaceLight, zIndex: 1 },
  notchRight: { position: 'absolute', right: -10, top: '50%', marginTop: -12, width: 20, height: 24, borderRadius: 12, backgroundColor: Brand.surfaceLight, zIndex: 1 },
  row: { flexDirection: 'row' },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Brand.borderLight, borderStyle: 'dotted' },
  cell: { flex: 1, paddingVertical: Spacing.two, paddingHorizontal: Spacing.two, alignItems: 'center' },
  label: { color: Brand.blue, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  value: { color: Brand.red, fontSize: 18, fontWeight: '700', marginTop: 4 },
});
