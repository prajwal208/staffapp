import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/contexts/auth-context';

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Redirect href="/login" />;
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="success" />
    </Stack>
  );
}
