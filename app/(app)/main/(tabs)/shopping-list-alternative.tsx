import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef } from 'react';
import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyShoppingListPlaceholderScreen from '../../../../components/placeholders/empty-shopping-list-placeholder-screen';
import { CustomBottomSheetModal } from '../../../../components/ui/bottom-sheet-modal';
import PendingCartItemDrawerContent from '../../../../components/ui/pending-cart-item-drawer-content/pending-cart-item-drawer-content';
import PriceSummary from '../../../../components/ui/price-summary';
import SearchBar from '../../../../components/ui/search-bar';
import ShoppingListItem, {
    ShoppingListItemTypeEnum,
} from '../../../../components/ui/shopping-list-item';
import { useCartActions } from '../../../../hooks/use-cart-actions';
import { generateShoppingListItemDescription } from '../../../../lib/utils';
import { useGetCart } from '../../../../network/customer/customer';
import type { ShopItemDto } from '../../../../network/model';
import { useGetProducts } from '../../../../network/query/query';

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

const MINIMUM_PRODUCT_SEARCH_LENGTH = 2;

export default function ShoppingListAlternative() {
  const queryClient = useQueryClient();
  const pendingProductSheetRef = useRef<BottomSheetModal>(null);

  const [searchQuery, setSearchQuery] = React.useState('');

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
    data: { products: searchProducts = [] } = {},
  } = useGetProducts(
    {
      search: searchQuery,
    },
    {
      query: {
        enabled: searchQuery?.length >= MINIMUM_PRODUCT_SEARCH_LENGTH,
      },
    },
  );

  const productOptions = searchProducts?.map(
    ({ products }) => products?.[0] as ShopItemDto,
  );

  const {
    data: { cart } = {},
  } = ({} = useGetCart());

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
        {/* <Toast config={toastConfig} /> */}

        <PendingCartItemDrawerContent
          pendingCartData={pendingCartData}
          onConfirm={handleConfirmPendingCartItem}
          onDismiss={() => pendingProductSheetRef?.current?.dismiss()}
          isLoading={areCartActionsLoading}
        />
      </CustomBottomSheetModal>

      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        className={`px-2 ${areAnyItemsInCart ? 'flex-1' : ''}`}
      >
        <View className="flex-1">
          <SearchBar<ShopItemDto>
            onSearch={setSearchQuery}
            onClear={() => setSearchQuery('')}
            searchText={searchQuery}
            placeholder={'Vyhľadaj konkrétny produkt'}
            options={productOptions ?? []}
            onOptionSelect={(item) =>
              handleTriggerCartDrawer(
                DrawerTypeEnum.PRODUCT,
                String(item?.detail?.barcode),
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

          <View className="flex-1 gap-4 mt-4 px-2">
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
          {!areAnyItemsInCart && <EmptyShoppingListPlaceholderScreen />}
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
