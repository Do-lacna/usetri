import React from 'react';
import {
  Image,
  Pressable,
  View,
} from 'react-native';
import { isArrayNotEmpty } from '~/src/lib/utils';
import type { AddCategoryExtendedWithPathDto } from '~/src/network/model';
import { useGetCategories } from '~/src/network/query/query';
import { type SearchOptions, searchItems } from '~/src/utils/search-utils';
import { NoDataText } from '~/src/components/no-data-text/no-data-text';
import Divider from '~/src/components/ui/divider';
import { Text } from '~/src/components/ui/text';

interface ShoppingListCategorySearchProps {
  searchQuery: string;
  onCategorySelect?: (categoryId: number) => void;
}

const options: SearchOptions<AddCategoryExtendedWithPathDto> = {
  threshold: 0.7,
  searchFields: ['name'],
  matchMode: 'all', // Use 'all' to require all words to match, 'any' for partial matches
};

const ShoppingListCategorySearch: React.FC<ShoppingListCategorySearchProps> = ({
  searchQuery,
  onCategorySelect,
}) => {
  const [searchResults, setSearchResults] = React.useState<
    AddCategoryExtendedWithPathDto[]
  >([]);

  const {
    data: { categories = [] } = {},
  } = useGetCategories();

  React.useEffect(() => {
    if (searchQuery?.length > 0 && isArrayNotEmpty(categories)) {
      const searchedAndSortedResult = searchItems(
        categories,
        searchQuery,
        options,
      ).sort(
        ({ popularity: aPopularity = 0 }, { popularity: bPopularity = 0 }) => {
          return bPopularity - aPopularity;
        },
      );
      setSearchResults(searchedAndSortedResult);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const renderCategory = (
    { name, id, image_url }: AddCategoryExtendedWithPathDto,
  ) => (
    <Pressable key={String(id)} onPress={() => onCategorySelect?.(Number(id))}>
      <View className="flex flex-row items-center border border-g1 rounded-full px-3 py-3 bg-muted">
        {!!image_url && (
          <Image
            source={{ uri: image_url }}
            resizeMode="contain"
            className="w-5 h-5 mr-2"
          />
        )}
        <Text className="text-sm font-expose">{name}</Text>
      </View>
    </Pressable>
  );

  if (!searchQuery || searchQuery.length < 2) {
    return null;
  }

  // Show at most ~4 rows worth of results (12 items at ~3 per row)
  const MAX_ITEMS = 12;
  const visibleResults = searchResults.slice(0, MAX_ITEMS);

  return (
    <View>
      {searchResults.length > 0 && (
        <Text className="text-lg font-expose-bold mx-2 text-foreground">
          Najlacnejšia varianta (kategória)
        </Text>
      )}
      {visibleResults.length > 0 ? (
        <View className="flex flex-row flex-wrap justify-center gap-2 px-2 py-2">
          {visibleResults.map((item) => renderCategory(item,))}
        </View>
      ) : (
        <View className="flex items-center justify-center">
          <NoDataText className="text-xl font-expose my-4">
            Nenašli sa žiadne kategórie
          </NoDataText>
        </View>
      )}
      {visibleResults.length > 0 && <Divider className="my-4" />}
    </View>
  );
};

export default ShoppingListCategorySearch;
