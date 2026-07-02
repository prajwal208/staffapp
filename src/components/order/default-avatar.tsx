import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { Brand } from '@/constants/theme';

export function DefaultAvatar() {
  return (
    <View style={styles.avatar}>
      <SymbolView
        name={{ ios: 'person.fill', android: 'person', web: 'person' }}
        size={30}
        tintColor={Brand.blue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Brand.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
