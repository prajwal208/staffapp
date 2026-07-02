import { stripTrailingSlash } from '@/utils/url';

const DEFAULT_API_HOST = 'https://api.wevraa.in';

export const API_BASE_URL = stripTrailingSlash(
  process.env.EXPO_PUBLIC_API_HOST ?? DEFAULT_API_HOST,
);
export const API_V1 = `${API_BASE_URL}/api/v1`;

if (__DEV__) {
  console.log('[API] Using base URL:', API_BASE_URL);
}
