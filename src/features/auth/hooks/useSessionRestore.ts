import { useEffect, useSyncExternalStore } from 'react';

import { authService } from '../services/authService';
import { selectIsProbingToken, useAuthStore } from '../store/authStore';

interface SessionRestoreState {
  isRestoring: boolean;
}

function subscribeToHydration(onStoreChange: () => void): () => void {
  return useAuthStore.persist.onFinishHydration(onStoreChange);
}

function getIsHydrated(): boolean {
  return useAuthStore.persist.hasHydrated();
}

function resolveHasToken(hasToken: boolean): void {
  useAuthStore.getState().setHasToken(hasToken);
}

/**
 * Restaura la sesión antes de decidir qué stack de navegación mostrar:
 * 1. zustand/persist hidrata `user` desde SecureStore.
 * 2. Solo si hay `user`, se comprueba que el token siga existiendo.
 *
 * Sin el paso 2 un usuario con token purgado entraría al área privada
 * y rebotaría recién con el primer 401.
 */
export function useSessionRestore(): SessionRestoreState {
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getIsHydrated,
    () => false,
  );
  const isProbingToken = useAuthStore(selectIsProbingToken);

  useEffect(() => {
    if (!isHydrated || !isProbingToken) {
      return;
    }

    let isActive = true;

    authService
      .hasSession()
      .then((hasToken) => {
        if (isActive) {
          resolveHasToken(hasToken);
        }
      })
      .catch(() => {
        // SecureStore no disponible (p. ej. web): se asume sesión inválida
        // en vez de dejar la app colgada en el splash.
        if (isActive) {
          resolveHasToken(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [isHydrated, isProbingToken]);

  return { isRestoring: !isHydrated || isProbingToken };
}
