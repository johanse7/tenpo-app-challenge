import { useEffect } from 'react';

import { setUnauthorizedHandler } from '@/core/api/unauthorizedHandler';

import { signOut } from '../services/signOut';

/**
 * Registers the global sign-out triggered by the httpClient on a 401.
 */
export function useUnauthorizedHandler(): void {
  useEffect(() => {
    setUnauthorizedHandler(() => {
      // `signOut` limpia el estado local en `finally`; si SecureStore falla
      // la sesión ya quedó cerrada, así que solo se evita el unhandled rejection.
      void signOut().catch(() => undefined);
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, []);
}
