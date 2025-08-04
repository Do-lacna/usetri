import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import {
  getGetHybridCartQueryKey,
  useDeleteHybridCart,
} from "~/network/hybrid-cart/hybrid-cart";
import {
  getGetArchivedCartQueryKey,
  useCreateArchivedCart,
} from "../../../network/customer/customer";
import { CartComparisonDto } from "../../../network/model";
import { Button } from "../button";

// Types
interface GroceryItem {
  id: string;
  name: string;
  brand: string;
  amount: string;
  price: number;
}

const ReceiptScreen: React.FC<
  CartComparisonDto & { actionsExecutable?: boolean }
> = ({
  shop: { name: shopName, image_url, id: shopId } = {},
  specific_products: groceries = [],
  total_price,
  actionsExecutable = true,
}) => {
  const formatPrice = (price = 0): string => {
    return `${price.toFixed(2)} €`;
  };

  const queryClient = useQueryClient();
  const router = useRouter();

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
          queryKey: getGetHybridCartQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getGetArchivedCartQueryKey(),
        });
        router.back();
      },
    },
  });

  const { mutate: sendDiscardCart } = useDeleteHybridCart({
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
          queryKey: getGetHybridCartQueryKey(),
        });
        router.back();
      },
    },
  });

  const handleSaveCart = () => {
    sendCreateArchivedCart({
      data: { selected_shop_id: shopId },
    });
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 px-4 pb-6">
        <Card className="bg-white shadow-lg mb-4">
          <CardHeader className="pb-4">
            <View className="items-center border-b border-gray-200 pb-4">
              <Text className="text-xl font-bold text-gray-900 mb-1">
                {shopName}
              </Text>
              <View className="flex-row justify-between w-full"></View>
            </View>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Items List */}
            <View className="mb-4">
              {groceries?.map(
                (
                  {
                    price = 1,
                    detail: { name, barcode, brand } = {},
                    quantity = 1,
                  },
                  index
                ) => (
                  <View key={barcode}>
                    <View className="flex-row justify-between items-start py-3">
                      <View className="flex-1 pr-4">
                        <Text className="text-base font-medium text-gray-900 mb-1">
                          {name}
                        </Text>
                        <Text className="text-sm text-gray-600 mb-1">
                          {brand}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          Počet: {2}
                        </Text>
                      </View>
                      <Text className="text-base font-semibold text-gray-900">
                        {formatPrice(price * quantity)}
                      </Text>
                    </View>
                    {index < groceries?.length - 1 && (
                      <Separator className="bg-gray-100" />
                    )}
                  </View>
                )
              )}
            </View>

            {/* Total Section */}
            <Separator className="bg-gray-300 mb-4" />
            <View className="flex-row justify-between items-center bg-gray-50 p-4 rounded-lg">
              <Text className="text-lg font-bold text-gray-900">
                Celková suma
              </Text>
              <Text className="text-xl font-bold text-green-600">
                {formatPrice(total_price)}
              </Text>
            </View>
          </CardContent>
        </Card>

        {actionsExecutable && (
          <View className="flex-row justify-center items-center mb-4 p-4 gap-4">
            <Button
              // disabled={!isDirty || !isValid}
              variant="outline"
              onPress={() => sendDiscardCart()}
              className="w-[40%] border-2 border-gray-600"
            >
              <Text className="font-bold">Zahodiť</Text>
            </Button>
            <Button
              // disabled={!isDirty || !isValid}
              onPress={handleSaveCart}
              className="w-[60%]"
            >
              <Text className="font-bold">Uložiť košík</Text>
            </Button>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReceiptScreen;
