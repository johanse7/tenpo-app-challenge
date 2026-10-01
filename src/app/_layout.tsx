import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { SplashLoader } from '@/components/SplashLoader';
import { queryClient } from '@/core/query/queryClient';
import { useSessionRestore } from '@/features/auth/hooks/useSessionRestore';
import { useUnauthorizedHandler } from '@/features/auth/hooks/useUnauthorizedHandler';

import '../../global.css';

export default function RootLayout() {
  const { isRestoring } = useSessionRestore();

  useUnauthorizedHandler();

  return (
    <GluestackUIProvider mode="light">
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          {isRestoring ? (
            <SplashLoader />
          ) : (
            <Stack screenOptions={{ headerShown: false }} />
          )}
          <StatusBar style="dark" />
        </SafeAreaProvider>
      </QueryClientProvider>
    </GluestackUIProvider>
  );
}
