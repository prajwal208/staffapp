import { Share, StyleSheet } from 'react-native';

import { GradientButton } from '@/components/gradient-button';
import type { CompleteOrderViewModel } from '@/utils/complete-order-mapper';

type Props = { order: CompleteOrderViewModel };

export function SharePrintButton({ order }: Props) {
  async function handleShare() {
    const measurementLines = order.measurements.map((m) => `${m.label}: ${m.value}`).join('\n');
    const billLine = order.billNo != null ? `Bill No: ${order.billNo}\n` : '';
    await Share.share({
      message: [
        billLine,
        `Customer: ${order.customerName}`,
        `Order No: ${order.orderNo}`,
        `Delivery: ${order.deliveryDate}`,
        `Type: ${order.orderType}`,
        `Status: ${order.currentStatus}`,
        '',
        'Measurements (inches):',
        measurementLines,
      ].filter(Boolean).join('\n'),
      title: order.billNo != null ? `Bill ${order.billNo} - ${order.customerName}` : `Order ${order.orderNo} - ${order.customerName}`,
    });
  }

  return (
    <GradientButton
      label="Share order summary"
      icon="share"
      onPress={handleShare}
      style={styles.button}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 18,
    marginTop: 22,
    marginBottom: 8,
  },
});
