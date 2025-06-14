import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "~/components/ui/button";
import { useCartActions } from "~/hooks/use-cart-actions";
import { PLACEHOLDER_PRODUCT_IMAGE } from "~/lib/constants";
import { getShopById } from "~/lib/utils";
import { useGetProductsByBarcode, useGetShops } from "~/network/query/query";
import { getShopLogo } from "~/utils/logo-utils";
import { displaySuccessToastMessage } from "~/utils/toast-utils";

// TypeScript interfaces
interface Shop {
  id: string;
  name: string;
  price: number;
  currency: string;
  distance?: string;
  availability: "in-stock" | "low-stock" | "out-of-stock";
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
  nutritionScore?: "A" | "B" | "C" | "D" | "E";
}

const ProductDetailScreen: React.FC = () => {
  const [cartQuantity, setCartQuantity] = useState<number>(1);
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);

  const { id } = useLocalSearchParams();
  const router = useRouter();

  const {
    handleAddCategoryToCart,
    handleAddProductToCart,
    handleRemoveItemFromCart,
    handleChooseProductFromCategory,
  } = useCartActions({
    onSuccessfullCartUpdate: () => {
      displaySuccessToastMessage("Produkt bol vložený do košíka");
    },
  });

  const incrementQuantity = () => {
    setCartQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setCartQuantity((prev) => Math.max(0, prev - 1));
  };

  const handleAddToCart = () => {
    if (cartQuantity > 0 && selectedShopId) {
      handleAddProductToCart(String(id), cartQuantity);
    }
  };

  const { data: { shops = [] } = {} } = useGetShops();
  const { name: selectedShopName, image_url: shopImage } =
    getShopById(selectedShopId, shops) || {};

  const { data: { products = [] } = {}, isLoading } = useGetProductsByBarcode(
    String(id),
    undefined
  );

  useEffect(() => {
    if ([products ?? []].length > 0) {
      setSelectedShopId(Number(products?.[0]?.shop_id));
    }
  }, [products]);

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
  const { detail: { image_url, brand, name, amount, unit, barcode } = {} } = {
    ...products?.[0],
  };

  // Sort prices from lowest to highest
  const sortedPrices = (products ?? []).sort(
    (a, b) => (a.price ?? 0) - (b.price ?? 0)
  );

  const selectedShopPrice =
    products?.find((product) => product.shop_id === Number(selectedShopId))
      ?.price ?? 0;

  const productCategories = [
    { id: "1", name: "Dairy" },
    { id: "2", name: "Milk & Cream" },
    { id: "3", name: "Whole Milk" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-gray-50 items-center justify-center py-2">
          <Image
            source={{
              uri: image_url ?? PLACEHOLDER_PRODUCT_IMAGE,
            }}
            className="w-full h-60"
            resizeMode="contain"
          />
        </View>

        {/* Category Hierarchy */}

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

            {products?.map(({ shop_id, price }) => {
              const { name: shopName } =
                getShopById(Number(shop_id), shops) || {};
              return (
                <TouchableOpacity
                  key={shop_id}
                  onPress={() => setSelectedShopId(Number(shop_id))}
                  className={`p-4 rounded-lg border-2 mb-3 ${
                    selectedShopId === shop_id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-white"
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
                      <Text className="text-xl font-bold text-gray-900">
                        {price?.toFixed(2)} €
                      </Text>
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
            <Text className="text-2xl font-bold text-gray-900">
              {/* {selectedShopId.currency}
              {selectedShopId.price.toFixed(2)} */}
              {(selectedShopPrice * cartQuantity).toFixed(2)} €
            </Text>
          </View>

          {/* Quantity Counter */}
          <View className="flex-row items-center bg-gray-100 rounded-lg">
            <TouchableOpacity
              onPress={decrementQuantity}
              disabled={cartQuantity === 0}
              className={`w-12 h-12 items-center justify-center rounded-l-lg ${
                cartQuantity === 0 ? "opacity-50" : ""
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
          onPress={handleAddToCart}
          disabled={cartQuantity === 0}
          className={`py-4 rounded-lg items-center justify-center flex-row ${
            cartQuantity === 0 ? "bg-gray-300" : "bg-primary"
          }`}
        >
          <Ionicons
            name="cart"
            size={20}
            color={cartQuantity === 0 ? "#9CA3AF" : "white"}
            className="mr-2"
          />
          <Text
            className={`text-lg font-semibold ${
              cartQuantity === 0 ? "text-gray-500" : "text-white"
            }`}
          >
            {cartQuantity === 0
              ? "Zvoľte množstvo"
              : "Pridať do nákupného zoznamu"}
          </Text>
        </Button>

        {/* {cartQuantity > 0 && (
          <Text className="text-center text-sm text-gray-500 mt-2">
            Total:
            {(12 * cartQuantity).toFixed(2)}
          </Text>
        )} */}
      </View>
    </SafeAreaView>
  );
};
export default ProductDetailScreen;
