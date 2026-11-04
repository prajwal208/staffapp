import { stripTrailingSlash } from '@/utils/url';

export const API_BASE_URL = stripTrailingSlash(
  'https://wevra-backend-459651677009.asia-south1.run.app',
);
export const API_V1 = `${API_BASE_URL}/api/v1`;

if (__DEV__) {
  console.log('[API] Using base URL:', API_BASE_URL);
}
