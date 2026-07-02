import { router } from 'expo-router';
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

import { Brand, Spacing } from '@/constants/theme';
import { ApiError } from '@/services/api-client';
import { requestStaffOtp } from '@/services/auth-service';

const MOBILE_REGEX = /^[6-9]\d{9}$/;

export default function LoginScreen() {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isValid = MOBILE_REGEX.test(mobile);

  async function handleContinue() {
    if (!isValid) return;
    setIsSubmitting(true);
    setError('');
    try {
      await requestStaffOtp(mobile);
      router.push({ pathname: '/otp', params: { mobile } });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to send OTP. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Staff Login</Text>
          <Text style={styles.subtitle}>Enter your mobile number to continue</Text>
          <View style={styles.inputRow}>
            <Text style={styles.prefix}>+91</Text>
            <TextInput
              style={styles.input}
              value={mobile}
              onChangeText={(text) => {
                setMobile(text.replace(/\D/g, '').slice(0, 10));
                setError('');
              }}
              keyboardType="phone-pad"
              placeholder="Mobile number"
              placeholderTextColor="#999"
              maxLength={10}
              autoFocus
              underlineColorAndroid="transparent"
            />
          </View>
          {mobile.length > 0 && !isValid ? (
            <Text style={styles.error}>Enter a valid 10-digit mobile number</Text>
          ) : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
        <Pressable
          style={[styles.button, (!isValid || isSubmitting) && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!isValid || isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color={Brand.white} />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Brand.surfaceLight },
  container: { flex: 1, paddingHorizontal: Spacing.four, justifyContent: 'space-between', paddingBottom: Spacing.four },
  content: { flex: 1, justifyContent: 'center', gap: Spacing.two },
  title: { fontSize: 28, fontWeight: '700', color: Brand.blue, textAlign: 'center' },
  subtitle: { fontSize: 16, color: Brand.textDark, textAlign: 'center', marginBottom: Spacing.four },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Brand.white,
    borderRadius: 12, borderWidth: 1, borderColor: Brand.borderLight,
    paddingHorizontal: Spacing.three, height: 56,
  },
  prefix: { fontSize: 16, fontWeight: '600', color: Brand.blue, marginRight: Spacing.two },
  input: {
    flex: 1, fontSize: 16, color: Brand.textDark, borderWidth: 0,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none', outlineWidth: 0 } as object) : {}),
  },
  error: { color: Brand.red, fontSize: 14, marginTop: Spacing.one, textAlign: 'center' },
  button: { backgroundColor: Brand.blue, borderRadius: 28, height: 56, alignItems: 'center', justifyContent: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: Brand.white, fontSize: 18, fontWeight: '600' },
});
