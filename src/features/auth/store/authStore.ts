import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { env } from '@/core/config/env';
import { secureStorage } from '@/core/storage/secureStorage';

import type { AuthUser } from '../types/auth.types';

interface AuthState {
  user: AuthUser | null;
  /**
   * `null` = SecureStore has not been queried yet on cold start.
   * `false` = no token. `true` = token present.
   * Not persisted: always resolved on startup.
   */
  hasToken: boolean | null;
  setSession: (user: AuthUser) => void;
  clearSession: () => void;
  setHasToken: (hasToken: boolean) => void;
}

/**
 * Synchronous session state. The token NEVER lives here:
 * it is persisted separately in expo-secure-store (authService).
 * The session is hydrated asynchronously from SecureStore.
 *
 * `hasToken` is the token counterpart: without it `user` alone is not
 * enough to consider the session valid (see `selectIsAuthenticated`).
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hasToken: null,
      setSession: (user) => set({ user, hasToken: true }),
      clearSession: () => set({ user: null, hasToken: false }),
      setHasToken: (hasToken) => set({ hasToken }),
    }),
    {
      name: env.USER_STORAGE_KEY,
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

export function selectIsAuthenticated(state: AuthState): boolean {
  return state.user !== null && state.hasToken === true;
}

/**
 * `true` only when there is a persisted user but it is not yet known
 * whether their token is still in SecureStore. Keeps the splash visible
 * and prevents a login flash before the real session is resolved.
 */
export function selectIsProbingToken(state: AuthState): boolean {
  return state.user !== null && state.hasToken === null;
}
