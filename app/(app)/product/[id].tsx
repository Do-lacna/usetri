import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { ListPlus } from "~/lib/icons/ListPlus";
import IconButton from "../../../components/icon-button";
import { useCartActions } from "../../../hooks/use-cart-actions";
import { PLACEHOLDER_PRODUCT_IMAGE } from "../../../lib/constants";
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
              uri: image_url ?? PLACEHOLDER_PRODUCT_IMAGE,
            }}
            className="w-full h-60"
            resizeMode="contain"
          />
        </View>

        <View className="px-4 py-2 flex-row bg-divider">
          <Text className="text-lg">{`Nealko  >  Alko  >  Piva `}</Text>
        </View>

        {/* Product Info Section */}
        <View className="px-4 py-5 space-y-4">
          {/* Product Details */}
          <View className="space-x-1 flex-row items-center justify-between">
            <View className="gap-1">
              <Text className="text-xl ">{brand}</Text>
              <Text className="text-xl font-bold">{name}</Text>
              <Text className="text-md text-gray-500">{`${amount} ${unit}`}</Text>
            </View>
            <IconButton
              className="flex items-center justify-center bg-primary w-10 h-10 rounded-full p-6"
              onPress={() => handleAddProductToCart(String(barcode))}
            >
              <ListPlus size={24} className="text-primary-foreground" />
            </IconButton>
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
