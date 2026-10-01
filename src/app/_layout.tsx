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
 * `index` se declara sin guard a propósito: es la ruta ancla del stack.
 * Cuando `(auth)` o `(app)` quedan bloqueadas, el router redirige allí y
 * `index.tsx` resuelve el destino final según el estado de sesión.
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
