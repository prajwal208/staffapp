import type { CompleteOrderResponse } from '@/types/api';
import type { DesignImage, Feature, Measurement } from '@/types/order';
import { formatDeliveryDate } from '@/utils/order';

const DESIGN_LABELS = [
  'Customer Fabric',
  'Front Neck Design',
  'Back Neck Design',
  'Sleeves Design',
] as const;

export type CompleteOrderViewModel = {
  customerName: string;
  billNo?: number;
  orderNo: number;
  deliveryDate: string;
  orderType: string;
  category?: string;
  customerImageUri?: string;
  designs: DesignImage[];
  measurements: Measurement[];
  features: Feature[];
  hangingsImageUri?: string;
  patternImageUri?: string;
  previousStatus: string;
  currentStatus: string;
  workflowStatusName?: string;
  workflowStatusColor?: string;
};

export function mapCompleteOrderToViewModel(
  order: CompleteOrderResponse,
): CompleteOrderViewModel {
  const designs: DesignImage[] = order.designImages?.length
    ? order.designImages.map((item) => ({
        label: item.label,
        imageUri: item.url,
      }))
    : DESIGN_LABELS.map((label, index) => ({
        label,
        imageUri: order.imageUrls[index] ?? '',
      })).filter((item) => item.imageUri);

  const measurements: Measurement[] = order.measurements.map((item) => ({
    label: item.name,
    value: String(item.value),
  }));

  const features: Feature[] =
    order.features?.map((item) => ({
      label: item.label,
      value: item.value,
    })) ?? [];

  const extraDesigns: DesignImage[] = [];
  if (order.hangingsImageUrl) {
    extraDesigns.push({ label: 'Hangings', imageUri: order.hangingsImageUrl });
  }
  if (order.patternImageUrl) {
    extraDesigns.push({ label: 'Drawing Image', imageUri: order.patternImageUrl });
  }

  const allDesigns = [...designs];
  for (const extra of extraDesigns) {
    if (!allDesigns.some((item) => item.imageUri === extra.imageUri)) {
      allDesigns.push(extra);
    }
  }

  return {
    customerName: order.customerName,
    billNo: order.billNo,
    orderNo: order.orderNo,
    deliveryDate: formatDeliveryDate(order.deliveryDate),
    orderType: order.orderType,
    category: order.category || undefined,
    customerImageUri: order.customerImageUrl || undefined,
    designs: allDesigns,
    measurements,
    features,
    hangingsImageUri: order.hangingsImageUrl ?? order.imageUrls[4],
    patternImageUri: order.patternImageUrl ?? order.imageUrls[5],
    previousStatus: order.previousStatus,
    currentStatus: order.currentStatus,
    workflowStatusName: order.workflowStatus?.name,
    workflowStatusColor: order.workflowStatus?.color,
  };
}
