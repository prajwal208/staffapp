import { apiRequest } from '@/services/api-client';
import type { CompleteOrderResponse, Staff } from '@/types/api';

function unwrapCompleteOrderResponse(data: unknown): CompleteOrderResponse {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid complete order response');
  }

  const record = data as Record<string, unknown>;
  if (typeof record.customerName === 'string') {
    return record as CompleteOrderResponse;
  }

  const nestedItems = record.items;
  if (Array.isArray(nestedItems) && nestedItems.length > 0) {
    const first = nestedItems[0];
    if (first && typeof first === 'object') {
      const item = first as Record<string, unknown>;
      if (typeof item.customerName === 'string') {
        return item as CompleteOrderResponse;
      }
      if (item.order && typeof item.order === 'object') {
        return item.order as CompleteOrderResponse;
      }
    }
  }

  throw new Error('Invalid complete order response');
}

export async function getStaffProfile(): Promise<Staff> {
  return apiRequest<Staff>('/staff/me', { auth: true });
}

export async function completeOrder(orderNo: number): Promise<CompleteOrderResponse> {
  const response = await apiRequest<unknown>('/staff/orders/complete', {
    method: 'POST',
    auth: true,
    body: { orderNo: Number(orderNo) },
  });

  return unwrapCompleteOrderResponse(response);
}
