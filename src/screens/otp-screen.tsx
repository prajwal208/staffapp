import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Blobs } from '@/components/blobs';
import { GradientFill } from '@/components/gradient';
import { Icon } from '@/components/icon';
import { WevraaLogo } from '@/components/wevraa-logo';
import { Colors, Shadow, SoftGradient } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import type { ScreenProps } from '@/navigation/types';
import { ApiError } from '@/services/api-client';
import { requestStaffOtp } from '@/services/auth-service';
import { clearPendingLoginPhone, getPendingLoginPhone } from '@/services/pending-login-store';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'] as const;

function formatPhoneDisplay(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  if (digits.length > 0) {
    return `+91 ${digits}`;
  }
  return '';
}

export function OtpScreen({ navigation }: ScreenProps<'Otp'>) {
  const { signIn } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    const resolved = getPendingLoginPhone() ?? '';
    setPhone(resolved);
    if (!resolved) {
      navigation.goBack();
    }
  }, [navigation]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const phoneDisplay = formatPhoneDisplay(phone);

  async function handleVerify(code: string) {
    if (code.length !== OTP_LENGTH || !phone) return;
    setIsSubmitting(true);
    setError('');
    try {
      await signIn(phone, code);
      clearPendingLoginPhone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed. Try again.');
      setOtp('');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    if (!phone || isResending) return;
    setIsResending(true);
    setError('');
    try {
      await requestStaffOtp(phone);
      setOtp('');
      setSecondsLeft(RESEND_SECONDS);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to resend OTP.');
    } finally {
      setIsResending(false);
    }
  }

  function handleKey(key: (typeof KEYS)[number]) {
    if (isSubmitting || !key) return;
    setError('');
    if (key === 'del') {
      setOtp((current) => current.slice(0, -1));
      return;
    }
    if (otp.length >= OTP_LENGTH) return;
    const next = otp + key;
    setOtp(next);
    if (next.length === OTP_LENGTH) {
      void handleVerify(next);
    }
  }

  if (!phone) return null;

  return (
    <View style={styles.screen}>
      <Blobs intensity={0.6} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.topBar}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            hitSlop={8}>
            <Icon name="arrow-left" size={18} color={Colors.ink} strokeWidth={2.4} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.miniLogo}>
              <WevraaLogo size={50} />
            </View>
            <Text style={styles.step}>Verify</Text>
            <Text style={styles.title}>Enter the {OTP_LENGTH}-digit code</Text>
            <Text style={styles.sub}>Sent by SMS. It may take a few seconds to arrive.</Text>
          </View>

          <View style={styles.sentCard}>
            <View style={styles.flex}>
              <Text style={styles.sentPhone}>{phoneDisplay}</Text>
              <Text style={styles.sentMeta}>OTP sent just now</Text>
            </View>
            <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
              <Text style={styles.link}>Change</Text>
            </Pressable>
          </View>

          <View style={styles.boxes}>
            {Array.from({ length: OTP_LENGTH }, (_, index) => {
              const digit = otp[index];
              const isActive = index === otp.length && !isSubmitting;
              return (
                <View
                  key={index}
                  style={[
                    styles.box,
                    digit ? styles.boxFilled : null,
                    isActive ? styles.boxActive : null,
                    error ? styles.boxError : null,
                  ]}>
                  {digit ? (
                    <GradientFill colors={SoftGradient} from={{ x: 0, y: 0 }} to={{ x: 1, y: 1 }} />
                  ) : null}
                  <Text style={styles.boxText}>{digit ?? ''}</Text>
                </View>
              );
            })}
          </View>

          {isSubmitting ? (
            <View style={styles.statusRow}>
              <ActivityIndicator size="small" color={Colors.pink} />
              <Text style={styles.statusText}>Verifying…</Text>
            </View>
          ) : error ? (
            <Text style={styles.error}>{error}</Text>
          ) : null}

          <View style={styles.timer}>
            {secondsLeft > 0 ? (
              <Text style={styles.timerText}>
                Resend code in <Text style={styles.timerStrong}>{secondsLeft}s</Text>
              </Text>
            ) : (
              <Pressable onPress={handleResend} disabled={isResending} hitSlop={8}>
                <Text style={styles.link}>{isResending ? 'Sending…' : 'Resend code'}</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>

        <View style={styles.keypad}>
          {KEYS.map((key, index) =>
            key === '' ? (
              <View key={index} style={styles.keySpacer} />
            ) : (
              <Pressable
                key={key}
                onPress={() => handleKey(key)}
                disabled={isSubmitting}
                style={({ pressed }) => [
                  styles.key,
                  key === 'del' && styles.keyGhost,
                  pressed && styles.keyPressed,
                ]}>
                {key === 'del' ? (
                  <Icon name="backspace" size={22} color={Colors.ink} strokeWidth={2} />
                ) : (
                  <Text style={styles.keyText}>{key}</Text>
                )}
              </Pressable>
            ),
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  safe: { flex: 1 },
  flex: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingTop: 10 },
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
  scroll: { paddingHorizontal: 22, paddingBottom: 16 },
  hero: { alignItems: 'center', paddingTop: 10 },
  miniLogo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...Shadow.soft,
  },
  step: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.purple,
    textTransform: 'uppercase',
    letterSpacing: 1.3,
    marginBottom: 6,
  },
  title: { fontSize: 22, fontWeight: '800', color: Colors.ink, letterSpacing: -0.4, textAlign: 'center' },
  sub: { fontSize: 13, color: Colors.muted, marginTop: 6, textAlign: 'center', lineHeight: 20 },
  sentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.line,
  },
  sentPhone: { fontSize: 15, fontWeight: '800', color: Colors.ink, letterSpacing: 0.3 },
  sentMeta: { fontSize: 12, color: Colors.muted, marginTop: 2 },
  link: { fontSize: 13, fontWeight: '800', color: Colors.purple },
  boxes: { flexDirection: 'row', gap: 8, marginTop: 22 },
  box: {
    flex: 1,
    height: 62,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.line,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  boxFilled: { borderColor: Colors.pinkBorder },
  boxActive: { borderColor: Colors.pink },
  boxError: { borderColor: Colors.error },
  boxText: { fontSize: 26, fontWeight: '900', color: Colors.ink },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14 },
  statusText: { fontSize: 13, fontWeight: '600', color: Colors.muted },
  error: { color: Colors.error, fontSize: 13, marginTop: 14, textAlign: 'center' },
  timer: { alignItems: 'center', marginTop: 16 },
  timerText: { fontSize: 13, color: Colors.muted },
  timerStrong: { fontWeight: '800', color: Colors.ink },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 14,
  },
  key: {
    width: '31.5%',
    height: 54,
    borderRadius: 16,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyGhost: { backgroundColor: 'transparent', borderColor: 'transparent' },
  keyPressed: { backgroundColor: Colors.orangeTint },
  keySpacer: { width: '31.5%', height: 54 },
  keyText: { fontSize: 22, fontWeight: '700', color: Colors.ink },
});
