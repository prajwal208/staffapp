import { apiRequest } from '@/services/api-client';
import type { StaffLoginResponse } from '@/types/api';

export async function requestStaffOtp(phone: string): Promise<void> {
  await apiRequest('/auth/staff/request-otp', { method: 'POST', body: { phone } });
}

export async function loginStaff(phone: string, otp: string): Promise<StaffLoginResponse> {
  return apiRequest<StaffLoginResponse>('/auth/staff/login', {
    method: 'POST',
    body: { phone, otp },
  });
}
