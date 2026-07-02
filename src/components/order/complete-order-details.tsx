import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DesignImageGrid } from '@/components/order/design-image-grid';
import { FeatureCards } from '@/components/order/feature-cards';
import { HangingsPatternRow } from '@/components/order/hangings-pattern-row';
import { MeasurementCard } from '@/components/order/measurement-card';
import { OrderHeader } from '@/components/order/order-header';
import { SharePrintButton } from '@/components/order/share-print-button';
import { Brand, Spacing } from '@/constants/theme';
import type { CompleteOrderViewModel } from '@/utils/complete-order-mapper';
import { getStatusColor } from '@/utils/order';

type Props = { order: CompleteOrderViewModel; onBack: () => void };

function formatOrderSummary(order: CompleteOrderViewModel) {
  const orderPart = `Order #${order.orderNo}`;
  return order.billNo != null ? `${orderPart} · Bill #${order.billNo}` : orderPart;
}

export function CompleteOrderDetails({ order, onBack }: Props) {
  const showHangings = Boolean(order.hangingsImageUri || order.patternImageUri);
  const statusColor = getStatusColor(order.workflowStatusColor ?? 'blue');

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <OrderHeader
          customerName={order.customerName}
          billNo={order.billNo}
          orderNumber={order.orderNo}
          deliveryDate={order.deliveryDate}
          orderType={order.orderType}
          customerImageUri={order.customerImageUri}
          onBack={onBack}
        />
      </SafeAreaView>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{formatOrderSummary(order)}</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>New status</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusBadgeText}>{order.workflowStatusName ?? order.currentStatus}</Text>
            </View>
          </View>
          <Text style={styles.statusTransition}>{order.previousStatus} → {order.currentStatus}</Text>
        </View>
        {order.designs.length > 0 ? <DesignImageGrid designs={order.designs} /> : null}
        {order.measurements.length > 0 ? <MeasurementCard measurements={order.measurements} /> : null}
        {order.features.length > 0 ? <FeatureCards features={order.features} /> : null}
        {showHangings ? (
          <HangingsPatternRow
            hangingsImageUri={order.hangingsImageUri ?? order.patternImageUri ?? ''}
            patternImageUri={order.patternImageUri ?? order.hangingsImageUri ?? ''}
          />
        ) : null}
        <SharePrintButton order={order} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.surfaceLight },
  headerSafe: { backgroundColor: Brand.blue },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  summaryCard: { marginHorizontal: Spacing.three, marginTop: Spacing.three, backgroundColor: Brand.white, borderRadius: 16, padding: Spacing.three, gap: Spacing.two },
  summaryTitle: { fontSize: 18, fontWeight: '700', color: Brand.textDark, textAlign: 'center' },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two },
  statusLabel: { fontSize: 15, fontWeight: '600', color: Brand.textDark },
  statusBadge: { borderRadius: 20, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one },
  statusBadgeText: { color: Brand.white, fontWeight: '700', fontSize: 14 },
  statusTransition: { fontSize: 14, color: '#666', textAlign: 'center' },
});
