import { queryClient } from '@/core/query/queryClient';

import { useAuthStore } from '../store/authStore';
import { authService } from './authService';

/**
 * Único punto de cierre de sesión: purga el token (SecureStore),
 * la sesión (store) y toda la caché de servidor (PII en memoria).
 * Lo consumen tanto `useLogout` como el handler de 401.
 *
 * El estado local se limpia en `finally`: un logout que no logueara
 * dejaría la app dentro del área privada sin credenciales válidas.
 */
export async function signOut(): Promise<void> {
  try {
    await authService.logout();
  } finally {
    useAuthStore.getState().clearSession();
    queryClient.clear();
  }
}
