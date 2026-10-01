import { useMutation } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';

import { signOut } from '../services/signOut';

/**
 * Cierre de sesión iniciado por el usuario.
 * La purga completa vive en `signOut`, compartida con el handler de 401.
 */
export function useLogout(): UseMutationResult<void, Error, void> {
  return useMutation({
    mutationFn: signOut,
  });
}
