import { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import SearchBar, { type ISearchBarHandle } from '~/src/components/search-bar';
import { Button } from '~/src/components/ui/button';
import type { ProductDto } from '~/src/network/model';

interface SearchHeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onClear: () => void;
}

export const SearchHeader = ({
  searchQuery,
  onSearch,
  onClear,
}: SearchHeaderProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const searchBarRef = useRef<ISearchBarHandle>(null);
  const { t } = useTranslation();

  const handleCancel = () => {
    searchBarRef.current?.blur();
    onClear();
  };

  return (
    <View className="flex-row items-center gap-3 mt-2 px-3 z-10">
      <SearchBar<ProductDto>
        ref={searchBarRef}
        displaySearchOptions={false}
        onSearch={onSearch}
        onClear={onClear}
        searchText={searchQuery}
        placeholder={t('search_bar.search_products_placeholder')}
        options={[]}
        onOptionSelect={option => console.log('Option selected:', option)}
        renderOption={item => (
          <Text className="text-foreground text-base font-expose">{item?.name}</Text>
        )}
        keyExtractor={item => String(item.id)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {isFocused && (
        <Button
          onPress={handleCancel}
          variant="ghost"
          size="sm"
          className="px-2 shrink-0"
        >
          <Text className="text-tertiary text-base font-expose-bold">{t('search_bar.cancel')}</Text>
        </Button>
      )}
    </View>
  );
};
