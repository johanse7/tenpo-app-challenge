import type { ComponentType, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-native';

import type {
  RenderHookOptions,
  RenderHookResult,
} from '@testing-library/react-native';

/**
 * Disposable client per test: no `retry` or `gcTime`, and no refetch on
 * focus/reconnect, so failures and state transitions are deterministic
 * and no global subscriptions stay active.
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
  /** Allows injecting a custom client to inspect its cache. */
  queryClient?: QueryClient;
}

export type RenderHookWithProvidersOptions<TProps> = ProvidersOptions & {
  initialProps?: TProps;
};

/**
 * Async equivalent of `renderHook` (RTL v14) wrapped in
 * `QueryClientProvider`. `result.current` exposes the hook value.
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
