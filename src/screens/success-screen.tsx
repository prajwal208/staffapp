import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CompleteOrderDetails } from '@/components/order/complete-order-details';
import { Colors } from '@/constants/theme';
import type { ScreenProps } from '@/navigation/types';
import { clearCompletedOrder, getCompletedOrder } from '@/services/completed-order-store';
import type { CompleteOrderResponse } from '@/types/api';
import { mapCompleteOrderToViewModel } from '@/utils/complete-order-mapper';

export function SuccessScreen({ navigation }: ScreenProps<'Success'>) {
  const [order, setOrder] = useState<CompleteOrderResponse | null>(null);

  useEffect(() => {
    const data = getCompletedOrder();
    if (!data) {
      navigation.goBack();
      return;
    }
    setOrder(data);
  }, [navigation]);

  const viewModel = useMemo(() => (order ? mapCompleteOrderToViewModel(order) : null), [order]);
  if (!viewModel) return null;

  function handleNextOrder() {
    clearCompletedOrder();
    navigation.popToTop();
  }

  return (
    <View style={styles.screen}>
      <CompleteOrderDetails order={viewModel} onBack={handleNextOrder} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
});
