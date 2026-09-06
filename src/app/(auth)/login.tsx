import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
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

import { Brand, Spacing } from '@/constants/theme';
import { requestStaffOtp } from '@/services/auth-service';
import { setPendingLoginPhone } from '@/services/pending-login-store';
import { ApiError } from '@/services/api-client';

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
      setPendingLoginPhone(mobile);
      router.push('/otp');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to send OTP. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.decorCircleLarge} />
        <View style={styles.decorCircleSmall} />
        <View style={styles.brandCenter}>
          <View style={styles.brandLogo}>
            <Text style={styles.brandEmoji}>🧵</Text>
          </View>
          <Text style={styles.brandName}>Wevraa Staff</Text>
          <Text style={styles.brandSub}>Workshop App</Text>
        </View>
        <View style={styles.staffBadge}>
          <Text style={styles.staffBadgeText}>✦ Staff & Artisan Portal</Text>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.bodyWrap}>
        <ScrollView
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={styles.stepLabel}>Step 1 of 2</Text>
          <Text style={styles.title}>Enter your{'\n'}mobile number</Text>
          <Text style={styles.subtitle}>We&apos;ll send an OTP to verify your identity</Text>

          <View style={styles.phoneInputWrap}>
            <View style={styles.countryCode}>
              <Text style={styles.flag}>🇮🇳</Text>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              value={mobile}
              onChangeText={(text) => {
                setMobile(text.replace(/\D/g, '').slice(0, 10));
                setError('');
              }}
              keyboardType="phone-pad"
              placeholder="98765 43210"
              placeholderTextColor="#C4C1DC"
              maxLength={10}
              autoFocus
              underlineColorAndroid="transparent"
            />
          </View>

          {mobile.length > 0 && !isValid ? (
            <Text style={styles.error}>Enter a valid 10-digit mobile number</Text>
          ) : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <SymbolView
                name={{ ios: 'info.circle', android: 'info', web: 'info' }}
                size={12}
                tintColor={Brand.authIndigo}
              />
            </View>
            <Text style={styles.infoText}>
              Your number must be registered by your boutique admin. Contact your manager if you
              face issues.
            </Text>
          </View>

          <Pressable
            style={[styles.primaryBtn, (!isValid || isSubmitting) && styles.primaryBtnDisabled]}
            onPress={handleContinue}
            disabled={!isValid || isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color={Brand.white} />
            ) : (
              <>
                <Text style={styles.primaryBtnText}>Send OTP</Text>
                <SymbolView
                  name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
                  size={16}
                  tintColor={Brand.white}
                />
              </>
            )}
          </Pressable>

          <Text style={styles.helpRow}>
            Need help? <Text style={styles.helpLink}>Contact your manager</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Brand.authSurface,
  },
  header: {
    backgroundColor: Brand.authNavy,
    paddingBottom: 32,
    overflow: 'hidden',
    position: 'relative',
  },
  decorCircleLarge: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(99,102,241,0.15)',
    top: -80,
    right: -50,
  },
  decorCircleSmall: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(165,180,252,0.07)',
    bottom: -50,
    left: -20,
  },
  brandCenter: {
    alignItems: 'center',
    paddingTop: Spacing.four,
    zIndex: 1,
  },
  brandLogo: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  brandEmoji: {
    fontSize: 24,
  },
  brandName: {
    fontSize: 24,
    fontWeight: '900',
    color: Brand.white,
    letterSpacing: -0.5,
  },
  brandSub: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginTop: 4,
  },
  staffBadge: {
    alignSelf: 'center',
    marginTop: 14,
    backgroundColor: 'rgba(99,102,241,0.25)',
    borderWidth: 0.5,
    borderColor: 'rgba(165,180,252,0.3)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    zIndex: 1,
  },
  staffBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Brand.authIndigoSoft,
    letterSpacing: 0.4,
  },
  bodyWrap: {
    flex: 1,
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: Spacing.four,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Brand.authMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: Brand.authNavy,
    letterSpacing: -0.5,
    lineHeight: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: Brand.authMuted,
    lineHeight: 20,
    marginBottom: 28,
  },
  phoneInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Brand.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Brand.authBorder,
    overflow: 'hidden',
    marginBottom: 16,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRightWidth: 1,
    borderRightColor: Brand.authBorder,
    backgroundColor: '#F8F7FD',
  },
  flag: {
    fontSize: 18,
  },
  countryCodeText: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.authNavy,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 16,
    fontSize: 16,
    fontWeight: '700',
    color: Brand.authNavy,
    letterSpacing: 1,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none', outlineWidth: 0 } as object) : {}),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 28,
  },
  infoIcon: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: Brand.authIndigoLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: Brand.authMuted,
    lineHeight: 18,
  },
  primaryBtn: {
    backgroundColor: Brand.authNavy,
    borderRadius: 16,
    paddingVertical: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: Brand.authNavy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryBtnDisabled: {
    opacity: 0.5,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: Brand.white,
    letterSpacing: 0.3,
  },
  error: {
    color: Brand.red,
    fontSize: 13,
    marginBottom: 12,
  },
  helpRow: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 12,
    color: Brand.authMuted,
  },
  helpLink: {
    color: Brand.authIndigo,
    fontWeight: '700',
  },
});
