import { memo } from 'react';

import { Icon, SearchIcon } from '@/components/ui/icon';
import { Input, InputField, InputSlot } from '@/components/ui/input';

interface SearchInputProps {
  value: string;
  onChangeText: (value: string) => void;
}

export const SearchInput = memo(function SearchInput({
  value,
  onChangeText,
}: SearchInputProps) {
  return (
    <Input>
      <InputSlot className="pl-3">
        <Icon as={SearchIcon} className="text-typography-400" />
      </InputSlot>
      <InputField
        placeholder="Buscar por nombre o email"
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
    </Input>
  );
});
