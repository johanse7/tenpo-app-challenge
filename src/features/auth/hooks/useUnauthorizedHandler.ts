import { useEffect } from 'react';

import { queryClient } from '@/core/query/queryClient';
import { setUnauthorizedHandler } from '@/core/api/unauthorizedHandler';

import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';


export function useUnauthorizedHandler(): void {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      void authService.logout();
      setUser(null);
      queryClient.clear();
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, [setUser]);
}
