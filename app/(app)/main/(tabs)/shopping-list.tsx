import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import {
  Image,
  Keyboard,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyShoppingListPlaceholderScreen from "../../../../components/placeholders/empty-shopping-list-placeholder-screen";
import { CustomBottomSheetModal } from "../../../../components/ui/bottom-sheet-modal";
import { Button } from "../../../../components/ui/button";
import PendingCartItemDrawerContent from "../../../../components/ui/pending-cart-item-drawer-content/pending-cart-item-drawer-content";
import PriceSummary from "../../../../components/ui/price-summary";
import SearchBar from "../../../../components/ui/search-bar";
import ShoppingListItem, {
  ShoppingListItemTypeEnum,
} from "../../../../components/ui/shopping-list-item";
import ShoppingListCategorySearch from "../../../../components/ui/shopping-list/shopping-list-category-search";
import ShoppingListFilterContent, {
  ShoppingListFilter,
} from "../../../../components/ui/shopping-list/shopping-list-filter-content";
import { useCartActions } from "../../../../hooks/use-cart-actions";
import { BASE_API_URL } from "../../../../lib/constants";
import { generateShoppingListItemDescription } from "../../../../lib/utils";
import { useGetCart } from "../../../../network/customer/customer";
import type {
  CategoryExtendedWithPathDto,
  ShopItemDto,
} from "../../../../network/model";
import {
  useGetCategories,
  useGetProducts,
} from "../../../../network/query/query";

export enum CartOperationsEnum {
  ADD = "ADD",
  REMOVE = "REMOVE",
  UPDATE = "UPDATE",
}

export enum DrawerTypeEnum {
  CATEGORY = "CATEGORY",
  PRODUCT = "PRODUCT",
}

export type PendingCartDataType = {
  identifier: string;
  type: DrawerTypeEnum;
};

const MINIMUM_PRODUCT_SEARCH_LENGTH = 2;

export default function Page() {
  const queryClient = useQueryClient();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const pendingProductSheetRef = useRef<BottomSheetModal>(null);

  const [filter, setFilter] = React.useState<ShoppingListFilter>(
    ShoppingListFilter.CATEGORIES
  );
  const [isTextInputFocused, setIsTextInputFocused] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<
    CategoryExtendedWithPathDto[]
  >([]);
  const [expandedOption, setExpandedOption] = React.useState<number | null>(
    null
  );
  const [pendingCartData, setPendingCartData] =
    React.useState<PendingCartDataType | null>(null);

  const { data: { categories = [] } = {}, isLoading } = useGetCategories(
    {},
    { query: { enabled: filter === ShoppingListFilter.CATEGORIES } }
  );

  const {
    handleAddCategoryToCart,
    handleAddProductToCart,
    handleRemoveItemFromCart,
    handleChooseProductFromCategory,
    isLoading: areCartActionsLoading,
  } = useCartActions({
    onSuccessfullCartUpdate: () => {
      setSearchQuery("");
      pendingProductSheetRef?.current?.dismiss();
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
          filter === ShoppingListFilter.PRODUCTS &&
          searchQuery?.length >= MINIMUM_PRODUCT_SEARCH_LENGTH,
      },
    }
  );

  const productOptions = searchProducts?.map(
    ({ products }) => products?.[0] as ShopItemDto
  );

  const { data: { cart } = {} } = ({} = useGetCart());

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

  const handleTriggerCartDrawer = React.useCallback(
    (type: DrawerTypeEnum, identifier?: string) => {
      if (!identifier) return;
      Keyboard.dismiss();
      setPendingCartData({ identifier, type });
    },
    []
  );

  useEffect(() => {
    if (pendingCartData) pendingProductSheetRef?.current?.present();
  }, [pendingCartData, pendingProductSheetRef]);

  const handleConfirmPendingCartItem = (
    pendingCartData?: PendingCartDataType,
    quantity?: number
  ) => {
    if (pendingCartData?.type === DrawerTypeEnum.CATEGORY) {
      handleAddCategoryToCart(Number(pendingCartData?.identifier));
    } else if (pendingCartData?.type === DrawerTypeEnum.PRODUCT) {
      handleAddProductToCart(pendingCartData.identifier, quantity);
    }
  };

  return (
    <SafeAreaView
      edges={["left", "top", "right"]}
      className="flex-1 content-center"
    >
      <CustomBottomSheetModal ref={pendingProductSheetRef} index={2}>
        {/* <Toast config={toastConfig} /> */}

        <PendingCartItemDrawerContent
          pendingCartData={pendingCartData}
          onConfirm={handleConfirmPendingCartItem}
          onDismiss={() => pendingProductSheetRef?.current?.dismiss()}
          isLoading={areCartActionsLoading}
        />
      </CustomBottomSheetModal>

      <CustomBottomSheetModal ref={bottomSheetRef}>
        <ShoppingListFilterContent
          currentFilter={filter}
          onFilterChange={handleFilterChange}
        />
      </CustomBottomSheetModal>
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        className={`px-2 ${areAnyItemsInCart ? "flex-1" : ""}`}
      >
        <View className="flex-1">
          <View className="flex-row items-center gap-4 mt-2 z-10 px-2">
            {filter === ShoppingListFilter.CATEGORIES ? (
              <SearchBar<CategoryExtendedWithPathDto>
                onSearch={setSearchQuery}
                onClear={() => setSearchQuery("")}
                searchText={searchQuery}
                placeholder={"Vyhľadaj kategóriu produktu"}
                options={searchResults}
                onOptionSelect={(item) =>
                  handleTriggerCartDrawer(
                    DrawerTypeEnum.CATEGORY,
                    String(item?.id)
                  )
                }
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
                onFocus={() => setIsTextInputFocused(true)}
                // onBlur={() => setIsTextInputFocused(false)}
                displaySearchOptions={false}
              />
            ) : (
              //TODO simplify and generalize methods for both search bars and handler methods
              <SearchBar<ShopItemDto>
                onSearch={setSearchQuery}
                onClear={() => setSearchQuery("")}
                searchText={searchQuery}
                placeholder={"Vyhľadaj konkrétny produkt"}
                options={productOptions ?? []}
                onOptionSelect={(item) =>
                  handleTriggerCartDrawer(
                    DrawerTypeEnum.PRODUCT,
                    String(item?.detail?.barcode)
                  )
                }
                // onOptionSelect={handleAddProductToCart}
                renderOption={(item) => (
                  <Text className="text-gray-800 text-lg">
                    {item?.detail?.name}
                  </Text>
                )}
                minimumSearchLength={MINIMUM_PRODUCT_SEARCH_LENGTH}
                keyExtractor={(item) => String(item?.detail?.barcode)}
              />
            )}
            {/* 
            <IconButton
              onPress={() => {
                Keyboard.dismiss();
                bottomSheetRef?.current?.present();
              }}
              className="w-10"
            >
              <ListFilter size={24} className="text-primary mr-3" />
            </IconButton> */}
            {isTextInputFocused && (
              <Button variant="ghost">
                <Text className="text-terciary">Zruš</Text>
              </Button>
            )}
          </View>

          <ScrollView
            className="flex-1 gap-4 mt-4 px-2"
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={() => queryClient.invalidateQueries()}
              />
            }
          >
            {isTextInputFocused ? (
              <View>
                <ShoppingListCategorySearch searchQuery={searchQuery} />
              </View>
            ) : (
              cartCategories.map(
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
          </ScrollView>
          {!areAnyItemsInCart && <EmptyShoppingListPlaceholderScreen />}
          {!!cart?.total_price && (
            <PriceSummary
              price={cart.total_price}
              onPress={() => console.log("summary pressed")}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
