import { act, renderHook, waitFor } from '@testing-library/react-native';

import { authService } from '@/features/auth/services/authService';
import { useSessionRestore } from '@/features/auth/hooks/useSessionRestore';
import { useAuthStore } from '@/features/auth/store/authStore';
import { memoryStorage } from '@/test/utils/memoryStorage';

import type { AuthUser } from '@/features/auth/types/auth.types';

jest.mock('@/features/auth/services/authService');
jest.mock('@/core/storage/secureStorage', () => ({
  secureStorage: jest.requireActual('@/test/utils/memoryStorage').memoryStorage,
}));

const mockedHasSession = jest.mocked(authService.hasSession);
const USER: AuthUser = { email: 'ana@example.com', name: 'Ana' };

beforeEach(async () => {
  memoryStorage.reset();
  useAuthStore.setState({ user: null, hasToken: null });
  // Deja la hidratación de zustand/persist resuelta para que `hasHydrated()`
  // sea true de forma determinista al montar el hook.
  await act(async () => {
    await useAuthStore.persist.rehydrate();
  });
});

describe('useSessionRestore', () => {
  it('sin usuario persistido no sondea y no está restaurando', async () => {
    const { result } = await renderHook(() => useSessionRestore());

    expect(result.current.isRestoring).toBe(false);
    expect(mockedHasSession).not.toHaveBeenCalled();
  });

  it('con usuario y token sin resolver, sondea y confirma la sesión', async () => {
    let resolveHasSession!: (value: boolean) => void;
    mockedHasSession.mockReturnValue(
      new Promise<boolean>((resolve) => {
        resolveHasSession = resolve;
      }),
    );
    useAuthStore.setState({ user: USER, hasToken: null });

    const { result } = await renderHook(() => useSessionRestore());

    // Mientras el sondeo no resuelve, sigue restaurando
    expect(result.current.isRestoring).toBe(true);
    expect(mockedHasSession).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveHasSession(true);
    });

    await waitFor(() => {
      expect(result.current.isRestoring).toBe(false);
    });
    expect(useAuthStore.getState().hasToken).toBe(true);
  });

  it('cuando el token ya no existe, marca hasToken=false y deja de restaurar', async () => {
    mockedHasSession.mockResolvedValue(false);
    useAuthStore.setState({ user: USER, hasToken: null });

    const { result } = await renderHook(() => useSessionRestore());

    await waitFor(() => {
      expect(result.current.isRestoring).toBe(false);
    });
    expect(useAuthStore.getState().hasToken).toBe(false);
  });

  it('si SecureStore falla, asume sesión inválida en vez de colgar', async () => {
    mockedHasSession.mockRejectedValue(new Error('SecureStore no disponible'));
    useAuthStore.setState({ user: USER, hasToken: null });

    const { result } = await renderHook(() => useSessionRestore());

    await waitFor(() => {
      expect(result.current.isRestoring).toBe(false);
    });
    expect(useAuthStore.getState().hasToken).toBe(false);
  });
});
