import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Blobs } from '@/components/blobs';
import { CustomerInfoCard } from '@/components/order/customer-info-card';
import { DesignImageGrid } from '@/components/order/design-image-grid';
import { FeatureCards } from '@/components/order/feature-cards';
import { MeasurementCard } from '@/components/order/measurement-card';
import { OrderDetailsHeader } from '@/components/order/order-details-header';
import { ProductionFlowSection } from '@/components/order/production-flow-section';
import { SharePrintButton } from '@/components/order/share-print-button';
import { Colors } from '@/constants/theme';
import type { CompleteOrderViewModel } from '@/utils/complete-order-mapper';

type Props = { order: CompleteOrderViewModel; onBack: () => void };

export function CompleteOrderDetails({ order, onBack }: Props) {
  const statusLabel = order.workflowStatusName ?? order.currentStatus;

  return (
    <View style={styles.screen}>
      <View style={styles.blobs} pointerEvents="none">
        <Blobs intensity={0.45} />
      </View>
      <SafeAreaView edges={['top']}>
        <OrderDetailsHeader onBack={onBack} />
      </SafeAreaView>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
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
  screen: { flex: 1, backgroundColor: Colors.bg },
  blobs: { position: 'absolute', top: 0, left: 0, right: 0, height: 260 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 28 },
});
