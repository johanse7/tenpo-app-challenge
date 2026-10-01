import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { env } from '@/core/config/env';
import { secureStorage } from '@/core/storage/secureStorage';

import type { AuthUser } from '../types/auth.types';

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

/**
 * Estado de sesión síncrono. El token NUNCA vive aquí:
 * se persiste por separado en expo-secure-store (authService).
 * La sesión se hidrata de forma asíncrona desde SecureStore.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: env.USER_STORAGE_KEY,
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

export function selectIsAuthenticated(state: AuthState): boolean {
  return state.user !== null;
}
