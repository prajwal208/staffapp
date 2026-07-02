import type { CompleteOrderResponse } from '@/types/api';

let lastCompletedOrder: CompleteOrderResponse | null = null;

export function setCompletedOrder(order: CompleteOrderResponse) {
  lastCompletedOrder = order;
}

export function getCompletedOrder(): CompleteOrderResponse | null {
  return lastCompletedOrder;
}

export function clearCompletedOrder() {
  lastCompletedOrder = null;
}
