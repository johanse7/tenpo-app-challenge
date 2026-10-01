import { queryClient } from '@/core/query/queryClient';
import { authService } from '@/features/auth/services/authService';
import { signOut } from '@/features/auth/services/signOut';
import { useAuthStore } from '@/features/auth/store/authStore';
import { memoryStorage } from '@/test/utils/memoryStorage';

jest.mock('@/features/auth/services/authService');
jest.mock('@/core/storage/secureStorage', () => ({
  secureStorage: jest.requireActual('@/test/utils/memoryStorage').memoryStorage,
}));

const mockedLogout = jest.mocked(authService.logout);
const USER = { email: 'ana@example.com', name: 'Ana' };

beforeEach(() => {
  memoryStorage.reset();
  useAuthStore.setState({ user: USER, hasToken: true });
  queryClient.clear();
  queryClient.setQueryData(['probe'], 'cached');
});

describe('signOut', () => {
  it('purga el token, la sesión del store y la caché de servidor', async () => {
    mockedLogout.mockResolvedValueOnce(undefined);

    await signOut();

    expect(mockedLogout).toHaveBeenCalledTimes(1);
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().hasToken).toBe(false);
    expect(queryClient.getQueryData(['probe'])).toBeUndefined();
  });

  it('limpia el estado local incluso si logout rechaza', async () => {
    mockedLogout.mockRejectedValueOnce(new Error('SecureStore no disponible'));

    await expect(signOut()).rejects.toThrow('SecureStore no disponible');

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().hasToken).toBe(false);
    expect(queryClient.getQueryData(['probe'])).toBeUndefined();
  });
});
