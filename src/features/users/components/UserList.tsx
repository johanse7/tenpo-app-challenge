import { memo, useCallback, useMemo } from 'react';
import { FlashList } from '@shopify/flash-list';
import type { ListRenderItem } from '@shopify/flash-list';

import { UserItem } from './UserItem';
import { ListFooter } from './ListFooter';
import { EmptyState } from './EmptyState';

import type { User } from '../types/user.types';

interface UserListProps {
  users: User[];
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isRefreshing: boolean;
  isSearching: boolean;
  onEndReached: () => void;
  onRefresh: () => void;
}

/**
 * FlashList: virtualización para datasets de 2000+ registros.
 * Todas las props de función se memoizan (useCallback) para que
 * React.memo de UserItem surta efecto.
 */
export const UserList = memo(function UserList({
  users,
  isFetchingNextPage,
  hasNextPage,
  isRefreshing,
  isSearching,
  onEndReached,
  onRefresh,
}: UserListProps) {
  const renderItem = useCallback<ListRenderItem<User>>(
    ({ item }) => <UserItem user={item} />,
    [],
  );

  const keyExtractor = useCallback((item: User) => item.id, []);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isSearching) {
      onEndReached();
    }
  }, [hasNextPage, isFetchingNextPage, isSearching, onEndReached]);

  const listFooter = useMemo(
    () => (
      <ListFooter
        isLoading={isFetchingNextPage}
        hasReachedEnd={!hasNextPage && users.length > 0}
        totalCount={users.length}
      />
    ),
    [isFetchingNextPage, hasNextPage, users.length],
  );

  const listEmpty = useMemo(() => <EmptyState isSearching={isSearching} />, [isSearching]);

  return (
    <FlashList
      data={users}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      ListFooterComponent={listFooter}
      ListEmptyComponent={listEmpty}
      contentContainerStyle={{ paddingBottom: 16 }}
    />
  );
});
