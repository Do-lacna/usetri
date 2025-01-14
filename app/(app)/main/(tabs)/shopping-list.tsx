import React from 'react';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import EmptyShoppingListPlaceholderScreen from '../../../../components/placeholders/empty-shopping-list-placeholder-screen';
import SearchBar from '../../../../components/ui/search-bar';
import ShoppingListItem from '../../../../components/ui/shopping-list-item';
import useCartStore from '../../../../hooks/use-cart-store';
import { isArrayNotEmpty } from '../../../../lib/utils';
import {
  useCreateCart,
  useGetCart,
} from '../../../../network/customer/customer';
import type { CategoryExtendedWithPathDto } from '../../../../network/model';
import { useGetCategories } from '../../../../network/query/query';
import {
  type SearchOptions,
  searchItems,
} from '../../../../utils/search-utils';

const options: SearchOptions<CategoryExtendedWithPathDto> = {
  threshold: 0.7,
  searchFields: ['name'],
  matchMode: 'all', // Use 'all' to require all words to match, 'any' for partial matches
};

export default function Page() {
  const {
    data: {
      data: { categories = [] } = {},
    } = {},
    isLoading,
  } = useGetCategories();

  const { mutate: sendUpdateCart, isIdle } = useCreateCart({
    mutation: {
      onError: () => {
        Toast.show({
          type: 'error',
          text1: 'Failed to update cart',
          position: 'bottom',
        });
      },
    },
  });
  const {
    data: {
      data: { cart } = {},
    } = {},
  } = useGetCart();

  const { mirrorCartState } = useCartStore();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<
    CategoryExtendedWithPathDto[]
  >([]);

  React.useEffect(() => {
    if (cart) {
      mirrorCartState(cart);
    }
  }, [cart]);

  React.useEffect(() => {
    if (searchQuery?.length > 0 && isArrayNotEmpty(categories)) {
      setSearchResults(searchItems(categories, searchQuery, options));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleAddToCart = (option: CategoryExtendedWithPathDto) => {
    //find out if user has a cart
    if (
      [...(cart?.specific_products ?? []), ...(cart?.categories ?? [])].length >
      0
    ) {
      //update only existing cart with new category
      // sendUpdateCart({ category_id: option.id, cart_id: cart.id });
    }
    sendUpdateCart({ data: { category_ids: [option?.id ?? 0] } });
    // sendUpdateCart({ category_id: option.id });
  };

  return (
    <View className="px-2">
      <SearchBar<CategoryExtendedWithPathDto>
        onSearch={setSearchQuery}
        onClear={() => setSearchQuery('')}
        searchText={searchQuery}
        options={searchResults}
        onOptionSelect={handleAddToCart}
        renderOption={(item) => (
          <Text className="text-gray-800 text-lg">{item?.name}</Text>
        )}
        keyExtractor={(item) => String(item.id)}
      />
      <ShoppingListItem label="Test" onDelete={() => {}} />
      <EmptyShoppingListPlaceholderScreen />
    </View>
  );
}
