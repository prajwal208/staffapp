import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Blobs } from '@/components/blobs';
import { GradientText } from '@/components/gradient';
import { GradientButton } from '@/components/gradient-button';
import { Icon } from '@/components/icon';
import { WevraaLogo } from '@/components/wevraa-logo';
import { Colors, Shadow } from '@/constants/theme';
import type { ScreenProps } from '@/navigation/types';
import { ApiError } from '@/services/api-client';
import { requestStaffOtp } from '@/services/auth-service';
import { setPendingLoginPhone } from '@/services/pending-login-store';

const MOBILE_REGEX = /^[6-9]\d{9}$/;

export function LoginScreen({ navigation }: ScreenProps<'Login'>) {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isValid = MOBILE_REGEX.test(mobile);

  async function handleContinue() {
    if (!isValid) return;
    setIsSubmitting(true);
    setError('');
    try {
      await requestStaffOtp(mobile);
      setPendingLoginPhone(mobile);
      navigation.navigate('Otp');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to send OTP. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.screen}>
      <Blobs />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.hero}>
              <View style={styles.logoTile}>
                <WevraaLogo size={92} />
              </View>
              <View style={styles.brandRow}>
                <Text style={styles.brand}>Wevraa </Text>
                <GradientText fontSize={30} width={92} letterSpacing={-0.9}>
                  Staff
                </GradientText>
              </View>
              <Text style={styles.tagline}>Your workshop, right in your pocket</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.step}>Sign in</Text>
              <Text style={styles.title}>Enter your mobile number</Text>
              <Text style={styles.sub}>We’ll text you a code to verify it’s you.</Text>

              <View style={[styles.phoneField, isFocused && styles.fieldFocused]}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  value={mobile}
                  onChangeText={(text) => {
                    setMobile(text.replace(/\D/g, '').slice(0, 10));
                    setError('');
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  keyboardType="phone-pad"
                  placeholder="98765 43210"
                  placeholderTextColor={Colors.placeholder}
                  maxLength={10}
                  autoFocus
                  underlineColorAndroid="transparent"
                />
              </View>

              {mobile.length === 10 && !isValid ? (
                <Text style={styles.error}>Enter a valid 10-digit mobile number</Text>
              ) : null}
              {error ? <Text style={styles.error}>{error}</Text> : null}

              <GradientButton
                label="Get OTP"
                icon="arrow-right"
                onPress={handleContinue}
                enabled={isValid}
                loading={isSubmitting}
                style={styles.button}
              />

              <View style={styles.note}>
                <View style={styles.noteIcon}>
                  <Icon name="info" size={11} color={Colors.orange} strokeWidth={2.6} />
                </View>
                <Text style={styles.noteText}>
                  Your number must be added by your boutique owner. Can’t sign in? Ask them to
                  check Staff settings.
                </Text>
              </View>
            </View>

            <Text style={styles.foot}>Powered by Wevraa</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  hero: { alignItems: 'center', paddingTop: 48, paddingHorizontal: 28 },
  logoTile: {
    width: 116,
    height: 116,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brand: { fontSize: 30, fontWeight: '900', color: Colors.ink, letterSpacing: -0.9 },
  tagline: { marginTop: 6, fontSize: 13, fontWeight: '500', color: Colors.muted },
  card: {
    marginTop: 34,
    marginHorizontal: 20,
    backgroundColor: Colors.card,
    borderRadius: 28,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: Colors.line,
    ...Shadow.card,
  },
  step: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.purple,
    textTransform: 'uppercase',
    letterSpacing: 1.3,
    marginBottom: 6,
  },
  title: { fontSize: 22, fontWeight: '800', color: Colors.ink, letterSpacing: -0.4, lineHeight: 28 },
  sub: { fontSize: 13, color: Colors.muted, marginTop: 6, marginBottom: 18, lineHeight: 20 },
  phoneField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.field,
    borderWidth: 2,
    borderColor: Colors.line,
    borderRadius: 18,
    overflow: 'hidden',
  },
  fieldFocused: { borderColor: Colors.pink, backgroundColor: Colors.white },
  countryCode: {
    height: 56,
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRightWidth: 1.5,
    borderRightColor: Colors.line,
  },
  countryCodeText: { fontSize: 15, fontWeight: '700', color: Colors.ink },
  phoneInput: {
    flex: 1,
    height: 56,
    paddingHorizontal: 14,
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: Colors.ink,
  },
  error: { color: Colors.error, fontSize: 13, marginTop: 10 },
  button: { marginTop: 16 },
  note: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 14 },
  noteIcon: {
    width: 18,
    height: 18,
    borderRadius: 6,
    backgroundColor: Colors.orangeTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  noteText: { flex: 1, fontSize: 12, color: Colors.muted, lineHeight: 18 },
  foot: {
    marginTop: 'auto',
    paddingTop: 24,
    paddingBottom: 22,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '500',
    color: Colors.faint,
  },
});
