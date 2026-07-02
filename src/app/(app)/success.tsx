import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CompleteOrderDetails } from '@/components/order/complete-order-details';
import { Brand, Spacing } from '@/constants/theme';
import { clearCompletedOrder, getCompletedOrder } from '@/services/completed-order-store';
import type { CompleteOrderResponse } from '@/types/api';
import { mapCompleteOrderToViewModel } from '@/utils/complete-order-mapper';

export default function SuccessScreen() {
  const insets = useSafeAreaInsets();
  const [order, setOrder] = useState<CompleteOrderResponse | null>(null);

  useEffect(() => {
    const data = getCompletedOrder();
    if (!data) {
      router.replace('/');
      return;
    }
    setOrder(data);
  }, []);

  const viewModel = useMemo(() => (order ? mapCompleteOrderToViewModel(order) : null), [order]);
  if (!viewModel) return null;

  function handleNextOrder() {
    clearCompletedOrder();
    router.replace('/');
  }

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <CompleteOrderDetails order={viewModel} onBack={handleNextOrder} />
      </View>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.two) }]}>
        <Pressable style={styles.nextButton} onPress={handleNextOrder}>
          <Text style={styles.nextButtonText}>Next order</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.surfaceLight },
  content: { flex: 1 },
  footer: { paddingHorizontal: Spacing.three, paddingTop: Spacing.two, backgroundColor: Brand.surfaceLight, borderTopWidth: 1, borderTopColor: Brand.borderLight },
  nextButton: { backgroundColor: Brand.green, borderRadius: 28, height: 48, alignItems: 'center', justifyContent: 'center' },
  nextButtonText: { color: Brand.white, fontSize: 16, fontWeight: '600' },
});
