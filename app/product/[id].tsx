import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { products } from "../../test/test-data";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // In a real app, you'd fetch product data based on the id
  const product = {
    ...products[0],
    prices: [
      { store: "Budget Market", price: "119.99", distance: "0.8 mi" },
      { store: "Super Store", price: "124.99", distance: "1.2 mi" },
      { store: "Premium Goods", price: "129.99", distance: "0.5 mi" },
      { store: "City Market", price: "134.99", distance: "2.1 mi" },
    ],
  };

  // Sort prices from lowest to highest
  const sortedPrices = [...product.prices].sort(
    (a, b) => parseFloat(a.price) - parseFloat(b.price)
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Optional: Add Stack.Screen for custom header options */}
      <Stack.Screen
        options={{
          headerShown: true,
          headerBackTitle: "Back",
          headerTitle: "Product Details",
          // Add any other screen options you need
        }}
      />

      <ScrollView className="flex-1">
        {/* Image Section */}
        <View className="relative bg-white">
          <Image
            source={{ uri: product.imageUrl }}
            className="w-full h-80"
            resizeMode="contain"
          />

          {/* Back Button */}
          {/* <SafeAreaView className="absolute top-0 left-0 right-0">
            <Pressable
              onPress={() => router.back()}
              className="ml-4 mt-2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm items-center justify-center"
            >
              <ChevronLeft size={24} color="white" />
            </Pressable>
          </SafeAreaView> */}
        </View>

        {/* Product Info Section */}
        <View className="px-4 py-5 space-y-4">
          {/* Product Details */}
          <View className="space-x-1 flex-row items-center justify-between">
            <View>
              <Text className="text-xl text-gray-600 font-medium">
                {product.brand}
              </Text>
              <Text className="text-xl font-bold">{product.name}</Text>
            </View>
            <Text className="text-xl text-gray-500">{product.amount}</Text>
          </View>

          {/* Prices Section */}
          <View className="space-y-3 mt-4">
            <Text className="text-lg font-semibold">
              Available at {product.prices.length} stores
            </Text>

            {/* Price Cards */}
            <View className="space-y-2">
              {sortedPrices.map((price, index) => (
                <Pressable
                  key={price.store}
                  className={`p-4 rounded-xl ${
                    index === 0
                      ? "bg-green-50 border border-green-100"
                      : "bg-white"
                  }`}
                  onPress={() => {
                    // Handle store selection
                    console.log(`Selected store: ${price.store}`);
                  }}
                >
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="font-medium">{price.store}</Text>
                      <Text className="text-sm text-gray-500">
                        {price.distance}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text
                        className={`text-lg font-bold ${
                          index === 0 ? "text-green-600" : "text-black"
                        }`}
                      >
                        ${price.price}
                      </Text>
                      {index === 0 && (
                        <Text className="text-xs text-green-600">
                          Best Price
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
