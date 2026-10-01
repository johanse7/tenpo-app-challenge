import { useEffect } from 'react';

import { setUnauthorizedHandler } from '@/core/api/unauthorizedHandler';

import { signOut } from '../services/signOut';

/**
 * Registra el cierre de sesión global que dispara el httpClient ante un 401.
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
