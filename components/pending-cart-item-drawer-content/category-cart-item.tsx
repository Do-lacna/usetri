import type React from "react";
import { useEffect, useState } from "react";
import { Image, View } from "react-native";
import type { PendingCartDataType } from "~/app/(app)/main/(tabs)/shopping-list";
import { useGetHybridCart } from "~/network/hybrid-cart/hybrid-cart";
import { useGetCategories } from "~/network/query/query";
import { getShopLogo } from "~/utils/logo-utils";
import { Button } from "../ui/button";
import Counter from "../ui/counter";
import { Text } from "../ui/text";
import { CartItemHeader } from "./cart-item-header";

interface CategoryCartItemProps {
  pendingCartData: PendingCartDataType;
  onDismiss: () => void;
  onConfirm: (quantity: number) => void;
  isLoading?: boolean;
}

export const CategoryCartItem: React.FC<CategoryCartItemProps> = ({
  pendingCartData,
  onDismiss,
  onConfirm,
  isLoading = false,
}) => {
  const [categoryCount, setCategoryCount] = useState(1);

  const { data: { cart } = {}, isLoading: isCartLoading } = useGetHybridCart();

  const { data: categoryData, isLoading: areCategoriesLoading } =
    useGetCategories(
      {},
      {
        query: {
          select: (data) =>
            data?.categories?.find((category) => {
              return category?.id === Number(pendingCartData?.identifier);
            }) ?? null,
          enabled: true,
        },
      }
    );

  const itemInCartCount =
    cart?.categories?.find(
      ({ category }) => category?.id === Number(pendingCartData?.identifier)
    )?.quantity ?? 0;

  useEffect(() => {
    if (itemInCartCount > 0) {
      setCategoryCount(itemInCartCount);
    } else {
      setCategoryCount(1);
    }
  }, [itemInCartCount]);

  const isLoadingGlobal = isLoading || areCategoriesLoading;

  // Mock data for category prices in different supermarkets
  // TODO: Replace with actual API data when available
  const mockCategoryPrices = [
    { shop_id: 1, price: 2.49 },
    { shop_id: 2, price: 2.65 },
    { shop_id: 3, price: 2.39 },
    { shop_id: 4, price: 2.55 },
  ];

  return (
    <View className="flex flex-col justify-between w-full p-4">
      <View>
        <CartItemHeader
          image_url={categoryData?.image_url}
          title={categoryData?.name}
          amountUnit={null}
          onDismiss={onDismiss}
        />

        {/* Category Info Message */}
        <View className="mb-4 bg-green-50 border border-blue-200 rounded-lg p-3">
          <Text className="text-sm text-green-700 leading-relaxed">
            Pridaním kategórie do košíka bude vo finálnom porovnaní z každého
            obchodu vybraný najlacnejší produkt
          </Text>
        </View>

        {/* Category Prices in Different Supermarkets */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-3">
            Odhadované ceny v obchodoch
          </Text>
          <View className="bg-gray-50 rounded-xl py-4 px-2">
            <View className="flex-row flex-wrap gap-3">
              {mockCategoryPrices.map(({ shop_id, price }) => (
                <View
                  key={shop_id}
                  className="flex-row items-center bg-white rounded-lg px-2 py-2 shadow-sm border border-gray-100"
                >
                  <Image
                    {...getShopLogo(shop_id as any)}
                    className="w-5 h-5 mr-2"
                    resizeMode="contain"
                  />
                  <Text className="text-sm font-medium text-gray-800">
                    {price.toFixed(2)}€
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Actions Section - Wolt Style */}
      <View className="w-full flex-row gap-4 items-center justify-between mt-6 mb-6">
        {/* Counter on the left */}
        <Counter
          initialCount={categoryCount}
          onCountChange={setCategoryCount}
        />

        {/* Confirm button on the right */}
        <Button
          onPress={() => onConfirm(categoryCount)}
          className="flex-1 ml-4"
          disabled={isLoadingGlobal}
        >
          <Text>Pridať kategóriu</Text>
        </Button>
      </View>
    </View>
  );
};
