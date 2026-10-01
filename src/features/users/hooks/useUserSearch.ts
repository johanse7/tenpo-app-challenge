import { useEffect, useMemo, useState } from 'react';

import { env } from '@/core/config/env';

import type { User } from '../types/user.types';

export interface UserSearchState {
  search: string;
  setSearch: (value: string) => void;
  filteredUsers: User[];
  isDebouncing: boolean;
}

/**
 * Búsqueda client-side con debounce sobre el dataset ya cacheado.
 * randomuser.me no expone filtro por texto.
 */
export function useUserSearch(users: User[]): UserSearchState {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, env.SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search]);

  const filteredUsers = useMemo(() => {
    if (debouncedSearch === '') {
      return users;
    }

    return users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(debouncedSearch) ||
        user.email.toLowerCase().includes(debouncedSearch),
    );
  }, [users, debouncedSearch]);

  return {
    search,
    setSearch,
    filteredUsers,
    isDebouncing: search.trim().toLowerCase() !== debouncedSearch,
  };
}
