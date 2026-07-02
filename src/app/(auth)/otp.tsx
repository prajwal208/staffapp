import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
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
import { ApiError } from '@/services/api-client';

function maskMobile(mobile: string) {
  if (mobile.length < 4) return mobile;
  return `+91 XXXXXX${mobile.slice(-4)}`;
}

export default function OtpScreen() {
  const { mobile } = useLocalSearchParams<{ mobile: string }>();
  const { signIn } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const phone = Array.isArray(mobile) ? mobile[0] : (mobile ?? '');
  const isValidLength = otp.length === 6;

  async function handleVerify() {
    if (!isValidLength || !phone) return;
    setIsSubmitting(true);
    setError('');
    try {
      await signIn(phone, otp);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>Code sent to {maskMobile(phone)}</Text>
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
