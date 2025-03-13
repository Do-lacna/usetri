import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQueryClient } from "@tanstack/react-query";
import React, { useRef } from "react";
import { Image, Keyboard, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { ListFilter } from "~/lib/icons/Filter";
import IconButton from "../../../../components/icon-button";
import EmptyShoppingListPlaceholderScreen from "../../../../components/placeholders/empty-shopping-list-placeholder-screen";
import { CustomBottomSheetModal } from "../../../../components/ui/bottom-sheet-modal";
import PriceSummary from "../../../../components/ui/price-summary";
import SearchBar from "../../../../components/ui/search-bar";
import ShoppingListItem, {
  ShoppingListItemTypeEnum,
} from "../../../../components/ui/shopping-list-item";
import ShoppingListFilterContent, {
  ShoppingListFilter,
} from "../../../../components/ui/shopping-list/shopping-list-filter-content";
import { useCartActions } from "../../../../hooks/use-cart-actions";
import useCartStore from "../../../../hooks/use-cart-store";
import { BASE_API_URL } from "../../../../lib/constants";
import {
  generateShoppingListItemDescription,
  isArrayNotEmpty,
} from "../../../../lib/utils";
import {
  getGetCartQueryKey,
  useCreateCart,
  useGetCart,
} from "../../../../network/customer/customer";
import type {
  CategoryExtendedWithPathDto,
  ShopItemDto,
} from "../../../../network/model";
import {
  useGetCategories,
  useGetProducts,
} from "../../../../network/query/query";
import {
  type SearchOptions,
  searchItems,
} from "../../../../utils/search-utils";

const options: SearchOptions<CategoryExtendedWithPathDto> = {
  threshold: 0.7,
  searchFields: ["name"],
  matchMode: "all", // Use 'all' to require all words to match, 'any' for partial matches
};

export enum CartOperationsEnum {
  ADD = "ADD",
  REMOVE = "REMOVE",
  UPDATE = "UPDATE",
}

export default function Page() {
  const queryClient = useQueryClient();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [filter, setFilter] = React.useState<ShoppingListFilter>(
    ShoppingListFilter.CATEGORIES
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<
    CategoryExtendedWithPathDto[]
  >([]);
  const [expandedOption, setExpandedOption] = React.useState<number | null>(
    null
  );

  const { data: { categories = [] } = {}, isLoading } = useGetCategories(
    {},
    { query: { enabled: filter === ShoppingListFilter.CATEGORIES } }
  );

  const {
    handleAddCategoryToCart,
    handleAddProductToCart,
    handleRemoveItemFromCart,
    handleChooseProductFromCategory,
  } = useCartActions({
    onSuccessfullCartUpdate: () => {
      setSearchQuery("");
    },
    onSuccessWithExpandedOption: (categoryId) => {
      setExpandedOption(Number(categoryId));
    },
  });

  const { data: { products: searchProducts = [] } = {} } = useGetProducts(
    {
      search: searchQuery,
    },
    {
      query: {
        enabled:
          filter === ShoppingListFilter.PRODUCTS && searchQuery?.length > 2,
      },
    }
  );

  const productOptions = searchProducts?.map(
    ({ products }) => products?.[0] as ShopItemDto
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
      // onMutate: ({ data }) => {},
      onSuccess: ({ cart }, variables) => {
        queryClient.invalidateQueries({
          queryKey: getGetCartQueryKey(),
        });
        const lastAddedCategory = cart?.categories?.slice(-1)[0]?.category?.id;
        if (
          lastAddedCategory &&
          variables?.additionalData?.operation === CartOperationsEnum.ADD
        ) {
          setExpandedOption(lastAddedCategory);
        }
        Keyboard.dismiss();
      },
    },
  });
  const { data: { cart } = {} } = ({} = useGetCart());

  const { mirrorCartState } = useCartStore();

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

  const handleResetExpandedOption = (isExpanded?: boolean) => {
    // Reset expanded option if the item is collapsed
    if (!!expandedOption && !isExpanded) setExpandedOption(null);
  };

  const cartCategories = cart?.categories ?? [];
  const cartProducts = cart?.specific_products ?? [];

  const areAnyItemsInCart =
    cartCategories.length > 0 || cartProducts.length > 0;

  const handleFilterChange = (filter: ShoppingListFilter) => {
    setFilter(filter);
    bottomSheetRef?.current?.dismiss();
  };

  return (
    <View className="flex-1 content-center">
      <CustomBottomSheetModal ref={bottomSheetRef}>
        <ShoppingListFilterContent
          currentFilter={filter}
          onFilterChange={handleFilterChange}
        />
      </CustomBottomSheetModal>
      <View className={`px-2 ${areAnyItemsInCart ? "flex-1" : ""}`}>
        <View className="flex-row items-center gap-4 mt-2 z-10">
          {filter === ShoppingListFilter.CATEGORIES ? (
            <SearchBar<CategoryExtendedWithPathDto>
              onSearch={setSearchQuery}
              onClear={() => setSearchQuery("")}
              searchText={searchQuery}
              placeholder={"Vyhľadaj kategóriu produktu"}
              options={searchResults}
              onOptionSelect={handleAddCategoryToCart}
              renderOption={(item) => (
                <View className="flex-row">
                  {item?.image_url && (
                    <Image
                      source={{ uri: `${BASE_API_URL}/${item.image_url}` }}
                      resizeMode="contain"
                      className="w-8 h-8 mr-4"
                      // style={{ width: 20, height: 20 }}
                    />
                  )}
                  <Text className="text-gray-800 text-lg">{item?.name}</Text>
                </View>
              )}
              keyExtractor={(item) => String(item.id)}
            />
          ) : (
            //TODO simplify and generalize methods for both search bars and handler methods
            <SearchBar<ShopItemDto>
              onSearch={setSearchQuery}
              onClear={() => setSearchQuery("")}
              searchText={searchQuery}
              placeholder={"Vyhľadaj konkrétny produkt"}
              options={productOptions ?? []}
              onOptionSelect={handleAddProductToCart}
              renderOption={(item) => (
                <Text className="text-gray-800 text-lg">
                  {item?.detail?.name}
                </Text>
              )}
              keyExtractor={(item) => String(item?.detail?.barcode)}
            />
          )}

          <IconButton
            onPress={() => bottomSheetRef?.current?.present()}
            className="w-10"
          >
            <ListFilter size={24} className="text-primary mr-3" />
          </IconButton>
        </View>

        <View className="flex-1 gap-2 mt-4">
          {cartCategories.map(
            ({ category: { id, name = "Category", image_url } = {} }) => (
              <ShoppingListItem
                key={id}
                id={id}
                categoryId={id}
                label={name}
                imageUrl={image_url}
                onDelete={(id) => handleRemoveItemFromCart("category", id)}
                isExpanded={expandedOption === id}
                onExpandChange={handleResetExpandedOption}
                onProductSelect={handleChooseProductFromCategory}
                type={ShoppingListItemTypeEnum.CATEGORY}
              />
            )
          )}

          {cartProducts.map(
            ({
              barcode,
              name = "Specific product",
              amount,
              unit,
              brand,
              category: { id: categoryId } = {},
            }) => (
              <ShoppingListItem
                key={barcode}
                id={String(barcode)}
                label={name}
                description={generateShoppingListItemDescription({
                  amount,
                  unit,
                  brand,
                })}
                type={ShoppingListItemTypeEnum.PRODUCT}
                categoryId={categoryId}
                onDelete={(id) => handleRemoveItemFromCart("product", id)}
                onProductSelect={handleChooseProductFromCategory}
              />
            )
          )}
        </View>
        {!areAnyItemsInCart && <EmptyShoppingListPlaceholderScreen />}
        {!!cart?.total_price && (
          <PriceSummary
            price={cart.total_price}
            onPress={() => console.log("summary pressed")}
          />
        )}
      </View>
    </View>
  );
}
