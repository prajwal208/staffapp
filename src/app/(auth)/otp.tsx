import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/auth-context';
import { Brand, Spacing } from '@/constants/theme';
import { requestStaffOtp } from '@/services/auth-service';
import { clearPendingLoginPhone, getPendingLoginPhone } from '@/services/pending-login-store';
import { ApiError } from '@/services/api-client';

function resolvePhoneParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

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

export default function OtpScreen() {
  const params = useLocalSearchParams<{ mobile?: string; phone?: string }>();
  const { signIn } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const fromParams = resolvePhoneParam(params.mobile) || resolvePhoneParam(params.phone);
    const resolved = fromParams || getPendingLoginPhone() || '';
    setPhone(resolved);
    if (!resolved) {
      router.replace('/login');
    }
  }, [params.mobile, params.phone]);

  const isValidLength = otp.length === 6;
  const phoneDisplay = formatPhoneDisplay(phone);

  async function handleVerify() {
    if (!isValidLength || !phone) return;
    setIsSubmitting(true);
    setError('');
    try {
      await signIn(phone, otp);
      clearPendingLoginPhone();
      router.replace('/(app)');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed. Try again.');
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
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to resend OTP.');
    } finally {
      setIsResending(false);
    }
  }

  if (!phone) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>Code sent to {phoneDisplay}</Text>
          <TextInput
            style={styles.input}
            value={otp}
            onChangeText={(text) => {
              setOtp(text.replace(/\D/g, '').slice(0, 6));
              setError('');
            }}
            keyboardType="number-pad"
            placeholder="Enter 6-digit OTP"
            placeholderTextColor="#999"
            maxLength={6}
            autoFocus
            textAlign="center"
            underlineColorAndroid="transparent"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable onPress={handleResend} disabled={isResending}>
            <Text style={styles.resend}>{isResending ? 'Sending...' : 'Resend OTP'}</Text>
          </Pressable>
        </View>
        <Pressable
          style={[styles.button, (!isValidLength || isSubmitting) && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={!isValidLength || isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color={Brand.white} />
          ) : (
            <Text style={styles.buttonText}>Verify</Text>
          )}
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Brand.surfaceLight },
  container: { flex: 1, paddingHorizontal: Spacing.four, justifyContent: 'space-between', paddingBottom: Spacing.four },
  content: { flex: 1, justifyContent: 'center', gap: Spacing.two, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: Brand.blue },
  subtitle: { fontSize: 16, color: Brand.textDark, marginBottom: Spacing.three },
  input: {
    width: '100%', backgroundColor: Brand.white, borderRadius: 12, borderWidth: 1,
    borderColor: Brand.borderLight, height: 56, fontSize: 18, color: Brand.textDark,
    paddingHorizontal: Spacing.three,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none', outlineWidth: 0 } as object) : {}),
  },
  error: { color: Brand.red, fontSize: 14, textAlign: 'center' },
  resend: { color: Brand.blue, fontSize: 15, fontWeight: '600', marginTop: Spacing.two },
  button: { backgroundColor: Brand.blue, borderRadius: 28, height: 56, alignItems: 'center', justifyContent: 'center', width: '100%' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: Brand.white, fontSize: 18, fontWeight: '600' },
});
