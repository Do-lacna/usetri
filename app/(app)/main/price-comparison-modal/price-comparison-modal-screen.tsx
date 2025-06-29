import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import FlippableCard from "../../../../components/flippable-card/flippable-card";
import { Button } from "../../../../components/ui/button";
import { isArrayNotEmpty } from "../../../../lib/utils";
import {
  getGetArchivedCartQueryKey,
  getGetCartQueryKey,
  useCreateArchivedCart,
  useGetUserCartComparison,
  useRemoveFromCart,
} from "../../../../network/customer/customer";
import { getShopLogo } from "../../../../utils/logo-utils";

const ShopComparisonScreen: React.FC = () => {
  const queryClient = useQueryClient();
  const [currentCartIndex, setCurrentCartIndex] = useState<number>(0);
  const [flippedItems, setFlippedItems] = useState<Set<string>>(new Set());
  const { data: { carts = [] } = {}, isLoading } = useGetUserCartComparison();

  const { mutate: sendCreateArchivedCart, isIdle } = useCreateArchivedCart({
    mutation: {
      onError: () => {
        Toast.show({
          type: "error",
          text1: "Nepodarilo sa uložiť košík",
          position: "bottom",
        });
      },
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Váš košík bol úspešne uložený vo vašom profile",
          position: "bottom",
        });
        queryClient.invalidateQueries({
          queryKey: getGetCartQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getGetArchivedCartQueryKey(),
        });
        router.back();
      },
    },
  });

  const { mutate: sendDiscardCart } = useRemoveFromCart({
    mutation: {
      onError: () => {
        Toast.show({
          type: "success",
          text1: "Váš košík bol úspešne vymazaný",
          position: "bottom",
        });
        Toast.show({
          type: "error",
          text1: "Nepodarilo sa zahodiť košík",
          position: "bottom",
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetCartQueryKey(),
        });
        router.back();
      },
    },
  });

  const currentShop = carts?.[currentCartIndex]?.shop;
  const currentCart = carts?.[currentCartIndex];
  const cheapestTotal = carts?.[0]?.total_price ?? 0;
  const currentTotal = carts?.[currentCartIndex]?.total_price ?? 0;
  const mostExpensiveTotal = carts?.[carts.length - 1]?.total_price ?? 0;
  const isCurrentCheapest = currentTotal === cheapestTotal;
  const isCurrentMostExpensive = currentTotal === mostExpensiveTotal;

  const savingsVsCheapest = currentTotal - cheapestTotal;
  const savingsVsMostExpensive = mostExpensiveTotal - currentTotal;

  const nextShop = (): void => {
    setCurrentCartIndex((prev) => (prev + 1) % (carts?.length ?? 0));
    setFlippedItems(new Set()); // Reset flipped items when changing shops
  };

  const prevShop = (): void => {
    setCurrentCartIndex(
      (prev) => (prev - 1 + (carts?.length ?? 0)) % (carts?.length ?? 0)
    );
    setFlippedItems(new Set()); // Reset flipped items when changing shops
  };

  const goToShop = (index: number): void => {
    setCurrentCartIndex(index);
    setFlippedItems(new Set()); // Reset flipped items when changing shops
  };

  const selectedCart = carts?.[currentCartIndex];

  const handleSaveCart = (): void => {
    sendCreateArchivedCart({
      data: { selected_shop_id: selectedCart?.shop?.id },
    });
  };

  const handleFlipItem = (barcode: string): void => {
    setFlippedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(barcode)) {
        newSet.delete(barcode);
      } else {
        newSet.add(barcode);
      }
      return newSet;
    });
  };

  const areMoreCartsAvailable = [...(carts ?? [])].length > 1;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className={`bg-green-50 px-4 py-6 border-b border-gray-200`}>
          <View className="flex-row items-center justify-between mb-4">
            {areMoreCartsAvailable && (
              <TouchableOpacity
                onPress={prevShop}
                className="p-2 rounded-full bg-white shadow-sm border border-gray-200"
                disabled={!isArrayNotEmpty(carts)}
              >
                <ChevronLeft size={20} color="#4B5563" />
              </TouchableOpacity>
            )}

            <View className="flex-1 items-center">
              <Image
                {...getShopLogo(currentShop?.id as any)}
                className="w-16 h-16 rounded-full"
                resizeMode="contain"
              />
            </View>

            {areMoreCartsAvailable && (
              <TouchableOpacity
                onPress={nextShop}
                className="p-2 rounded-full bg-white shadow-sm border border-gray-200"
                disabled={!isArrayNotEmpty(carts)}
              >
                <ChevronRight size={20} color="#4B5563" />
              </TouchableOpacity>
            )}
          </View>

          {areMoreCartsAvailable && (
            <View className="flex-row justify-center space-x-2 mb-4">
              {carts?.map(({ shop }, index) => (
                <TouchableOpacity
                  key={shop?.id}
                  onPress={() => goToShop(index)}
                  className={`w-3 h-3 rounded-full mr-1 ${
                    index === currentCartIndex ? "bg-terciary" : "bg-gray-300"
                  }`}
                />
              ))}
            </View>
          )}

          <View className="bg-white rounded-xl p-4 border border-gray-200">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm text-gray-600 mb-1">Celková suma</Text>
                <Text className="text-3xl font-bold text-gray-900">
                  {selectedCart?.total_price?.toFixed(2)} €
                </Text>
              </View>
              <View className="items-end">
                {isCurrentCheapest && (
                  <View className="flex-row items-center mb-1">
                    <Award size={16} color="#059669" />
                    <Text className="text-sm font-medium text-green-600 ml-1">
                      Najlepšia cena
                    </Text>
                  </View>
                )}
                {isCurrentMostExpensive && areMoreCartsAvailable && (
                  <View className="flex-row items-center mb-1">
                    <TrendingUp size={16} color="#DC2626" />
                    <Text className="text-sm font-medium text-red-600 ml-2">
                      Najdrahšie
                    </Text>
                  </View>
                )}
                {!isCurrentCheapest && (
                  <Text className="text-md text-red-600 font-bold">
                    + {savingsVsCheapest.toFixed(2)} €
                  </Text>
                )}
                {!isCurrentMostExpensive && savingsVsMostExpensive > 0 && (
                  <Text className="text-md text-green-600 font-bold">
                    - {savingsVsMostExpensive.toFixed(2)} €
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        <View className="px-4 pb-6">
          <View className="bg-white mt-4 rounded-xl border border-gray-200 overflow-hidden">
            <Text className="text-lg font-semibold text-gray-900 p-4 border-b border-gray-100">
              Váš nákup ({selectedCart?.specific_products?.length ?? 0} kusov)
            </Text>

            {selectedCart?.specific_products?.map(
              (
                {
                  detail: {
                    name,
                    barcode,
                    brand,
                    unit,
                    amount,
                    category: { id, image_url, name: categoryName } = {},
                  } = {},
                  price = 0,
                  quantity = 1,
                },
                index
              ) => {
                const isFlipped = flippedItems.has(barcode);

                // Front content (original product view)
                const frontContent = (
                  <View
                    className={`p-4 bg-white ${
                      index < (currentCart?.specific_products?.length ?? 0) - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="text-base font-medium text-gray-900">
                          {name}
                        </Text>
                        <Text className="text-sm text-gray-500">
                          {amount} {unit}
                        </Text>
                      </View>

                      <View className="items-end ml-4">
                        <Text className="text-base font-semibold text-gray-900">
                          {(price * quantity).toFixed(2)} €
                        </Text>
                        {quantity > 1 && (
                          <Text className="text-xs text-gray-500">
                            {quantity} x {price.toFixed(2)} €
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                );

                const backContent = (
                  <View
                    className={`p-4 bg-white ${
                      index < (currentCart?.specific_products?.length ?? 0) - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        {!!image_url && (
                          <Image
                            source={{ uri: image_url as string }}
                            resizeMode="contain"
                            className="w-8 h-8 mr-2"
                          />
                        )}
                        <Text className="text-base font-medium text-gray-900">
                          {categoryName}
                        </Text>
                      </View>

                      <View className="items-end ml-4">
                        <Text className="text-base font-semibold text-gray-900">
                          {(price * quantity).toFixed(2)} €
                        </Text>
                        {quantity > 1 && (
                          <Text className="text-xs text-gray-500">
                            {quantity} x {price.toFixed(2)} €
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                );

                return (
                  <FlippableCard
                    key={barcode}
                    frontContent={frontContent}
                    backContent={backContent}
                    isFlipped={isFlipped}
                    onFlip={() => handleFlipItem(barcode)}
                  />
                );
              }
            )}
          </View>
        </View>
      </ScrollView>

      <View className="bg-white px-4 py-3 border-t border-gray-200">
        <View className="flex-row justify-center items-center gap-4">
          <Button
            variant="outline"
            onPress={() => sendDiscardCart()}
            className="w-[30%] border-2 border-gray-600"
          >
            <Text className="font-bold text-gray-700">Zahodiť</Text>
          </Button>
          <Button onPress={handleSaveCart} className="w-[60%]">
            <Text className="font-bold text-white">Uložiť zoznam</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ShopComparisonScreen;
