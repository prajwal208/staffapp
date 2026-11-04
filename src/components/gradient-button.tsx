import { ActivityIndicator, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { GradientFill } from '@/components/gradient';
import { Icon, type IconName } from '@/components/icon';
import { Colors, Shadow } from '@/constants/theme';

type Props = {
  label: string;
  onPress: () => void;
  enabled?: boolean;
  loading?: boolean;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
};

export function GradientButton({ label, onPress, enabled = true, loading = false, icon, style }: Props) {
  const active = enabled && !loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={!active}
      style={({ pressed }) => [
        styles.button,
        enabled ? Shadow.glow : styles.off,
        pressed && styles.pressed,
        style,
      ]}>
      <View style={styles.clip}>{enabled ? <GradientFill /> : null}</View>
      {loading ? (
        <ActivityIndicator color={Colors.white} />
      ) : (
        <>
          <Text style={styles.label}>{label}</Text>
          {icon ? <Icon name={icon} size={16} color={Colors.white} strokeWidth={2.6} /> : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    backgroundColor: Colors.pink,
  },
  off: {
    backgroundColor: Colors.disabled,
  },
  clip: {
    ...StyleSheet.absoluteFill,
    borderRadius: 18,
    overflow: 'hidden',
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  label: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
