import React from 'react';
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  Pressable,
  View,
} from 'react-native';
import { isArrayNotEmpty } from '../../../lib/utils';
import { AddCategoryExtendedWithPathDto } from '../../../network/model';
import { useGetCategories } from '../../../network/query/query';
import { SearchOptions, searchItems } from '../../../utils/search-utils';
import { Card } from '../card';
import Divider from '../divider';
import { NoDataText } from '../no-data-text/no-data-text';
import { Text } from '../text';

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
      setSearchResults(searchItems(categories, searchQuery, options));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const renderCategory = ({
    item: { name, id, image_url } = {},
  }: ListRenderItemInfo<AddCategoryExtendedWithPathDto>) => (
    <Pressable onPress={() => onCategorySelect?.(Number(id))}>
      <Card className="flex flex-row items-center bg-divider p-2">
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

  return (
    <View>
      <FlatList
        horizontal
        data={searchResults}
        ItemSeparatorComponent={() => <View className="w-4" />}
        renderItem={renderCategory}
        keyExtractor={(category) => String(category?.id)}
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
