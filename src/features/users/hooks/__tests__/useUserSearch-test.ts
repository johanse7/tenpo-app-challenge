import { act, renderHook } from '@testing-library/react-native';

import { env } from '@/core/config/env';
import { useUserSearch } from '@/features/users/hooks/useUserSearch';
import { makeUser } from '@/test/factories/user.factory';

import type { User } from '@/features/users/types/user.types';

const users: User[] = [
  makeUser({ id: '1', fullName: 'Ana Rojas', email: 'ana.rojas@example.com' }),
  makeUser({ id: '2', fullName: 'Bruno Díaz', email: 'bruno.diaz@example.com' }),
  makeUser({ id: '3', fullName: 'Catalina Mena', email: 'cata.mena@example.com' }),
];

async function advanceDebounce(ms: number = env.SEARCH_DEBOUNCE_MS) {
  await act(async () => {
    await jest.advanceTimersByTimeAsync(ms);
  });
}

describe('useUserSearch', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('arranca con búsqueda vacía, sin filtrar y sin debounce activo', async () => {
    const { result } = await renderHook(() => useUserSearch(users));

    expect(result.current.search).toBe('');
    expect(result.current.filteredUsers).toEqual(users);
    expect(result.current.isDebouncing).toBe(false);
  });

  it('no filtra antes de que pase el tiempo de debounce', async () => {
    const { result } = await renderHook(() => useUserSearch(users));

    await act(async () => {
      result.current.setSearch('ana');
    });

    expect(result.current.isDebouncing).toBe(true);
    expect(result.current.filteredUsers).toEqual(users);

    await advanceDebounce(env.SEARCH_DEBOUNCE_MS - 1);

    expect(result.current.filteredUsers).toEqual(users);
    expect(result.current.isDebouncing).toBe(true);
  });

  it('filtra por nombre tras el debounce', async () => {
    const { result } = await renderHook(() => useUserSearch(users));

    await act(async () => {
      result.current.setSearch('ana');
    });
    await advanceDebounce();

    expect(result.current.isDebouncing).toBe(false);
    expect(result.current.filteredUsers).toEqual([users[0]]);
  });

  it('filtra por email y es insensible a mayúsculas y espacios', async () => {
    const { result } = await renderHook(() => useUserSearch(users));

    await act(async () => {
      result.current.setSearch('  BRUNO.DIAZ@EXAMPLE.COM  ');
    });
    await advanceDebounce();

    expect(result.current.filteredUsers).toEqual([users[1]]);
  });

  it('coincide por nombre o por email indistintamente', async () => {
    const { result } = await renderHook(() => useUserSearch(users));

    await act(async () => {
      result.current.setSearch('cata');
    });
    await advanceDebounce();

    // "cata" aparece tanto en fullName ("Catalina") como en email ("cata.mena")
    expect(result.current.filteredUsers).toEqual([users[2]]);
  });

  it('devuelve lista vacía cuando nada coincide', async () => {
    const { result } = await renderHook(() => useUserSearch(users));

    await act(async () => {
      result.current.setSearch('zzzzz');
    });
    await advanceDebounce();

    expect(result.current.filteredUsers).toEqual([]);
  });

  it('restablece todos los usuarios al vaciar la búsqueda', async () => {
    const { result } = await renderHook(() => useUserSearch(users));

    await act(async () => {
      result.current.setSearch('ana');
    });
    await advanceDebounce();
    expect(result.current.filteredUsers).toEqual([users[0]]);

    await act(async () => {
      result.current.setSearch('   ');
    });
    await advanceDebounce();

    expect(result.current.filteredUsers).toEqual(users);
    expect(result.current.isDebouncing).toBe(false);
  });

  it('reinicia el temporizador si la búsqueda cambia antes del debounce', async () => {
    const { result } = await renderHook(() => useUserSearch(users));

    await act(async () => {
      result.current.setSearch('an');
    });
    await advanceDebounce(200);

    await act(async () => {
      result.current.setSearch('bruno');
    });
    // Todavía no debería haber filtrado por "an" ni por "bruno"
    expect(result.current.filteredUsers).toEqual(users);

    await advanceDebounce(200);
    // 200ms tras el último cambio aún no cumplen los 300ms
    expect(result.current.filteredUsers).toEqual(users);

    await advanceDebounce(100);
    expect(result.current.filteredUsers).toEqual([users[1]]);
  });

  it('mantiene estable la referencia de filteredUsers sin cambios', async () => {
    const { result } = await renderHook(() => useUserSearch(users));

    const first = result.current.filteredUsers;
    await advanceDebounce();
    const second = result.current.filteredUsers;

    expect(second).toBe(first);
  });
});
