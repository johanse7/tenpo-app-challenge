import { useMutation } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';

import { signOut } from '../services/signOut';

/**
 * User-initiated sign-out.
 * The full purge lives in `signOut`, shared with the 401 handler.
 */
export function useLogout(): UseMutationResult<void, Error, void> {
  return useMutation({
    mutationFn: signOut,
  });
}
