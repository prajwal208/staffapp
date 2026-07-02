import { StyleSheet, Text, View } from 'react-native';

import { Brand, Spacing } from '@/constants/theme';
import type { Feature } from '@/types/order';

type Props = { features: Feature[] };

export function FeatureCards({ features }: Props) {
  return (
    <View style={styles.container}>
      {features.map((feature) => (
        <View key={feature.label} style={styles.card}>
          <Text style={styles.label}>{feature.label}</Text>
          <Text style={styles.value}>{feature.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, paddingHorizontal: Spacing.three, marginTop: Spacing.four, justifyContent: 'space-between' },
  card: { width: '22%', minWidth: 72, backgroundColor: Brand.white, borderRadius: 12, paddingVertical: Spacing.two, paddingHorizontal: Spacing.one, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  label: { color: Brand.red, fontSize: 11, fontWeight: '700', textAlign: 'center' },
  value: { color: Brand.blue, fontSize: 14, fontWeight: '700', marginTop: 4, textAlign: 'center' },
});
