import { AxiosError, AxiosHeaders } from 'axios';

import { httpClient } from '@/core/api/httpClient';
import { notifyUnauthorized } from '@/core/api/unauthorizedHandler';
import { env } from '@/core/config/env';
import { secureStorage } from '@/core/storage/secureStorage';

jest.mock('@/core/storage/secureStorage');
jest.mock('@/core/api/unauthorizedHandler');

const mockedGetItem = jest.mocked(secureStorage.getItem);
const mockedNotify = jest.mocked(notifyUnauthorized);

type RequestInterceptor = {
  fulfilled: (config: unknown) => Promise<{ headers: AxiosHeaders }>;
};
type ResponseInterceptor = {
  rejected: (error: unknown) => Promise<never>;
};

const requestInterceptor = (
  httpClient.interceptors.request as unknown as { handlers: RequestInterceptor[] }
).handlers[0];

const responseInterceptor = (
  httpClient.interceptors.response as unknown as { handlers: ResponseInterceptor[] }
).handlers[0];

function axiosErrorWithStatus(status: number): AxiosError {
  const response = {
    status,
    statusText: '',
    data: {},
    headers: {},
    config: { headers: new AxiosHeaders() },
  };

  return new AxiosError(
    'Request failed',
    'ERR_BAD_REQUEST',
    { headers: new AxiosHeaders() } as never,
    {},
    response as never,
  );
}

describe('httpClient configuración', () => {
  it('usa baseURL y timeout derivados de env', () => {
    expect(httpClient.defaults.baseURL).toBe(env.API_BASE_URL);
    expect(httpClient.defaults.timeout).toBe(env.HTTP_TIMEOUT_MS);
  });

  it('declara cabeceras JSON por defecto', () => {
    const headers = httpClient.defaults.headers as Record<string, unknown>;

    expect(headers['Content-Type']).toBe('application/json');
    expect(headers['Accept']).toBe('application/json');
  });
});

describe('httpClient interceptor de request', () => {
  it('añade Authorization Bearer cuando hay token', async () => {
    mockedGetItem.mockResolvedValueOnce('abc123');
    const config = { headers: new AxiosHeaders() };

    const result = await requestInterceptor.fulfilled(config);

    expect(mockedGetItem).toHaveBeenCalledWith(env.TOKEN_STORAGE_KEY);
    expect(result.headers.get('Authorization')).toBe('Bearer abc123');
  });

  it('no añade Authorization cuando no hay token', async () => {
    mockedGetItem.mockResolvedValueOnce(null);
    const config = { headers: new AxiosHeaders() };

    const result = await requestInterceptor.fulfilled(config);

    expect(result.headers.has('Authorization')).toBe(false);
  });
});

describe('httpClient interceptor de response', () => {
  it('notifica y rechaza ante un 401', async () => {
    const error = axiosErrorWithStatus(401);

    await expect(responseInterceptor.rejected(error)).rejects.toBe(error);
    expect(mockedNotify).toHaveBeenCalledTimes(1);
  });

  it('no notifica ante un error distinto de 401', async () => {
    const error = axiosErrorWithStatus(500);

    await expect(responseInterceptor.rejected(error)).rejects.toBe(error);
    expect(mockedNotify).not.toHaveBeenCalled();
  });

  it('no notifica ante un error que no es de axios', async () => {
    const error = new Error('error genérico');

    await expect(responseInterceptor.rejected(error)).rejects.toBe(error);
    expect(mockedNotify).not.toHaveBeenCalled();
  });
});
