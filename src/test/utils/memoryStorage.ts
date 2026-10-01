import type { SecureStorageAdapter } from '@/core/storage/secureStorage';

export interface MemoryStorage extends SecureStorageAdapter {
  /** Vuelca el contenido actual (útil para asserts de persistencia). */
  dump(): Record<string, string>;
  /** Precarga una clave sin pasar por `setItem`. */
  seed(key: string, value: string): void;
  reset(): void;
}

/**
 * Doble de `secureStorage` respaldado por un `Map`. Permite probar la
 * persistencia sin tocar `expo-secure-store`.
 */
export function createMemoryStorage(): MemoryStorage {
  const store = new Map<string, string>();

  return {
    async getItem(key) {
      return store.has(key) ? (store.get(key) as string) : null;
    },
    async setItem(key, value) {
      store.set(key, value);
    },
    async removeItem(key) {
      store.delete(key);
    },
    dump: () => Object.fromEntries(store),
    seed: (key, value) => {
      store.set(key, value);
    },
    reset: () => {
      store.clear();
    },
  };
}

/**
 * Instancia única compartida entre el `jest.mock` de
 * `@/core/storage/secureStorage` y los tests que la inspeccionan.
 */
export const memoryStorage = createMemoryStorage();
