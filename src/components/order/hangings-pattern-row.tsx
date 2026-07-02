import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Brand, Spacing } from '@/constants/theme';

type Props = { hangingsImageUri: string; patternImageUri: string };

export function HangingsPatternRow({ hangingsImageUri, patternImageUri }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <Text style={styles.label}>HANGINGS</Text>
        <Image source={{ uri: hangingsImageUri }} style={styles.image} contentFit="cover" />
      </View>
      <View style={styles.column}>
        <Text style={styles.label}>PATTERN</Text>
        <Image source={{ uri: patternImageUri }} style={styles.image} contentFit="cover" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: Spacing.two, paddingHorizontal: Spacing.three, marginTop: Spacing.four },
  column: { flex: 1, gap: Spacing.one },
  label: { color: Brand.red, fontSize: 14, fontWeight: '700', textAlign: 'center' },
  image: { width: '100%', aspectRatio: 1, borderRadius: 12, backgroundColor: '#ddd' },
});
