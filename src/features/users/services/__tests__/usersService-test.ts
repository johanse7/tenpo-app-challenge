import { httpClient } from '@/core/api/httpClient';
import { env } from '@/core/config/env';
import { usersService } from '@/features/users/services/usersService';
import {
  makeUserDto,
  makeUsersPageResponse,
} from '@/test/factories/user.factory';

jest.mock('@/core/api/httpClient');

const mockedGet = jest.mocked(httpClient.get);

describe('usersService.fetchUsersPage', () => {
  it('consulta la raíz con los parámetros derivados de env', async () => {
    mockedGet.mockResolvedValueOnce({ data: makeUsersPageResponse({ count: 0, page: 3 }) });

    await usersService.fetchUsersPage({ page: 3 });

    expect(mockedGet).toHaveBeenCalledTimes(1);
    expect(mockedGet).toHaveBeenCalledWith('/', {
      params: {
        seed: env.USERS_SEED,
        results: env.USERS_PAGE_SIZE,
        page: 3,
        inc: env.USERS_INCLUDED_FIELDS,
      },
    });
  });

  it('mapea los DTOs a usuarios de dominio y conserva el número de página', async () => {
    const dto = makeUserDto({
      login: { uuid: 'uuid-1' },
      name: { first: 'Ana', last: 'Rojas' },
      email: 'ana@example.com',
      location: { city: 'Valparaíso', country: 'Chile' },
      dob: { age: 34 },
      picture: { thumbnail: 'https://cdn/thumb.jpg' },
    });

    mockedGet.mockResolvedValueOnce({
      data: makeUsersPageResponse({ results: [dto], page: 2 }),
    });

    const result = await usersService.fetchUsersPage({ page: 2 });

    expect(result).toEqual({
      users: [
        {
          id: 'uuid-1',
          fullName: 'Ana Rojas',
          email: 'ana@example.com',
          phone: dto.phone,
          city: 'Valparaíso',
          country: 'Chile',
          age: 34,
          avatarUrl: 'https://cdn/thumb.jpg',
        },
      ],
      page: 2,
    });
  });

  it('devuelve una lista vacía cuando la API no trae resultados', async () => {
    mockedGet.mockResolvedValueOnce({
      data: makeUsersPageResponse({ results: [], page: 1 }),
    });

    const result = await usersService.fetchUsersPage({ page: 1 });

    expect(result).toEqual({ users: [], page: 1 });
  });

  it('propaga el error cuando la petición falla', async () => {
    const error = new Error('Network down');
    mockedGet.mockRejectedValueOnce(error);

    await expect(usersService.fetchUsersPage({ page: 1 })).rejects.toBe(error);
  });
});
