import { env } from '@/core/config/env';
import {
  selectIsAuthenticated,
  selectIsProbingToken,
  useAuthStore,
} from '@/features/auth/store/authStore';
import { memoryStorage } from '@/test/utils/memoryStorage';

import type { AuthUser } from '@/features/auth/types/auth.types';

jest.mock('@/core/storage/secureStorage', () => ({
  secureStorage: jest.requireActual('@/test/utils/memoryStorage').memoryStorage,
}));

type AuthSnapshot = Parameters<typeof selectIsAuthenticated>[0];

const USER: AuthUser = { email: 'ana@example.com', name: 'Ana' };

function snapshot(user: AuthUser | null, hasToken: boolean | null): AuthSnapshot {
  return {
    user,
    hasToken,
    setSession: () => undefined,
    clearSession: () => undefined,
    setHasToken: () => undefined,
  } as AuthSnapshot;
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
  memoryStorage.reset();
  useAuthStore.setState({ user: null, hasToken: null });
});

describe('selectIsAuthenticated', () => {
  it.each([
    [null, true, false],
    [USER, true, true],
    [USER, false, false],
    [USER, null, false],
  ] as [AuthUser | null, boolean | null, boolean][])(
    'user=%p hasToken=%p => %p',
    (user, hasToken, expected) => {
      expect(selectIsAuthenticated(snapshot(user, hasToken))).toBe(expected);
    },
  );
});

describe('selectIsProbingToken', () => {
  it.each([
    [null, null, false],
    [USER, null, true],
    [USER, true, false],
    [USER, false, false],
  ] as [AuthUser | null, boolean | null, boolean][])(
    'user=%p hasToken=%p => %p',
    (user, hasToken, expected) => {
      expect(selectIsProbingToken(snapshot(user, hasToken))).toBe(expected);
    },
  );
});

describe('useAuthStore acciones', () => {
  it('arranca sin usuario y con hasToken sin resolver', () => {
    const state = useAuthStore.getState();

    expect(state.user).toBeNull();
    expect(state.hasToken).toBeNull();
  });

  it('setSession guarda el usuario y marca hasToken=true', () => {
    useAuthStore.getState().setSession(USER);

    expect(useAuthStore.getState().user).toEqual(USER);
    expect(useAuthStore.getState().hasToken).toBe(true);
  });

  it('clearSession vacía el usuario y marca hasToken=false', () => {
    useAuthStore.getState().setSession(USER);
    useAuthStore.getState().clearSession();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().hasToken).toBe(false);
  });

  it('setHasToken actualiza solo el flag de token', () => {
    useAuthStore.setState({ user: USER, hasToken: null });

    useAuthStore.getState().setHasToken(false);
    expect(useAuthStore.getState().hasToken).toBe(false);
    expect(useAuthStore.getState().user).toEqual(USER);

    useAuthStore.getState().setHasToken(true);
    expect(useAuthStore.getState().hasToken).toBe(true);
  });
});

describe('persistencia (partialize)', () => {
  it('persiste solo el usuario y nunca el flag hasToken', async () => {
    useAuthStore.getState().setSession(USER);
    await flush();

    const raw = memoryStorage.dump()[env.USER_STORAGE_KEY];
    expect(raw).toBeDefined();

    const parsed = JSON.parse(raw) as { state: Record<string, unknown> };
    expect(parsed.state.user).toEqual(USER);
    expect(parsed.state).not.toHaveProperty('hasToken');
  });
});
