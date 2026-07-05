import { SymbolView } from 'expo-symbols';
import { Pressable, Share, StyleSheet, Text } from 'react-native';

import { Brand, Spacing } from '@/constants/theme';
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
    <Pressable style={styles.button} onPress={handleShare}>
      <SymbolView
        name={{ ios: 'square.and.arrow.up', android: 'share', web: 'share' }}
        size={18}
        tintColor={Brand.white}
      />
      <Text style={styles.text}>Share Order Summary</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Brand.blueDark,
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    marginHorizontal: Spacing.three,
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
  },
  text: {
    color: Brand.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
