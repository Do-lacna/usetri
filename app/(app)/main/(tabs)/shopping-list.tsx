import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import {
  Keyboard,
  RefreshControl,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ShoppingListProductSearch from "~/components/ui/shopping-list/shopping-list-product-search";
import { useGetHybridCart } from "~/network/hybrid-cart/hybrid-cart";
import EmptyShoppingListPlaceholderScreen from "../../../../components/placeholders/empty-shopping-list-placeholder-screen";
import { CustomBottomSheetModal } from "../../../../components/ui/bottom-sheet-modal";
import { Button } from "../../../../components/ui/button";
import Divider from "../../../../components/ui/divider";
import PendingCartItemDrawerContent from "../../../../components/ui/pending-cart-item-drawer-content/pending-cart-item-drawer-content";
import PriceSummary from "../../../../components/ui/price-summary";
import SearchBar from "../../../../components/ui/search-bar";
import ShoppingListCategoryItem from "../../../../components/ui/shopping-list/shopping-list-category-item";
import ShoppingListCategorySearch from "../../../../components/ui/shopping-list/shopping-list-category-search";
import ShoppingListProductItem from "../../../../components/ui/shopping-list/shopping-list-product-item";
import { useCartActions } from "../../../../hooks/use-cart-actions";
import type { CategoryExtendedWithPathDto } from "../../../../network/model";

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

export default function ShoppingList() {
  const pendingProductSheetRef = useRef<BottomSheetModal>(null);
  const [isTextInputFocused, setIsTextInputFocused] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const queryClient = useQueryClient();
  const [expandedOption, setExpandedOption] = React.useState<number | null>(
    null
  );
  const [pendingCartData, setPendingCartData] =
    React.useState<PendingCartDataType | null>(null);

  const {
    handleAddCategoryToCart,
    handleAddProductToCart,
    handleRemoveItemFromCart,
    handleChooseProductFromCategory,
    handleUpdateProductQuantity,
    handleUpdateCategoryQuantity,
    handleSwitchProduct,
    isLoading: areCartActionsLoading,
  } = useCartActions({
    onSuccessfullCartUpdate: () => {
      setSearchQuery("");
      pendingProductSheetRef?.current?.dismiss();
      setIsTextInputFocused(false);
    },
    onSuccessWithExpandedOption: (categoryId) => {
      setExpandedOption(Number(categoryId));
    },
  });

  const { data: { cart } = {}, isLoading: isCartLoading } = ({} =
    useGetHybridCart());

  const cartCategories = cart?.categories ?? [];
  const cartProducts = cart?.specific_products ?? [];

  const areAnyItemsInCart =
    cartCategories.length > 0 || cartProducts.length > 0;

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
      className="flex-1 content-center bg-gray-50"
    >
      <CustomBottomSheetModal ref={pendingProductSheetRef} index={2}>
        <PendingCartItemDrawerContent
          pendingCartData={pendingCartData}
          onConfirm={handleConfirmPendingCartItem}
          onDismiss={() => pendingProductSheetRef?.current?.dismiss()}
          isLoading={areCartActionsLoading}
        />
      </CustomBottomSheetModal>

      {/* <CustomBottomSheetModal ref={bottomSheetRef}>
        <ShoppingListFilterContent
          currentFilter={filter}
          onFilterChange={handleFilterChange}
        />
      </CustomBottomSheetModal> */}
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        className={`px-2 ${areAnyItemsInCart ? "flex-1" : ""}`}
      >
        <View className="flex-1">
          <View className="flex-row items-center gap-4 mt-2 z-10 px-2">
            <SearchBar<CategoryExtendedWithPathDto>
              onSearch={setSearchQuery}
              onClear={() => setSearchQuery("")}
              searchText={searchQuery}
              placeholder={"Vyhľadaj kategóriu alebo produkt"}
              keyExtractor={(item) => String(item.id)}
              onFocus={() => setIsTextInputFocused(true)}
              // onBlur={() => setIsTextInputFocused(false)}
              displaySearchOptions={false}
            />
            {isTextInputFocused && (
              <Button
                variant="ghost"
                onPress={() => {
                  setSearchQuery("");
                  setIsTextInputFocused(false);
                }}
              >
                <Text className="text-terciary">Zruš</Text>
              </Button>
            )}
          </View>

          <View className="flex-1 gap-4 mt-4 px-2">
            {isTextInputFocused ? (
              <View className="flex-1 mb-16">
                <ShoppingListCategorySearch
                  searchQuery={searchQuery}
                  onCategorySelect={(categoryId) =>
                    handleTriggerCartDrawer(
                      DrawerTypeEnum.CATEGORY,
                      String(categoryId)
                    )
                  }
                />
                <ShoppingListProductSearch
                  searchQuery={searchQuery}
                  onProductSelect={(barcode) =>
                    handleTriggerCartDrawer(
                      DrawerTypeEnum.PRODUCT,
                      String(barcode)
                    )
                  }
                />
              </View>
            ) : (
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={isCartLoading || areCartActionsLoading}
                    onRefresh={() => queryClient.invalidateQueries()}
                  />
                }
                className="mb-24"
              >
                {cartCategories.map((item) => (
                  <ShoppingListCategoryItem
                    key={item?.category?.id}
                    item={item}
                    isExpanded={expandedOption === item?.category?.id}
                    onAlternativeSelect={handleChooseProductFromCategory}
                    onUpdateQuantity={handleUpdateCategoryQuantity}
                  />
                ))}

                <Divider className="mt-2 mb-4" />

                {cartProducts.map((item) => (
                  <ShoppingListProductItem
                    key={item?.product?.barcode}
                    item={item}
                    isExpanded={expandedOption === item?.product?.barcode}
                    onAlternativeSelect={(originalBarcode, barcode) =>
                      handleSwitchProduct(originalBarcode, barcode)
                    }
                    onUpdateQuantity={handleUpdateProductQuantity}
                  />
                ))}
              </ScrollView>
            )}
          </View>
          {!areAnyItemsInCart && !isTextInputFocused && (
            <EmptyShoppingListPlaceholderScreen />
          )}
          {!!cart?.total_price && <PriceSummary />}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
