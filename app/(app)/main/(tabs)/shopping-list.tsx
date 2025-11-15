import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  RefreshControl,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomBottomSheetModal } from "~/src/components/layout/bottom-sheet-modal/bottom-sheet-modal";
import PendingCartItemDrawerContent, {
  PendingCartItemActionEnum,
} from "~/src/components/pending-cart-item-drawer-content";
import EmptyShoppingListPlaceholderScreen from "~/src/components/placeholders/empty-shopping-list-placeholder-screen";
import SearchBar, { type ISearchBarHandle } from "~/src/components/search-bar";
import { Button } from "~/src/components/ui/button";
import Divider from "~/src/components/ui/divider";
import ShoppingListProductSearch from "~/src/features/shopping-list/components/shopping-list-product-search";
import { useCartActions } from "~/src/hooks/use-cart-actions";
import { useGetCart } from "~/src/network/cart/cart";
import type { CategoryExtendedWithPathDto } from "~/src/network/model";
import PriceSummary from "../../../../src/features/shopping-list/components/price-summary";
import ShoppingListCategoryItem from "../../../../src/features/shopping-list/components/shopping-list-category-item";
import ShoppingListCategorySearch from "../../../../src/features/shopping-list/components/shopping-list-category-search";
import ShoppingListProductItem from "../../../../src/features/shopping-list/components/shopping-list-product-item";

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
  identifier: number;
  type: DrawerTypeEnum;
};

interface SearchHeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onClear: () => void;
}

export default function ShoppingList() {
  const { t } = useTranslation();
  const pendingProductSheetRef = useRef<BottomSheetModal>(null);
  const searchBarRef = useRef<ISearchBarHandle>(null);
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

  const { data: { cart } = {}, isLoading: isCartLoading } = useGetCart();

  const cartCategories = cart?.categories ?? [];
  const cartProducts = cart?.specific_products ?? [];

  const areAnyItemsInCart =
    cartCategories.length > 0 || cartProducts.length > 0;

  const handleTriggerCartDrawer = React.useCallback(
    (type: DrawerTypeEnum, identifier?: number) => {
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
    quantity?: number,
    action?: PendingCartItemActionEnum
  ) => {
    if (action === PendingCartItemActionEnum.ADD) {
      if (pendingCartData?.type === DrawerTypeEnum.CATEGORY) {
        handleAddCategoryToCart(Number(pendingCartData?.identifier), quantity);
      } else if (pendingCartData?.type === DrawerTypeEnum.PRODUCT) {
        handleAddProductToCart(pendingCartData.identifier, quantity);
      }
    } else if (action === PendingCartItemActionEnum.UPDATE) {
      if (pendingCartData?.type === DrawerTypeEnum.CATEGORY) {
        handleUpdateCategoryQuantity(
          Number(pendingCartData?.identifier),
          quantity ?? 0
        );
      } else if (pendingCartData?.type === DrawerTypeEnum.PRODUCT) {
        handleUpdateProductQuantity(pendingCartData.identifier, quantity ?? 0);
      }
    }
  };

  return (
    <SafeAreaView
      edges={["left", "top", "right"]}
      className="flex-1 content-center bg-background"
    >
      <CustomBottomSheetModal ref={pendingProductSheetRef} index={2}>
        <PendingCartItemDrawerContent
          pendingCartData={pendingCartData}
          onConfirm={handleConfirmPendingCartItem}
          onDismiss={() => pendingProductSheetRef?.current?.dismiss()}
          isLoading={areCartActionsLoading}
        />
      </CustomBottomSheetModal>

      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        className={`px-2 ${areAnyItemsInCart ? "flex-1" : ""}`}
      >
        <View className="flex-1">
          <View className="flex-row items-center gap-4 mt-2 z-10 px-2">
            <SearchBar<CategoryExtendedWithPathDto>
              ref={searchBarRef}
              onSearch={setSearchQuery}
              onClear={() => setSearchQuery("")}
              searchText={searchQuery}
              placeholder={t("shopping_list.search_placeholder")}
              keyExtractor={(item) => String(item.id)}
              onFocus={() => setIsTextInputFocused(true)}
              onBlur={() => setIsTextInputFocused(false)}
              displaySearchOptions={false}
            />
            {isTextInputFocused && (
              <Button
                variant="ghost"
                onPress={() => {
                  searchBarRef.current?.blur();
                  setSearchQuery("");
                }}
              >
                <Text className="text-primary">
                  {t("shopping_list.cancel")}
                </Text>
              </Button>
            )}
          </View>

          <View className="flex-1 gap-4 mt-4 px-2">
            {isTextInputFocused ? (
              <View className="flex-1 mb-16">
                <ShoppingListCategorySearch
                  searchQuery={searchQuery}
                  onCategorySelect={(categoryId) =>
                    handleTriggerCartDrawer(DrawerTypeEnum.CATEGORY, categoryId)
                  }
                />
                <ShoppingListProductSearch
                  searchQuery={searchQuery}
                  onProductSelect={(productId) =>
                    handleTriggerCartDrawer(DrawerTypeEnum.PRODUCT, productId)
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
                    key={item?.product?.id}
                    item={item}
                    isExpanded={expandedOption === item?.product?.id}
                    onAlternativeSelect={(originalId, id) =>
                      handleSwitchProduct(originalId, id)
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
