import { useMemo, useState } from 'react';

import { env } from '@/core/config/env';
import { useDebounce } from '@/hooks/useDebounce';

import type { User } from '../types/user.types';

export interface UserSearchState {
  search: string;
  setSearch: (value: string) => void;
  filteredUsers: User[];
  isDebouncing: boolean;
}

/**
 * Client-side debounced search over the already-cached dataset.
 * randomuser.me does not expose a text filter.
 */
export function useUserSearch(users: User[]): UserSearchState {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, env.SEARCH_DEBOUNCE_MS);

  const filteredUsers = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    if (query === '') {
      return users;
    }

    return users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query),
    );
  }, [users, debouncedSearch]);

  return {
    search,
    setSearch,
    filteredUsers,
    isDebouncing: search !== debouncedSearch,
  };
}
