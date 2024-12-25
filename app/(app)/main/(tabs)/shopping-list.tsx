import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { isArrayNotEmpty } from '~/lib/utils';
import type { CategoryExtendedWithPathDto } from '~/network/model';
import { useGetCategories } from '~/network/query/query';
import { type SearchOptions, searchItems } from '~/utils/search-utils';
import EmptyShoppingListPlaceholderScreen from '../../../../components/placeholders/empty-shopping-list-placeholder-screen';
import SearchBar from '../../../../components/ui/search-bar';

const options: SearchOptions<CategoryExtendedWithPathDto> = {
  threshold: 0.7,
  searchFields: ['name'],
  matchMode: 'all', // Use 'all' to require all words to match, 'any' for partial matches
};

export default function Page() {
  const { data } = useGetCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<
    CategoryExtendedWithPathDto[]
  >([]);

  const categories = data?.categories ?? [];

  useEffect(() => {
    if (searchQuery?.length > 0 && isArrayNotEmpty(categories)) {
      setSearchResults(searchItems(categories, searchQuery, options));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <View className="px-2">
      <SearchBar<CategoryExtendedWithPathDto>
        onSearch={setSearchQuery}
        onClear={() => setSearchQuery('')}
        searchText={searchQuery}
        options={searchResults}
        onOptionSelect={(option) => console.log('Option selected:', option)}
        renderOption={(item) => (
          <Text className="text-gray-800 text-lg">{item?.name}</Text>
        )}
        keyExtractor={(item) => String(item.id)}
      />
      <EmptyShoppingListPlaceholderScreen />
    </View>
  );
}
