import { env } from '@/core/config/env';
import { authService } from '@/features/auth/services/authService';
import { memoryStorage } from '@/test/utils/memoryStorage';

jest.mock('@/core/storage/secureStorage', () => ({
  secureStorage: jest.requireActual('@/test/utils/memoryStorage').memoryStorage,
}));

beforeEach(() => {
  memoryStorage.reset();
});

describe('authService.login', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('devuelve un token con el formato simulado y el user derivado del email', async () => {
    const dto = { email: 'ana@example.com', password: '12345678' };

    const promise = authService.login(dto);
    await jest.advanceTimersByTimeAsync(700);
    const session = await promise;

    expect(session.user).toEqual({ email: 'ana@example.com', name: 'Ana' });
    expect(session.token).toMatch(/^tenpo\.mock\.\d+\./);
    // El sufijo es la longitud del email en base 36
    expect(session.token.endsWith(`.${dto.email.length.toString(36)}`)).toBe(true);
  });

  it('capitaliza solo el primer carácter del alias', async () => {
    const promise = authService.login({ email: 'BOB@x.com', password: '12345678' });
    await jest.advanceTimersByTimeAsync(700);
    const session = await promise;

    expect(session.user.name).toBe('BOB');
  });

  it('deriva el nombre del email completo cuando no tiene @', async () => {
    const promise = authService.login({ email: 'sinsigno', password: '12345678' });
    await jest.advanceTimersByTimeAsync(700);
    const session = await promise;

    expect(session.user).toEqual({ email: 'sinsigno', name: 'Sinsigno' });
  });
});

describe('authService.persistToken', () => {
  it('guarda el token en la clave de sesión', async () => {
    await authService.persistToken('token-abc');

    expect(await memoryStorage.getItem(env.TOKEN_STORAGE_KEY)).toBe('token-abc');
  });
});

describe('authService.logout', () => {
  it('elimina el token persistido', async () => {
    memoryStorage.seed(env.TOKEN_STORAGE_KEY, 'token-abc');

    await authService.logout();

    expect(await memoryStorage.getItem(env.TOKEN_STORAGE_KEY)).toBeNull();
  });
});

describe('authService.hasSession', () => {
  it('es true cuando hay un token no vacío', async () => {
    memoryStorage.seed(env.TOKEN_STORAGE_KEY, 'token-abc');

    await expect(authService.hasSession()).resolves.toBe(true);
  });

  it('es false cuando no hay token', async () => {
    await expect(authService.hasSession()).resolves.toBe(false);
  });

  it('es false cuando el token es una cadena vacía', async () => {
    memoryStorage.seed(env.TOKEN_STORAGE_KEY, '');

    await expect(authService.hasSession()).resolves.toBe(false);
  });
});
