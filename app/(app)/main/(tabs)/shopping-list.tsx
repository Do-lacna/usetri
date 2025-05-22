import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useEffect, useRef } from 'react';
import {
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ShoppingListProductSearch from '~/components/ui/shopping-list/shopping-list-product-search';
import EmptyShoppingListPlaceholderScreen from '../../../../components/placeholders/empty-shopping-list-placeholder-screen';
import { CustomBottomSheetModal } from '../../../../components/ui/bottom-sheet-modal';
import { Button } from '../../../../components/ui/button';
import PendingCartItemDrawerContent from '../../../../components/ui/pending-cart-item-drawer-content/pending-cart-item-drawer-content';
import PriceSummary from '../../../../components/ui/price-summary';
import SearchBar from '../../../../components/ui/search-bar';
import ShoppingListItem, {
  ShoppingListItemTypeEnum,
} from '../../../../components/ui/shopping-list-item';
import ShoppingListCategorySearch from '../../../../components/ui/shopping-list/shopping-list-category-search';
import { useCartActions } from '../../../../hooks/use-cart-actions';
import { generateShoppingListItemDescription } from '../../../../lib/utils';
import { useGetCart } from '../../../../network/customer/customer';
import type { CategoryExtendedWithPathDto } from '../../../../network/model';

export enum CartOperationsEnum {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  UPDATE = 'UPDATE',
}

export enum DrawerTypeEnum {
  CATEGORY = 'CATEGORY',
  PRODUCT = 'PRODUCT',
}

export type PendingCartDataType = {
  identifier: string;
  type: DrawerTypeEnum;
};


export default function Page() {
  const pendingProductSheetRef = useRef<BottomSheetModal>(null);
  const [isTextInputFocused, setIsTextInputFocused] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<
    CategoryExtendedWithPathDto[]
  >([]);
  const [expandedOption, setExpandedOption] = React.useState<number | null>(
    null,
  );
  const [pendingCartData, setPendingCartData] =
    React.useState<PendingCartDataType | null>(null);

  const {
    handleAddCategoryToCart,
    handleAddProductToCart,
    handleRemoveItemFromCart,
    handleChooseProductFromCategory,
    isLoading: areCartActionsLoading,
  } = useCartActions({
    onSuccessfullCartUpdate: () => {
      setSearchQuery('');
      pendingProductSheetRef?.current?.dismiss();
    },
    onSuccessWithExpandedOption: (categoryId) => {
      setExpandedOption(Number(categoryId));
    },
  });

  const {
    data: { cart } = {},
  } = ({} = useGetCart());

  const handleResetExpandedOption = (isExpanded?: boolean) => {
    // Reset expanded option if the item is collapsed
    if (!!expandedOption && !isExpanded) setExpandedOption(null);
  };

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
    [],
  );

  useEffect(() => {
    if (pendingCartData) pendingProductSheetRef?.current?.present();
  }, [pendingCartData, pendingProductSheetRef]);

  const handleConfirmPendingCartItem = (
    pendingCartData?: PendingCartDataType,
    quantity?: number,
  ) => {
    if (pendingCartData?.type === DrawerTypeEnum.CATEGORY) {
      handleAddCategoryToCart(Number(pendingCartData?.identifier));
    } else if (pendingCartData?.type === DrawerTypeEnum.PRODUCT) {
      handleAddProductToCart(pendingCartData.identifier, quantity);
    }
  };

  return (
    <SafeAreaView
      edges={['left', 'top', 'right']}
      className="flex-1 content-center"
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
        className={`px-2 ${areAnyItemsInCart ? 'flex-1' : ''}`}
      >
        <View className="flex-1">
          <View className="flex-row items-center gap-4 mt-2 z-10 px-2">
            <SearchBar<CategoryExtendedWithPathDto>
              onSearch={setSearchQuery}
              onClear={() => setSearchQuery('')}
              searchText={searchQuery}
              placeholder={'Vyhľadaj kategóriu produktu'}
              keyExtractor={(item) => String(item.id)}
              onFocus={() => setIsTextInputFocused(true)}
              // onBlur={() => setIsTextInputFocused(false)}
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
                <ShoppingListCategorySearch searchQuery={searchQuery} onCategorySelect={(categoryId) => handleTriggerCartDrawer(DrawerTypeEnum.CATEGORY, String(categoryId))} />
                <ShoppingListProductSearch searchQuery={searchQuery} onProductSelect={(barcode) => handleTriggerCartDrawer(DrawerTypeEnum.PRODUCT, String(barcode))} />
              </View>
            ) : (
              cartCategories.map(
                ({ category: { id, name = 'Category', image_url } = {} }) => (
                  <ShoppingListItem
                    key={id}
                    id={id}
                    categoryId={id}
                    label={name}
                    imageUrl={image_url}
                    onDelete={(id) => handleRemoveItemFromCart('category', id)}
                    isExpanded={expandedOption === id}
                    onExpandChange={handleResetExpandedOption}
                    onProductSelect={handleChooseProductFromCategory}
                    type={ShoppingListItemTypeEnum.CATEGORY}
                  />
                ),
              )
            )}

            {cartProducts.map(
              ({
                barcode,
                name = 'Specific product',
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
                  onDelete={(id) => handleRemoveItemFromCart('product', id)}
                  onProductSelect={handleChooseProductFromCategory}
                />
              ),
            )}
          </View>
          {!areAnyItemsInCart && !isTextInputFocused && <EmptyShoppingListPlaceholderScreen />}
          {!!cart?.total_price && (
            <PriceSummary
              price={cart.total_price}
              onPress={() => console.log('summary pressed')}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
