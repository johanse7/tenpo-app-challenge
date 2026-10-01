import { Redirect } from 'expo-router';

import { selectIsAuthenticated, useAuthStore } from '@/features/auth/store/authStore';
import { UsersScreen } from '@/features/users/screens/UsersScreen';

export default function UsersRoute() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <UsersScreen />;
}
