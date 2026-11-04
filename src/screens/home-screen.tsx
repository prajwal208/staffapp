import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Blobs } from '@/components/blobs';
import { GradientFill, GradientText } from '@/components/gradient';
import { GradientButton } from '@/components/gradient-button';
import { Icon } from '@/components/icon';
import { WevraaLogo } from '@/components/wevraa-logo';
import { Colors, Shadow, SoftGradient } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import type { ScreenProps } from '@/navigation/types';
import { ApiError } from '@/services/api-client';
import { setCompletedOrder } from '@/services/completed-order-store';
import { completeOrder } from '@/services/staff-service';

function getInitials(name: string | undefined) {
  if (!name) return 'W';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function formatType(type: string | undefined) {
  if (!type) return '';
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

export function HomeScreen({ navigation }: ScreenProps<'Home'>) {
  const { signOut, staff } = useAuth();
  const [orderNo, setOrderNo] = useState('');
  const orderNoRef = useRef('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  async function handleSubmit() {
    const enteredOrderNo = (orderNoRef.current || orderNo).trim();
    const order = Number.parseInt(enteredOrderNo, 10);
    if (!enteredOrderNo) {
      setError('Please enter an Order No');
      return;
    }
    if (!Number.isInteger(order) || order <= 0) {
      setError('Order No must be a valid number');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const result = await completeOrder(order);
      setCompletedOrder(result);
      navigation.navigate('Success');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to complete order. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const staffType = formatType(staff?.type);

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <GradientFill colors={SoftGradient} from={{ x: 0, y: 0 }} to={{ x: 1, y: 1 }} />
            <Blobs intensity={0.7} />
            <SafeAreaView edges={['top']}>
              <View style={styles.headerRow}>
                <View style={styles.avatar}>
                  <GradientFill from={{ x: 0, y: 0 }} to={{ x: 1, y: 1 }} />
                  <Text style={styles.avatarText}>{getInitials(staff?.name)}</Text>
                </View>
                <View style={styles.flex}>
                  <Text style={styles.hello}>Welcome back</Text>
                  <Text style={styles.name} numberOfLines={1}>
                    {staff?.name ?? 'Staff'}
                  </Text>
                </View>
                <View style={styles.logoTile}>
                  <WevraaLogo size={30} />
                </View>
                <Pressable
                  onPress={signOut}
                  style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}
                  hitSlop={6}
                  accessibilityLabel="Logout">
                  <Icon name="logout" size={18} color={Colors.ink} strokeWidth={2.2} />
                </Pressable>
              </View>

              <View style={styles.chips}>
                {staff?.boutiqueName ? (
                  <View style={styles.chip}>
                    <Icon name="store" size={12} color={Colors.inkSoft} strokeWidth={2.4} />
                    <Text style={styles.chipText} numberOfLines={1}>
                      {staff.boutiqueName}
                    </Text>
                  </View>
                ) : null}
                {staffType ? (
                  <View style={styles.chip}>
                    <Text style={styles.chipText}>{staffType}</Text>
                  </View>
                ) : null}
                {staff?.workflowStatus?.name ? (
                  <View style={styles.chip}>
                    <View style={styles.dot} />
                    <Text style={styles.chipText}>{staff.workflowStatus.name}</Text>
                  </View>
                ) : null}
              </View>
            </SafeAreaView>
          </View>

          <View style={styles.body}>
            <View style={styles.enterCard}>
              <Text style={styles.label}>Order number</Text>
              <Text style={styles.sub}>Enter the global order number to advance its workflow.</Text>

              <View style={[styles.orderField, isFocused && styles.fieldFocused]}>
                <GradientText fontSize={28} width={22} height={36}>
                  #
                </GradientText>
                <TextInput
                  style={styles.orderInput}
                  value={orderNo}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/\D/g, '');
                    orderNoRef.current = cleaned;
                    setOrderNo(cleaned);
                    setError('');
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="0000"
                  placeholderTextColor={Colors.placeholder}
                  keyboardType="number-pad"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                  underlineColorAndroid="transparent"
                />
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <GradientButton
                label="Complete order"
                icon="arrow-right"
                onPress={handleSubmit}
                loading={isSubmitting}
                style={styles.button}
              />
            </View>

            <View style={styles.tip}>
              <View style={styles.tipIcon}>
                <Icon name="info" size={12} color={Colors.orange} strokeWidth={2.6} />
              </View>
              <Text style={styles.tipText}>
                Completing an order moves it to the next step in your boutique’s workflow.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingBottom: 30 },
  header: {
    paddingTop: 22,
    paddingHorizontal: 20,
    paddingBottom: 70,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: Colors.white, fontSize: 16, fontWeight: '900' },
  hello: { fontSize: 12, fontWeight: '600', color: Colors.muted },
  name: { fontSize: 19, fontWeight: '900', color: Colors.ink, letterSpacing: -0.4, marginTop: 1 },
  logoTile: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    maxWidth: '100%',
  },
  chipText: { fontSize: 12, fontWeight: '700', color: Colors.inkSoft },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.success },
  body: { paddingHorizontal: 18, marginTop: -46 },
  enterCard: {
    backgroundColor: Colors.card,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.line,
    ...Shadow.card,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.purple,
    textTransform: 'uppercase',
    letterSpacing: 1.3,
  },
  sub: { fontSize: 13, color: Colors.muted, marginTop: 6, marginBottom: 14, lineHeight: 19 },
  orderField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 68,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.line,
    backgroundColor: Colors.field,
  },
  fieldFocused: { borderColor: Colors.pink, backgroundColor: Colors.white },
  orderInput: {
    flex: 1,
    height: 64,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: Colors.ink,
  },
  error: { color: Colors.error, fontSize: 13, marginTop: 10 },
  button: { marginTop: 16 },
  tip: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 16, paddingHorizontal: 6 },
  tipIcon: {
    width: 20,
    height: 20,
    borderRadius: 7,
    backgroundColor: Colors.orangeTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: { flex: 1, fontSize: 12, color: Colors.muted, lineHeight: 18 },
});
