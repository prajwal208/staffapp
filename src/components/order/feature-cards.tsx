import { StyleSheet, Text, View } from 'react-native';

import { Brand, Spacing } from '@/constants/theme';
import type { Feature } from '@/types/order';

type Props = { features: Feature[] };

export function FeatureCards({ features }: Props) {
  if (features.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customizations</Text>
      <View style={styles.grid}>
        {features.map((feature) => (
          <View key={feature.label} style={styles.card}>
            <Text style={styles.label}>{feature.label.toUpperCase()}</Text>
            <Text style={styles.value}>{feature.value.toUpperCase()}</Text>
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
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.textDark,
    marginBottom: Spacing.two,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  label: {
    color: Brand.textMuted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  value: {
    color: Brand.textDark,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
  },
});
