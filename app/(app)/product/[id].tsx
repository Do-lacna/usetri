import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { Button } from "../../../components/ui/button";
import { useCartActions } from "../../../hooks/use-cart-actions";
import { getShopById } from "../../../lib/utils";
import {
  useGetProductsByBarcode,
  useGetShops,
} from "../../../network/query/query";
import { displaySuccessToastMessage } from "../../../utils/toast-utils";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { data: { shops = [] } = {} } = useGetShops();

  const { data: { products = [] } = {} } = useGetProductsByBarcode(
    String(id),
    undefined
    // {
    //   query: {
    //     enabled: !!id,
    //   },
    // }
  );

  const {
    handleAddCategoryToCart,
    handleAddProductToCart,
    handleRemoveItemFromCart,
    handleChooseProductFromCategory,
  } = useCartActions({
    onSuccessfullCartUpdate: () => {
      displaySuccessToastMessage("Produkt bol vložený do košíka");
    },
    // onSuccessWithExpandedOption: (categoryId) => {
    //   setExpandedOption(Number(categoryId));
    // },
  });

  if (!products?.[0]) {
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
    price,
    detail,
  } = {
    ...products?.[0],
  };

  // Sort prices from lowest to highest
  const sortedPrices = (products ?? []).sort(
    (a, b) => (a.price ?? 0) - (b.price ?? 0)
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Optional: Add Stack.Screen for custom header options */}

      <ScrollView className="flex-1">
        {/* Image Section */}
        <View className="relative bg-white">
          <Image
            source={{
              uri:
                image_url ??
                "https://digitalcontent.api.tesco.com/v2/media/ghs/e0a0e446-3cee-4281-84ea-ca80461b8551/342cec25-6528-44cf-9328-bdda502f88c7_1825618099.jpeg?h=540&w=540",
            }}
            className="w-full h-80"
            resizeMode="contain"
          />
        </View>

        <Button
          className="w-[60%] self-center"
          onPress={() => handleAddProductToCart(String(barcode))}
        >
          <Text>Pridať do košíka</Text>
        </Button>

        {/* Product Info Section */}
        <View className="px-4 py-5 space-y-4">
          {/* Product Details */}
          <View className="space-x-1 flex-row items-center justify-between">
            <View>
              <Text className="text-xl text-gray-600 font-medium">{brand}</Text>
              <Text className="text-xl font-bold">{name}</Text>
            </View>
            <Text className="text-xl text-gray-500">{`${amount} ${unit}`}</Text>
          </View>
          <View className="my-2 border-divider border-2" />

          <View className="space-y-3 mt-4">
            <Text className="text-lg font-semibold">
              Dostupné v {products?.length} obchodoch
            </Text>

            <View className="space-y-2">
              {sortedPrices.map(({ price, shop_id }, index) => (
                <Pressable
                  key={shop_id}
                  className={`p-4 rounded-xl ${
                    index === 0
                      ? "bg-green-50 border border-green-100"
                      : "bg-white"
                  }`}
                  onPress={() => {
                    // Handle store selection
                    console.log(`Selected store: ${price}`);
                  }}
                >
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="font-medium">
                        {getShopById(Number(shop_id), shops ?? [])?.name}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text
                        className={`text-lg font-bold ${
                          index === 0 ? "text-green-600" : "text-black"
                        }`}
                      >
                        ${price}
                      </Text>
                      {index === 0 && (
                        <Text className="text-xs text-green-600">
                          Najlepšia cena
                        </Text>
                      )}
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
