import { env } from '@/core/config/env';
import { secureStorage } from '@/core/storage/secureStorage';

import type { AuthSession, AuthUser } from '../types/auth.types';
import type { LoginDto } from '../schemas/login.schema';

const SIMULATED_NETWORK_LATENCY_MS = 700;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function createMockToken(email: string): string {
  return `tenpo.mock.${Date.now()}.${email.length.toString(36)}`;
}

function buildUserFromEmail(email: string): AuthUser {
  const alias = email.split('@')[0] ?? 'usuario';
  const name = alias.charAt(0).toUpperCase() + alias.slice(1);

  return { email, name };
}

export const authService = {
  async login(dto: LoginDto): Promise<AuthSession> {
    await delay(SIMULATED_NETWORK_LATENCY_MS);

    return {
      token: createMockToken(dto.email),
      user: buildUserFromEmail(dto.email),
    };
  },

  async logout(): Promise<void> {
    await secureStorage.removeItem(env.TOKEN_STORAGE_KEY);
  },

  async persistToken(token: string): Promise<void> {
    await secureStorage.setItem(env.TOKEN_STORAGE_KEY, token);
  },
};
