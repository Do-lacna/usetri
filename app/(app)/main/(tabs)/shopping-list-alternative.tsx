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
import EmptyShoppingListPlaceholderScreen from "../../../../components/placeholders/empty-shopping-list-placeholder-screen";
import { CustomBottomSheetModal } from "../../../../components/ui/bottom-sheet-modal";
import { Button } from "../../../../components/ui/button";
import PendingCartItemDrawerContent from "../../../../components/ui/pending-cart-item-drawer-content/pending-cart-item-drawer-content";
import PriceSummary from "../../../../components/ui/price-summary";
import SearchBar from "../../../../components/ui/search-bar";
import ShoppingListProductItem from "../../../../components/ui/shopping-list/shopping-list-item-alternate";
import { useAlternativeCartActions } from "../../../../hooks/use-alternative-cart-actions";
import type { CategoryExtendedWithPathDto } from "../../../../network/model";
import { useGetProductCart } from "../../../../network/product-cart/product-cart";
import { DrawerTypeEnum, PendingCartDataType } from "./shopping-list";

export enum CartOperationsEnum {
  ADD = "ADD",
  REMOVE = "REMOVE",
  UPDATE = "UPDATE",
}

export default function ShoppingListAlternative() {
  const pendingProductSheetRef = useRef<BottomSheetModal>(null);
  const [isTextInputFocused, setIsTextInputFocused] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const queryClient = useQueryClient();
  const [expandedOption, setExpandedOption] = React.useState<number | null>(
    null
  );
  const [pendingProductBarcode, setPendingProductBarcode] = React.useState<
    string | null
  >(null);

  const {
    handleAddProductToCart,
    handleUpdateProductQuantity,
    handleSwitchProduct,
    isLoading: areCartActionsLoading,
  } = useAlternativeCartActions({
    onSuccessfullCartUpdate: () => {
      setSearchQuery("");
      pendingProductSheetRef?.current?.dismiss();
      setIsTextInputFocused(false);
    },
    onSuccessWithExpandedOption: (categoryId) => {
      setExpandedOption(Number(categoryId));
    },
  });

  const {
    data: { cart: { specific_products = [], total_price } = {} } = {},
    isLoading: isCartLoading,
  } = useGetProductCart();

  const areAnyItemsInCart = [...(specific_products ?? [])].length > 0;

  const handleTriggerCartDrawer = React.useCallback((barcode: string) => {
    if (!barcode) return;
    Keyboard.dismiss();
    setPendingProductBarcode(barcode);
  }, []);

  useEffect(() => {
    if (pendingProductBarcode) pendingProductSheetRef?.current?.present();
  }, [pendingProductBarcode, pendingProductSheetRef]);

  const handleConfirmPendingCartItem = (
    pendingCartData?: PendingCartDataType,
    quantity?: number
  ) => {
    handleAddProductToCart(String(pendingCartData?.identifier), quantity);
  };

  return (
    <SafeAreaView
      edges={["left", "top", "right"]}
      className="flex-1 content-center bg-gray-50"
    >
      <CustomBottomSheetModal ref={pendingProductSheetRef} index={2}>
        <PendingCartItemDrawerContent
          pendingCartData={{
            identifier: String(pendingProductBarcode),
            type: DrawerTypeEnum.PRODUCT,
          }}
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
              placeholder={"Vyhľadaj konkrétny produkt"}
              keyExtractor={(item) => String(item.id)}
              onFocus={() => setIsTextInputFocused(true)}
              displaySearchOptions={false}
            />
            {isTextInputFocused && (
              <Button
                variant="ghost"
                onPress={() => setIsTextInputFocused(false)}
              >
                <Text className="text-terciary">Zruš</Text>
              </Button>
            )}
          </View>

          <View className="flex-1 gap-4 mt-4 px-2">
            {isTextInputFocused ? (
              <View className="flex-1 mb-16">
                <ShoppingListProductSearch
                  searchQuery={searchQuery}
                  onProductSelect={(barcode) =>
                    handleTriggerCartDrawer(String(barcode))
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
                className="px-1"
              >
                {specific_products?.map((item) => (
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
          {!!total_price && <PriceSummary />}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
