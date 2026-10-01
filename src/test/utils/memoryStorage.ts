import type { SecureStorageAdapter } from '@/core/storage/secureStorage';

export interface MemoryStorage extends SecureStorageAdapter {
  /** Dumps the current contents (useful for persistence asserts). */
  dump(): Record<string, string>;
  /** Preloads a key without going through `setItem`. */
  seed(key: string, value: string): void;
  reset(): void;
}

/**
 * `secureStorage` test double backed by a `Map`. Allows testing
 * persistence without touching `expo-secure-store`.
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
 * Single instance shared between the `jest.mock` of
 * `@/core/storage/secureStorage` and the tests that inspect it.
 */
export const memoryStorage = createMemoryStorage();
