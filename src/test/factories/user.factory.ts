import { env } from '@/core/config/env';

import type {
  UserDto,
  UsersPageResponse,
} from '@/features/users/types/user.service.types';
import type { User, UsersPage } from '@/features/users/types/user.types';

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

const DEFAULT_DTO: UserDto = {
  name: { title: 'Mr', first: 'Juan', last: 'Pérez' },
  location: {
    city: 'Santiago',
    state: 'Región Metropolitana',
    country: 'Chile',
  },
  email: 'juan.perez@example.com',
  dob: { date: '1990-04-12T05:32:11.204Z', age: 35 },
  phone: '(56) 9 1234 5678',
  picture: {
    large: 'https://randomuser.me/api/portraits/men/1.jpg',
    medium: 'https://randomuser.me/api/portraits/med/men/1.jpg',
    thumbnail: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
  },
  login: { uuid: 'd9d4d9a2-1f6f-4b60-9c30-0d3b0f3f6f6f' },
};

const DEFAULT_USER: User = {
  id: 'd9d4d9a2-1f6f-4b60-9c30-0d3b0f3f6f6f',
  fullName: 'Juan Pérez',
  email: 'juan.perez@example.com',
  phone: '(56) 9 1234 5678',
  city: 'Santiago',
  country: 'Chile',
  age: 35,
  avatarUrl: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
};

function mergeDeep<T>(base: T, overrides: DeepPartial<T> | undefined): T {
  if (!overrides) {
    return base;
  }

  // Solo se llega aquí con objetos planos: los arrays se reemplazan enteros
  // (ver `bothPlainObjects`), nunca se fusionan elemento a elemento.
  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };

  const overridesRecord = overrides as Record<string, unknown>;
  const baseRecord = base as Record<string, unknown>;

  for (const key of Object.keys(overridesRecord)) {
    const overrideValue = overridesRecord[key];
    const baseValue = baseRecord[key];

    const bothPlainObjects =
      overrideValue !== null &&
      typeof overrideValue === 'object' &&
      !Array.isArray(overrideValue) &&
      baseValue !== null &&
      typeof baseValue === 'object' &&
      !Array.isArray(baseValue);

    result[key] = bothPlainObjects
      ? mergeDeep(baseValue, overrideValue as DeepPartial<unknown>)
      : overrideValue;
  }

  return result as T;
}

export function makeUserDto(overrides: DeepPartial<UserDto> = {}): UserDto {
  return mergeDeep(DEFAULT_DTO, overrides);
}

export function makeUser(overrides: Partial<User> = {}): User {
  return { ...DEFAULT_USER, ...overrides };
}

/**
 * User list with unique ids/emails per index. `idPrefix` allows
 * distinguishing pages when testing `useInfiniteQuery` flattening.
 */
export function makeUserList(count: number, idPrefix = 'u', overrides: Partial<User> = {}): User[] {
  return Array.from({ length: count }, (_, index) =>
    makeUser({
      id: `${idPrefix}-${index}`,
      fullName: `${DEFAULT_USER.fullName} ${idPrefix}-${index}`,
      email: `${idPrefix}.${index}@example.com`,
      ...overrides,
    }),
  );
}

export function makeUserDtoList(count: number, idPrefix = 'u', overrides: DeepPartial<UserDto> = {}): UserDto[] {
  return Array.from({ length: count }, (_, index) =>
    makeUserDto({
      ...overrides,
      login: { uuid: `${idPrefix}-${index}`, ...overrides.login },
      email: overrides.email ?? `${idPrefix}.${index}@example.com`,
      name: {
        first: `Nombre${idPrefix}${index}`,
        last: `Apellido${idPrefix}${index}`,
        ...overrides.name,
      },
    }),
  );
}

export function makeUsersPageResponse(
  options: { count?: number; page?: number; results?: UserDto[] } = {},
): UsersPageResponse {
  const page = options.page ?? 1;
  const results = options.results ?? makeUserDtoList(options.count ?? 2, `p${page}`);

  return {
    results,
    info: {
      seed: env.USERS_SEED,
      results: results.length,
      page,
      version: '1.4',
    },
  };
}

export function makeUsersPage(
  options: { count?: number; page?: number } = {},
): UsersPage {
  const page = options.page ?? 1;

  return {
    users: makeUserList(options.count ?? 2, `p${page}`),
    page,
  };
}
