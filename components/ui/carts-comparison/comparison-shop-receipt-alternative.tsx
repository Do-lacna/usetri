import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import {
  getGetArchivedCartQueryKey,
  getGetCartQueryKey,
  useCreateArchivedCart,
  useRemoveFromCart,
} from "../../../network/customer/customer";
import { CartComparisonDto } from "../../../network/model";

// Types
interface GroceryItem {
  id: string;
  name: string;
  brand: string;
  amount: string;
  price: number;
}

interface Store {
  name: string;
  address: string;
  date: string;
  time: string;
}

interface ReceiptScreenProps {
  store: Store;
  items: GroceryItem[];
  totalPrice: number;
  onSaveReceipt: () => void;
  onDiscardReceipt: () => void;
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

  const handleSaveCart = () => {
    sendCreateArchivedCart({
      data: { selected_shop_id: shopId },
    });
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 px-4 pb-6">
        {/* Header */}
        {/* <View className="mb-6">
          <Text className="text-sm text-gray-500 text-center">
            Sumár produktov
          </Text>
        </View> */}

        {/* Receipt Card */}
        <Card className="bg-white shadow-lg mb-6">
          <CardHeader className="pb-4">
            {/* Store Information */}
            <View className="items-center border-b border-gray-200 pb-4">
              <Text className="text-xl font-bold text-gray-900 mb-1">
                {shopName}
              </Text>
              {/* <Text className="text-sm text-gray-600 text-center mb-2">
                {store.address}
              </Text> */}
              <View className="flex-row justify-between w-full">
                {/* <Text className="text-xs text-gray-500">{store.date}</Text>
                <Text className="text-xs text-gray-500">{store.time}</Text> */}
              </View>
            </View>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Items List */}
            <View className="mb-4">
              {groceries?.map(
                ({ price, detail: { name, barcode, brand } = {} }, index) => (
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
                        {formatPrice(price)}
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
                Total Amount
              </Text>
              <Text className="text-xl font-bold text-green-600">
                {formatPrice(total_price)}
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {/* <View className="space-y-3 mb-6">
          <Button
            onPress={onSaveReceipt}
            className="bg-blue-600 hover:bg-blue-700 py-4"
          >
            <Text className="text-white font-semibold text-base">
              Save Receipt
            </Text>
          </Button>

          <Button
            variant="outline"
            onPress={onDiscardReceipt}
            className="border-red-500 hover:bg-red-50 py-4"
          >
            <Text className="text-red-500 font-semibold text-base">
              Discard Receipt
            </Text>
          </Button>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReceiptScreen;
