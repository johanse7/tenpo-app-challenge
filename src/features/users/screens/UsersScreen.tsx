import { useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import { useLogout } from '@/features/auth/hooks/useLogout';
import { useAuthStore } from '@/features/auth/store/authStore';

import { SearchInput } from '../components/SearchInput';
import { UserList } from '../components/UserList';
import { ErrorState } from '../components/ErrorState';
import { useUsers } from '../hooks/useUsers';
import { useUserSearch } from '../hooks/useUserSearch';

export function UsersScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const { mutate: logout } = useLogout();

  const {
    users,
    isLoading,
    isError,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useUsers();

  const { search, setSearch, filteredUsers, isDebouncing } = useUserSearch(users);

  const handleEndReached = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <Box
      className="flex-1 bg-background-50"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <VStack className="bg-background-0 px-4 pb-3" space="sm">
        <HStack className="items-center justify-between">
          <VStack space="xs" className="flex-1">
            <Heading size="lg">Clientes</Heading>
            <Text className="text-typography-400" size="xs" numberOfLines={1}>
              Hola, {user?.name ?? 'usuario'}
            </Text>
          </VStack>
          <Button variant="link" onPress={handleLogout}>
            <ButtonText className="text-primary-500">Salir</ButtonText>
          </Button>
        </HStack>
        <SearchInput value={search} onChangeText={setSearch} />
      </VStack>

      {isLoading ? (
        <Box className="flex-1 items-center justify-center">
          <Spinner />
        </Box>
      ) : isError ? (
        <ErrorState onRetry={handleRefresh} />
      ) : (
        <UserList
          users={filteredUsers}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          isRefreshing={isRefetching}
          isSearching={search.trim() !== '' || isDebouncing}
          onEndReached={handleEndReached}
          onRefresh={handleRefresh}
        />
      )}
    </Box>
  );
}
