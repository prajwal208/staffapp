import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Brand, Spacing } from '@/constants/theme';
import type { DesignImage } from '@/types/order';

type Props = { designs: DesignImage[] };

function formatLabel(label: string) {
  return label.toUpperCase();
}

export function DesignImageGrid({ designs }: Props) {
  if (designs.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Design References</Text>
        <Text style={styles.viewAll}>View All ›</Text>
      </View>
      <View style={styles.grid}>
        {designs.map((design) => (
          <View key={`${design.label}-${design.imageUri}`} style={styles.cell}>
            <Image source={{ uri: design.imageUri }} style={styles.image} contentFit="cover" />
            <View style={styles.overlay}>
              <Text style={styles.overlayLabel}>{formatLabel(design.label)}</Text>
            </View>
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
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.textDark,
  },
  viewAll: {
    fontSize: 13,
    fontWeight: '600',
    color: Brand.blueAccent,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Spacing.two,
  },
  cell: {
    width: '48%',
    aspectRatio: 1.15,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
  },
  overlayLabel: {
    color: Brand.white,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
