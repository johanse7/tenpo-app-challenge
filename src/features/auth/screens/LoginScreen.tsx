import { KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';

import { LoginForm } from '../components/LoginForm';

export function LoginScreen() {
  const insets = useSafeAreaInsets();

  return (
    <Box
      className="flex-1 bg-background-0"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Box className="flex-1 justify-center px-6">
          <LoginForm />
        </Box>
      </KeyboardAvoidingView>
    </Box>
  );
}
