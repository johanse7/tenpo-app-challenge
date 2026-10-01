import { httpClient } from "@/core/api/httpClient";
import { env } from "@/core/config/env";

import { mapUserDtoToUser } from "../mappers/user.mapper";

import { UsersPageResponse } from "../types/user.service.types";
import type { UsersPage } from "../types/user.types";

export interface FetchUsersPageParams {
  page: number;
}

export const usersService = {
  async fetchUsersPage({ page }: FetchUsersPageParams): Promise<UsersPage> {
    const { data } = await httpClient.get<UsersPageResponse>("/", {
      params: {
        seed: env.USERS_SEED,
        results: env.USERS_PAGE_SIZE,
        page,
        inc: env.USERS_INCLUDED_FIELDS,
      },
    });

    return {
      users: data.results.map(mapUserDtoToUser),
      page: data.info.page,
    };
  },
};
