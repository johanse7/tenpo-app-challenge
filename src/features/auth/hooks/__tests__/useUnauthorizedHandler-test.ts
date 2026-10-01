import { act, renderHook } from '@testing-library/react-native';

import { notifyUnauthorized } from '@/core/api/unauthorizedHandler';
import { useUnauthorizedHandler } from '@/features/auth/hooks/useUnauthorizedHandler';
import { signOut } from '@/features/auth/services/signOut';

jest.mock('@/features/auth/services/signOut');

const mockedSignOut = jest.mocked(signOut);

describe('useUnauthorizedHandler', () => {
  it('registra el handler: un 401 (notify) dispara signOut', async () => {
    mockedSignOut.mockResolvedValue(undefined);

    await renderHook(() => useUnauthorizedHandler());

    await act(async () => {
      notifyUnauthorized();
    });

    expect(mockedSignOut).toHaveBeenCalledTimes(1);
  });

  it('desregistra el handler al desmontar', async () => {
    mockedSignOut.mockResolvedValue(undefined);
    const { unmount } = await renderHook(() => useUnauthorizedHandler());

    await unmount();

    await act(async () => {
      notifyUnauthorized();
    });

    expect(mockedSignOut).not.toHaveBeenCalled();
  });

  it('traga el rechazo de signOut para no dejar un unhandled rejection', async () => {
    mockedSignOut.mockRejectedValue(new Error('SecureStore falló'));

    await renderHook(() => useUnauthorizedHandler());

    await act(async () => {
      notifyUnauthorized();
      // Deja que la cadena .catch() se resuelva
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(mockedSignOut).toHaveBeenCalledTimes(1);
  });
});
