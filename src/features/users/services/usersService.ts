import { httpClient } from '@/core/api/httpClient';
import { env } from '@/core/config/env';

import { mapUserDtoToUser } from '../mappers/user.mapper';
import { usersPageResponseSchema } from '../schemas/user.schema';

import type { UsersPage } from '../types/user.types';

export interface FetchUsersPageParams {
  page: number;
}

export const usersService = {
  /**
   * Paginación servidor con seed determinista:
   * GET /api/?seed=tenpo&results=50&page=N
   * La respuesta se valida en runtime con zod antes de mapearla.
   */
  async fetchUsersPage({ page }: FetchUsersPageParams): Promise<UsersPage> {
    const { data } = await httpClient.get<unknown>('/', {
      params: {
        seed: env.USERS_SEED,
        results: env.USERS_PAGE_SIZE,
        page,
        inc: env.USERS_INCLUDED_FIELDS,
      },
    });

    const parsed = usersPageResponseSchema.parse(data);

    return {
      users: parsed.results.map(mapUserDtoToUser),
      page: parsed.info.page,
    };
  },
};
