import * as SecureStore from 'expo-secure-store';

export interface SecureStorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

/**
 * Único punto de acceso a almacenamiento persistente sensible.
 * Compatible con `createJSONStorage` de zustand/persist.
 */
export const secureStorage: SecureStorageAdapter = {
  getItem: async (key) => SecureStore.getItemAsync(key),
  setItem: async (key, value) => {
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key) => {
    await SecureStore.deleteItemAsync(key);
  },
};
