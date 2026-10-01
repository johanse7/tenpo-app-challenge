import { Redirect } from 'expo-router';

import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import { selectIsAuthenticated, useAuthStore } from '@/features/auth/store/authStore';

export default function LoginRoute() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/users" />;
  }

  return <LoginScreen />;
}
