import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CustomerInfoCard } from '@/components/order/customer-info-card';
import { DesignImageGrid } from '@/components/order/design-image-grid';
import { FeatureCards } from '@/components/order/feature-cards';
import { MeasurementCard } from '@/components/order/measurement-card';
import { OrderDetailsHeader } from '@/components/order/order-details-header';
import { ProductionFlowSection } from '@/components/order/production-flow-section';
import { SharePrintButton } from '@/components/order/share-print-button';
import { Brand } from '@/constants/theme';
import type { CompleteOrderViewModel } from '@/utils/complete-order-mapper';

type Props = { order: CompleteOrderViewModel; onBack: () => void };

export function CompleteOrderDetails({ order, onBack }: Props) {
  const statusLabel = order.workflowStatusName ?? order.currentStatus;

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <OrderDetailsHeader onBack={onBack} />
      </SafeAreaView>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <CustomerInfoCard
          customerName={order.customerName}
          orderType={order.orderType}
          category={order.category}
          deliveryDate={order.deliveryDate}
          statusLabel={statusLabel}
          statusColor={order.workflowStatusColor}
        />
        <ProductionFlowSection
          previousStatus={order.previousStatus}
          currentStatus={order.currentStatus}
        />
        <DesignImageGrid designs={order.designs} />
        <FeatureCards features={order.features} />
        <MeasurementCard measurements={order.measurements} />
        <SharePrintButton order={order} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.surfaceLight },
  safeTop: { backgroundColor: Brand.white },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
});
