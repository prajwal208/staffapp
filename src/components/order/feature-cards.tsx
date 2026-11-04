import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
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
    marginHorizontal: 18,
    marginTop: 22,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.ink,
    letterSpacing: -0.3,
    marginBottom: 10,
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
    color: Colors.purple,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  value: {
    color: Colors.ink,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 6,
    textAlign: 'center',
  },
});
