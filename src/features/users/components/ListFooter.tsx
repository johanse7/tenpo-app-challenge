import { memo } from 'react';

import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

interface ListFooterProps {
  isLoading: boolean;
  hasReachedEnd: boolean;
  totalCount: number;
}

export const ListFooter = memo(function ListFooter({
  isLoading,
  hasReachedEnd,
  totalCount,
}: ListFooterProps) {
  if (isLoading) {
    return (
      <VStack className="items-center py-6">
        <Spinner />
      </VStack>
    );
  }

  if (hasReachedEnd) {
    return (
      <VStack className="items-center py-6">
        <Text className="text-typography-400" size="xs">
          Fin de la lista · {totalCount} usuarios
        </Text>
      </VStack>
    );
  }

  return null;
});
