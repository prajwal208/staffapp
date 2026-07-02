import { apiRequest } from '@/services/api-client';
import type { CompleteOrderResponse, Staff } from '@/types/api';

export async function getStaffProfile(): Promise<Staff> {
  return apiRequest<Staff>('/staff/me', { auth: true });
}

export async function completeOrder(orderNo: number): Promise<CompleteOrderResponse> {
  return apiRequest<CompleteOrderResponse>('/staff/orders/complete', {
    method: 'POST',
    auth: true,
    body: { orderNo },
  });
}
