import { router } from 'expo-router';
import { useRef, useState } from 'react';
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
import { setCompletedOrder } from '@/services/completed-order-store';
import { completeOrder } from '@/services/staff-service';
import { ApiError } from '@/services/api-client';

export default function HomeScreen() {
  const { signOut, staff } = useAuth();
  const [orderNo, setOrderNo] = useState('');
  const orderNoRef = useRef('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      router.push('/success');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to complete order. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.appTitle}>Staff</Text>
            {staff ? (
              <Text style={styles.staffMeta}>
                {staff.name}
                {staff.workflowStatus?.name ? ` · ${staff.workflowStatus.name}` : staff.type ? ` · ${staff.type}` : ''}
              </Text>
            ) : null}
          </View>
          <Pressable onPress={signOut}>
            <Text style={styles.logout}>Logout</Text>
          </Pressable>
        </View>
        <View style={styles.formSection}>
          <Text style={styles.heading}>Complete Order</Text>
          <Text style={styles.hint}>Enter global order number to advance workflow</Text>
          <TextInput
            style={styles.input}
            value={orderNo}
            onChangeText={(text) => {
              const cleaned = text.replace(/\D/g, '');
              orderNoRef.current = cleaned;
              setOrderNo(cleaned);
              setError('');
            }}
            placeholder="Order No (e.g. 5)"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color={Brand.white} />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Brand.surfaceLight },
  container: { flex: 1, paddingHorizontal: Spacing.four },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.three },
  appTitle: { fontSize: 22, fontWeight: '700', color: Brand.blue },
  staffMeta: { fontSize: 13, color: '#666', marginTop: 2 },
  logout: { fontSize: 15, color: Brand.red, fontWeight: '600' },
  formSection: { flex: 1, justifyContent: 'center', gap: Spacing.three, marginTop: -Spacing.six },
  heading: { fontSize: 26, fontWeight: '700', color: Brand.textDark, textAlign: 'center' },
  hint: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: Spacing.one },
  input: {
    backgroundColor: Brand.white, borderRadius: 12, borderWidth: 1, borderColor: Brand.borderLight,
    height: 52, paddingHorizontal: Spacing.three, fontSize: 16, color: Brand.textDark,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none', outlineWidth: 0 } as object) : {}),
  },
  submitButton: { backgroundColor: Brand.blue, borderRadius: 28, height: 56, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.one },
  submitButtonDisabled: { opacity: 0.7 },
  submitButtonText: { color: Brand.white, fontSize: 18, fontWeight: '600' },
  error: { color: Brand.red, fontSize: 14, textAlign: 'center' },
});
