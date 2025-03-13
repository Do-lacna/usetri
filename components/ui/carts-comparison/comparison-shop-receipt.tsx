import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { Button } from "~/components/ui/button";
import {
  getGetArchivedCartQueryKey,
  getGetCartQueryKey,
  useCreateArchivedCart,
  useRemoveFromCart,
} from "../../../network/customer/customer";
import { CartDto } from "../../../network/model";

const ComparisonShopReceipt = ({
  shop: { name: shopName, image_url, id: shopId } = {},
  categories = [],
  specific_products: groceries = [],
  total_price,
  actionsExecutable = true,
}: CartDto & { actionsExecutable?: boolean }) => {
  const width = Dimensions.get("window").width;
  const h = Dimensions.get("window").height;
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
    <View
      className={
        actionsExecutable
          ? "flex-1 p-4 bg-white rounded-lg shadow-md m-4 justify-between"
          : ""
      }
    >
      <View className="gap-4">
        <View className="flex items-center my-4 gap-4">
          <Text className="text-4xl font-bold text-terciary">
            {shopName?.toLocaleUpperCase()}
          </Text>
          <Text className="text-2xl font-bold">Zoznam produktov</Text>
          <View className="w-[100%] border-terciary border" />
        </View>

        <ScrollView className="h-96 px-2">
          {categories?.map(({ category: { id, name } = {}, price }) => (
            <View key={id} className="flex-row justify-between mb-2">
              <Text className="text-lg">{name}</Text>
              <Text className="text-lg font-semibold">
                {price?.toFixed(2)} €
              </Text>
            </View>
          ))}
          {/* TODO wait for API BE to add this */}
          {groceries?.map(({ price, name, barcode }) => (
            <View key={barcode} className="flex-row justify-between mb-2">
              <Text className="text-lg">{name}</Text>
              <Text className="text-lg font-semibold">
                {price?.toFixed(2) ?? 0} €
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <View>
        <View className="w-[100%] border-terciary border" />
        <View className="flex-row justify-between items-center my-4">
          <Text className="text-2xl text-terciary">Celková suma</Text>
          <Text className="text-2xl font-bold text-terciary">
            {total_price?.toFixed(2) ?? 0} €
          </Text>
        </View>
        {actionsExecutable && (
          <View className="flex-row justify-center items-center my-4 p-4 gap-4">
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
      </View>
    </View>
  );
};

export default ComparisonShopReceipt;
