import { memo } from 'react';

import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import type { User } from '../types/user.types';

interface UserItemProps {
  user: User;
}

/**
 * List cell. React.memo prevents re-renders
 * when scrolling datasets of 2000+ items.
 */
export const UserItem = memo(function UserItem({ user }: UserItemProps) {
  return (
    <HStack
      className="items-center border-b border-outline-100 bg-background-0 px-4 py-3"
      space="md"
         >
      <Image
        source={{ uri: user.avatarUrl }}
        alt={`Foto de ${user.fullName}`}
        className="h-12 w-12 rounded-full"
      />
      <VStack className="flex-1" space="xs">
        <Heading size="sm" numberOfLines={1}>
          {user.fullName}
        </Heading>
        <Text
          className="text-typography-500"
          size="sm"
          numberOfLines={1}
        >
          {user.email}
        </Text>
        <Text
          className="text-typography-400"
          size="xs"
          numberOfLines={1}
        >
          {user.city}, {user.country} · {user.age} años
        </Text>
      </VStack>
    </HStack>
  );
});
