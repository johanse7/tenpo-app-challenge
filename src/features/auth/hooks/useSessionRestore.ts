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
 * Restores the session before deciding which navigation stack to show:
 * 1. zustand/persist hydrates `user` from SecureStore.
 * 2. Only if there is a `user`, it checks that the token still exists.
 *
 * Without step 2, a user with a purged token would enter the private area
 * and only bounce back on the first 401.
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
