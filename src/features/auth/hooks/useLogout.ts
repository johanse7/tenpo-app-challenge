import { useMutation } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';

import { queryClient } from '@/core/query/queryClient';

import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

/**
 * Cierre de sesión: purga token (SecureStore), usuario (store)
 * y toda la caché de servidor (PII en memoria).
 */
export function useLogout(): UseMutationResult<void, Error, void> {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
    },
  });
}
