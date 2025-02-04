import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { Button } from "~/components/ui/button";
import { getSimplifiedCart } from "../../../lib/utils";
import {
  getGetCartQueryKey,
  useCreateArchivedCart,
  useRemoveFromCart,
} from "../../../network/customer/customer";
import { ShopCart } from "../../../network/model";

const ComparisonShopReceipt = ({
  shop: { name: shopName, image_url } = {},
  categories = [],
  specific_products: groceries = [],
  total_price,
}: ShopCart) => {
  const width = Dimensions.get("window").width;
  const h = Dimensions.get("window").height;
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: sendCreateArchivedCart, isIdle } = useCreateArchivedCart({
    mutation: {
      onError: () => {
        Toast.show({
          type: "error",
          text1: "Failed to save cart",
          position: "bottom",
        });
      },
      // onMutate: ({ data }) => {},
      // onSuccess: ({ cart }, variables) => {
      //   queryClient.invalidateQueries({
      //     queryKey: getGetCartQueryKey(),
      //   });
      //   const lastAddedCategory = cart?.categories?.slice(-1)[0]?.id;
      //   if (
      //     lastAddedCategory &&
      //     variables?.additionalData?.operation === CartOperationsEnum.ADD
      //   ) {
      //     setExpandedOption(lastAddedCategory);
      //   }
      // },
    },
  });

  const { mutate: sendDiscardCart } = useRemoveFromCart({
    mutation: {
      onError: () => {
        Toast.show({
          type: "error",
          text1: "Failed to discard cart",
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
    const simplifiedCart = getSimplifiedCart({
      categories,
      specific_products: groceries,
    });
    sendCreateArchivedCart({
      data: simplifiedCart,
    });
  };

  return (
    <View
      className="flex-1 p-4 bg-white rounded-lg shadow-md m-4 justify-between"
      style={{ width: width - 32 }}
    >
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold">{shopName}</Text>
        <View className="flex-row items-center">
          <Text className="text-lg font-semibold mr-2">
            Total: {total_price?.toFixed(2)} €
          </Text>
          <ChevronRight size={24} color="#888" />
        </View>
      </View>

      <View>
        {categories?.map(({ category: { id, name } = {} }) => (
          <View key={id} className="flex-row justify-between mb-2">
            <Text className="text-base">
              {name}
              {/* (x{grocery.quantity}) */}
            </Text>
            <Text className="text-base font-semibold">
              {/* //TODO add price here */}${id?.toFixed(2)}
            </Text>
          </View>
        ))}
        {groceries?.map(({ price, detail: { name, barcode } = {} }) => (
          <View key={barcode} className="flex-row justify-between mb-2">
            <Text className="text-base">
              {name}
              {/* (x{grocery.quantity}) */}
            </Text>
            <Text className="text-base font-semibold">
              {price?.toFixed(2)} €
            </Text>
          </View>
        ))}
      </View>
      <View className="flex-row justify-center items-center my-4 p-4 gap-2">
        <Button
          // disabled={!isDirty || !isValid}
          onPress={handleSaveCart}
          className="flex-1"
        >
          <Text>Ulozit kosik</Text>
        </Button>
        <Button
          // disabled={!isDirty || !isValid}
          variant="outline"
          onPress={() => sendDiscardCart()}
          className="flex-1 bg-red-500"
        >
          <Text>Zahodit</Text>
        </Button>
      </View>
    </View>
  );
};

export default ComparisonShopReceipt;
