import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {
  DrawerTypeEnum,
  type PendingCartDataType,
} from '~/app/(app)/main/(tabs)/shopping-list';
import { CustomBottomSheetModal } from '~/src/components/layout/bottom-sheet-modal/bottom-sheet-modal';
import PendingCartItemDrawerContent from '~/src/components/pending-cart-item-drawer-content';
import { useCartActions } from '~/src/hooks/use-cart-actions';
import { calculateDiscountPercentage } from '~/src/lib/number-utils';
import { getShopById } from '~/src/lib/utils';
import {
  useGetCategoryPrices,
  useGetProductsById,
  useGetShops,
} from '~/src/network/query/query';

import { CategoryPricesGrid } from '~/src/components/category-prices-grid';
import { AddToCartSection } from '~/src/components/product-detail/add-to-cart-section';
import { CategoryBreadcrumb } from '~/src/components/product-detail/category-breadcrumb';
import { ProductImage } from '~/src/components/product-detail/product-image';
import { ProductInfo } from '~/src/components/product-detail/product-info';
import { ShopPricesList } from '~/src/components/product-detail/shop-prices-list';
import { getGetCartQueryKey, useGetCart } from '~/src/network/cart/cart';

const ProductDetailScreen: React.FC = () => {
  const [cartQuantity, setCartQuantity] = useState<number>(1);
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<
    'added' | 'updated' | 'removed' | null
  >(null);
  const pendingProductSheetRef = useRef<BottomSheetModal>(null);
  const [pendingCartData, setPendingCartData] =
    useState<PendingCartDataType | null>(null);

  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { id: productId } = useLocalSearchParams();

  const {
    handleAddProductToCart,
    handleRemoveItemFromCart,
    handleUpdateProductQuantity,
    handleAddCategoryToCart,
    handleUpdateCategoryQuantity,
    isLoading: areCartActionsLoading,
  } = useCartActions({
    onSuccessfullCartUpdate: () => {
      queryClient.invalidateQueries({
        queryKey: getGetCartQueryKey(),
      });
      pendingProductSheetRef?.current?.dismiss();
      // Trigger haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      // Reset after 2 seconds
      setTimeout(() => setActionType(null), 2000);
    },
  });

  const incrementQuantity = () => {
    setCartQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setCartQuantity(prev => Math.max(0, prev - 1));
  };

  const {
    data: { cart } = {},
    isLoading: isCartLoading,
  } = useGetCart();

  const currentProductInCartQuantity =
    cart?.specific_products?.find(
      item => item.product?.id === Number(productId),
    )?.quantity ?? 0;

  const handleManageProductCartQuantity = () => {
    if (cartQuantity > 0 && selectedShopId) {
      if (currentProductInCartQuantity === 0) {
        setActionType('added');
        handleAddProductToCart(Number(productId), cartQuantity);
      } else {
        setActionType('updated');
        handleUpdateProductQuantity(Number(productId), cartQuantity);
      }
    }
    if (cartQuantity === 0 && selectedShopId) {
      setActionType('removed');
      handleRemoveItemFromCart('product', Number(productId));
    }
  };

  const {
    data: { shops = [] } = {},
  } = useGetShops();

  const { name: selectedShopName, image_url: shopImage } =
    getShopById(selectedShopId, shops) || {};

  const {
    data: {
      detail: {
        id,
        image_url,
        brand,
        name,
        unit: { normalized_amount: amount, normalized_unit: unit } = {},
        category: {
          id: categoryId,
          name: categoryName,
          default_amount: categoryDefaultAmount,
          default_unit: categoryDefaultUnit,
          path_from_root,
          image_url: categoryImageUrl,
        } = {},
      } = {},
      shops_prices,
    } = {},
    isLoading,
  } = useGetProductsById(Number(productId), undefined);

  // Fetch category prices
  const {
    data: { shop_prices: categoryShopPrices } = {},
  } = useGetCategoryPrices(Number(categoryId), {
    query: {
      enabled: !!categoryId,
    },
  });

  // Calculate which shops don't have this specific product
  const missingShopsPrices = useMemo(() => {
    if (!categoryShopPrices || !shops_prices) return [];

    const productShopIds = new Set(shops_prices.map(sp => Number(sp.shop_id)));

    return categoryShopPrices
      .filter(({ shop_id }) => !productShopIds.has(Number(shop_id)))
      .map(({ shop_id, price, product_id }) => ({
        shop_id,
        price: price?.actual_price ?? 0,
        originalPrice: price?.price ?? 0,
        discountPrice: price?.discount_price?.price,
        product_id,
      }));
  }, [categoryShopPrices, shops_prices]);

  useEffect(() => {
    if ([shops_prices ?? []].length > 0) {
      setSelectedShopId(Number(shops_prices?.[0]?.shop_id));
    }
  }, [shops_prices]);

  useEffect(() => {
    if (currentProductInCartQuantity > 0) {
      setCartQuantity(currentProductInCartQuantity);
    }
  }, [currentProductInCartQuantity]);

  // Redirect to not-found if product doesn't exist
  useEffect(() => {
    if (!id && !isLoading && productId) {
      router.dismissAll();
      router.replace('/+not-found');
    }
  }, [id, isLoading, productId]);

  // Show loading state while checking
  if (!id && isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-foreground">Načítavam...</Text>
      </View>
    );
  }

  // If no product and not loading, we're redirecting (show nothing)
  if (!id && !isLoading) {
    return null;
  }

  const selectedShopPrice =
    shops_prices?.find(product => product.shop_id === Number(selectedShopId))
      ?.actual_price ?? 0;

  const selectedShopDiscountPrice = shops_prices?.find(
    product => product.shop_id === Number(selectedShopId),
  )?.discount_price?.price;

  const percentageDiscount = selectedShopDiscountPrice
    ? calculateDiscountPercentage(selectedShopPrice, selectedShopDiscountPrice)
    : null;

  const totalPrice =
    (selectedShopDiscountPrice ?? selectedShopPrice) * cartQuantity;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => queryClient.invalidateQueries()}
          />
        }
      >
        <ProductImage
          imageUrl={image_url ?? categoryImageUrl}
          discountPercentage={percentageDiscount}
        />

        <CategoryBreadcrumb categories={path_from_root || []} />

        <View className="px-4">
          <ProductInfo
            name={name || ''}
            brand={brand || ''}
            amount={amount || 0}
            unit={unit || ''}
          />

          <ShopPricesList
            shopsPrices={shops_prices}
            shops={shops}
            selectedShopId={selectedShopId}
            onShopSelect={setSelectedShopId}
          />

          {/* Category prices for shops that don't have this specific product */}
          {missingShopsPrices.length > 0 && (
            <CategoryPricesGrid
              categoryPrices={missingShopsPrices}
              title={t('cart_drawer.estimated_prices_other_shops', {
                category: categoryName || '',
              })}
              categoryAmount={categoryDefaultAmount}
              categoryUnit={categoryDefaultUnit}
              className="mb-6"
              onPricePress={(shopId, productId) => {
                if (!productId) return;
                setPendingCartData({
                  identifier: productId,
                  type: DrawerTypeEnum.PRODUCT,
                });
                pendingProductSheetRef.current?.present();
              }}
            />
          )}
        </View>
      </ScrollView>

      <AddToCartSection
        selectedShopName={String(selectedShopName)}
        totalPrice={totalPrice}
        cartQuantity={cartQuantity}
        currentProductInCartQuantity={currentProductInCartQuantity}
        onIncrement={incrementQuantity}
        onDecrement={decrementQuantity}
        onAddToCart={handleManageProductCartQuantity}
        actionType={actionType}
      />

      <CustomBottomSheetModal
        ref={pendingProductSheetRef}
        snapPoints={['85%']}
        onDismiss={() => setPendingCartData(null)}
      >
        <PendingCartItemDrawerContent
          pendingCartData={pendingCartData}
          onDismiss={() => pendingProductSheetRef.current?.dismiss()}
          onConfirm={(data, quantity, action) => {
            if (!data || !quantity || !action) return;
            if (data.type === DrawerTypeEnum.CATEGORY) {
              if (action === 'ADD') {
                handleAddCategoryToCart(data.identifier, quantity);
              } else {
                handleUpdateCategoryQuantity(data.identifier, quantity);
              }
            } else {
              if (action === 'ADD') {
                handleAddProductToCart(data.identifier, quantity);
              } else {
                handleUpdateProductQuantity(data.identifier, quantity);
              }
            }
          }}
          isLoading={areCartActionsLoading}
        />
      </CustomBottomSheetModal>
    </SafeAreaView>
  );
};

export default ProductDetailScreen;
