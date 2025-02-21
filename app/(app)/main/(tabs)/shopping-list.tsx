import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQueryClient } from "@tanstack/react-query";
import React, { useRef } from "react";
import { Keyboard, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { ListFilter } from "~/lib/icons/Filter";
import IconButton from "../../../../components/icon-button";
import EmptyShoppingListPlaceholderScreen from "../../../../components/placeholders/empty-shopping-list-placeholder-screen";
import { CustomBottomSheetModal } from "../../../../components/ui/bottom-sheet-modal";
import PriceSummary from "../../../../components/ui/price-summary";
import SearchBar from "../../../../components/ui/search-bar";
import ShoppingListItem from "../../../../components/ui/shopping-list-item";
import ShoppingListFilterContent, {
  ShoppingListFilter,
} from "../../../../components/ui/shopping-list/shopping-list-filter-content";
import useCartStore from "../../../../hooks/use-cart-store";
import { getSimplifiedCart, isArrayNotEmpty } from "../../../../lib/utils";
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

enum CartOperationsEnum {
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

  const handleAddProductToCart = ({
    detail: { barcode } = {},
  }: ShopItemDto) => {
    if (!barcode) return;
    setSearchQuery("");
    const { barcodes = [], category_ids = [] } = getSimplifiedCart(cart);

    sendUpdateCart({
      data: { ...category_ids, barcodes: [...barcodes, barcode] },
      additionalData: {
        operation: CartOperationsEnum.ADD,
      },
      //here I want to pass more data for example to the context
    });
  };

  const handleAddToCart = (option: CategoryExtendedWithPathDto) => {
    if (!option?.id) return;

    setSearchQuery("");
    const { barcodes = [], category_ids = [] } = getSimplifiedCart(cart);

    sendUpdateCart({
      data: { barcodes, category_ids: [...category_ids, option?.id] },
      additionalData: {
        operation: CartOperationsEnum.ADD,
      },
      //here I want to pass more data for example to the context
    });
  };

  const handleResetExpandedOption = (isExpanded?: boolean) => {
    // Reset expanded option if the item is collapsed
    if (!!expandedOption && !isExpanded) setExpandedOption(null);
  };

  const cartCategories = cart?.categories ?? [];
  const cartProducts = cart?.specific_products ?? [];

  const areAnyItemsInCart =
    cartCategories.length > 0 || cartProducts.length > 0;

  const handleRemoveProductFromCard = (
    type: "category" | "product",
    id?: number | string
  ) => {
    const simplifiedCart = getSimplifiedCart(cart);
    //TODO when BE adjusts DTO uncomment this
    if (type === "category") {
      simplifiedCart.category_ids = simplifiedCart.category_ids?.filter(
        (categoryId) => categoryId !== id
      );
    } else {
      simplifiedCart.barcodes = simplifiedCart.barcodes?.filter(
        (barcode) => barcode !== id
      );
    }
    sendUpdateCart({ data: simplifiedCart });
  };

  const handleProductSelect = (barcode: string, categoryId: number) => {
    const { barcodes = [], category_ids = [] } = getSimplifiedCart(cart);

    const updatedCategoryIds = category_ids.includes(categoryId)
      ? category_ids.filter((id) => id !== categoryId)
      : category_ids;

    sendUpdateCart({
      data: {
        category_ids: updatedCategoryIds,
        barcodes: [...barcodes, barcode],
      },
      additionalData: {
        operation: CartOperationsEnum.ADD,
      },
    });
  };

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
              onOptionSelect={handleAddToCart}
              renderOption={(item) => (
                <Text className="text-gray-800 text-lg">{item?.name}</Text>
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
            ({ category: { id, name = "Category" } = {} }) => (
              <ShoppingListItem
                key={id}
                id={id}
                categoryId={id}
                label={name}
                onDelete={(id) => handleRemoveProductFromCard("category", id)}
                isExpanded={expandedOption === id}
                onExpandChange={handleResetExpandedOption}
                onProductSelect={handleProductSelect}
              />
            )
          )}

          {cartProducts.map(
            ({
              detail: {
                barcode,
                name = "Specific product",
                category: { id: categoryId } = {},
              } = {},
            }) => (
              <ShoppingListItem
                key={barcode}
                id={String(barcode)}
                label={name}
                categoryId={categoryId}
                onDelete={(id) => handleRemoveProductFromCard("product", id)}
                // onExpandChange={handleResetExpandedOption}
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
