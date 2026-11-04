import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { WevraaLogo } from '@/components/wevraa-logo';
import { Colors, Shadow } from '@/constants/theme';

type Props = {
  onBack: () => void;
};

export function OrderDetailsHeader({ onBack }: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        onPress={onBack}
        hitSlop={8}>
        <Icon name="arrow-left" size={18} color={Colors.ink} strokeWidth={2.4} />
      </Pressable>
      <Text style={styles.title}>Order details</Text>
      <View style={styles.logoTile}>
        <WevraaLogo size={28} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.soft,
  },
  pressed: { opacity: 0.7 },
  title: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.ink,
    letterSpacing: -0.3,
  },
  logoTile: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
