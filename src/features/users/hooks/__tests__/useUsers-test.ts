import { act, waitFor } from '@testing-library/react-native';

import { env } from '@/core/config/env';
import { USERS_QUERY_KEY, useUsers } from '@/features/users/hooks/useUsers';
import { usersService } from '@/features/users/services/usersService';
import { makeUserList } from '@/test/factories/user.factory';
import { renderHookWithProviders } from '@/test/utils/renderWithProviders';

jest.mock('@/features/users/services/usersService');

const mockedFetch = jest.mocked(usersService.fetchUsersPage);

describe('USERS_QUERY_KEY', () => {
  it('incluye el seed para invalidar la caché cuando cambia', () => {
    expect(USERS_QUERY_KEY).toEqual(['users', env.USERS_SEED]);
  });
});

describe('useUsers', () => {
  it('carga la primera página con page=1 y aplana los usuarios', async () => {
    mockedFetch.mockImplementation(async ({ page }) => ({
      users: makeUserList(2, `p${page}`),
      page,
    }));

    const { result } = await renderHookWithProviders(() => useUsers());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedFetch).toHaveBeenCalledWith({ page: 1 });
    expect(result.current.users).toEqual(makeUserList(2, 'p1'));
    expect(result.current.hasNextPage).toBe(true);
  });

  it('acumula los usuarios de todas las páginas al paginar', async () => {
    mockedFetch.mockImplementation(async ({ page }) => ({
      users: makeUserList(2, `p${page}`),
      page,
    }));

    const { result } = await renderHookWithProviders(() => useUsers());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    await act(async () => {
      await result.current.fetchNextPage();
    });

    await waitFor(() => {
      expect(result.current.users).toHaveLength(4);
    });

    expect(mockedFetch).toHaveBeenNthCalledWith(2, { page: 2 });
    expect(result.current.users).toEqual([
      ...makeUserList(2, 'p1'),
      ...makeUserList(2, 'p2'),
    ]);
  });

  it('detiene la paginación al alcanzar USERS_MAX_PAGES', async () => {
    // Devuelve siempre la última página permitida para ejercer el borde
    // de `getNextPageParam` sin tener que paginar 50 veces.
    mockedFetch.mockImplementation(async () => ({
      users: makeUserList(1, 'last'),
      page: env.USERS_MAX_PAGES,
    }));

    const { result } = await renderHookWithProviders(() => useUsers());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.fetchNextPage).toBeInstanceOf(Function);

    await act(async () => {
      await result.current.fetchNextPage();
    });

    // No debe haber solicitado una segunda página
    expect(mockedFetch).toHaveBeenCalledTimes(1);
  });

  it('expone el error cuando la consulta falla', async () => {
    const error = new Error('Boom');
    mockedFetch.mockRejectedValue(error);

    const { result } = await renderHookWithProviders(() => useUsers());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(error);
    expect(result.current.users).toEqual([]);
  });
});
