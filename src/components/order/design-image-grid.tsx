import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Brand, Spacing } from '@/constants/theme';
import type { DesignImage } from '@/types/order';

type Props = { designs: DesignImage[] };

export function DesignImageGrid({ designs }: Props) {
  return (
    <View style={styles.grid}>
      {designs.map((design) => (
        <View key={design.label} style={styles.cell}>
          <Image source={{ uri: design.imageUri }} style={styles.image} contentFit="cover" />
          <View style={styles.labelOverlay}>
            <Text style={styles.label}>{design.label}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: Spacing.two, paddingHorizontal: Spacing.three, marginTop: Spacing.three },
  cell: { width: '48%', aspectRatio: 1.2, borderRadius: 12, overflow: 'hidden', backgroundColor: '#ddd' },
  image: { width: '100%', height: '100%' },
  labelOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.55)', paddingVertical: Spacing.two, paddingHorizontal: Spacing.two },
  label: { color: Brand.white, fontSize: 13, fontWeight: '600', textAlign: 'center' },
});
