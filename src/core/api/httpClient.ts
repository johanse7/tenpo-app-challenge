import { create, isAxiosError } from 'axios';

import { env } from '@/core/config/env';
import { secureStorage } from '@/core/storage/secureStorage';
import { notifyUnauthorized } from '@/core/api/unauthorizedHandler';

export const httpClient = create({
  baseURL: env.API_BASE_URL,
  timeout: env.HTTP_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

httpClient.interceptors.request.use(async (config) => {
  const token = await secureStorage.getItem(env.TOKEN_STORAGE_KEY);

  if (token !== null) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      notifyUnauthorized();
    }

    return Promise.reject(error);
  },
);
