import { memo } from 'react';

import { Icon, SearchIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

interface EmptyStateProps {
  isSearching: boolean;
}

export const EmptyState = memo(function EmptyState({
  isSearching,
}: EmptyStateProps) {
  return (
    <VStack className="flex-1 items-center justify-center py-16" space="sm">
      <Icon as={SearchIcon} size="xl" className="text-typography-300" />
      <Text className="text-typography-500" size="sm">
        {isSearching
          ? 'Sin resultados para tu búsqueda'
          : 'Desliza para cargar más usuarios'}
      </Text>
    </VStack>
  );
});
