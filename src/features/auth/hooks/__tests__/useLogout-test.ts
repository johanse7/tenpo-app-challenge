import { act, waitFor } from '@testing-library/react-native';

import { useLogout } from '@/features/auth/hooks/useLogout';
import { signOut } from '@/features/auth/services/signOut';
import { renderHookWithProviders } from '@/test/utils/renderWithProviders';

jest.mock('@/features/auth/services/signOut');

const mockedSignOut = jest.mocked(signOut);

describe('useLogout', () => {
  it('ejecuta signOut al disparar la mutación', async () => {
    mockedSignOut.mockResolvedValue(undefined);

    const { result } = await renderHookWithProviders(() => useLogout());

    await act(async () => {
      await result.current.mutateAsync();
    });

    expect(mockedSignOut).toHaveBeenCalledTimes(1);

    // Deja que React Query notifique el éxito dentro de `act` (evita avisos y
    // timers colgados al terminar el test).
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('propaga el error si signOut falla', async () => {
    const error = new Error('No se pudo cerrar sesión');
    mockedSignOut.mockRejectedValue(error);

    const { result } = await renderHookWithProviders(() => useLogout());

    await act(async () => {
      await expect(result.current.mutateAsync()).rejects.toBe(error);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
