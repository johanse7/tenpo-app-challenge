import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';

import { env } from '@/core/config/env';

import { usersService } from '../services/usersService';

import type { User, UsersPage } from '../types/user.types';

export const USERS_QUERY_KEY = ['users', env.USERS_SEED] as const;

export type UsersInfiniteQueryResult = UseInfiniteQueryResult<
  InfiniteData<UsersPage>,
  Error
> & { users: User[] };

/**
 * Paginated massive list (2000+ records).
 * Page flattening is memoized to preserve
 * referential identity across renders.
 */
export function useUsers(): UsersInfiniteQueryResult {
  const query = useInfiniteQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: ({ pageParam }) => usersService.fetchUsersPage({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < env.USERS_MAX_PAGES ? lastPage.page + 1 : undefined,
  });

  const users = useMemo(
    () => query.data?.pages.flatMap((page) => page.users) ?? [],
    [query.data],
  );

  return { ...query, users };
}
