import { useMutation } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';

import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

import type { AuthSession } from '../types/auth.types';
import type { LoginDto } from '../schemas/login.schema';

/**
 * Login como server state: useMutation gestiona pending/error,
 * nunca useState manual.
 */
export function useLogin(): UseMutationResult<AuthSession, Error, LoginDto> {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: async (session) => {
      await authService.persistToken(session.token);
      setUser(session.user);
    },
  });
}
