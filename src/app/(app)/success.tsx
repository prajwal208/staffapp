import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CompleteOrderDetails } from '@/components/order/complete-order-details';
import { Brand } from '@/constants/theme';
import { clearCompletedOrder, getCompletedOrder } from '@/services/completed-order-store';
import type { CompleteOrderResponse } from '@/types/api';
import { mapCompleteOrderToViewModel } from '@/utils/complete-order-mapper';

export default function SuccessScreen() {
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
      <CompleteOrderDetails order={viewModel} onBack={handleNextOrder} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.surfaceLight },
});
