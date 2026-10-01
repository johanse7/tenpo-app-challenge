import type { ComponentType, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-native';

import type {
  RenderHookOptions,
  RenderHookResult,
} from '@testing-library/react-native';

/**
 * Client desechable por test: sin `retry` ni `gcTime`, y sin refetch por
 * foco/reconexión, para que los fallos y las transiciones de estado sean
 * deterministas y no queden suscripciones globales activas.
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
      mutations: { retry: false },
    },
  });
}

export interface ProvidersOptions {
  /** Permite inyectar un client propio para inspeccionar su caché. */
  queryClient?: QueryClient;
}

export type RenderHookWithProvidersOptions<TProps> = ProvidersOptions & {
  initialProps?: TProps;
};

/**
 * Equivalente asíncrono de `renderHook` (RTL v14) envuelto en
 * `QueryClientProvider`. `result.current` expone el valor del hook.
 */
export async function renderHookWithProviders<TProps, TResult>(
  hook: (props: TProps) => TResult,
  options: RenderHookWithProvidersOptions<TProps> = {},
): Promise<RenderHookResult<TResult, TProps> & { queryClient: QueryClient }> {
  const { queryClient = createTestQueryClient(), initialProps } = options;

  const wrapper: ComponentType<{ children: ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const hookOptions: RenderHookOptions<TProps> = { wrapper };
  if (initialProps !== undefined) {
    hookOptions.initialProps = initialProps;
  }

  const result = await renderHook<TResult, TProps>(hook, hookOptions);

  return { ...result, queryClient };
}
