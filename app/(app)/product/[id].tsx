import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import type React from 'react';
import { useEffect, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useCartActions } from '~/hooks/use-cart-actions';
import { calculateDiscountPercentage } from '~/lib/number-utils';
import { getShopById } from '~/lib/utils';
import { useGetProductsByBarcode, useGetShops } from '~/network/query/query';
import { displaySuccessToastMessage } from '~/utils/toast-utils';

import { AddToCartSection } from '~/components/product-detail/add-to-cart-section';
import { CategoryBreadcrumb } from '~/components/product-detail/category-breadcrumb';
import { ProductImage } from '~/components/product-detail/product-image';
import { ProductInfo } from '~/components/product-detail/product-info';
import { ShopPricesList } from '~/components/product-detail/shop-prices-list';
import {
  getGetHybridCartQueryKey,
  useGetHybridCart,
} from '../../../network/hybrid-cart/hybrid-cart';

const ProductDetailScreen: React.FC = () => {
  const [cartQuantity, setCartQuantity] = useState<number>(1);
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { id } = useLocalSearchParams();

  const {
    handleAddProductToCart,
    handleRemoveItemFromCart,
    handleUpdateProductQuantity,
  } = useCartActions({
    onSuccessfullCartUpdate: () => {
      queryClient.invalidateQueries({
        queryKey: getGetHybridCartQueryKey(),
      });
      displaySuccessToastMessage('Produkt bol vložený do košíka');
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
  } = useGetHybridCart();

  const currentProductInCartQuantity =
    cart?.specific_products?.find(item => item.product?.barcode === String(id))
      ?.quantity ?? 0;

  const handleManageProductCartQuantity = () => {
    if (cartQuantity > 0 && selectedShopId) {
      if (currentProductInCartQuantity === 0) {
        handleAddProductToCart(String(id), cartQuantity);
      } else {
        handleUpdateProductQuantity(String(id), cartQuantity);
      }
    }
    if (cartQuantity === 0 && selectedShopId) {
      handleRemoveItemFromCart('product', String(id));
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
        barcode,
        image_url,
        brand,
        name,
        unit: { normalized_amount: amount, normalized_unit: unit } = {},
        category: { path_from_root, image_url: categoryImageUrl } = {},
      } = {},
      shops_prices,
    } = {},
    isLoading,
  } = useGetProductsByBarcode(String(id), undefined);

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
    if (!barcode && !isLoading && id) {
      // Product not found, clear navigation stack and redirect
      // Use dismissAll to clear modal stack, then replace current route
      router.dismissAll();
      router.replace('/+not-found');
    }
  }, [barcode, isLoading, id]);

  // Show loading state while checking
  if (!barcode && isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-foreground">Načítavam...</Text>
      </View>
    );
  }

  // If no product and not loading, we're redirecting (show nothing)
  if (!barcode && !isLoading) {
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
      />
    </SafeAreaView>
  );
};

export default ProductDetailScreen;
