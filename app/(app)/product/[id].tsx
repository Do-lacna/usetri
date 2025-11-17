import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useCartActions } from '~/src/hooks/use-cart-actions';
import { calculateDiscountPercentage } from '~/src/lib/number-utils';
import { getShopById } from '~/src/lib/utils';
import {
  useGetCategoryPrices,
  useGetProductsById,
  useGetShops,
} from '~/src/network/query/query';
import { displaySuccessToastMessage } from '~/src/utils/toast-utils';

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
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { id: productId } = useLocalSearchParams();

  const {
    handleAddProductToCart,
    handleRemoveItemFromCart,
    handleUpdateProductQuantity,
  } = useCartActions({
    onSuccessfullCartUpdate: () => {
      queryClient.invalidateQueries({
        queryKey: getGetCartQueryKey(),
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
  } = useGetCart();

  const currentProductInCartQuantity =
    cart?.specific_products?.find(
      item => item.product?.id === Number(productId),
    )?.quantity ?? 0;

  const handleManageProductCartQuantity = () => {
    if (cartQuantity > 0 && selectedShopId) {
      if (currentProductInCartQuantity === 0) {
        handleAddProductToCart(Number(productId), cartQuantity);
      } else {
        handleUpdateProductQuantity(Number(productId), cartQuantity);
      }
    }
    if (cartQuantity === 0 && selectedShopId) {
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
        barcode,
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
      .map(({ shop_id, price }) => ({
        shop_id,
        price: price?.actual_price ?? 0,
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
      />
    </SafeAreaView>
  );
};

export default ProductDetailScreen;
