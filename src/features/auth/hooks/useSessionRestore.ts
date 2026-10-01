import { useSyncExternalStore } from 'react';

import { useAuthStore } from '../store/authStore';

interface SessionRestoreState {
  isRestoring: boolean;
}

function subscribeToHydration(onStoreChange: () => void): () => void {
  return useAuthStore.persist.onFinishHydration(onStoreChange);
}

function getIsHydrated(): boolean {
  return useAuthStore.persist.hasHydrated();
}

/**
 * Espera a que zustand/persist hidrate la sesión desde SecureStore
 * antes de decidir qué stack de navegación mostrar.
 */
export function useSessionRestore(): SessionRestoreState {
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getIsHydrated,
    () => false,
  );

  return { isRestoring: !isHydrated };
}
