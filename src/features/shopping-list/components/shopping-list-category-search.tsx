import React from 'react';
import {
  FlatList,
  Image,
  type ListRenderItemInfo,
  Pressable,
  View,
} from 'react-native';
import { isArrayNotEmpty } from '../../../lib/utils';
import type { AddCategoryExtendedWithPathDto } from '~/src/network/model';
import { useGetCategories } from '~/src/network/query/query';
import { type SearchOptions, searchItems } from '../../../utils/search-utils';
import { NoDataText } from '~/src/components/no-data-text/no-data-text';
import { Card } from '~/src/components/ui/card';
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
    isLoading,
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

  const renderCategory = ({
    item: { name, id, image_url } = {},
  }: ListRenderItemInfo<AddCategoryExtendedWithPathDto>) => (
    <Pressable onPress={() => onCategorySelect?.(Number(id))}>
      <Card className="flex flex-row items-center bg-muted p-2">
        {!!image_url && (
          <Image
            source={{ uri: image_url as string }}
            resizeMode="contain"
            className="w-8 h-8 mr-4"
          />
        )}

        <Text>{name}</Text>
      </Card>
    </Pressable>
  );

  if (!searchQuery || searchQuery.length < 2) {
    return null;
  }

  return (
    <View>
      {searchResults.length > 0 && (
        <Text className="text-lg font-bold mx-2 text-foreground">
          Najlacnejšia varianta (kategória)
        </Text>
      )}
      <FlatList
        horizontal
        data={searchResults}
        ItemSeparatorComponent={() => <View className="w-4" />}
        renderItem={renderCategory}
        keyExtractor={category => String(category?.id)}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 8,
          paddingVertical: 8,
        }}
        ListEmptyComponent={
          <View className="flex items-center justify-center">
            <NoDataText className="text-xl my-4">
              Nenašli sa žiadne kategórie
            </NoDataText>
          </View>
        }
      />
      {searchResults?.length > 0 && <Divider className="my-4" />}
    </View>
  );
};

export default ShoppingListCategorySearch;
