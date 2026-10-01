import { Redirect } from 'expo-router';

import { selectIsAuthenticated, useAuthStore } from '@/features/auth/store/authStore';

export default function Index() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  return <Redirect href={isAuthenticated ? '/users' : '/login'} />;
}
