import * as SecureStore from 'expo-secure-store';

import { secureStorage } from '@/core/storage/secureStorage';

jest.mock('expo-secure-store');

const getItemAsync = jest.mocked(SecureStore.getItemAsync);
const setItemAsync = jest.mocked(SecureStore.setItemAsync);
const deleteItemAsync = jest.mocked(SecureStore.deleteItemAsync);

describe('secureStorage', () => {
  it('getItem delega en getItemAsync y devuelve el valor', async () => {
    getItemAsync.mockResolvedValueOnce('token-abc');

    await expect(secureStorage.getItem('k')).resolves.toBe('token-abc');
    expect(getItemAsync).toHaveBeenCalledWith('k');
  });

  it('getItem devuelve null cuando no hay valor', async () => {
    getItemAsync.mockResolvedValueOnce(null);

    await expect(secureStorage.getItem('k')).resolves.toBeNull();
  });

  it('setItem delega en setItemAsync con clave y valor', async () => {
    setItemAsync.mockResolvedValueOnce(undefined);

    await secureStorage.setItem('k', 'v');

    expect(setItemAsync).toHaveBeenCalledWith('k', 'v');
  });

  it('removeItem delega en deleteItemAsync', async () => {
    deleteItemAsync.mockResolvedValueOnce(undefined);

    await secureStorage.removeItem('k');

    expect(deleteItemAsync).toHaveBeenCalledWith('k');
  });
});
