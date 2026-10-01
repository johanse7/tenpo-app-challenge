import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { RootNavigator } from '@/core/navigation/RootNavigator';
import { queryClient } from '@/core/query/queryClient';

import './global.css';

export default function App() {
  return (
    <GluestackUIProvider mode="light">
      <QueryClientProvider client={queryClient}>
        <RootNavigator />
        <StatusBar style="dark" />
      </QueryClientProvider>
    </GluestackUIProvider>
  );
}
