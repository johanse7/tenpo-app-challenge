import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { env } from '@/core/config/env';
import { secureStorage } from '@/core/storage/secureStorage';

import type { AuthUser } from '../types/auth.types';

interface AuthState {
  user: AuthUser | null;
  /**
   * `null` = aún no se consultó SecureStore en frío.
   * `false` = no hay token. `true` = hay token.
   * No se persiste: siempre se resuelve al arrancar.
   */
  hasToken: boolean | null;
  setSession: (user: AuthUser) => void;
  clearSession: () => void;
  setHasToken: (hasToken: boolean) => void;
}

/**
 * Estado de sesión síncrono. El token NUNCA vive aquí:
 * se persiste por separado en expo-secure-store (authService).
 * La sesión se hidrata de forma asíncrona desde SecureStore.
 *
 * `hasToken` es la contraparte del token: sin él `user` no basta para
 * dar la sesión por válida (ver `selectIsAuthenticated`).
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
 * `true` solo cuando hay usuario persistido pero todavía no se sabe
 * si su token sigue en SecureStore. Mantiene el splash visible y evita
 * un destello del login antes de resolver la sesión real.
 */
export function selectIsProbingToken(state: AuthState): boolean {
  return state.user !== null && state.hasToken === null;
}
