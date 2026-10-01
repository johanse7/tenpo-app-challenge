import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import { UsersScreen } from '@/features/users/screens/UsersScreen';
import { useAuthStore, selectIsAuthenticated } from '@/features/auth/store/authStore';
import { useSessionRestore } from '@/features/auth/hooks/useSessionRestore';
import { useUnauthorizedHandler } from '@/features/auth/hooks/useUnauthorizedHandler';

import { SplashLoader } from './SplashLoader';

import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isRestoring } = useSessionRestore();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  useUnauthorizedHandler();

  if (isRestoring) {
    return <SplashLoader />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <Stack.Screen name="Users" component={UsersScreen} />
          ) : (
            <Stack.Screen name="Login" component={LoginScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
