import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '@/contexts/auth-context';
import type { RootStackParamList } from '@/navigation/types';
import { HomeScreen } from '@/screens/home-screen';
import { LoginScreen } from '@/screens/login-screen';
import { OtpScreen } from '@/screens/otp-screen';
import { SuccessScreen } from '@/screens/success-screen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Success" component={SuccessScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Otp" component={OtpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
