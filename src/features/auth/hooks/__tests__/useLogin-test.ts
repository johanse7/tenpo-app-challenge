import { act, waitFor } from '@testing-library/react-native';

import { useLogin } from '@/features/auth/hooks/useLogin';
import { authService } from '@/features/auth/services/authService';
import { useAuthStore } from '@/features/auth/store/authStore';
import { memoryStorage } from '@/test/utils/memoryStorage';
import { renderHookWithProviders } from '@/test/utils/renderWithProviders';

import type { AuthSession } from '@/features/auth/types/auth.types';

jest.mock('@/features/auth/services/authService');
jest.mock('@/core/storage/secureStorage', () => ({
  secureStorage: jest.requireActual('@/test/utils/memoryStorage').memoryStorage,
}));

const mockedLogin = jest.mocked(authService.login);
const mockedPersistToken = jest.mocked(authService.persistToken);

const SESSION: AuthSession = {
  token: 'token-xyz',
  user: { email: 'ana@example.com', name: 'Ana' },
};

const CREDENTIALS = { email: 'ana@example.com', password: '12345678' };

beforeEach(() => {
  memoryStorage.reset();
  useAuthStore.setState({ user: null, hasToken: null });
});

describe('useLogin', () => {
  it('invoca authService.login con las credenciales', async () => {
    mockedLogin.mockResolvedValue(SESSION);
    mockedPersistToken.mockResolvedValue(undefined);

    const { result } = await renderHookWithProviders(() => useLogin());

    await act(async () => {
      await result.current.mutateAsync(CREDENTIALS);
    });

    // React Query invoca `mutationFn(variables, options)`; solo importan las credenciales.
    expect(mockedLogin.mock.calls[0][0]).toEqual(CREDENTIALS);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('en éxito persiste el token y guarda la sesión en el store', async () => {
    mockedLogin.mockResolvedValue(SESSION);
    mockedPersistToken.mockResolvedValue(undefined);

    const { result } = await renderHookWithProviders(() => useLogin());

    await act(async () => {
      await result.current.mutateAsync(CREDENTIALS);
    });

    expect(mockedPersistToken).toHaveBeenCalledWith('token-xyz');
    expect(useAuthStore.getState().user).toEqual(SESSION.user);
    expect(useAuthStore.getState().hasToken).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('expone el error y no toca el store cuando login falla', async () => {
    const error = new Error('Credenciales inválidas');
    mockedLogin.mockRejectedValue(error);

    const { result } = await renderHookWithProviders(() => useLogin());

    await act(async () => {
      await expect(result.current.mutateAsync(CREDENTIALS)).rejects.toBe(error);
    });

    expect(mockedPersistToken).not.toHaveBeenCalled();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().hasToken).toBeNull();

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
