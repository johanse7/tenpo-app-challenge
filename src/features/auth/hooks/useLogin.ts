import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { authService } from "../services/authService";
import { useAuthStore } from "../store/authStore";

import type { LoginDto } from "../schemas/login.schema";
import type { AuthSession } from "../types/auth.types";

export function useLogin(): UseMutationResult<AuthSession, Error, LoginDto> {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: async (session) => {
      await authService.persistToken(session.token);
      setSession(session.user);
    },
  });
}
