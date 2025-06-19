import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { useCartActions } from '~/hooks/use-cart-actions';
import { PLACEHOLDER_PRODUCT_IMAGE } from '~/lib/constants';
import { calculateDiscountPercentage } from '~/lib/number-utils';
import { getShopById } from '~/lib/utils';
import { useGetProductsByBarcode, useGetShops } from '~/network/query/query';
import { getShopLogo } from '~/utils/logo-utils';
import { displaySuccessToastMessage } from '~/utils/toast-utils';
import {
  getGetUserCartComparisonQueryKey,
  useGetCart,
} from '../../../network/customer/customer';

// TypeScript interfaces
interface Shop {
  id: string;
  name: string;
  price: number;
  currency: string;
  distance?: string;
  availability: 'in-stock' | 'low-stock' | 'out-of-stock';
}

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  amount: number;
  unit: string;
  imageUrl: string;
  categories: Category[];
  shops: Shop[];
  description?: string;
  nutritionScore?: 'A' | 'B' | 'C' | 'D' | 'E';
}

const ProductDetailScreen: React.FC = () => {
  const [cartQuantity, setCartQuantity] = useState<number>(1);
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { id } = useLocalSearchParams();
  const router = useRouter();

  const {
    handleAddCategoryToCart,
    handleAddProductToCart,
    handleRemoveItemFromCart,
    handleChooseProductFromCategory,
    handleUpdateProductQuantity,
  } = useCartActions({
    onSuccessfullCartUpdate: () => {
      queryClient.invalidateQueries({
        queryKey: getGetUserCartComparisonQueryKey(),
      });
      displaySuccessToastMessage('Produkt bol vložený do košíka');
    },
  });

  const incrementQuantity = () => {
    setCartQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setCartQuantity((prev) => Math.max(0, prev - 1));
  };

  const {
    data: { cart } = {},
    isLoading: isCartLoading,
  } = ({} = useGetCart());

  const currentProductInCartQuantity =
    cart?.specific_products?.find(
      (item) => item.product?.barcode === String(id),
    )?.quantity ?? 0;

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
    data: { products = [] } = {},
    isLoading,
  } = useGetProductsByBarcode(String(id), undefined);

  useEffect(() => {
    if ([products ?? []].length > 0) {
      setSelectedShopId(Number(products?.[0]?.shop_id));
    }
  }, [products]);

  useEffect(() => {
    if (currentProductInCartQuantity > 0) {
      setCartQuantity(currentProductInCartQuantity);
    }
  }, [currentProductInCartQuantity]);

  //TODO add loading state and error state

  if (!products?.[0] && !isLoading) {
    //TODO create adequate error screen for not found product
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-3xl">Product not found</Text>
      </View>
    );
  }

  //TODO this EP should return only detail of the product in 1 object
  const {
    detail: { image_url, brand, name, amount, unit, barcode } = {},
    discount_price,
  } = {
    ...products?.[0],
  };

  const selectedShopPrice =
    products?.find((product) => product.shop_id === Number(selectedShopId))
      ?.price ?? 0;

  const selectedShopDiscountPrice =
    products?.find((product) => product.shop_id === Number(selectedShopId))
      ?.discount_price?.price ?? 0;

  const percentageDiscount = selectedShopDiscountPrice
    ? calculateDiscountPercentage(selectedShopPrice, selectedShopDiscountPrice)
    : null;

  const productCategories = [
    { id: '1', name: 'Dairy' },
    { id: '2', name: 'Milk & Cream' },
    { id: '3', name: 'Whole Milk' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
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
        <View className="bg-gray-50 items-center justify-center py-2 relative">
          <Image
            source={{
              uri: image_url ?? PLACEHOLDER_PRODUCT_IMAGE,
            }}
            className="w-full h-60"
            resizeMode="contain"
          />
          {percentageDiscount && (
            <Badge className="absolute top-6 left-4 bg-red-400">
              <Text className="text-sm text-white font-semibold">
                -{percentageDiscount}%
              </Text>
            </Badge>
          )}
        </View>

        <View className="px-4 w-full flex-row">
          {productCategories.map((category, index) => (
            <View key={category.id} className="flex-row items-center mb-2">
              <Text className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {category.name}
              </Text>
              {index < productCategories.length - 1 && (
                <Ionicons
                  name="chevron-forward"
                  size={12}
                  color="#9CA3AF"
                  className="mx-1"
                />
              )}
            </View>
          ))}
        </View>

        <View className="px-4">
          {/* Product Info */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              {name}
            </Text>
            <View className="flex-row items-center mb-2 justify-between">
              <Text className="text-lg text-gray-600 mb-1">{brand}</Text>
              <Text className="text-sm bg-divider px-3 py-1 rounded-full">
                {amount} {unit}
              </Text>
            </View>
          </View>

          {/* Shop Prices */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Dostupné v {products?.length} obchodoch
            </Text>

            {products?.map(({ shop_id, price, discount_price }) => {
              const { name: shopName } =
                getShopById(Number(shop_id), shops) || {};
              return (
                <TouchableOpacity
                  key={shop_id}
                  onPress={() => setSelectedShopId(Number(shop_id))}
                  className={`p-4 rounded-lg border-2 mb-3 ${
                    selectedShopId === shop_id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-1 gap-4">
                        <Image
                          {...getShopLogo(shop_id as any)}
                          className="w-8 h-8 rounded-full"
                          resizeMode="contain"
                        />
                        <Text className="text-lg font-semibold text-gray-900 mr-2">
                          {shopName}
                        </Text>
                      </View>
                    </View>

                    <View className="items-end">
                      {
                        discount_price?.price ? (
                          <View className="flex-row items-center space-x-1">
                            <Text className="text-xl font-bold text-red-600 mr-1">
                              {discount_price?.price.toFixed(2)} €
                            </Text>
                            <Text className="text-xl text-gray-400 line-through">
                              {price?.toFixed(2)} €
                            </Text>
                          </View>
                        ) : (
                          <Text className="text-xl font-bold text-gray-900">
                            {price?.toFixed(2)} €
                          </Text>
                        )
                      }
            
                      {selectedShopId === shop_id && (
                        <View className="w-2 h-2 bg-green-500 rounded-full mt-1" />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Add to Cart Section */}
      <View className="bg-white border-t border-gray-200 px-4 py-4">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-sm text-gray-600">
              Cena v {selectedShopName}
            </Text>
            {selectedShopDiscountPrice ? (
              <View>
                <View className="flex-row items-center space-x-1">
                  <Text className="text-2xl font-bold text-red-600 mr-1">
                    {((selectedShopDiscountPrice ?? 0) * cartQuantity).toFixed(2)} €
                  </Text>
                  <Text className="text-2xl text-gray-400 line-through">
                    {(selectedShopPrice * cartQuantity).toFixed(2)} €
                  </Text>
                </View>
              </View>
            ) : (
              <Text className="text-2xl font-bold text-gray-900">
                {(selectedShopPrice * cartQuantity).toFixed(2)} €
              </Text>
            )}
          </View>

          {/* Quantity Counter */}
          <View className="flex-row items-center bg-gray-100 rounded-lg">
            <TouchableOpacity
              onPress={decrementQuantity}
              disabled={cartQuantity === 0}
              className={`w-12 h-12 items-center justify-center rounded-l-lg ${
                cartQuantity === 0 ? 'opacity-50' : ''
              }`}
            >
              <Ionicons name="remove" size={20} color="#374151" />
            </TouchableOpacity>

            <View className="w-16 h-12 items-center justify-center bg-white">
              <Text className="text-lg font-semibold text-gray-900">
                {cartQuantity}
              </Text>
            </View>

            <TouchableOpacity
              onPress={incrementQuantity}
              className="w-12 h-12 items-center justify-center rounded-r-lg"
            >
              <Ionicons name="add" size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Add to Cart Button */}
        <Button
          onPress={handleManageProductCartQuantity}
          className={`py-4 rounded-lg items-center justify-center flex-row ${
            cartQuantity === 0 ? 'bg-red-400' : 'bg-primary'
          }`}
        >
          <Ionicons name="cart" size={20} className="mr-2" />
          <Text className="font-semibold">
            {/* {TODO refactor this shit} */}
            {cartQuantity === 0
              ? currentProductInCartQuantity > 0
                ? 'Odobrať z košíka'
                : 'Zvoľte množstvo'
              : currentProductInCartQuantity > 0
                ? 'Aktualizovať v košíku'
                : 'Pridať do nákupného zoznamu'}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};
export default ProductDetailScreen;
