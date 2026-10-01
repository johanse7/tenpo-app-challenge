import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { SplashLoader } from "@/components/SplashLoader";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { queryClient } from "@/core/query/queryClient";
import { useSessionRestore } from "@/features/auth/hooks/useSessionRestore";
import { useUnauthorizedHandler } from "@/features/auth/hooks/useUnauthorizedHandler";
import {
  selectIsAuthenticated,
  useAuthStore,
} from "@/features/auth/store/authStore";

import "../../global.css";

/**
 * `index` is declared without a guard on purpose: it is the stack's anchor route.
 * When `(auth)` or `(app)` are blocked, the router redirects there and
 * `index.tsx` resolves the final destination based on the session state.
 */
export default function RootLayout() {
  const { isRestoring } = useSessionRestore();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  useUnauthorizedHandler();

  return (
    <GluestackUIProvider mode="light">
      <QueryClientProvider client={queryClient}>
        {isRestoring ? (
          <SplashLoader />
        ) : (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={!isAuthenticated}>
              <Stack.Screen name="(auth)" />
            </Stack.Protected>

            <Stack.Protected guard={isAuthenticated}>
              <Stack.Screen name="(app)" />
            </Stack.Protected>

            <Stack.Screen name="index" />
          </Stack>
        )}
        <StatusBar style="dark" />
      </QueryClientProvider>
    </GluestackUIProvider>
  );
}
