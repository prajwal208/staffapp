import { Image, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
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
        <Text style={styles.title}>Design references</Text>
        <Text style={styles.count}>{designs.length}</Text>
      </View>
      <View style={styles.grid}>
        {designs.map((design) => (
          <View key={`${design.label}-${design.imageUri}`} style={styles.cell}>
            <Image source={{ uri: design.imageUri }} style={styles.image} resizeMode="cover" />
            <View style={styles.overlay}>
              <Text style={styles.overlayLabel} numberOfLines={1}>
                {formatLabel(design.label)}
              </Text>
            </View>
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
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.ink,
    letterSpacing: -0.3,
  },
  count: {
    minWidth: 26,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: Colors.orangeTint,
    color: Colors.orange,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  cell: {
    width: '48.5%',
    aspectRatio: 1.15,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.line,
    borderWidth: 1,
    borderColor: Colors.line,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  overlayLabel: {
    color: Colors.ink,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
