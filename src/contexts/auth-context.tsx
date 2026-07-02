import * as SecureStore from 'expo-secure-store';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';

import { loginStaff } from '@/services/auth-service';
import { setAccessTokenGetter, setOnUnauthorized } from '@/services/api-client';
import { getStaffProfile } from '@/services/staff-service';
import type { Staff } from '@/types/api';

const ACCESS_TOKEN_KEY = 'staff_access_token';
const STAFF_KEY = 'staff_profile';
const MOBILE_KEY = 'staff_mobile';

async function getStoredItem(key: string) {
  if (Platform.OS === 'web') return localStorage.getItem(key);
  return SecureStore.getItemAsync(key);
}

async function setStoredItem(key: string, value: string) {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function deleteStoredItem(key: string) {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  mobile: string | null;
  staff: Staff | null;
  signIn: (phone: string, otp: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mobile, setMobile] = useState<string | null>(null);
  const [staff, setStaff] = useState<Staff | null>(null);
  const accessTokenRef = useRef<string | null>(null);

  const clearSession = useCallback(async () => {
    await deleteStoredItem(ACCESS_TOKEN_KEY);
    await deleteStoredItem(STAFF_KEY);
    await deleteStoredItem(MOBILE_KEY);
    accessTokenRef.current = null;
    setStaff(null);
    setMobile(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    setAccessTokenGetter(() => accessTokenRef.current);
    setOnUnauthorized(() => {
      void clearSession();
    });
  }, [clearSession]);

  useEffect(() => {
    async function loadSession() {
      try {
        const token = await getStoredItem(ACCESS_TOKEN_KEY);
        const storedStaff = await getStoredItem(STAFF_KEY);
        const storedMobile = await getStoredItem(MOBILE_KEY);
        if (token && storedStaff) {
          accessTokenRef.current = token;
          setStaff(JSON.parse(storedStaff) as Staff);
          setMobile(storedMobile);
          setIsAuthenticated(true);
          try {
            const profile = await getStaffProfile();
            setStaff(profile);
            await setStoredItem(STAFF_KEY, JSON.stringify(profile));
          } catch {
            // keep cached profile
          }
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();
  }, []);

  const signIn = useCallback(async (phone: string, otp: string) => {
    const response = await loginStaff(phone, otp);
    await setStoredItem(ACCESS_TOKEN_KEY, response.accessToken);
    await setStoredItem(STAFF_KEY, JSON.stringify(response.staff));
    await setStoredItem(MOBILE_KEY, phone);
    accessTokenRef.current = response.accessToken;
    setStaff(response.staff);
    setMobile(phone);
    setIsAuthenticated(true);
  }, []);

  const signOut = useCallback(async () => {
    await clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({ isAuthenticated, isLoading, mobile, staff, signIn, signOut }),
    [isAuthenticated, isLoading, mobile, staff, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
