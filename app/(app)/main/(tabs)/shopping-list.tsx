import React from "react";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";
import EmptyShoppingListPlaceholderScreen from "../../../../components/placeholders/empty-shopping-list-placeholder-screen";
import PriceSummary from "../../../../components/ui/price-summary";
import SearchBar from "../../../../components/ui/search-bar";
import ShoppingListItem from "../../../../components/ui/shopping-list-item";
import useCartStore from "../../../../hooks/use-cart-store";
import { isArrayNotEmpty } from "../../../../lib/utils";
import {
  useCreateCart,
  useGetCart,
} from "../../../../network/customer/customer";
import type { CategoryExtendedWithPathDto } from "../../../../network/model";
import { useGetCategories } from "../../../../network/query/query";
import {
  type SearchOptions,
  searchItems,
} from "../../../../utils/search-utils";

const options: SearchOptions<CategoryExtendedWithPathDto> = {
  threshold: 0.7,
  searchFields: ["name"],
  matchMode: "all", // Use 'all' to require all words to match, 'any' for partial matches
};

export default function Page() {
  const { data: { categories = [] } = {}, isLoading } = useGetCategories(
    {},
    { query: { enabled: false } }
  );

  const { mutate: sendUpdateCart, isIdle } = useCreateCart({
    mutation: {
      onError: () => {
        Toast.show({
          type: "error",
          text1: "Failed to update cart",
          position: "bottom",
        });
      },
    },
  });
  const { data: { cart } = {} } = ({} = useGetCart());

  console.log(cart);

  const { mirrorCartState } = useCartStore();

  const [searchQuery, setSearchQuery] = React.useState("");
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

  const cartCategories = cart?.categories ?? [];
  const cartProducts = cart?.specific_products ?? [];

  return (
    <View className="px-2 flex-1">
      <SearchBar<CategoryExtendedWithPathDto>
        onSearch={setSearchQuery}
        onClear={() => setSearchQuery("")}
        searchText={searchQuery}
        options={searchResults}
        onOptionSelect={handleAddToCart}
        renderOption={(item) => (
          <Text className="text-gray-800 text-lg">{item?.name}</Text>
        )}
        keyExtractor={(item) => String(item.id)}
      />

      {cartCategories.map(({ category_id, category_name = "Category" }) => (
        <ShoppingListItem
          key={category_id}
          label={category_name}
          categoryId={category_id}
          onDelete={() => {}}
        />
      ))}

      {cartProducts.map(
        ({
          detail: { barcode, name = "Specific product", category_id } = {},
        }) => (
          <ShoppingListItem
            key={barcode}
            label={name}
            categoryId={category_id}
            onDelete={() => {}}
          />
        )
      )}
      <EmptyShoppingListPlaceholderScreen />
      {cart?.total_price && (
        <PriceSummary
          price={cart.total_price}
          onPress={() => console.log("summary pressed")}
        />
      )}
    </View>
  );
}
