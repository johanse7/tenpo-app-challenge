import { queryClient } from '@/core/query/queryClient';

import { useAuthStore } from '../store/authStore';
import { authService } from './authService';

/**
 * Single sign-out point: purges the token (SecureStore),
 * the session (store) and the entire server cache (PII in memory).
 * Consumed by both `useLogout` and the 401 handler.
 *
 * Local state is cleared in `finally`: a logout that failed to log out
 * would leave the app inside the private area without valid credentials.
 */
export async function signOut(): Promise<void> {
  try {
    await authService.logout();
  } finally {
    useAuthStore.getState().clearSession();
    queryClient.clear();
  }
}
